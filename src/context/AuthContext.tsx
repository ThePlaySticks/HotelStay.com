'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { UserRole } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase';

export interface Persona {
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

export const PERSONAS: Persona[] = [];

export interface AuthModalState {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  role: 'guest' | 'hotel_manager' | 'super_admin' | 'hotel_owner';
  title?: string;
  description?: string;
  redirectUrl?: string;
  onSuccessCallback?: () => void;
}

interface AuthContextType {
  currentUser: Persona | null;
  currentPersona: Persona;
  setPersona: (personaIdOrRole: string) => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  isHotelAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password?: string, asRole?: UserRole) => Promise<Persona>;
  signInWithOtp: (params: {
    email: string;
    otp: string;
    purpose?: string;
    role?: UserRole;
    name?: string;
    hotelName?: string;
    hotelSlug?: string;
  }) => Promise<Persona>;
  sendOtp: (params: {
    email: string;
    purpose?: string;
    name?: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; message: string; devCode?: string }>;
  signUp: (params: {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    hotelName?: string;
    hotelSlug?: string;
    phone?: string;
  }) => Promise<Persona>;
  signOut: () => Promise<void>;
  updateCurrentUser: (updates: Partial<Persona>) => void;
  authModal: AuthModalState;
  openAuthModal: (params?: Partial<AuthModalState>) => void;
  closeAuthModal: () => void;
  isSupabaseActive: boolean;
  checkAccountExists: (email: string) => boolean;
}

const DEFAULT_GUEST: Persona = {
  id: 'guest-anonymous',
  name: 'Guest Traveler',
  email: '',
  role: 'guest',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidEmailFormat(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();
  const [currentUser, setCurrentUser] = useState<Persona | null>(null);
  const [activePersona, setActivePersona] = useState<Persona>(DEFAULT_GUEST);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: 'signup',
    role: 'guest',
  });

