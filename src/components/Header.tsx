import React, { useState } from 'react';
import { Smartphone, Monitor, Download, Sparkles, LogOut, Shield, User } from 'lucide-react';
import { sounds } from '../utils/audio';
import { UserAccount } from '../types/auth';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  isOnline: boolean;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  onInstallPwa,
  canInstallPwa,
  currentUser,
  onLogout
}) => {
  const [logoLoaded, setLogoLoaded] = useState(true);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.playTap();
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 select-none">
      {/* Main Brand App Header in Modern Purple */}
      <div className="glass-header text-white px-4 py-3 sm:py-3.5 shadow-lg border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Stylized Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 flex items-center justify-center shadow-md border-2 border-purple-200/80 overflow-hidden flex-shrink-0">
              {logoLoaded ? (
                <img
                  src="https://igloobd.com/default/assets/img/about/about1.jpg"
                  alt="Igloo Logo"
                  className="w-full h-full object-cover rounded-xl"
                  onError={() => setLogoLoaded(false)}
                />
              ) : (
                <span className="text-2xl" role="img" aria-label="ice cream">🍦</span>
              )}
            </div>

            <div className="flex flex-col">
              {/* Title */}
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-md font-sans">
                  Igloo
                </span>
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-lg bg-white/20 text-purple-100 backdrop-blur-md border border-white/25 shadow-2xs tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>AI</span>
                </span>
              </div>

              {/* User Profile Badge */}
              {currentUser && (
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-purple-100 flex items-center space-x-1 bg-black/20 px-2 py-0.5 rounded-md">
                    {currentUser.role === 'super_admin' ? (
                      <Shield className="w-3 h-3 text-amber-300" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="text-[9px] text-amber-300 font-extrabold uppercase">
                      ({currentUser.role === 'super_admin' ? 'Super Admin' : 'User'})
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* PWA Install Button */}
            {canInstallPwa && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onInstallPwa?.();
                }}
                className="flex items-center space-x-1 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                title="Install App"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Install</span>
              </button>
            )}

            {/* Frame View Toggle (Desktop Only) */}
            <button
              onClick={() => {
                sounds.playTap();
                setIsMobileFrame(!isMobileFrame);
              }}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition active:scale-90 border border-white/30 hidden md:flex items-center justify-center cursor-pointer"
              title={isMobileFrame ? 'Expand to Full Width' : 'Preview in Phone Frame'}
            >
              {isMobileFrame ? (
                <Monitor className="w-4 h-4 text-white" />
              ) : (
                <Smartphone className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Instant Functional Logout Button */}
            {currentUser && (
              <button
                onClick={handleLogoutClick}
                className="px-3 py-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-900 text-white transition active:scale-90 border border-white/30 flex items-center space-x-1.5 text-xs font-bold shadow-sm cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
