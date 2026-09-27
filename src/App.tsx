import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ReplyGenerator } from './components/ReplyGenerator';
import { ProductView } from './components/ProductView';
import { FAQExplorer } from './components/FAQExplorer';
import { SettingsUserManagement } from './components/SettingsUserManagement';
import { LoginPage } from './components/LoginPage';
import { getCurrentUser, logoutUser, getStoredUsers, saveUsers } from './services/authService';
import { UserAccount } from './types/auth';
import { syncUsersWithSupabase, syncFaqsWithSupabase, getGeminiKeyFromSupabase } from './services/supabaseService';
import { IGLOO_FAQS } from './data/knowledgeBase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [initialQueryForGenerator, setInitialQueryForGenerator] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Silent background sync with Supabase
    syncUsersWithSupabase(getStoredUsers()).then((synced) => {
      if (synced && synced.length > 0) {
        saveUsers(synced);
      }
    }).catch(() => {});

    syncFaqsWithSupabase(IGLOO_FAQS).catch(() => {});
    getGeminiKeyFromSupabase().catch(() => {});

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA BeforeInstallPrompt Handler
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveTab('generator');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstallPwa(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleSelectProductForReply = (product: { name: string; price: number }) => {
    setInitialQueryForGenerator(`${product.name} price`);
    setActiveTab('generator');
  };

  const handleTestInGenerator = (query: string) => {
    setInitialQueryForGenerator(query);
    setActiveTab('generator');
  };

  // If not logged in, render Modern Purple Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/10 flex justify-center items-start sm:p-0 md:py-4 transition-all">
      {/* Mobile App Container - Designed specifically for mobile screens */}
      <div className="w-full max-w-md bg-slate-100 min-h-screen flex flex-col relative overflow-x-hidden shadow-2xl sm:border sm:border-slate-200/80 sm:rounded-[36px]">
        {/* Modern Mobile App Header in Modern Purple */}
        <Header
          isOnline={isOnline}
          onInstallPwa={handleInstallPwa}
          canInstallPwa={canInstallPwa}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Floating Mobile Tabs */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={currentUser.role}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 w-full mx-auto pb-24">
          {activeTab === 'generator' && (
            <ReplyGenerator
              initialQuery={initialQueryForGenerator}
            />
          )}

          {activeTab === 'products' && (
            <ProductView onSelectProductForReply={handleSelectProductForReply} />
          )}

          {activeTab === 'faqs' && (
            <FAQExplorer
              onTestInGenerator={handleTestInGenerator}
              userRole={currentUser.role}
            />
          )}

          {/* User Admin Tab (Only Super Admin) */}
          {activeTab === 'settings' && currentUser.role === 'super_admin' && (
            <SettingsUserManagement currentUser={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
}
