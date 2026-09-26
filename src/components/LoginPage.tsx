import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail
} from 'lucide-react';
import { loginUser } from '../services/authService';
import { UserAccount } from '../types/auth';
import { sounds } from '../utils/audio';
import { getTimeBasedGreeting } from '../utils/timeGreeting';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);

  const greetingInfo = getTimeBasedGreeting();

  const handleInputFocus = (field: 'email' | 'password', e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(field);
    // Smoothly scroll the focused input into center view after the mobile virtual keyboard pops up
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      sounds.playError();
      return;
    }

    setIsLoading(true);
    sounds.playTap();

    setTimeout(() => {
      const res = loginUser(email, password);
      setIsLoading(false);

      if (res.success && res.user) {
        sounds.playSuccess();
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        onLoginSuccess(res.user);
      } else {
        sounds.playError();
        if (navigator.vibrate) navigator.vibrate(100);
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    }, 350);
  };

  const handleFillSuperAdmin = () => {
    sounds.playTap();
    setEmail('fapolok7@gmail.com');
    setPassword('Admin@123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#13072b] via-[#1a0a38] to-[#0f051d] flex flex-col justify-between items-center px-4 py-2 sm:py-4 selection:bg-purple-500 selection:text-white relative overflow-y-auto overflow-x-hidden font-sans">
      {/* Dynamic Animated Ambient Background Glow Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Radial Neon Halos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-indigo-600/25 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px]" />

        {/* Decorative Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Curved Vector Accent Lines */}
        <svg
          className="absolute top-0 left-0 w-full h-[400px] text-purple-400/[0.08]"
          viewBox="0 0 1000 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,100 C200,30 400,260 700,80 C900,-20 1050,150 1150,210"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M-50,240 C250,130 500,340 850,150 C1000,70 1100,190 1200,270"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Top Branding Bar - Positioned high up at the top */}
      <div className="relative z-10 w-full max-w-md mx-auto pt-3 sm:pt-6 pb-1 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg shadow-purple-950/40 border-2 border-purple-400/40 relative group overflow-hidden flex-shrink-0">
              <img
                src="https://igloobd.com/default/assets/img/about/about1.jpg"
                alt="Igloo Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-sans">
                  Igloo
                </span>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-300/30 shadow-md shadow-purple-500/25 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-xs text-purple-200/90 font-semibold tracking-wide">
                Customer Support Intelligence
              </p>
            </div>
          </div>

          {/* Version Badge */}
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-extrabold text-purple-200 flex items-center space-x-1.5 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>V2.0.1</span>
          </div>
        </div>
      </div>

      {/* Main Login Section - Vertically Centered in the middle */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-2 space-y-2.5">
        {/* Only Good Evening Greeting - Positioned directly on top of the Login Box */}
        <div className="px-2 space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>{greetingInfo.greeting}</span>
            <span className="text-lg">{greetingInfo.icon}</span>
          </h2>
          <p className="text-xs text-purple-200/80 font-medium">
            Sign in to access corporate replies, live catalog & FAQs
          </p>
        </div>

        {/* Luxe White Glass Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] px-5 sm:px-7 py-6 sm:py-7 shadow-[0_25px_60px_-15px_rgba(76,29,149,0.45)] border border-white/80 space-y-4">
          {/* Error Notification Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-700 font-bold animate-in fade-in zoom-in-95 duration-150 shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-0.5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                <span>Official Email Address</span>
              </label>
              <div className="relative">
                <div className={`w-8 h-8 rounded-xl absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200 ${
                  isFocused === 'email' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onFocus={(e) => handleInputFocus('email', e)}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. executive@igloobd.com"
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password with Forgot? link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700">
                  Login Password
                </label>
                <button
                  type="button"
                  onClick={handleFillSuperAdmin}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200/80 transition cursor-pointer"
                >
                  Auto-fill Admin?
                </button>
              </div>
              <div className="relative">
                <div className={`w-8 h-8 rounded-xl absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200 ${
                  isFocused === 'password' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={(e) => handleInputFocus('password', e)}
                  onBlur={() => setIsFocused(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secure password"
                  required
                  className="w-full pl-12 pr-11 py-3 sm:py-3.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 focus:bg-white transition-all shadow-xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button with Gradient & Glow */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-600/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in to Igloo AI</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer info: Developed by Fa Polok */}
          <div className="text-center text-xs text-slate-400 pt-2 font-medium flex items-center justify-center space-x-2 border-t border-slate-100">
            <span>© 2026 Abdul Monem Ltd.</span>
            <span>•</span>
            <span>Developed by Fa Polok</span>
          </div>
        </div>
      </div>
    </div>
  );
};
