import { useState } from 'react';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';

const FIELD_STYLE = {
  background: 'rgba(60,60,60,0.5)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow:
    'inset 0px 1px 0px rgba(255,255,255,0.10), inset 0px -1px 0px rgba(0,0,0,0.15)',
  borderRadius: '14px',
  color: 'white',
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '16px',
  outline: 'none',
  width: '100%',
  padding: '14px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  display: 'block',
  marginBottom: '8px',
};

export default function ContactView() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PageTransition>
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="w-full max-w-[480px]">

          {/* Title */}
          <h1
            className="text-white mb-10"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Contact
          </h1>

          {sent ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/60"
              style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem' }}
            >
              Message sent — I'll be in touch soon.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Name */}
              <div>
                <label htmlFor="name" style={LABEL_STYLE}>Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name..."
                  value={form.name}
                  onChange={handleChange}
                  style={FIELD_STYLE}
                  className="placeholder:text-[rgba(255,255,255,0.25)]"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={LABEL_STYLE}>Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your Email Address..."
                  value={form.email}
                  onChange={handleChange}
                  style={FIELD_STYLE}
                  className="placeholder:text-[rgba(255,255,255,0.25)]"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={LABEL_STYLE}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Your Message..."
                  value={form.message}
                  onChange={handleChange}
                  style={{ ...FIELD_STYLE, resize: 'vertical' }}
                  className="placeholder:text-[rgba(255,255,255,0.25)]"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="self-start px-8 py-3 rounded-[32px] text-white font-semibold transition-colors"
                style={{
                  background: '#d25d5f',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                }}
              >
                Send Message
              </motion.button>

            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
