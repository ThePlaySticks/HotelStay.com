'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string;
  hotelName?: string;
  hotelSlug?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthModalState {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  role: 'guest' | 'hotel_manager' | 'super_admin';
  title?: string;
  description?: string;
  redirectUrl?: string;
  onSuccessCallback?: () => void;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  currentPersona: UserAccount; // Backwards-compatible alias for existing views
  isAuthenticated: boolean;
  isGuest: boolean;
  isHotelAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password?: string, asRole?: UserRole) => Promise<UserAccount>;
  signUp: (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    hotelName?: string;
    hotelSlug?: string;
  }) => Promise<UserAccount>;
  signOut: () => void;
  updateCurrentUser: (updates: Partial<UserAccount>) => void;
  // Auth Modal Controls
  authModal: AuthModalState;
  openAuthModal: (params?: Partial<AuthModalState>) => void;
  closeAuthModal: () => void;
}

const DEFAULT_GUEST_FALLBACK: UserAccount = {
  id: 'guest-unauth',
  name: 'Guest Traveler',
  email: 'guest@hotelstay.com',
  role: 'guest',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: 'signup',
    role: 'guest',
  });

  // Load active session from localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('hotelstay_active_user');
      if (savedSession) {
        setCurrentUser(JSON.parse(savedSession));
      }
    } catch {
      // ignore storage error
    }
  }, []);

  const signIn = async (email: string, _password?: string, asRole?: UserRole): Promise<UserAccount> => {
    const role = asRole || (email.includes('manager') || email.includes('admin') ? 'hotel_manager' : 'guest');
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const account: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name || 'User',
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(account);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(account));
    } catch {
      // ignore
    }
    return account;
  };

  const signUp = async (params: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    hotelName?: string;
    hotelSlug?: string;
  }): Promise<UserAccount> => {
    const account: UserAccount = {
      id: `usr-${Date.now()}`,
      name: params.name,
      email: params.email,
      role: params.role,
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(account);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(account));
    } catch {
      // ignore
    }
    return account;
  };

  const signOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('hotelstay_active_user');
    } catch {
      // ignore
    }
  };

  const updateCurrentUser = (updates: Partial<UserAccount>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('hotelstay_active_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const openAuthModal = (params?: Partial<AuthModalState>) => {
    setAuthModal({
      isOpen: true,
      mode: params?.mode || 'signup',
      role: params?.role || 'guest',
      title: params?.title,
      description: params?.description,
      redirectUrl: params?.redirectUrl,
      onSuccessCallback: params?.onSuccessCallback,
    });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const isAuthenticated = currentUser !== null && currentUser.id !== 'guest-unauth';
  const role = currentUser?.role || 'guest';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentPersona: currentUser || DEFAULT_GUEST_FALLBACK,
        isAuthenticated,
        isGuest: role === 'guest',
        isHotelAdmin: role === 'hotel_manager' || role === 'hotel_owner',
        isSuperAdmin: role === 'super_admin',
        signIn,
        signUp,
        signOut,
        updateCurrentUser,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
