import { Message } from '../types';
import AgentIcon from './AgentIcon';
import { User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div id={`msg-${message.id}`} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start mb-6`}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="size-8 rounded-full bg-[#d25d5f] flex items-center justify-center">
            <User className="size-5 text-white" strokeWidth={2} />
          </div>
        ) : (
          <AgentIcon type={message.sender as any} size="md" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && message.agentName && (
          <span className="text-xs font-semibold text-gray-400 px-1 font-['Source_Sans_Pro',sans-serif]">
            {message.agentName}
          </span>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-[#d25d5f] text-white'
              : 'bg-[rgba(60,60,60,0.5)] backdrop-blur-md border border-white/10 text-white shadow-sm'
          }`}
        >
          <p className="text-sm leading-relaxed font-['Source_Sans_3',sans-serif]">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 px-1 font-['Source_Sans_Pro',sans-serif]">
          {message.timestamp.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}