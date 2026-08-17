import { useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import PageTransition from './PageTransition';
import LeaveAgentModal from './LeaveAgentModal';
import { useNetworkState } from '../context/NetworkStateContext';

export default function ChatView() {
  const { activeConversation, sendMessage } = useChat();
  const { setNetworkState } = useNetworkState();
  const [inputFocused, setInputFocused] = useState(false);

  const hasMessages = !!(activeConversation && activeConversation.messages.length > 0);

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    hasMessages && currentLocation.pathname !== nextLocation.pathname
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync network state with current chat state
  useEffect(() => {
    if (hasMessages) {
      setNetworkState('conversation');
    } else if (inputFocused) {
      setNetworkState('focused');
    } else {
      setNetworkState('idle');
    }
  }, [hasMessages, inputFocused]);

  // Reset to idle on unmount
  useEffect(() => {
    return () => setNetworkState('idle');
  }, []);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  return (
    <PageTransition>
      <div className="relative size-full overflow-hidden">

        {/* Radial gradient */}
        <div className="absolute flex h-full items-center justify-center left-0 top-0 w-full z-0 pointer-events-none">
          <div className="flex-none rotate-180">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1512 982' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.20000000298023224'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-7.5282e-15 98.2 -151.2 -4.0275e-14 756 2.1805e-13)'><stop stop-color='rgba(89,13,180,0.3)' offset='0'/><stop stop-color='rgba(145,68,236,0.15)' offset='0.25'/><stop stop-color='rgba(182,131,243,0.05)' offset='0.5'/><stop stop-color='rgba(0,0,0,0.1)' offset='1'/></radialGradient></defs></svg>")`
            }} />
          </div>
        </div>

        {/* Messages */}
        <main className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none">
          {hasMessages && (
            <div
              ref={messagesContainerRef}
              className="w-full max-w-[800px] flex-1 overflow-y-auto mt-[40px] px-8 pb-[140px] pointer-events-auto"
              style={{ maxHeight: 'calc(100vh - 40px)' }}
            >
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
          onFocusChange={(focused) => {
            setInputFocused(focused);
          }}
        />
      </div>

      <LeaveAgentModal
        open={blocker.state === 'blocked'}
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </PageTransition>
  );
}
