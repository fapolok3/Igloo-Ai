import React, { useEffect } from 'react';
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

  // Detect and set safe bottom inset for devices with on-screen Back/Home/Recent buttons
  useEffect(() => {
    const updateNavSafeBottom = () => {
      try {
        // Measure native env(safe-area-inset-bottom)
        const testEl = document.createElement('div');
        testEl.style.cssText =
          'position:fixed;bottom:0;height:env(safe-area-inset-bottom, 0px);visibility:hidden;pointer-events:none;';
        document.body.appendChild(testEl);
        const nativeInset = testEl.offsetHeight;
        document.body.removeChild(testEl);

        if (nativeInset > 0) {
          // Native browser safe area is active (handles 3-button or gesture bars)
          document.documentElement.style.setProperty('--mobile-nav-safe-inset', `${nativeInset}px`);
          return;
        }

        // Fallback for Android mobile browsers where 3 soft buttons exist but env() is 0
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isMobile = isAndroid || /iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 640;

        if (isAndroid || isMobile) {
          const screenHeight = window.screen.height;
          const innerHeight = window.innerHeight;
          const diff = screenHeight - innerHeight;
          const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone;

          if (isStandalone && diff >= 36) {
            document.documentElement.style.setProperty('--mobile-nav-safe-inset', '52px');
          } else if (diff >= 44 && diff <= 130) {
            // Android on-screen soft navigation bar (Back, Home, Recent) active
            document.documentElement.style.setProperty('--mobile-nav-safe-inset', '48px');
          } else {
            document.documentElement.style.setProperty('--mobile-nav-safe-inset', '0px');
          }
        } else {
          document.documentElement.style.setProperty('--mobile-nav-safe-inset', '0px');
        }
      } catch (e) {
        document.documentElement.style.setProperty('--mobile-nav-safe-inset', '0px');
      }
    };

    updateNavSafeBottom();
    window.addEventListener('resize', updateNavSafeBottom);
    window.addEventListener('orientationchange', updateNavSafeBottom);
    return () => {
      window.removeEventListener('resize', updateNavSafeBottom);
      window.removeEventListener('orientationchange', updateNavSafeBottom);
    };
  }, []);

  const handleTabClick = (tabId: TabType) => {
    sounds.playTap();
    if (navigator.vibrate) navigator.vibrate(25);
    setActiveTab(tabId);
  };

  return (
    <nav
      className="fixed inset-x-2.5 sm:inset-x-4 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[28px] shadow-xl shadow-purple-950/15 p-1.5 sm:p-2 select-none touch-manipulation transition-[bottom] duration-150 ease-out"
      style={{
        bottom: 'calc(max(env(safe-area-inset-bottom, 0px), var(--mobile-nav-safe-inset, 0px)) + 12px)'
      }}
    >
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