  // Sync NextAuth Session to AuthContext persona state asynchronously to prevent cascading renders
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'authenticated' && session?.user) {
        const su = session.user as any;
        const persona: Persona = {
          id: su.id || `usr-${su.email}`,
          name: su.name || 'Member',
          email: su.email || '',
          role: (su.role as UserRole) || 'guest',
          hotelId: su.hotelId,
          hotelName: su.hotelName,
          hotelSlug: su.hotelSlug,
          phone: su.phone,
        };
        setCurrentUser(persona);
        setActivePersona(persona);
        try {
          localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
        } catch {
          // ignore
        }
      } else if (status === 'unauthenticated') {
        // Check local storage for persistent persona in case user switched offline
        try {
          const savedSession = localStorage.getItem('hotelstay_active_user');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.id && parsed.email) {
              // Check if it's one of the demo personas
              const match = PERSONAS.find((p) => p.email.toLowerCase() === parsed.email.toLowerCase());
              if (match) {
                setCurrentUser(match);
                setActivePersona(match);
                return;
              }
            }
          }
        } catch {
          // ignore
        }
        setCurrentUser(null);
        setActivePersona(DEFAULT_GUEST);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [session, status]);

  const checkAccountExists = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    // Check seeded personas
    if (PERSONAS.some((p) => p.email.toLowerCase() === cleanEmail)) return true;
    try {
      const data = localStorage.getItem('hotelstay_registered_users');
      if (data) {
        const list = JSON.parse(data);
        return list.some((u: any) => u.email.toLowerCase() === cleanEmail);
      }
    } catch {
      // ignore
    }
    return false;
  };

  const setPersona = (personaIdOrRole: string) => {
    const found =
      PERSONAS.find((p) => p.id === personaIdOrRole || p.role === personaIdOrRole) ||
      {
        id: `persona-${Date.now()}`,
        name: 'Hotel Manager',
        email: 'manager@hotelstay.com',
        role: (personaIdOrRole as UserRole) || 'hotel_manager',
        hotelId: personaIdOrRole,
      };

    setActivePersona(found);
    setCurrentUser(found);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(found));
    } catch {
      // ignore
    }
  };

  /**
   * Password Authentication using NextAuth Credentials Provider
   */
  const signIn = async (email: string, password?: string, asRole?: UserRole): Promise<Persona> => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!isValidEmailFormat(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // Call NextAuth Credentials Sign-In
    const result = await nextAuthSignIn('credentials', {
      email: cleanEmail,
      password,
      role: asRole,
      redirect: false,
    });

    if (result?.error) {
      // Check if it matches a persona fallback for demo
      const personaMatch = PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
      if (personaMatch && password.length >= 8) {
        setCurrentUser(personaMatch);
        setActivePersona(personaMatch);
        try {
          localStorage.setItem('hotelstay_active_user', JSON.stringify(personaMatch));
        } catch {
          // ignore
        }
        return personaMatch;
      }
      throw new Error(result.error);
    }

    // Check persona match or create user persona
    const personaMatch = PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
    const persona: Persona = personaMatch || {
      id: `usr-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: asRole || 'guest',
    };

    setCurrentUser(persona);
    setActivePersona(persona);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
    } catch {
      // ignore
    }

    return persona;
  };

  /**
   * Generates a System OTP and dispatches email, storing the code in Supabase
   */
  const sendOtp = async (params: {
    email: string;
    purpose?: string;
    name?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; message: string; devCode?: string }> => {
    const cleanEmail = (params.email || '').trim().toLowerCase();
    if (!cleanEmail || !isValidEmailFormat(cleanEmail)) {
      throw new Error('Please enter a valid email address to receive an OTP code.');
    }

    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        purpose: params.purpose || 'login',
        name: params.name,
        role: params.role,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to dispatch verification code.');
    }

    return {
      success: true,
      message: data.message || 'One-time password dispatched.',
      devCode: data.devCode,
    };
  };

  /**
   * One-Time Password Authentication using NextAuth OTP Credentials Provider
   */
  const signInWithOtp = async (params: {
    email: string;
    otp: string;
    purpose?: string;
    role?: UserRole;
    name?: string;
    hotelName?: string;
    hotelSlug?: string;
  }): Promise<Persona> => {
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanOtp = (params.otp || '').trim();

    if (!cleanEmail || !isValidEmailFormat(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!cleanOtp) {
      throw new Error('Please enter the 6-digit one-time code sent to your email.');
    }

    const result = await nextAuthSignIn('otp', {
      email: cleanEmail,
      otp: cleanOtp,
      purpose: params.purpose || 'login',
      role: params.role || 'guest',
      name: params.name,
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
      redirect: false,
    });

    if (result?.error) {
      // In case NextAuth transport encountered a CSRF/origin mismatch, attempt direct OTP verification fallback
      try {
        const verifyRes = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
            purpose: params.purpose || 'login',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          const personaMatch = PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
          const persona: Persona = personaMatch || {
            id: `usr-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: params.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: params.role || 'guest',
            hotelName: params.hotelName,
            hotelSlug: params.hotelSlug,
          };
          setCurrentUser(persona);
          setActivePersona(persona);
          try {
            localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
          } catch {
            // ignore
          }
          return persona;
        }
      } catch {
        // ignore
      }
      throw new Error(result.error);
    }

    const persona: Persona = {
      id: `usr-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: params.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: params.role || 'guest',
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
    };

    setCurrentUser(persona);
    setActivePersona(persona);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
    } catch {
      // ignore
    }

    return persona;
  };

  /**
   * Registers a new user account in Supabase database and signs in via NextAuth
   */
  const signUp = async (params: {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    hotelName?: string;
    hotelSlug?: string;
    phone?: string;
  }): Promise<Persona> => {
    const cleanName = (params.name || '').trim();
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanPassword = params.password || '';
    const cleanRole: UserRole = params.role || 'hotel_manager';

    if (!cleanName) {
      throw new Error('Please enter your full name.');
    }
    if (!cleanEmail || !isValidEmailFormat(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (cleanPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    // Call registration endpoint which persists in Supabase database
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        password: cleanPassword,
        name: cleanName,
        role: cleanRole,
        hotelName: params.hotelName,
        hotelSlug: params.hotelSlug,
        phone: params.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok && res.status !== 409) {
      throw new Error(data.error || 'Registration failed.');
    }

    // Automatically sign in via NextAuth
    return await signIn(cleanEmail, cleanPassword, cleanRole);
  };

  /**
   * NextAuth Sign Out
   */
  const signOut = async () => {
    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setActivePersona(DEFAULT_GUEST);
    try {
      localStorage.removeItem('hotelstay_active_user');
    } catch {
      // ignore
    }
  };

  const updateCurrentUser = (updates: Partial<Persona>) => {
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

    setActivePersona((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });

    if (updateSession) {
      updateSession({
        user: updates,
      });
    }
  };

  const openAuthModal = (params?: Partial<AuthModalState>) => {
    setAuthModal((prev) => ({
      ...prev,
      isOpen: true,
      mode: params?.mode || 'signup',
      role: params?.role || 'guest',
      title: params?.title,
      description: params?.description,
      redirectUrl: params?.redirectUrl,
      onSuccessCallback: params?.onSuccessCallback,
    }));
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const isAuthenticated = !!currentUser;
  const isGuest = currentUser?.role === 'guest';
  const isHotelAdmin = currentUser?.role === 'hotel_manager' || currentUser?.role === 'hotel_owner';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentPersona: currentUser || activePersona,
        setPersona,
        isAuthenticated,
        isGuest,
        isHotelAdmin,
        isSuperAdmin,
        signIn,
        signInWithOtp,
        sendOtp,
        signUp,
        signOut,
        updateCurrentUser,
        authModal,
        openAuthModal,
        closeAuthModal,
        isSupabaseActive: isSupabaseConfigured,
        checkAccountExists,
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
