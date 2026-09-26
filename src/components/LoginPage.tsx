import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
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
    <div className="min-h-screen bg-[#13072b] flex flex-col justify-between selection:bg-purple-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Animated Ambient Background Glow Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Radial Neon Halos */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/35 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 bg-indigo-600/30 rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-fuchsia-600/25 rounded-full blur-[110px]" />

        {/* Decorative Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Dynamic Curved Vector Lines */}
        <svg
          className="absolute top-0 left-0 w-full h-[380px] text-white/[0.07]"
          viewBox="0 0 1000 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,120 C200,40 400,280 700,90 C900,-30 1050,160 1150,220"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M-50,260 C250,140 500,360 850,160 C1000,80 1100,200 1200,280"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Top Header & Branding Section */}
      <div className="relative z-10 px-6 pt-12 pb-6 max-w-md w-full mx-auto flex flex-col justify-between">
        {/* Brand Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xl shadow-purple-950/50 border-2 border-purple-400/40 relative group overflow-hidden">
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
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-sans">
                  Igloo
                </span>
                {/* Clean "AI" tag without icon */}
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-300/30 shadow-md shadow-purple-500/20 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-semibold tracking-wide">
                Customer Support Intelligence
              </p>
            </div>
          </div>

          {/* Version Pill */}
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-extrabold text-purple-200 flex items-center space-x-1.5 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>V2.0.1</span>
          </div>
        </div>

        {/* Dynamic Time-Based Greeting Typography */}
        <div className="mt-8 space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>{greetingInfo.greeting}</span>
            <span className="text-xl">{greetingInfo.icon}</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
            Sign in to access corporate replies, live catalog & FAQs
          </p>
        </div>
      </div>

      {/* Modern Glass Bottom Card Container */}
      <div className="relative z-10 w-full bg-white rounded-t-[38px] px-6 sm:px-8 pt-5 pb-8 max-w-md mx-auto shadow-2xl shadow-purple-950/40 border-t border-purple-100/80 space-y-4">
        {/* Top Handle / Pull Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-700 font-bold animate-in fade-in zoom-in-95 duration-150 shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 flex items-center justify-between">
              <span>Official Email Address</span>
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isFocused === 'email' ? 'text-purple-600' : 'text-slate-400'
              }`} />
              <input
                type="email"
                value={email}
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. executive@igloobd.com"
                required
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-white transition-all shadow-xs"
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
                className="text-xs font-bold text-purple-600 hover:text-purple-800 transition cursor-pointer"
              >
                Auto-fill Admin?
              </button>
            </div>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isFocused === 'password' ? 'text-purple-600' : 'text-slate-400'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused(null)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secure password"
                required
                className="w-full pl-10 pr-11 py-3.5 bg-slate-50/90 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-white transition-all shadow-xs font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition"
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
              className="w-full py-4 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-600/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 relative overflow-hidden group"
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

        {/* Quick Autofill Badge Card */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleFillSuperAdmin}
            className="w-full py-2.5 px-3.5 bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200/80 rounded-2xl text-purple-900 transition flex items-center justify-between text-xs font-bold cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-lg bg-purple-200/80 text-purple-700 group-hover:scale-105 transition-transform">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black text-purple-950 leading-tight">Super Admin Autofill</span>
                <span className="block text-[10px] text-purple-700 font-mono">fapolok7@gmail.com</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black bg-purple-600 text-white px-2.5 py-1 rounded-xl shadow-xs group-hover:bg-purple-700 transition">
              Tap
            </span>
          </button>
        </div>

        {/* Footer info: Developed by Fa Polok */}
        <div className="text-center text-xs text-slate-400 pt-2 font-medium flex items-center justify-center space-x-2">
          <span>© 2026 Abdul Monem Ltd.</span>
          <span>•</span>
          <span>Developed by Fa Polok</span>
        </div>
      </div>
    </div>
  );
};
