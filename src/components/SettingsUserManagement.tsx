import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  ShieldCheck,
  Trash2,
  Lock,
  Mail,
  User,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Pencil,
  X,
  Save,
  Sparkles,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardPaste,
  RefreshCw
} from 'lucide-react';
import {
  getStoredUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  toggleUserStatusByAdmin
} from '../services/authService';
import { UserAccount, SUPER_ADMIN_CREDENTIAL } from '../types/auth';
import { sounds } from '../utils/audio';
import {
  getGeminiKeyFromSupabase,
  saveGeminiKeyToSupabase
} from '../services/supabaseService';

interface SettingsUserManagementProps {
  currentUser: UserAccount;
}

export const SettingsUserManagement: React.FC<SettingsUserManagementProps> = ({ currentUser }) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'gemini'>('users');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'super_admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Gemini AI Key Management State (Super Admin Exclusive)
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => localStorage.getItem('igloo_gemini_api_key') || '');
  const [savedGeminiKey, setSavedGeminiKey] = useState(() => localStorage.getItem('igloo_gemini_api_key') || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'super_admin'>('user');
  const [editShowPassword, setEditShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = () => {
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    loadUsers();
    // Load remote Gemini Key from Supabase on mount
    getGeminiKeyFromSupabase().then((remoteKey) => {
      if (remoteKey) {
        setSavedGeminiKey(remoteKey);
        setGeminiKeyInput(remoteKey);
      }
    }).catch(() => {});
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTap();
    setStatusMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'সবগুলো ঘর সঠিকভাবে পূরণ করুন।' });
      return;
    }

    if (password.length < 6) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      return;
    }

    const res = createUserByAdmin({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role
    });

    if (res.success) {
      sounds.playSuccess();
      setStatusMsg({ type: 'success', text: `অ্যাকাউন্ট "${name}" সফলভাবে তৈরি হয়েছে!` });
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      loadUsers();
    } else {
      sounds.playError();
      setStatusMsg({ type: 'error', text: res.error || 'অ্যাকাউন্ট তৈরি করা যায়নি।' });
    }
  };

  const handleToggleStatus = (targetUser: UserAccount) => {
    sounds.playTap();
    setStatusMsg(null);

    if (targetUser.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'মূল সুপার অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয় করা যাবে না।' });
      return;
    }

    const res = toggleUserStatusByAdmin(targetUser.id);
    if (res.success) {
      sounds.playSuccess();
      loadUsers();
    } else {
      sounds.playError();
      setStatusMsg({ type: 'error', text: res.error || 'স্ট্যাটাস পরিবর্তন করা যায়নি।' });
    }
  };

  const handleDeleteUser = (targetUser: UserAccount) => {
    sounds.playTap();
    setStatusMsg(null);

    if (targetUser.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'মূল সুপার অ্যাডমিন অ্যাকাউন্ট ডিলিট করা যাবে না।' });
      return;
    }

    if (window.confirm(`আপনি কি নিশ্চিত যে "${targetUser.name}" এর অ্যাকাউন্টটি ডিলিট করতে চান?`)) {
      const res = deleteUserByAdmin(targetUser.id);
      if (res.success) {
        sounds.playSuccess();
        setStatusMsg({ type: 'success', text: 'অ্যাকাউন্ট সফলভাবে ডিলিট করা হয়েছে।' });
        loadUsers();
      } else {
        sounds.playError();
        setStatusMsg({ type: 'error', text: res.error || 'অ্যাকাউন্ট ডিলিট করা যায়নি।' });
      }
    }
  };

  const handleOpenEditModal = (user: UserAccount) => {
    sounds.playTap();
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword(user.password || '');
    setEditRole(user.role);
    setEditShowPassword(false);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    sounds.playTap();
    setIsUpdating(true);

    if (!editName.trim() || !editEmail.trim() || !editPassword.trim()) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন।' });
      setIsUpdating(false);
      return;
    }

    if (editPassword.length < 6) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      setIsUpdating(false);
      return;
    }

    const res = updateUserByAdmin(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      password: editPassword.trim(),
      role: editRole
    });

    setIsUpdating(false);

    if (res.success) {
      sounds.playSuccess();
      setStatusMsg({ type: 'success', text: `ইউজার "${editName}" সফলভাবে আপডেট হয়েছে!` });
      setEditingUser(null);
      loadUsers();
    } else {
      sounds.playError();
      setStatusMsg({ type: 'error', text: res.error || 'ইউজার আপডেট করা যায়নি।' });
    }
  };

  // Real-time API Key Verification against Google Generative Language endpoint
  const handleTestKey = async () => {
    const rawKey = geminiKeyInput.trim().replace(/^["']|["']$/g, '');
    sounds.playTap();

    if (!rawKey) {
      setKeyTestStatus({ success: false, message: 'দয়া করে একটি Gemini API Key ইনপুট দিন।' });
      sounds.playError();
      return;
    }

    setIsTestingKey(true);
    setKeyTestStatus(null);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(
        rawKey
      )}`;
      const payload = {
        contents: [{ parts: [{ text: 'Hello! Respond with "OK" in one word.' }] }]
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setKeyTestStatus({
          success: true,
          message: 'অভিনন্দন! গুগল এই API Key সফলভাবে গ্রহণ করেছে। জেমিনাই AI সম্পূর্ণ সক্রিয়!'
        });
        sounds.playSuccess();
      } else {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || (await res.text().catch(() => ''));
        const reason = errJson?.error?.details?.[0]?.reason || errJson?.error?.status || '';

        let msg = `গুগল প্রত্যাখ্যান করেছে: ${errMsg || `Status ${res.status}`}`;
        if (reason === 'API_KEY_INVALID' || errMsg.includes('API key not valid')) {
          msg = 'API Key টি সঠিক নয় বা ইনভ্যালিড। নিশ্চিত করুন এটি সরাসরি https://aistudio.google.com/apikey থেকে নেওয়া হয়েছে।';
        }
        setKeyTestStatus({ success: false, message: msg });
        sounds.playError();
      }
    } catch (err: any) {
      setKeyTestStatus({ success: false, message: `নেটওয়ার্ক সমস্যা: ${err?.message || err}` });
      sounds.playError();
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSaveGeminiKey = async () => {
    const key = geminiKeyInput.trim().replace(/^["']|["']$/g, '');
    sounds.playTap();
    setIsSavingKey(true);
    setStatusMsg(null);

    try {
      const savedToSupabase = await saveGeminiKeyToSupabase(key);
      setSavedGeminiKey(key);
      sounds.playSuccess();

      if (key) {
        setStatusMsg({
          type: 'success',
          text: savedToSupabase
            ? 'Gemini API Key সফলভাবে Supabase ডাটাবেজ এবং সিস্টেমে সেভ করা হয়েছে!'
            : 'Gemini API Key লোকালি সেভ হয়েছে (Supabase কানেকশন চেক করুন)।'
        });
      } else {
        setStatusMsg({
          type: 'success',
          text: 'Custom Gemini API Key মুছে ফেলা হয়েছে।'
        });
      }
    } catch (err: any) {
      sounds.playError();
      setStatusMsg({
        type: 'error',
        text: `সেভ করতে সমস্যা হয়েছে: ${err?.message || err}`
      });
    } finally {
      setIsSavingKey(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleClearGeminiKey = async () => {
    sounds.playTap();
    setIsSavingKey(true);
    try {
      await saveGeminiKeyToSupabase('');
      setSavedGeminiKey('');
      setGeminiKeyInput('');
      setKeyTestStatus(null);
      sounds.playSuccess();
      setStatusMsg({
        type: 'success',
        text: 'Custom Gemini Key Supabase এবং লোকাল থেকে সম্পূর্ণ মুছে ফেলা হয়েছে।'
      });
    } catch (err: any) {
      sounds.playError();
      setStatusMsg({
        type: 'error',
        text: `মুছে ফেলতে সমস্যা হয়েছে: ${err?.message || err}`
      });
    } finally {
      setIsSavingKey(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handlePasteKey = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setGeminiKeyInput(text.trim());
          sounds.playTap();
        }
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
  };

  return (
    <div className="space-y-5 pb-28 sm:pb-8 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                Super Admin Only
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Super Admin Settings & AI Control
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Manage executive accounts and configure Gemini AI API Key
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1.5">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setActiveAdminSubTab('users');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer select-none flex items-center justify-center space-x-2 ${
            activeAdminSubTab === 'users'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>Support Executives</span>
          <span className="inline-flex items-center justify-center px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded-full font-bold ml-1">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setActiveAdminSubTab('gemini');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer select-none flex items-center justify-center space-x-2 ${
            activeAdminSubTab === 'gemini'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Gemini AI Key Setup</span>
          {savedGeminiKey ? (
            <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold ml-1">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-medium ml-1">
              Server Env
            </span>
          )}
        </button>
      </div>

      {/* Notification Toast/Alert */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-xs animate-in fade-in duration-150 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* TAB 1: GEMINI AI API KEY CONFIGURATION (SUPER ADMIN ONLY) */}
      {activeAdminSubTab === 'gemini' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Gemini API Key Setup
                </h3>
              </div>

              {savedGeminiKey && (
                <button
                  type="button"
                  onClick={handleClearGeminiKey}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition cursor-pointer"
                >
                  Clear Key
                </button>
              )}
            </div>

            {/* Current Active Status */}
            <div className="flex items-center space-x-2 text-xs font-bold py-1">
              {savedGeminiKey ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-800">
                    Active Key: <code className="bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-purple-900 font-mono">{savedGeminiKey.slice(0, 8)}... ({savedGeminiKey.length} chars)</code>
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-500">
                    Status: Server Default (GEMINI_API_KEY)
                  </span>
                </>
              )}
            </div>

            {/* Input Field */}
            <div className="space-y-3">
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="Paste Gemini API Key here (AIzaSy...)"
                  className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePasteKey}
                    className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title={showGeminiKey ? 'Hide key' : 'Show key'}
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Real-time Google Test Status */}
              {keyTestStatus && (
                <div
                  className={`p-3 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in duration-150 ${
                    keyTestStatus.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {keyTestStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-semibold">{keyTestStatus.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTestingKey || !geminiKeyInput.trim()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isTestingKey ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Test Key</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveGeminiKey}
                  disabled={isSavingKey}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-500/20 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSavingKey ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT (SUPER ADMIN ONLY) */}
      {activeAdminSubTab === 'users' && (
        <>
          {/* Create New User Form */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <UserPlus className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-black text-slate-900">Add New User Account</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Official Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="executive@igloobd.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Account Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Role Permissions</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition font-medium"
                  >
                    <option value="user">Support Executive (User)</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-500/20 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* User List Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">Active Accounts</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Total: {users.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((u) => {
                const isPrimaryAdmin = u.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase();
                const isActive = u.status === 'active';

                return (
                  <div key={u.id} className="py-3 flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 ${
                          u.role === 'super_admin'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {u.name}
                          </span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded-md font-bold ${
                              u.role === 'super_admin'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {u.role === 'super_admin' ? 'Super Admin' : 'User'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Active/Inactive Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{isActive ? 'Active' : 'Disabled'}</span>
                      </span>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(u)}
                        title="Edit User Credentials"
                        className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Toggle Status Button (Disable/Enable) */}
                      {!isPrimaryAdmin && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          title={isActive ? 'Disable User' : 'Enable User'}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            isActive
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Delete Button */}
                      {!isPrimaryAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          title="Delete User"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Edit User Modal Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Edit User Details</h3>
                  <p className="text-[11px] text-slate-500">Update account credentials and role</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    placeholder="Full name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={editEmail}
                    disabled={editingUser.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="Email address"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1 flex items-center justify-between">
                  <span>Login Password</span>
                  <span className="text-[10px] text-purple-600 font-semibold">Super Admin Override</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={editShowPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    required
                    placeholder="New password (min 6 characters)"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setEditShowPassword(!editShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {editShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Assigned Role</label>
                <select
                  value={editRole}
                  disabled={editingUser.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition font-medium disabled:opacity-60"
                >
                  <option value="user">Support Executive (User)</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
                {editingUser.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase() && (
                  <p className="text-[10px] text-amber-600 font-medium ml-1">
                    Primary Super Admin role cannot be demoted.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-500/20 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
