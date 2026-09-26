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
  Save
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

interface SettingsUserManagementProps {
  currentUser: UserAccount;
}

export const SettingsUserManagement: React.FC<SettingsUserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'super_admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    sounds.playTap();

    const res = createUserByAdmin({ name, email, password, role });
    if (res.success) {
      sounds.playSuccess();
      setStatusMsg({ type: 'success', text: `User account "${name}" created successfully!` });
      setName('');
      setEmail('');
      setPassword('');
      loadUsers();
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      sounds.playError();
      setStatusMsg({ type: 'error', text: res.error || 'Failed to create user.' });
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
    sounds.playTap();
    setEditingUser(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    sounds.playTap();

    const res = updateUserByAdmin(editingUser.id, {
      name: editName,
      email: editEmail,
      password: editPassword,
      role: editRole
    });

    setIsUpdating(false);

    if (res.success) {
      sounds.playSuccess();
      setStatusMsg({
        type: 'success',
        text: `Account "${editName}" (${editEmail}) updated successfully!`
      });
      setEditingUser(null);
      loadUsers();
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      sounds.playError();
      setStatusMsg({
        type: 'error',
        text: res.error || 'Failed to update user account.'
      });
    }
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (user.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
      sounds.playError();
      setStatusMsg({ type: 'error', text: 'Cannot delete Super Admin account!' });
      return;
    }

    if (window.confirm(`Are you sure you want to delete user account "${user.name}" (${user.email})?`)) {
      sounds.playTap();
      const res = deleteUserByAdmin(user.id);
      if (res.success) {
        sounds.playSuccess();
        setStatusMsg({ type: 'success', text: `User "${user.name}" deleted.` });
        loadUsers();
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        sounds.playError();
        setStatusMsg({ type: 'error', text: res.error || 'Failed to delete user.' });
      }
    }
  };

  const handleToggleStatus = (user: UserAccount) => {
    sounds.playTap();
    const res = toggleUserStatusByAdmin(user.id);
    if (res.success) {
      sounds.playSuccess();
      loadUsers();
    } else {
      sounds.playError();
      setStatusMsg({ type: 'error', text: res.error || 'Action failed.' });
    }
  };

  return (
    <div className="space-y-5 pb-36 sm:pb-12 animate-in fade-in duration-150">
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
              User Management & Access Control
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Create and manage official support executive accounts
            </p>
          </div>
        </div>
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
                  placeholder="e.g. tanvir@igloobd.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1">Login Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1">Assigned Role</label>
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-500/20 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Registered Users List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-black text-slate-900">
              Active Registered Accounts ({users.length})
            </h3>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {users.map((usr) => {
            const isItemSuperAdmin = usr.role === 'super_admin';
            const isSelf = usr.email.toLowerCase() === currentUser.email.toLowerCase();

            return (
              <div
                key={usr.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xs ${
                      isItemSuperAdmin
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {usr.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {usr.name}
                      </h4>
                      {isSelf && (
                        <span className="text-[9px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                      <span
                        className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border ${
                          isItemSuperAdmin
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isItemSuperAdmin ? 'Super Admin' : 'User'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                      <span>{usr.email}</span>
                      {usr.password && (
                        <span className="text-slate-400 font-mono">
                          • Pass: {usr.password}
                        </span>
                      )}
                      <span
                        className={`font-bold flex items-center space-x-1 ${
                          usr.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        • {usr.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center">
                  {/* Edit Button for Super Admin - Available for EVERY user */}
                  <button
                    onClick={() => handleOpenEditModal(usr)}
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition flex items-center space-x-1 cursor-pointer font-bold shadow-2xs"
                    title="Edit Name, Email & Password"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Edit</span>
                  </button>

                  {!isSelf && usr.email.toLowerCase() !== SUPER_ADMIN_CREDENTIAL.email.toLowerCase() && (
                    <>
                      <button
                        onClick={() => handleToggleStatus(usr)}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                          usr.status === 'active'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={usr.status === 'active' ? 'Disable Account' : 'Activate Account'}
                      >
                        {usr.status === 'active' ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden sm:inline">Disable</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden sm:inline">Activate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(usr)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200/90 space-y-4 relative animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Edit User Account
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Modify credentials for {editingUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-3.5">
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
                    placeholder="User full name"
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
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="User official email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
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
