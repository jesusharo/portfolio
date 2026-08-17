import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// POST /api/contact  { name, email, message }
router.post('/', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error('Contact: GMAIL_USER or GMAIL_APP_PASSWORD not set');
    return res.status(500).json({ error: 'Email not configured' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: user,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
          <h2 style="margin-bottom:4px">New portfolio message</h2>
          <p style="color:#666;margin-top:0">via jharolozano.com</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;background:#f5f5f5;padding:12px 16px;border-radius:8px">${message}</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact send error:', err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
