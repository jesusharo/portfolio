import { Message } from '../types';

// Parse [[PROJECT:id:name]] markers from text
interface TextSegment { kind: 'text'; content: string }
interface ProjectSegment { kind: 'project'; id: string; name: string }
type Segment = TextSegment | ProjectSegment;

function parseSegments(text: string): Segment[] {
  const regex = /\[\[PROJECT:([^\]:]+):([^\]]+)\]\]/g;
  const segments: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ kind: 'text', content: text.slice(last, match.index) });
    }
    segments.push({ kind: 'project', id: match[1], name: match[2] });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ kind: 'text', content: text.slice(last) });
  }

  return segments;
}

interface MessageBubbleProps {
  message: Message;
  onOpenProject?: (id: string) => void;
}

function UserAvatar() {
  return (
    <div className="size-[32px] rounded-full bg-[#5C1E1E] flex items-center justify-center shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SparkleIcon() {
  return (
    <div className="size-[32px] rounded-full bg-[rgba(50,50,50,0.8)] flex items-center justify-center shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-[5px] py-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="size-[6px] rounded-full bg-white/40"
          style={{
            animation: 'typingBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ProjectCard({ id, name, onOpen }: { id: string; name: string; onOpen?: (id: string) => void }) {
  return (
    <button
      onClick={() => onOpen?.(id)}
      className="inline-flex items-center gap-[7px] mt-2 mb-1 px-[14px] py-[8px] rounded-[20px] bg-white/8 border border-white/12 text-white/80 text-[0.78rem] font-['Source_Sans_3',sans-serif] leading-tight hover:bg-white/12 hover:text-white transition-colors group"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-50 group-hover:opacity-80 transition-opacity">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      </svg>
      {name}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function MessageBubble({ message, onOpenProject }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-[10px] mb-4">
        <div className="bg-[#5C1E1E] rounded-[20px] px-[20px] py-[14px] max-w-[65%]">
          <p className="text-[14px] text-white leading-[1.55] font-['Source_Sans_3',sans-serif]">
            {message.content}
          </p>
        </div>
        <UserAvatar />
      </div>
    );
  }

  const segments = message.isLoading ? [] : parseSegments(message.content);

  return (
    <div className="flex items-start gap-[10px] mb-4">
      <SparkleIcon />
      <div className="bg-[rgba(38,38,38,0.88)] rounded-[20px] px-[20px] py-[14px] max-w-[72%]">
        {message.isLoading ? (
          <TypingDots />
        ) : (
          <div className="text-[14px] text-white leading-[1.55] font-['Source_Sans_3',sans-serif]">
            {segments.map((seg, i) => {
              if (seg.kind === 'text') {
                // Split by newlines to render paragraph breaks
                return seg.content.split('\n').map((line, j, arr) => (
                  <span key={`${i}-${j}`}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ));
              }
              return (
                <div key={i}>
                  <ProjectCard id={seg.id} name={seg.name} onOpen={onOpenProject} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
