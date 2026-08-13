import { useState, useCallback } from 'react';
import { Conversation, Message, AgentType } from '../types';
import { agents } from '../data/agents';

const generateAgentResponse = (userMessage: string, agentType: AgentType): string => {
  const responses: Record<AgentType, string[]> = {
    search: [
      `He encontrado información relevante sobre "${userMessage}". Identificando fuentes clave...`,
      `Buscando datos actualizados sobre este tema. He localizado varios proveedores potenciales.`,
      `Investigación completada. He recopilado información de múltiples fuentes confiables.`
    ],
    tools: [
      `Analizando los datos recopilados. Generando un informe de viabilidad...`,
      `He evaluado las certificaciones y la salud financiera de los candidatos.`,
      `Según mi análisis, hay 3 opciones principales que cumplen con los criterios.`
    ],
    brain: [
      `Desarrollando una estrategia basada en los datos analizados...`,
      `Mi recomendación es priorizar proveedores con certificación ISO 9001 y experiencia en aerospace.`,
      `He identificado los riesgos potenciales y las oportunidades de optimización.`
    ],
    insights: [
      `Basándome en el análisis completo, sugiero contactar primero con los dos proveedores mejor calificados.`,
      `Los insights clave indican que la relación calidad-precio es óptima en la región de Cluj-Napoca.`,
      `Te recomiendo verificar también la capacidad de producción y los tiempos de entrega antes de decidir.`
    ]
  };

  const agentResponses = responses[agentType];
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
};

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date()
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [speakingAgents, setSpeakingAgents] = useState<AgentType[]>(['search']); // Solo uno hablando por defecto
  const [presentAgents, setPresentAgents] = useState<AgentType[]>(['tools', 'brain', 'insights']); // Los demás presentes

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const toggleAgent = useCallback((agentId: AgentType) => {
    // Ciclo: no presente -> presente (rosa) -> hablando (azul) -> no presente
    if (speakingAgents.includes(agentId)) {
      // Si está hablando, quitarlo completamente
      setSpeakingAgents(prev => prev.filter(id => id !== agentId));
    } else if (presentAgents.includes(agentId)) {
      // Si está presente, pasarlo a hablando
      setPresentAgents(prev => prev.filter(id => id !== agentId));
      setSpeakingAgents(prev => [...prev, agentId]);
    } else {
      // Si no está en ninguno, agregarlo a presente
      setPresentAgents(prev => [...prev, agentId]);
    }
  }, [speakingAgents, presentAgents]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversación ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date()
    };

    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, [conversations.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !activeConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        const title = conv.messages.length === 0 ? content.slice(0, 50) : conv.title;
        return { ...conv, messages: updatedMessages, title };
      }
      return conv;
    }));

    // Simulate agent responses with delays - only speaking agents
    const agentSequence: AgentType[] = ['search', 'tools', 'brain', 'insights'].filter(
      agent => speakingAgents.includes(agent)
    );
    
    for (let i = 0; i < agentSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + i * 1000));
      
      const agentType = agentSequence[i];
      const agent = agents.find(a => a.id === agentType);
      
      const agentMessage: Message = {
        id: `${Date.now()}-${agentType}`,
        content: generateAgentResponse(content, agentType),
        sender: agentType,
        timestamp: new Date(),
        agentName: agent?.name
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return { ...conv, messages: [...conv.messages, agentMessage] };
        }
        return conv;
      }));
    }
  }, [activeConversationId, speakingAgents]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    sendMessage,
    speakingAgents,
    presentAgents,
    toggleAgent
  };
};