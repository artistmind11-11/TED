/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'time:track', 'time:approve', 'time:view_all',
    'billing:manage', 'billing:view',
    'clients:manage', 'clients:view',
    'tasks:manage', 'tasks:assign',
    'reports:view',
    'settings:manage',
    'approvals:view',
    'crm:manage', 'crm:view'
  ],
  manager: [
    'time:track', 'time:approve', 'time:view_all',
    'billing:view',
    'clients:view',
    'tasks:manage', 'tasks:assign',
    'reports:view',
    'approvals:view',
    'crm:view'
  ],
  assistant: [
    'time:track',
    'tasks:manage',
    'clients:view',
    'crm:view'
  ],
  client: [
    'time:view_all',
    'billing:view',
    'approvals:view'
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('elite_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic with requested credentials
    const validCredentials: Record<string, string> = {
      'admin@eliteexec.com': 'admin123',
      'manager@eliteexec.com': 'manager123',
      'assistant@eliteexec.com': 'assistant123',
      'client@acme.com': 'client123'
    };

    if (validCredentials[email] !== password) {
      // For the prototype, we'll allow any password for quick access buttons, 
      // but check for real submissions
      if (password !== 'password123') {
        throw new Error('Invalid credentials');
      }
    }

    let role: UserRole = 'assistant';
    let name = 'Assistant User';
    let clientId: string | undefined;

    if (email === 'admin@eliteexec.com') {
      role = 'admin';
      name = 'Admin User';
    } else if (email === 'manager@eliteexec.com') {
      role = 'manager';
      name = 'Manager User';
    } else if (email === 'client@acme.com') {
      role = 'client';
      name = 'Acme Corp Client';
      clientId = 'c1';
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role,
      clientId,
      permissions: ROLE_PERMISSIONS[role]
    };

    setUser(newUser);
    localStorage.setItem('elite_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elite_user');
  };

  const hasPermission = (permission: Permission) => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role as UserRole);
    }
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, hasRole, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
