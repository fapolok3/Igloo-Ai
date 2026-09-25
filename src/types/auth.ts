export type UserRole = 'super_admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: number;
  lastLogin?: number;
  status: 'active' | 'inactive';
}

export const SUPER_ADMIN_CREDENTIAL = {
  id: 'usr-super-admin',
  name: 'Super Admin',
  email: 'fapolok7@gmail.com',
  password: 'Admin@123',
  role: 'super_admin' as UserRole,
  createdAt: 1711382400000,
  status: 'active' as const
};
