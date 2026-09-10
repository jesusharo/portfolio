import { Router } from 'express';
import { createHash } from 'crypto';

const router = Router();

const MAX_INPUT_BYTES = 200 * 1024;
const RATE_LIMIT = 10;
const RATE_WINDOW = 10 * 60 * 1000;
const MAX_RATE_ENTRIES = 10_000;
const MAX_CACHE_ENTRIES = 200;
const rateLimiter = new Map();
const cache = new Map();

function clientIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function allowedRequest(ip) {
  const now = Date.now();
  const current = rateLimiter.get(ip);
  if (!current || now - current.windowStart >= RATE_WINDOW) {
    if (rateLimiter.size >= MAX_RATE_ENTRIES) rateLimiter.delete(rateLimiter.keys().next().value);
    rateLimiter.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (current.count >= RATE_LIMIT) return false;
  current.count += 1;
  return true;
}

function cacheGet(key) {
  const value = cache.get(key);
  if (!value) return undefined;
  cache.delete(key);
  cache.set(key, value);
  return value;
}

function cacheSet(key, value) {
  if (cache.has(key)) cache.delete(key);
  while (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

function isProtectedKey(key) {
  return /(?:^|[_-])(id|uuid|key|slug|url|uri|href|src|path|image|file|filename|color|hex|code|htmltag|type|role|class|className|alttext)(?:$|[_-])/i.test(key)
    || /^(id|url|href|src|path|color|slug|code|type)$/i.test(key);
}

function isNonHumanString(value) {
  const trimmed = value.trim();
  return !trimmed
    || /^(?:https?:|mailto:|tel:|data:|\/\/|\/|\.\/|\.\.\/)/i.test(trimmed)
    || /^#[0-9a-f]{3,8}$/i.test(trimmed)
    || /^[a-z0-9]+(?:[-_.][a-z0-9]+)+$/i.test(trimmed)
    || /^[\w$.[\]{}()<>/:=;+*'"`\\-]+$/.test(trimmed) && /[{}()[\]<>:=;]/.test(trimmed);
}

function protectString(value, shouldTranslate, state) {
  if (!shouldTranslate || isNonHumanString(value)) return value;
  let result = value;
  // Preserve complete code blocks and all markup (including attributes and URLs).
  const patterns = [
    /<code\b[^>]*>[\s\S]*?<\/code>/gi,
    /<pre\b[^>]*>[\s\S]*?<\/pre>/gi,
    /<\/?[a-z][^>]*>/gi,
    /(?:https?:\/\/|mailto:|tel:|\/\/)[^\s"'<>]+/gi,
  ];
  for (const pattern of patterns) {
    result = result.replace(pattern, match => {
      const token = `__TRANSLATE_PROTECTED_${state.tokens.length}_X__`;
      state.tokens.push([token, match]);
      return token;
    });
  }
  return result;
}

function prepare(value, state, key = '') {
  if (typeof value === 'string') return protectString(value, !isProtectedKey(key), state);
  if (Array.isArray(value)) return value.map(item => prepare(item, state, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [
      name, prepare(item, state, name),
    ]));
  }
  return value;
}

function restore(value, state) {
  if (typeof value === 'string') {
    return state.tokens.reduce((text, [token, original]) => text.split(token).join(original), value);
  }
  if (Array.isArray(value)) return value.map(item => restore(item, state));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restore(item, state)]));
  }
  return value;
}

function sameShape(original, translated) {
  if (typeof original !== typeof translated || Array.isArray(original) !== Array.isArray(translated)) return false;
  if (Array.isArray(original)) {
    return original.length === translated.length && original.every((item, i) => sameShape(item, translated[i]));
  }
  if (original && typeof original === 'object') {
    const a = Object.keys(original);
    const b = Object.keys(translated || {});
    return a.length === b.length && a.every(key => Object.prototype.hasOwnProperty.call(translated, key)
      && sameShape(original[key], translated[key]));
  }
  return true;
}

const PLACEHOLDER_RE = /__TRANSLATE_PROTECTED_\d+_X__/g;
// MyMemory rejects queries above 500 characters even though it responds with
// HTTP 200. Keep shared chunks below that provider-specific ceiling.
const FALLBACK_CHUNK_SIZE = 450;
const FALLBACK_TIMEOUT = 8_000;
const FALLBACK_TOTAL_TIMEOUT = 45_000;

function placeholdersIn(text) {
  return text.match(PLACEHOLDER_RE) || [];
}

function assertPlaceholders(original, translated) {
  const expected = placeholdersIn(original);
  const actual = placeholdersIn(translated);
  if (expected.length !== actual.length || expected.some((token, index) => token !== actual[index])) {
    throw new Error('Translation provider altered protected content');
  }
}

