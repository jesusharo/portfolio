export interface CaseStudy {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  color: string;
  accentColor: string;
  description?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-ekatena',
    name: 'Ekatena',
    icon: 'E',
    bgColor: '#1B3A4A',
    color: '#34D399',
    accentColor: '#0D1F28',
    description: 'Complete redesign of the Ekatena platform, a corporate intelligence tool used by legal and financial analysts across Mexico.',
  },
  {
    id: 'case-dispatch',
    name: 'Dispatch',
    icon: 'D',
    bgColor: '#2A1A4A',
    color: '#60A5FA',
    accentColor: '#150D25',
    description: 'UX research and design for Dispatch, a last-mile logistics platform operating across Latin America.',
  },
  {
    id: 'case-flora',
    name: 'Flora',
    icon: 'F',
    bgColor: '#4A1A30',
    color: '#F472B6',
    accentColor: '#250D18',
    description: 'Consumer app design for Flora, a subscription service for curated plant care products and expert guidance.',
  },
  {
    id: 'case-nova',
    name: 'Nova',
    icon: 'N',
    bgColor: '#2A3A1A',
    color: '#FBBF24',
    accentColor: '#151D0D',
    description: 'End-to-end product design for Nova, an AI-powered analytics dashboard for e-commerce teams.',
  },
  {
    id: 'case-pulse',
    name: 'Pulse',
    icon: 'P',
    bgColor: '#3A1A4A',
    color: '#A78BFA',
    accentColor: '#1D0D25',
    description: 'Health and wellness app design for Pulse, focused on habit tracking and guided mental health routines.',
  },
  {
    id: 'case-anchor',
    name: 'Anchor',
    icon: 'A',
    bgColor: '#3A2A1A',
    color: '#FB7185',
    accentColor: '#1D150D',
    description: 'Brand strategy and digital product design for Anchor, a community platform for independent podcast creators.',
  },
];
