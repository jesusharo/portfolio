import { BookMarked, Mail, Sparkles, PenTool } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const CONTACT_MAILTO = 'mailto:jharolozano@gmail.com?subject=Hello%20from%20your%20portfolio';

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
    { id: 'projects', label: 'UI projects',  icon: PenTool,     path: '/projects' },
    { id: 'cases',    label: 'Case studies', icon: BookMarked,  path: '/cases' },
    { id: 'agent',    label: 'Agent',        icon: Sparkles,    path: '/agent' },
    { id: 'about',    label: 'About me',     icon: AboutMeIcon, path: '/about' },
    { id: 'contact',  label: 'Contact',      icon: Mail,        path: '/contact' },
  ];

  const isActive = (path: string) =>
    path === '/agent'
      ? location.pathname === '/agent' || location.pathname.startsWith('/chat')
      : location.pathname === path;

  function renderBtn(link: typeof links[0], desktop: boolean) {
    const Icon = link.icon;
    const active = isActive(link.path);
    const isContact = link.id === 'contact';
    return (
      <button
        key={link.id}
        onClick={() => isContact ? window.location.href = CONTACT_MAILTO : navigate(link.path)}
        aria-label={link.label}
        className={`${desktop ? 'group relative' : ''} cursor-pointer flex items-center justify-center rounded-full transition-all duration-200 ${
          active
            ? 'size-[52px] bg-[#d25d5f] text-white'
            : 'size-[44px] bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.25)]'
        }`}
      >
        <Icon className="size-[22px]" strokeWidth={1.5} />
        {desktop && (
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-white/70 text-sm whitespace-nowrap font-['Source_Sans_3',sans-serif]">{link.label}</p>
          </div>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex flex-row justify-around items-center px-4 pt-3 pb-6 z-30 bg-[rgba(0,0,0,0.2)] backdrop-blur-md">
        {links.map(link => renderBtn(link, false))}
      </div>

      {/* Desktop left vertical bar */}
      <div className="hidden md:flex absolute flex-col gap-[16px] items-center left-[24px] top-1/2 -translate-y-1/2 w-[64px] z-30">
        {links.map(link => renderBtn(link, true))}
      </div>
    </>
  );
}
