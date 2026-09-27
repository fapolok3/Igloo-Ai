import React from 'react';
import { MessageSquareText, IceCream, HelpCircle, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../utils/audio';
import { UserRole } from '../types/auth';

export type TabType = 'generator' | 'products' | 'faqs' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole?: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userRole
}) => {
  const tabs = [
    { id: 'generator' as TabType, label: 'Reply AI', icon: MessageSquareText },
    { id: 'products' as TabType, label: 'Products & Offers', icon: IceCream },
    { id: 'faqs' as TabType, label: 'FAQs', icon: HelpCircle }
  ];

  // Settings tab is visible only if role is super_admin
  if (userRole === 'super_admin') {
    tabs.push({ id: 'settings' as TabType, label: 'Super Admin', icon: SlidersHorizontal });
  }

  const handleTabClick = (tabId: TabType) => {
    sounds.playTap();
    if (navigator.vibrate) navigator.vibrate(25);
    setActiveTab(tabId);
  };

  return (
    <nav className="fixed bottom-3 inset-x-2.5 sm:inset-x-4 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[28px] shadow-xl shadow-purple-950/15 p-1.5 sm:p-2 select-none touch-manipulation">
      <div
        className={`grid items-center w-full ${
          tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-3'
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center transition active:scale-90 cursor-pointer py-1 px-0.5 group w-full min-w-0"
            >
              <div
                className={`p-1.5 sm:p-2 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-purple-100 text-purple-600 shadow-2xs'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-1 leading-none text-center block w-full truncate px-0.5 ${
                  isActive
                    ? 'text-purple-600 font-bold'
                    : 'text-slate-500 font-medium group-hover:text-slate-700'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
