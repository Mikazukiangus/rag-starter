import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FloatingSpaceBannerProps {
  onClick: () => void;
}

export const FloatingSpaceBanner: React.FC<FloatingSpaceBannerProps> = ({ onClick }) => {
  const astronautImgSrc =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHFbnW-vjxhPgi-O6E7dYMk9hGtP9tqgoRti808WQUAXNns9JBqd2qWjso8TOEijyYigTrI0eYA_kKUSFhVoywvHRWhViYNWAePN-KWwlrMiMZWlqdFAADrhAYTq63ufXX5AFC7HmIp4SVSbxWGPhIAGIX-8E7OgodxwEkNgmo-rXHGEZHrA9gqEwpDnvacGV-6ADgQirHF5UGFluN88U8SOs2qRelaPQ312yfPI6E5tUG2DTIBXKz';

  return (
    <aside
      aria-label="Featured Story Pill Banner"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <button
        onClick={onClick}
        type="button"
        className="flex items-center gap-3 bg-[#1e222d]/95 hover:bg-[#2a2e39] backdrop-blur-md border border-[#2a2e39] hover:border-[#363a45] px-4 py-2 rounded-full shadow-2xl transition-all group duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962ff]/50"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-[#2a2e39] shrink-0">
          <img
            alt="Astronaut Scott 'Kidd' Poteet"
            className="w-full h-full object-cover"
            src={astronautImgSrc}
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback in case of network issue
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="text-left text-xs pr-1">
          <div className="font-bold text-white flex items-center gap-1 group-hover:text-[#2962ff] transition-colors">
            <span>See our space story</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] text-[#787b86]">
            With astronaut Scott "Kidd" Poteet
          </div>
        </div>
      </button>
    </aside>
  );
};
