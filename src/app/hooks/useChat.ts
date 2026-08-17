import { useState, useCallback } from 'react';
import { Conversation, Message } from '../types';

// Strip [[PROJECT:...]] markers from text before sending to API
function stripProjectMarkers(text: string): string {
  return text.replace(/\[\[PROJECT:[^\]]+\]\]/g, '').trim();
}

// Build Anthropic-compatible message history from conversation
function buildHistory(messages: Message[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages
    .filter(m => !m.isLoading)
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.sender === 'assistant' ? stripProjectMarkers(m.content) : m.content,
    }));
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'New conversation', messages: [], createdAt: new Date() }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [loading, setLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const sendMessage = useCallback(async (content: string, isSuggestion = false) => {
    if (!content.trim() || !activeConversationId || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    let historyBeforeSend: Message[] = [];

    // Add user message + loading placeholder
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const updatedMessages = [...conv.messages, userMessage, loadingMessage];
        const title = conv.messages.length === 0 ? content.slice(0, 50) : conv.title;
        historyBeforeSend = conv.messages;
        return { ...conv, messages: updatedMessages, title };
      }
      return conv;
    }));

    setLoading(true);

    try {
      // Build message history for the API (user + previous assistant messages)
      const apiHistory = buildHistory([...historyBeforeSend, userMessage]);

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory, isSuggestion }),
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, I had trouble responding. Please try again.';

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: reply,
        sender: 'assistant',
        timestamp: new Date(),
      };

      // Replace loading placeholder with real response
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          const messages = conv.messages.filter(m => !m.isLoading);
          return { ...conv, messages: [...messages, assistantMessage] };
        }
        return conv;
      }));
    } catch {
      // Replace loading placeholder with error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble connecting. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          const messages = conv.messages.filter(m => !m.isLoading);
          return { ...conv, messages: [...messages, errorMessage] };
        }
        return conv;
      }));
    } finally {
      setLoading(false);
    }
  }, [activeConversationId, loading]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading,
  };
};
