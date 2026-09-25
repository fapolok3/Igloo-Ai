import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ReplyGenerator } from './components/ReplyGenerator';
import { ProductView } from './components/ProductView';
import { FAQExplorer } from './components/FAQExplorer';
import { SettingsUserManagement } from './components/SettingsUserManagement';
import { LoginPage } from './components/LoginPage';
import { getCurrentUser, logoutUser } from './services/authService';
import { UserAccount } from './types/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
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
    <div className="min-h-screen bg-slate-950 flex justify-center items-center sm:p-0 md:p-4 transition-all">
      {/* Container - Adaptive Mobile App Wrapper on Desktop, 100% Native on Mobile */}
      <div
        className={`w-full bg-slate-100 min-h-screen flex flex-col transition-all duration-300 relative overflow-x-hidden ${
          isMobileFrame
            ? 'max-w-md my-auto shadow-2xl rounded-[40px] border-[8px] border-slate-800 overflow-hidden ring-1 ring-purple-500/20'
            : 'max-w-4xl mx-auto shadow-2xl sm:min-h-screen md:rounded-3xl md:my-4 md:border md:border-purple-200/40 overflow-hidden'
        }`}
      >
        {/* Modern Mobile App Header in Modern Purple */}
        <Header
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          isOnline={isOnline}
          onInstallPwa={handleInstallPwa}
          canInstallPwa={canInstallPwa}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Top Desktop Tabs */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={currentUser.role}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 max-w-4xl w-full mx-auto">
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
