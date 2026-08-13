import { Agent } from '../types';

export const agents: Agent[] = [
  {
    id: 'search',
    name: 'Investigador',
    description: 'Busca y recopila información relevante',
    color: '#ECDFFC',
    icon: 'search'
  },
  {
    id: 'tools',
    name: 'Analista',
    description: 'Analiza datos y genera informes',
    color: '#FBE1F7',
    icon: 'briefcase'
  },
  {
    id: 'brain',
    name: 'Estratega',
    description: 'Desarrolla estrategias y soluciones',
    color: '#0084FF',
    icon: 'brain'
  },
  {
    id: 'insights',
    name: 'Consejero',
    description: 'Proporciona insights y recomendaciones',
    color: '#E7D3FF',
    icon: 'lightbulb'
  }
];

export const getAgentById = (id: string) => agents.find(agent => agent.id === id);
