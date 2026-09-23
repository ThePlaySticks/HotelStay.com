'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

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

export const PERSONAS: Persona[] = [
  {
    id: 'persona-guest',
    name: 'Julian Vance',
    email: 'julian.vance@vanceholdings.co.uk',
    role: 'guest',
    phone: '+44 7911 123456',
  },
  {
    id: 'persona-azure-admin',
    name: 'Camille Laurent',
    email: 'camille.laurent@azureriviera.com',
    role: 'hotel_manager',
    hotelId: 'hotel-azure',
    hotelName: 'The Azure Riviera Resort & Spa',
    phone: '+33 4 93 01 23 45',
  },
  {
    id: 'persona-serenita-admin',
    name: 'Dimitris Kostas',
    email: 'dimitris@serenitahaven.gr',
    role: 'hotel_manager',
    hotelId: 'hotel-serenita',
    hotelName: 'Serenita Coastal Haven & Spa',
    phone: '+30 2286 071234',
  },
  {
    id: 'persona-super-admin',
    name: 'Platform Super Admin',
    email: 'admin@hotelstay.com',
    role: 'super_admin',
    phone: '+1 800 555 0100',
  },
];

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
  currentUser: Persona | null;
  currentPersona: Persona;
  setPersona: (personaIdOrRole: string) => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  isHotelAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password?: string, asRole?: UserRole) => Promise<Persona>;
  signUp: (params: {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    hotelName?: string;
    hotelSlug?: string;
  }) => Promise<Persona>;
  signOut: () => Promise<void>;
  updateCurrentUser: (updates: Partial<Persona>) => void;
  authModal: AuthModalState;
  openAuthModal: (params?: Partial<AuthModalState>) => void;
  closeAuthModal: () => void;
  isSupabaseActive: boolean;
}

const DEFAULT_GUEST: Persona = PERSONAS[0];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Persona | null>(null);
  const [activePersona, setActivePersona] = useState<Persona>(DEFAULT_GUEST);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: 'signup',
    role: 'guest',
  });

  // Supabase Auth state listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Fallback to local storage if Supabase is not configured yet
      try {
        const savedSession = localStorage.getItem('hotelstay_active_user');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setCurrentUser(parsed);
          setActivePersona(parsed);
        }
      } catch {
        // ignore
      }
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member';
        const role = (user.user_metadata?.role as UserRole) || 'guest';
        const persona: Persona = {
          id: user.id,
          name,
          email: user.email || '',
          role,
          phone: user.phone || user.user_metadata?.phone,
          avatar: user.user_metadata?.avatar_url,
          hotelName: user.user_metadata?.hotel_name,
          hotelSlug: user.user_metadata?.hotel_slug,
          createdAt: user.created_at,
        };
        setCurrentUser(persona);
        setActivePersona(persona);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member';
        const role = (user.user_metadata?.role as UserRole) || 'guest';
        const persona: Persona = {
          id: user.id,
          name,
          email: user.email || '',
          role,
          phone: user.phone || user.user_metadata?.phone,
          avatar: user.user_metadata?.avatar_url,
          hotelName: user.user_metadata?.hotel_name,
          hotelSlug: user.user_metadata?.hotel_slug,
          createdAt: user.created_at,
        };
        setCurrentUser(persona);
        setActivePersona(persona);
        try {
          localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
        } catch {
          // ignore
        }
      } else {
        setCurrentUser(null);
        setActivePersona(DEFAULT_GUEST);
        try {
          localStorage.removeItem('hotelstay_active_user');
        } catch {
          // ignore
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const signIn = async (email: string, password?: string, asRole?: UserRole): Promise<Persona> => {
    const supabase = getSupabaseClient();
    if (supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (data.user) {
        const user = data.user;
        const persona: Persona = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || email,
          role: (user.user_metadata?.role as UserRole) || asRole || 'guest',
          createdAt: user.created_at,
        };
        setCurrentUser(persona);
        setActivePersona(persona);
        return persona;
      }
    }

    // Local simulated fallback when Supabase keys are not set
    const role = asRole || (email.includes('manager') || email.includes('admin') ? 'hotel_manager' : 'guest');
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const account: Persona = {
      id: `usr-${Date.now()}`,
      name: name || 'User',
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(account);
    setActivePersona(account);
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
    role?: UserRole;
    hotelName?: string;
    hotelSlug?: string;
  }): Promise<Persona> => {
    const supabase = getSupabaseClient();
    const cleanRole: UserRole = params.role || 'guest';

    if (supabase && params.password) {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            full_name: params.name.trim(),
            role: cleanRole,
            hotel_name: params.hotelName,
            hotel_slug: params.hotelSlug,
          },
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      if (data.user) {
        const persona: Persona = {
          id: data.user.id,
          name: params.name,
          email: params.email,
          role: cleanRole,
          hotelName: params.hotelName,
          hotelSlug: params.hotelSlug,
          createdAt: data.user.created_at,
        };
        return persona;
      }
    }

    // Local fallback
    const account: Persona = {
      id: `usr-${Date.now()}`,
      name: params.name,
      email: params.email,
      role: cleanRole,
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(account);
    setActivePersona(account);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(account));
    } catch {
      // ignore
    }
    return account;
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
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
      const base = prev || DEFAULT_GUEST;
      const updated = { ...base, ...updates };
      setActivePersona(updated);
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

  const effectivePersona = currentUser || activePersona;
  const isAuthenticated = currentUser !== null;
  const currentRole = effectivePersona.role;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentPersona: effectivePersona,
        setPersona,
        isAuthenticated,
        isGuest: currentRole === 'guest',
        isHotelAdmin: currentRole === 'hotel_manager' || currentRole === 'hotel_owner',
        isSuperAdmin: currentRole === 'super_admin',
        signIn,
        signUp,
        signOut,
        updateCurrentUser,
        authModal,
        openAuthModal,
        closeAuthModal,
        isSupabaseActive: isSupabaseConfigured,
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
