import { Message } from '../types';

interface SidebarProps {
  questions: Message[];
  onQuestionClick: (id: string) => void;
}

export default function Sidebar({
  questions,
  onQuestionClick
}: SidebarProps) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[120px] top-[120px] w-[200px] z-10 max-h-[calc(100vh-200px)] overflow-y-auto">
      {questions.length > 0 && (
        <h3 className="font-['Source_Sans_Pro',sans-serif] text-[12px] uppercase text-[#686868] tracking-wider font-semibold mb-2">
          Historial
        </h3>
      )}
      {questions.map((msg) => (
        <button
          key={msg.id}
          onClick={() => onQuestionClick(msg.id)}
          className="text-left relative shrink-0 w-full hover:opacity-100 opacity-60 transition-opacity"
        >
          <p className="font-['Source_Sans_Pro',sans-serif] leading-[1.4] text-white text-[14px] line-clamp-3">
            {msg.content}
          </p>
        </button>
      ))}
    </div>
  );
}