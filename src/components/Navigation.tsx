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

  // Settings tab is visible only if role is super_admin for managing users
  if (userRole === 'super_admin') {
    tabs.push({ id: 'settings' as TabType, label: 'User Admin', icon: Settings2 });
  }

  const handleTabClick = (tabId: TabType) => {
    sounds.playTap();
    if (navigator.vibrate) navigator.vibrate(25);
    setActiveTab(tabId);
  };

  return (
    <>
      {/* Top App Tab Bar in Modern Purple Accent */}
      <div className="hidden sm:block bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-[73px] z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-3.5 px-5 text-xs font-bold transition-all relative cursor-pointer select-none ${
                    isActive
                      ? 'text-purple-600 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl my-1'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-purple-100/80 text-purple-600' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating Mobile Tab Bar (Modern Purple Accent) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl safe-area-bottom">
        <div
          className={`grid h-16 max-w-md mx-auto px-2 ${
            userRole === 'super_admin' ? 'grid-cols-4' : 'grid-cols-3'
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition active:scale-95 select-none relative cursor-pointer ${
                  isActive ? 'text-purple-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-200 ${
                    isActive ? 'bg-purple-50 text-purple-600 ring-2 ring-purple-500/20 shadow-xs' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
