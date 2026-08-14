export interface CaseStudy {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const caseStudies: CaseStudy[] = [
  { id: 'case-1', name: 'Case Study 1', color: '#34D399', icon: 'C' },
  { id: 'case-2', name: 'Case Study 2', color: '#60A5FA', icon: 'D' },
  { id: 'case-3', name: 'Case Study 3', color: '#F472B6', icon: 'E' },
  { id: 'case-4', name: 'Case Study 4', color: '#FBBF24', icon: 'F' },
  { id: 'case-5', name: 'Case Study 5', color: '#A78BFA', icon: 'G' },
  { id: 'case-6', name: 'Case Study 6', color: '#FB7185', icon: 'H' },
];
