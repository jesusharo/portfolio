import { motion, AnimatePresence } from 'motion/react';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LeaveAgentModal({ open, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div
              className="pointer-events-auto w-full max-w-[340px] rounded-[20px] bg-[rgba(30,30,30,0.95)] border border-white/10 p-6 flex flex-col gap-5"
              style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
            >
              {/* Icon */}
              <div className="size-[44px] rounded-full bg-[rgba(210,93,95,0.15)] border border-[rgba(210,93,95,0.3)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="#d25d5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1">
                <h2 className="text-white text-[1rem] font-semibold font-['Source_Sans_3',sans-serif]">
                  Leave the conversation?
                </h2>
                <p className="text-white/50 text-[0.85rem] leading-[1.5] font-['Source_Sans_3',sans-serif]">
                  Navigating away will reset the current chat session. This cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-[10px] rounded-[32px] border border-white/15 text-white/60 text-[0.85rem] font-['Source_Sans_3',sans-serif] hover:text-white hover:border-white/30 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-[10px] rounded-[32px] bg-[#d25d5f] text-white text-[0.85rem] font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors"
                >
                  Leave
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
