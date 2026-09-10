import { useState, useCallback, useEffect, useRef } from 'react';
import { Conversation, Message } from '../types';
import { useLanguage } from '../context/LanguageContext';

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
  const { language } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: language === 'es' ? 'Nueva conversación' : 'New conversation', messages: [], createdAt: new Date() }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const requestGenerationRef = useRef(0);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    requestGenerationRef.current += 1;
    setLoading(false);
    setConversations(current => current.map(conversation =>
      ({
        ...conversation,
        title: conversation.messages.length === 0
          ? (language === 'es' ? 'Nueva conversación' : 'New conversation')
          : conversation.title,
        messages: conversation.messages.filter(message => !message.isLoading),
      })
    ));
  }, [language]);

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
    const requestGeneration = ++requestGenerationRef.current;

    try {
      // Build message history for the API (user + previous assistant messages)
      const apiHistory = buildHistory([...historyBeforeSend, userMessage]);

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory, isSuggestion, language }),
      });

      const data = await res.json();
      if (requestGeneration !== requestGenerationRef.current) return;
      const reply = data.reply || (language === 'es'
        ? 'Lo siento, tuve problemas para responder. Inténtalo de nuevo.'
        : 'Sorry, I had trouble responding. Please try again.');

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
      if (requestGeneration !== requestGenerationRef.current) return;
      // Replace loading placeholder with error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: language === 'es'
          ? 'Tengo problemas para conectarme. Inténtalo de nuevo.'
          : "I'm having trouble connecting. Please try again.",
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
      if (requestGeneration === requestGenerationRef.current) setLoading(false);
    }
  }, [activeConversationId, language, loading]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading,
  };
};
