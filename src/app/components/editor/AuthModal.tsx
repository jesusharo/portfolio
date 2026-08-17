import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { login } from '../../lib/api';

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthModal({ open, onSuccess, onClose }: Props) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(passcode);
      onSuccess();
    } catch {
      setError('Wrong passcode. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <form
              onSubmit={handleSubmit}
              className="pointer-events-auto w-full max-w-[320px] rounded-[20px] bg-[rgba(24,24,24,0.98)] border border-white/10 p-6 flex flex-col gap-4"
              style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
            >
              <div>
                <h2 className="text-white text-[1rem] font-semibold font-['Source_Sans_3',sans-serif] mb-1">
                  Editor access
                </h2>
                <p className="text-white/40 text-[0.8rem] font-['Source_Sans_3',sans-serif]">
                  Enter your passcode to continue.
                </p>
              </div>

              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Passcode"
                className="bg-white/5 border border-white/10 rounded-[12px] px-4 py-3 text-white text-[0.9rem] outline-none focus:border-white/25 placeholder:text-white/25 font-['Source_Sans_3',sans-serif]"
              />

              {error && (
                <p className="text-[#d25d5f] text-[0.8rem] font-['Source_Sans_3',sans-serif]">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-[10px] rounded-[32px] border border-white/15 text-white/50 text-[0.85rem] font-['Source_Sans_3',sans-serif] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!passcode || loading}
                  className="flex-1 py-[10px] rounded-[32px] bg-[#d25d5f] text-white text-[0.85rem] font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Enter'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
