import { Layout, BookOpen, User, MessageCircle } from 'lucide-react';

export default function MainMenu() {
  const links = [
    { id: 'UI projects', icon: Layout },
    { id: 'Case studies', icon: BookOpen },
    { id: 'About me', icon: User },
    { id: 'Assistant', icon: MessageCircle },
  ];

  return (
    <div className="absolute flex flex-col gap-[16px] items-center left-[24px] top-1/2 -translate-y-1/2 w-[64px] z-30">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.id === 'Assistant';
        
        return (
          <button
            key={link.id}
            className={`group relative cursor-pointer flex items-center justify-center size-[52px] rounded-full transition-all ${
              isActive 
                ? 'bg-[#d25d5f] text-white shadow-md scale-110' 
                : 'bg-[#2A2A2A] border border-[#3C3C3C] text-[#686868] hover:border-[#4A4A4A] hover:text-[#A0A0A0] shadow-sm hover:scale-105'
            }`}
          >
            <Icon 
              className="size-[22px] transition-colors" 
              strokeWidth={isActive ? 2.5 : 2}
            />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                <p className="font-semibold font-['Source_Sans_Pro',sans-serif]">{link.id}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}