// Split on whitespace, treating protected markers as indivisible words.
function chunkForFallback(text) {
  if (text.length <= FALLBACK_CHUNK_SIZE) return [text];
  const words = text.match(/__TRANSLATE_PROTECTED_\d+_X__|\S+\s*/g) || [text];
  const chunks = [];
  let current = '';
  for (const word of words) {
    if (current && current.length + word.length > FALLBACK_CHUNK_SIZE) {
      chunks.push(current);
      current = '';
    }
    current += word;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FALLBACK_TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function lingvaTranslate(text, target) {
  const data = await fetchWithTimeout(
    `https://lingva.ml/api/v1/en/${target}/${encodeURIComponent(text)}`,
  );
  if (typeof data?.translation !== 'string') throw new Error('Invalid Lingva response');
  assertPlaceholders(text, data.translation);
  return data.translation;
}

async function myMemoryTranslate(text, target) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
  const data = await fetchWithTimeout(url);
  const translation = data?.responseData?.translatedText;
  if (Number(data?.responseStatus) !== 200 || data?.responseDetails || typeof translation !== 'string') {
    throw new Error('Invalid MyMemory response');
  }
  assertPlaceholders(text, translation);
  return translation;
}

async function fallbackTranslateStrings(value, target) {
  if (target === 'en') return value;
  const deadline = Date.now() + FALLBACK_TOTAL_TIMEOUT;
  const values = new Map();
  const collect = (item, key = '') => {
    if (typeof item === 'string') {
      if (!isProtectedKey(key) && !isNonHumanString(item)) values.set(item, null);
    } else if (Array.isArray(item)) {
      item.forEach(child => collect(child, key));
    } else if (item && typeof item === 'object') {
      Object.entries(item).forEach(([name, child]) => collect(child, name));
    }
  };
  collect(value);

  const translateOne = async text => {
    const chunks = chunkForFallback(text);
    const translatedChunks = [];
    for (const chunk of chunks) {
      if (Date.now() >= deadline) throw new Error('Fallback translation deadline exceeded');
      let result;
      try {
        result = await lingvaTranslate(chunk, target);
      } catch {
        result = await myMemoryTranslate(chunk, target);
      }
      assertPlaceholders(chunk, result);
      translatedChunks.push(result);
    }
    const translated = translatedChunks.join('');
    assertPlaceholders(text, translated);
    return translated;
  };

  const pending = [...values.keys()];
  let cursor = 0;
  const worker = async () => {
    while (cursor < pending.length) {
      const text = pending[cursor++];
      values.set(text, await translateOne(text));
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, pending.length) }, worker));

  const replace = (item, key = '') => {
    if (typeof item === 'string') return values.has(item) && !isProtectedKey(key) ? values.get(item) : item;
    if (Array.isArray(item)) return item.map(child => replace(child, key));
    if (item && typeof item === 'object') {
      return Object.fromEntries(Object.entries(item).map(([name, child]) => [name, replace(child, name)]));
    }
    return item;
  };
  return replace(value);
}

router.post('/', async (req, res) => {
  const { content, targetLanguage } = req.body || {};
  if (!['es', 'en'].includes(targetLanguage)) {
    return res.status(400).json({ error: 'targetLanguage must be "es" or "en"' });
  }
  let serialized;
  try {
    serialized = JSON.stringify(content);
  } catch {
    return res.status(400).json({ error: 'content must be JSON-serializable' });
  }
  if (serialized === undefined) return res.status(400).json({ error: 'content is required' });
  if (Buffer.byteLength(serialized, 'utf8') > MAX_INPUT_BYTES) {
    return res.status(413).json({ error: 'content exceeds the 200 KB limit' });
  }
  if (!allowedRequest(clientIp(req))) return res.status(429).json({ error: 'Too many translation requests; try again later' });

  const cacheKey = createHash('sha256').update(targetLanguage).update('\0').update(serialized).digest('hex');
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return res.json({ content: cached });

  const state = { tokens: [] };
  const prepared = prepare(content, state);
  try {
    const translated = await fallbackTranslateStrings(prepared, targetLanguage);
    if (!sameShape(prepared, translated)) throw new Error('Translation changed the content shape');
    for (const [token] of state.tokens) {
      if (!JSON.stringify(translated).includes(token)) throw new Error('Translation altered protected content');
    }
    const restored = restore(translated, state);
    cacheSet(cacheKey, restored);
    return res.json({ content: restored });
  } catch {
    console.warn('Lingva/MyMemory translation unavailable');
    return res.status(502).json({ error: 'Translation service returned an invalid response' });
  }
});

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimiter) {
    if (now - entry.windowStart >= RATE_WINDOW) rateLimiter.delete(ip);
  }
}, RATE_WINDOW).unref?.();

export default router;