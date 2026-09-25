import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  ArrowRight
} from 'lucide-react';
import { loginUser } from '../services/authService';
import { UserAccount } from '../types/auth';
import { sounds } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-[#2e1065] flex flex-col justify-between selection:bg-purple-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Stylized Curved Vectors & Waves in Modern Purple */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute -top-12 -left-20 w-[600px] h-[500px] text-white/10"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50,150 C150,50 250,250 450,120 C550,60 600,200 650,250"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M-80,250 C120,120 300,320 520,180"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Modern Purple & Indigo Glow Blobs */}
        <div className="absolute top-10 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Section: Logo & Welcome Title */}
      <div className="relative z-10 px-6 pt-10 pb-8 max-w-md w-full mx-auto flex flex-col justify-between">
        {/* Header Bar */}
        <div className="flex items-center justify-start">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-white/30">
              <img
                src="https://igloobd.com/default/assets/img/about/about1.jpg"
                alt="Igloo Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black text-white tracking-tight">Igloo</span>
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-white/20 text-purple-100 border border-white/30 tracking-wider">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Back Typography */}
        <div className="mt-8 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Sign in to continue to Igloo AI
          </p>
        </div>
      </div>

      {/* Bottom Sheet White Card (Clean Modern Purple Palette) */}
      <div className="relative z-10 w-full bg-white rounded-t-[36px] px-6 sm:px-8 pt-4 pb-8 max-w-md mx-auto shadow-2xl space-y-5">
        {/* Top Handle / Pull Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-xs text-red-700 font-bold animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
            />
          </div>

          {/* Password with Forgot? link */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                Password
              </label>
              <button
                type="button"
                onClick={handleFillSuperAdmin}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 pr-11 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Full Width Clean Sign In Button in Modern Purple */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/30 transition active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Super Admin Quick Autofill Bar */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleFillSuperAdmin}
            className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl text-purple-900 transition flex items-center justify-between text-xs font-bold cursor-pointer"
          >
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Auto-fill Super Admin (fapolok7@gmail.com)</span>
            </div>
            <span className="text-[10px] uppercase font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
              Tap
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 pt-3 font-medium">
          © 2026 Abdul Monem Ltd. · Privacy · Help
        </div>
      </div>
    </div>
  );
};
