export interface Project {
  id: string;
  name: string;
  /** Icon letter shown in the card */
  icon: string;
  /** Card background color */
  bgColor: string;
  /** Icon/text color */
  color: string;
  /** Dark background used in detail view */
  accentColor: string;
  description?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: 'klarna',
    name: 'Klarna',
    icon: 'K',
    bgColor: '#1B2D5C',
    color: '#4ADE80',
    accentColor: '#0F1A38',
    description: 'Redesign of the checkout and payment flow for Klarna\'s consumer app, focusing on reducing friction and increasing conversion rates across key touchpoints.',
  },
  {
    id: 'unilink',
    name: 'Unilink',
    icon: 'U',
    bgColor: '#2B2B6B',
    color: '#C084FC',
    accentColor: '#191945',
    description: 'End-to-end UX design for a B2B SaaS platform connecting universities and students, including onboarding, dashboards, and notification systems.',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    icon: 'S',
    bgColor: '#7A7A8A',
    color: '#E879F9',
    accentColor: '#3A3A48',
    description: 'Design system and component library for Orbit, a project management tool built for distributed design teams.',
  },
  {
    id: 'vector',
    name: 'Vector',
    icon: 'V',
    bgColor: '#3B2A8A',
    color: '#818CF8',
    accentColor: '#1F1655',
    description: 'Mobile-first product design for Vector, a fintech app helping freelancers track income, expenses, and tax obligations in real time.',
  },
  {
    id: 'astro',
    name: 'Astro',
    icon: 'A',
    bgColor: '#4A5A2A',
    color: '#BEF264',
    accentColor: '#252E14',
    description: 'Brand identity and landing page design for Astro, a developer tooling startup targeting modern web teams.',
  },
  {
    id: 'atentu',
    name: 'Atentu',
    icon: 'T',
    bgColor: '#5A1025',
    color: '#FB7185',
    accentColor: '#2D0813',
    description: 'Atentu is a fintech product based on Ekatena. It uses data from official sources such as the government, the police, the Mexican taxes institution, and the Mexican credit bureau to generate a risk score analysis of a specific company.\n\nAtentu was lacking branding and a concept to represent this project. I worked with the stakeholder to define a logotype as well as a new color palette and a new style of icons to communicate the main idea to a new market.\n\nI also worked on synthesizing the content from Ekatena and adapting it to work with this specialized product. When the content was done, I prepared a simple landing page to launch the product as a proof of concept.',
  },
];
