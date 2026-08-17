import { Router } from 'express';
import { query } from '../db.mjs';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Rate limiter (in-memory, per IP) ────────────────────────────────────────
const RATE_LIMIT = 10;          // max messages
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes
const rateLimiter = new Map();  // ip -> { count, windowStart }

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimiter.get(ip) || { count: 0, windowStart: now };

  // Reset window if expired
  if (now - entry.windowStart > RATE_WINDOW) {
    rateLimiter.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;

  rateLimiter.set(ip, { count: entry.count + 1, windowStart: entry.windowStart });
  return true;
}

// Periodically clean stale entries to avoid unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimiter.entries()) {
    if (now - entry.windowStart > RATE_WINDOW) rateLimiter.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── Topic filter (pre-API check) ────────────────────────────────────────────
// Meaningful portfolio terms — intentionally excludes generic question words
const PORTFOLIO_KEYWORDS = [
  'design','designer','project','case study','case studies','work','experience',
  'portfolio','role','skill','tool','figma','sketch','ux','ui','product',
  'research','process','challenge','result','impact','background','contact',
  'available','hire','resume','cv','career','job','haro','jesus',
  'built','created','developed','collaborated','client','team','sprint',
  'prototype','wireframe','user','brand','interface','visual','motion',
  'klarna','atentu','numaris','unilink','ekatena',
];

const OFF_TOPIC_SIGNALS = [
  'weather','forecast','recipe','cook','sport','football','basketball',
  'movie','music','song','stock market','crypto','bitcoin','ethereum',
  'politic','election','news','joke','funny','meme','lorem','ipsum',
  'jailbreak','ignore previous','ignore all','act as','forget everything',
  'system prompt','override','translate this','summarize this article',
];

const OUT_OF_SCOPE_REPLY =
  "I can only answer questions about Jesus's work, projects, and experience. " +
  "Try asking: \"What projects has he worked on?\" or \"What's his design process?\"";

function isOnTopic(message) {
  const lower = message.toLowerCase();
  // Very short messages pass (ambiguous, low risk)
  if (lower.trim().length < 15) return true;
  // If there's a portfolio keyword, always allow
  const hasPortfolio = PORTFOLIO_KEYWORDS.some(w => lower.includes(w));
  if (hasPortfolio) return true;
  // If there's an off-topic signal and NO portfolio keyword, block
  const hasOffTopic = OFF_TOPIC_SIGNALS.some(w => lower.includes(w));
  if (hasOffTopic) return false;
  // Ambiguous — allow through (better to answer than to wrongly block)
  return true;
}

// ─── Context helpers ──────────────────────────────────────────────────────────
function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

function blocksToText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(b => {
    if (b.type === 'richtext') return stripHtml(b.html);
    if (b.type === 'image' && b.caption) return `[Image: ${b.caption}]`;
    return '';
  }).filter(Boolean).join('\n');
}

async function buildContext() {
  const [projectsResult, aboutResult] = await Promise.all([
    query(`SELECT id, type, name, description, content_blocks FROM projects WHERE hidden = false ORDER BY sort_order`),
    query(`SELECT content_html, resume_content FROM about_content WHERE id = 1`),
  ]);
  return {
    projects: projectsResult.rows,
    about: aboutResult.rows[0] || {},
  };
}

function buildSystemPrompt(projects, about) {
  const uiProjects = projects.filter(p => p.type === 'ui_project');
  const caseStudies = projects.filter(p => p.type === 'case_study');

  const formatProject = p => {
    const body = blocksToText(p.content_blocks);
    return [
      `### ${p.name} (ID: ${p.id})`,
      p.description ? `Description: ${p.description}` : null,
      body ? `Content:\n${body}` : null,
    ].filter(Boolean).join('\n');
  };

  const aboutText = stripHtml(about.content_html) || '(none provided)';
  const resumeText = about.resume_content?.trim() || '(none provided)';

  return `You are the AI assistant embedded in Jesus Haro's product design portfolio.
Your sole purpose is to help visitors learn about his work, experience, and background.

## Knowledge base — ONLY use information below. Never invent, infer, or extrapolate.

### About Jesus
${aboutText}

### Resume / CV
${resumeText}

### UI Projects
${uiProjects.length ? uiProjects.map(formatProject).join('\n\n') : '(none)'}

### Case Studies
${caseStudies.length ? caseStudies.map(formatProject).join('\n\n') : '(none)'}

## Rules
1. Respond ALWAYS in English.
2. Tone: concise, friendly, professional. Short, direct answers — no filler.
3. NEVER invent information not in the knowledge base. If you can't answer, say so honestly and suggest a related question you CAN answer.
4. If asked about anything unrelated to Jesus's work, experience, or background, politely decline and redirect.
5. Greet naturally on the FIRST message only. Say goodbye only when visitor signals they're done. Do NOT repeat greetings or farewells.
6. When your answer references a specific project or case study, embed a card using EXACTLY this format: [[PROJECT:{id}:{name}]]
   Place the card where it reads most naturally. You may include multiple cards.`;
}

// Truncate history to last N turns (user+assistant pairs), always ending with user
function truncateHistory(messages, maxTurns = 3) {
  // Keep only non-loading messages
  const clean = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  // Take last maxTurns*2 messages
  const sliced = clean.slice(-(maxTurns * 2));
  // Ensure it starts with 'user'
  const firstUserIdx = sliced.findIndex(m => m.role === 'user');
  return firstUserIdx > 0 ? sliced.slice(firstUserIdx) : sliced;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/agent/chat
router.post('/chat', async (req, res) => {
  const { messages, isSuggestion } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Get the latest user message (last in array)
  const latestUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const userText = latestUserMsg?.content || '';

  // 1. Character limit — reject oversized input
  if (userText.length > 300) {
    return res.json({ reply: "Please keep your question under 300 characters so I can answer clearly." });
  }

  // 2. Rate limiting (skip for suggestion-originated messages)
  if (!isSuggestion) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.json({
        reply: "You've sent a lot of messages — please wait a few minutes before asking again.",
      });
    }
  }

  // 3. Topic filter (skip for suggestion-originated messages)
  if (!isSuggestion && !isOnTopic(userText)) {
    return res.json({ reply: OUT_OF_SCOPE_REPLY });
  }

  try {
    const { projects, about } = await buildContext();
    const systemPrompt = buildSystemPrompt(projects, about);

    // Strip project card markers from assistant messages; truncate to 3 turns
    const cleanMessages = messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string'
        ? m.content.replace(/\[\[PROJECT:[^\]]+\]\]/g, '').trim()
        : m.content,
    }));
    const truncated = truncateHistory(cleanMessages, 3);

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',   // cheapest viable model
      max_tokens: 400,              // tight output cap
      system: systemPrompt,
      messages: truncated,
    });

    const reply = response.content[0]?.text || '';
    res.json({ reply });

  } catch (err) {
    // 4. Friendly message for spend limit / credit exhaustion errors
    const msg = err.message || '';
    const isCreditsError =
      msg.includes('credit balance') ||
      msg.includes('spend limit') ||
      msg.includes('billing') ||
      (err.status === 429) ||
      (err.status === 400 && msg.includes('credit'));

    if (isCreditsError) {
      return res.json({
        reply: "I've reached my monthly interaction limit — feel free to reach out at jharolozano@gmail.com instead.",
      });
    }

    console.error('Agent error:', msg);
    res.status(500).json({ error: 'Agent error' });
  }
});

// GET /api/agent/suggestions — dynamic suggestions from real content
router.get('/suggestions', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, type, name FROM projects WHERE hidden = false ORDER BY sort_order`
    );
    res.json({ projects: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
