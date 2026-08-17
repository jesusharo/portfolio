import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { useNetworkState } from '../context/NetworkStateContext';

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
  letterSpacing: '0.02em',
  color: 'rgba(255,255,255,0.45)',
  display: 'block',
  marginBottom: '8px',
};

export default function ContactView() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { setNetworkState } = useNetworkState();

  useEffect(() => {
    setNetworkState('conversation');
    return () => setNetworkState('idle');
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <PageTransition>
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[480px]">

          {/* Title */}
          <h1
            className="text-white mb-10"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          >
            Contact
          </h1>

          {status === 'sent' ? (
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
                  style={{ ...FIELD_STYLE, resize: 'none' }}
                  className="placeholder:text-[rgba(255,255,255,0.25)]"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-2 items-start">
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                  whileTap={{ scale: status === 'sending' ? 1 : 0.97 }}
                  className="self-start px-8 py-3 rounded-[32px] text-white font-semibold transition-all disabled:opacity-60"
                  style={{
                    background: '#d25d5f',
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.95rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </motion.button>
                {status === 'error' && (
                  <p className="text-[#d25d5f] text-[0.82rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    Something went wrong — please try again.
                  </p>
                )}
              </div>

            </form>
          )}
        </div>
        </div>
      </div>
    </PageTransition>
  );
}
