import { BookMarked, Mail, Sparkles, Tags } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

function AboutMeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="8" stroke="currentColor" />
      <path
        d="M6.02335 5H4.90707V7.51156C4.7516 7.39478 4.55835 7.32558 4.34893 7.32558C3.83518 7.32558 3.4187 7.74205 3.4187 8.25581C3.4187 8.76958 3.83518 9.18605 4.34893 9.18605C4.55835 9.18605 4.7516 9.11685 4.90707 9.00007V10.9535H7.32568V12.1628H8.44196V9.83721H6.02335V5Z"
        fill="currentColor"
      />
      <path
        d="M11.9768 8.25581C11.9768 8.76958 11.5604 9.18605 11.0466 9.18605C10.5329 9.18605 10.1164 8.76958 10.1164 8.25581C10.1164 7.74205 10.5329 7.32558 11.0466 7.32558C11.5604 7.32558 11.9768 7.74205 11.9768 8.25581Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function MainMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { id: 'projects', label: 'UI projects',    icon: Tags,        path: '/projects' },
    { id: 'cases',    label: 'Case studies',   icon: BookMarked,  path: '/cases' },
    { id: 'agent',    label: 'Agent',          icon: Sparkles,    path: '/' },
    { id: 'about',    label: 'About me',       icon: AboutMeIcon, path: '/about' },
    { id: 'contact',  label: 'Contact',        icon: Mail,        path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/chat');
    return location.pathname === path;
  };

  return (
    <div className="absolute flex flex-col gap-[16px] items-center left-[24px] top-1/2 -translate-y-1/2 w-[64px] z-30">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.path);

        return (
          <button
            key={link.id}
            onClick={() => navigate(link.path)}
            className={`group relative cursor-pointer flex items-center justify-center size-[52px] rounded-full transition-colors ${
              active
                ? 'bg-[#d25d5f] text-white border border-[rgba(255,255,255,0.15)]'
                : 'bg-[#686868] text-white hover:bg-[#7a7a7a] border border-[rgba(255,255,255,0.10)]'
            }`}
          >
            <Icon
              className="size-[22px]"
              strokeWidth={2}
            />

            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                <p className="font-semibold font-['Source_Sans_Pro',sans-serif]">{link.label}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
