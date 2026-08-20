import { useEffect } from 'react';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { useNetworkState } from '../context/NetworkStateContext';

const CONTACT_EMAIL = 'jharolozano@gmail.com';
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Hello from your portfolio')}`;

export default function ContactView() {
  const { setNetworkState } = useNetworkState();

  useEffect(() => {
    setNetworkState('conversation');
    return () => setNetworkState('idle');
  }, []);

  return (
    <PageTransition>
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[480px] text-center">
          <h1
            className="text-white/50 text-[0.72rem] font-semibold tracking-[0.22em] uppercase select-none mb-6"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Contact
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p
              className="text-white/60"
              style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem' }}
            >
              Have a project in mind? Send me an email.
            </p>
            <a
              href={CONTACT_MAILTO}
              className="inline-flex px-8 py-3 rounded-[32px] text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: '#d25d5f',
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
              }}
            >
              Email me
            </a>
            <span
              className="text-white/35 text-[0.85rem]"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {CONTACT_EMAIL}
            </span>
          </motion.div>
        </div>
        </div>
      </div>
    </PageTransition>
  );
}
