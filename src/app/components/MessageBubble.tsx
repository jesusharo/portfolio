import { Message } from '../types';
import svgPaths from '../../imports/svg-qeyvz6rlpu';

interface MessageBubbleProps {
  message: Message;
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
    <div className="size-[28px] rounded-[8px] bg-[rgba(50,50,50,0.8)] flex items-center justify-center shrink-0">
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

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-[10px] mb-4">
        {/* User bubble */}
        <div className="bg-[#5C1E1E] rounded-[20px] px-[20px] py-[14px] max-w-[65%]">
          <p className="text-[14px] text-white leading-[1.55] font-['Source_Sans_3',sans-serif]">
            {message.content}
          </p>
        </div>
        {/* Avatar */}
        <UserAvatar />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-[10px] mb-4">
      {/* Sparkle icon left of bubble */}
      <SparkleIcon />
      {/* AI bubble */}
      <div className="bg-[rgba(38,38,38,0.88)] rounded-[20px] px-[20px] py-[14px] max-w-[65%]">
        <p className="text-[14px] text-white leading-[1.55] font-['Source_Sans_3',sans-serif]">
          {message.content}
        </p>
      </div>
    </div>
  );
}
