import { useState, useMemo, useRef, useEffect } from 'react';
import svgPaths from "../../imports/svg-qeyvz6rlpu";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  centered?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

const CATEGORIZED_SUGGESTIONS = [
  {
    category: "Sobre ti / panorama general",
    questions: [
      "¿Cuál es tu experiencia y a qué te dedicas?",
      "¿Qué tipo de proyectos te interesa trabajar?",
      "¿Cómo describirías tu proceso de trabajo?"
    ]
  },
  {
    category: "Sobre un proyecto específico",
    questions: [
      "¿Qué problema resolvía este proyecto?",
      "¿Cuál fue tu rol en este proyecto?",
      "¿Qué herramientas o tecnologías usaste aquí?",
      "¿Qué fue lo más retador de este proyecto?",
      "¿Qué resultado o impacto tuvo?"
    ]
  },
  {
    category: "Sobre habilidades / stack",
    questions: [
      "¿Con qué herramientas de diseño/desarrollo trabajas normalmente?",
      "¿Tienes experiencia trabajando en equipo o con clientes directamente?"
    ]
  },
  {
    category: "Cierre / siguiente paso",
    questions: [
      "¿Cómo puedo contactarte?",
      "¿Tienes disponibilidad para nuevos proyectos?"
    ]
  }
];

export default function ChatInput({ onSendMessage, disabled, centered = false, onFocusChange }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (suggestionsRef.current && !suggestionsRef.current.contains(target) && target !== inputRef.current) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled) {
      onSendMessage(suggestion);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = useMemo(() => {
    const allQuestions = CATEGORIZED_SUGGESTIONS.flatMap(cat => cat.questions);
    if (!input.trim()) return allQuestions.slice(0, 5);
    const lowerInput = input.toLowerCase();
    return allQuestions.filter(q => q.toLowerCase().includes(lowerInput)).slice(0, 5);
  }, [input]);

  return (
    <div 
      className={`-translate-x-1/2 absolute left-1/2 z-20 flex flex-col items-center w-full max-w-[600px] px-4 md:px-0 transition-all duration-500 ease-in-out ${
        centered ? 'top-1/2 -translate-y-1/2' : 'bottom-[160px] md:bottom-[80px]'
      }`}
    >
      
      <form onSubmit={handleSubmit} className="w-full relative z-30">
        <div className="bg-[rgba(60,60,60,0.5)] backdrop-blur-xl content-stretch flex gap-[24px] items-center pl-[24px] pr-[8px] rounded-[32px] w-full mx-auto pt-[8px] pb-[8px]" style={{ boxShadow: '0px 4px 36px rgba(0,0,0,0.05), inset 0px 1px 0px rgba(255,255,255,0.10), inset 0px -1px 0px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => { setShowSuggestions(true); onFocusChange?.(true); }}
            onBlur={() => onFocusChange?.(false)}
            placeholder="Do you want to know anything in particular?"
            disabled={disabled}
            className="font-['Source_Sans_3',sans-serif] font-normal leading-[1.4] relative flex-1 text-[16px] text-white bg-transparent outline-none placeholder:text-[rgba(255,255,255,0.3)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="bg-[#d25d5f] content-stretch flex items-center justify-center rounded-[32px] size-[48px] shrink-0 hover:bg-[#c25052] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative shrink-0 size-[24px]">
              <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </button>
        </div>
      </form>

      {/* Suggestions — floating pills, above input when at bottom, below when centered */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute left-1/2 -translate-x-1/2 w-full flex flex-col items-start gap-[6px] z-20 ${
            centered
              ? 'top-[calc(100%+8px)]'
              : 'bottom-[calc(100%+8px)] flex-col-reverse'
          }`}
        >
          {filteredSuggestions.map((q, idx) => (
            <button
              key={idx}
              onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(q); }}
              className="px-[18px] py-[10px] rounded-[32px] text-left text-[0.75rem] leading-[1.4] font-['Source_Sans_3',sans-serif] text-[rgba(255,255,255,0.65)] transition-colors hover:text-[rgba(255,255,255,0.85)] bg-[rgba(60,60,60,0.85)]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-3 text-center text-[0.85rem] leading-[1.5] font-['Source_Sans_3',sans-serif] text-[rgba(255,255,255,0.25)] px-2">
        This agent is here to help you explore my projects — it's not a replacement for an interview.
      </p>
    </div>
  );
}