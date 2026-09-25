import { UserAccount, SUPER_ADMIN_CREDENTIAL } from '../types/auth';

const STORAGE_KEY_USERS = 'igloo_auth_users_v2';
const STORAGE_KEY_CURRENT_USER = 'igloo_auth_current_user_v2';

// Initialize default users storage if not existing
export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      const initial = [SUPER_ADMIN_CREDENTIAL];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    // Ensure Super Admin is always present and updated
    const superAdminExists = parsed.some((u) => u.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase());
    if (!superAdminExists) {
      parsed.unshift(SUPER_ADMIN_CREDENTIAL);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Failed to get users:', err);
    return [SUPER_ADMIN_CREDENTIAL];
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      // Store user without raw password for security in session
      const { password, ...safeUser } = user;
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  } catch (err) {
    console.error('Failed to set current user:', err);
  }
}

export function loginUser(email: string, pass: string): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  const users = getStoredUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (found.status === 'inactive') {
    return { success: false, error: 'This account has been disabled. Contact Super Admin.' };
  }

  if (found.password !== cleanPass) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // Update last login
  found.lastLogin = Date.now();
  saveUsers(users);

  setCurrentUser(found);
  return { success: true, user: found };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function createUserByAdmin(data: { name: string; email: string; password: string; role?: 'user' | 'super_admin' }): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPass = data.password.trim();
  const cleanName = data.name.trim();

  if (!cleanName || !cleanEmail || !cleanPass) {
    return { success: false, error: 'Name, Email and Password are required.' };
  }

  if (cleanPass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPass,
    role: data.role || 'user',
    createdAt: Date.now(),
    status: 'active'
  };

  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

export function deleteUserByAdmin(userId: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  if (target.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
    return { success: false, error: 'Cannot delete the primary Super Admin account.' };
  }

  const updated = users.filter((u) => u.id !== userId);
  saveUsers(updated);
  return { success: true };
}

export function toggleUserStatusByAdmin(userId: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  if (target.email.toLowerCase() === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
    return { success: false, error: 'Cannot deactivate the primary Super Admin account.' };
  }

  target.status = target.status === 'active' ? 'inactive' : 'active';
  saveUsers(users);
  return { success: true };
}
