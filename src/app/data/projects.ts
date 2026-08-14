export interface Project {
  id: string;
  name: string;
  color: string;
  /** SVG path data or a letter for the icon */
  icon: string;
  iconType: 'svg' | 'letter';
  url?: string;
}

export const projects: Project[] = [
  {
    id: 'klarna',
    name: 'Klarna',
    color: '#4ADE80',
    icon: 'K',
    iconType: 'letter',
  },
  {
    id: 'project-2',
    name: 'Project 2',
    color: '#C084FC',
    icon: 'U',
    iconType: 'letter',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    color: '#E879F9',
    icon: 'S',
    iconType: 'letter',
  },
  {
    id: 'project-4',
    name: 'Project 4',
    color: '#FB923C',
    icon: 'V',
    iconType: 'letter',
  },
  {
    id: 'astro',
    name: 'Astro',
    color: '#818CF8',
    icon: 'A',
    iconType: 'letter',
  },
  {
    id: 'project-6',
    name: 'Project 6',
    color: '#F43F5E',
    icon: 'B',
    iconType: 'letter',
  },
];
