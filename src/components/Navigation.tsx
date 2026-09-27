import React from 'react';
import { MessageSquareText, IceCream, HelpCircle, Settings2 } from 'lucide-react';
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

  // Settings tab is visible only if role is super_admin for managing users & Gemini configuration
  if (userRole === 'super_admin') {
    tabs.push({ id: 'settings' as TabType, label: 'Super Admin', icon: Settings2 });
  }

  const handleTabClick = (tabId: TabType) => {
    sounds.playTap();
    if (navigator.vibrate) navigator.vibrate(25);
    setActiveTab(tabId);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[62px] sm:top-[73px] z-30 shadow-2xs overflow-x-auto scrollbar-none">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        <div className="flex space-x-1 py-1.5 sm:py-2 min-w-max mx-auto sm:mx-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 text-xs font-bold transition-all relative cursor-pointer select-none rounded-xl ${
                  isActive
                    ? 'text-purple-700 bg-purple-50/90 font-black shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'scale-105 bg-purple-100 text-purple-700' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
