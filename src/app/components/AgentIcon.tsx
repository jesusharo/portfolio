import svgPaths from "../../imports/svg-qeyvz6rlpu";
import { AgentType } from '../types';

interface AgentIconProps {
  type: AgentType;
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  isPresent?: boolean;
}

const colorMap = {
  search: '#ECDFFC',
  tools: '#FBE1F7',
  brain: '#0084FF',
  insights: '#E7D3FF'
};

const strokeColorMap = {
  search: '#0367C4',
  tools: '#0367C4',
  brain: 'white',
  insights: '#0367C4'
};

const pathMap = {
  search: svgPaths.p38815800,
  tools: svgPaths.p6576600,
  brain: svgPaths.p2fe790c0,
  insights: svgPaths.p3a142140
};

export default function AgentIcon({ type, size = 'md', isSpeaking = false, isPresent = false }: AgentIconProps) {
  const defaultBgColor = colorMap[type];
  const strokeColor = strokeColorMap[type];
  const path = pathMap[type];
  
  // Determinar color de fondo basado en estado
  let bgColor = defaultBgColor;
  let opacity = 1;
  
  if (isSpeaking) {
    // Estado "hablando" - fondo azul
    bgColor = '#0084FF';
  } else if (isPresent) {
    // Estado "presente" - fondo rosa/púrpura claro
    bgColor = '#E8D5F8';
  } else {
    // No está en la conversación - opacidad baja
    opacity = 0.3;
  }
  
  const sizeClass = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-8'
  }[size];

  return (
    <div className={`${sizeClass} relative shrink-0 transition-opacity`} style={{ opacity }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <rect fill={bgColor} height="32" rx="16" width="32" />
        <path d={path} stroke={isSpeaking ? 'white' : strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
      </svg>
    </div>
  );
}