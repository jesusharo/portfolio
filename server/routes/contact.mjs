import { Router } from 'express';

const router = Router();

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// POST /api/contact  { name, email, message }
router.post('/', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const recipient = process.env.CONTACT_RECIPIENT;

  if (!apiKey || !from || !recipient) {
    console.error('Contact: Resend configuration is incomplete');
    return res.status(500).json({ error: 'Email not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
          <h2 style="margin-bottom:4px">New portfolio message</h2>
          <p style="color:#666;margin-top:0">via jharolozano.com</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap;background:#f5f5f5;padding:12px 16px;border-radius:8px">${escapeHtml(message)}</p>
        </div>
      `,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`Contact: Resend API error (${response.status})`, details);
      return res.status(502).json({ error: 'Email delivery failed' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact send error:', err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
