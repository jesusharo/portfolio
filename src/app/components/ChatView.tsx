import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';

export default function ChatView() {
  const {
    activeConversation,
    sendMessage,
  } = useChat();

  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const hasMessages = !!(activeConversation && activeConversation.messages.length > 0);

  // Derive network scale state: idle → focused → conversation
  const networkState: 'idle' | 'focused' | 'conversation' = hasMessages
    ? 'conversation'
    : inputFocused
      ? 'focused'
      : 'idle';

  return (
    <div className="bg-[#1c1c1c] relative size-full overflow-hidden">
      {/* Background blur layer */}
      <div className="absolute backdrop-blur-[20px] bg-gradient-to-t from-[69.674%] from-[rgba(0,0,0,0)] h-full left-0 to-[99.185%] to-[rgba(0,0,0,0.24)] top-0 w-full z-0" data-name="blurr" />
      
      {/* Radial gradient background */}
      <div className="absolute flex h-full items-center justify-center left-0 top-0 w-full z-0 pointer-events-none">
        <div className="flex-none rotate-180">
          <div className="h-full w-full" style={{ 
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1512 982' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.20000000298023224'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-7.5282e-15 98.2 -151.2 -4.0275e-14 756 2.1805e-13)'><stop stop-color='rgba(89,13,180,0.3)' offset='0'/><stop stop-color='rgba(145,68,236,0.15)' offset='0.25'/><stop stop-color='rgba(182,131,243,0.05)' offset='0.5'/><stop stop-color='rgba(0,0,0,0.1)' offset='1'/></radialGradient></defs></svg>")` 
          }} />
        </div>
      </div>

      {/* Persistent Network Visualization Background */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
        <NetworkVisualization networkState={networkState} />
      </div>
      
      <MainMenu />

      {/* Main Content */}
      <main className="absolute inset-0 overflow-hidden z-10 flex flex-col items-center pointer-events-none">
        {hasMessages && (
          <div className="w-full max-w-[800px] h-[calc(100vh-140px)] overflow-y-auto mt-[40px] px-8 pb-[80px] pointer-events-auto">
            <div className="space-y-4">
              {activeConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        onSendMessage={sendMessage}
        centered={!hasMessages}
        onFocusChange={setInputFocused}
      />
    </div>
  );
}