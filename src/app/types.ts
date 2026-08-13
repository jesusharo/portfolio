export type AgentType = 'search' | 'tools' | 'brain' | 'insights';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | AgentType;
  timestamp: Date;
  agentName?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Agent {
  id: AgentType;
  name: string;
  description: string;
  color: string;
  icon: string;
}
