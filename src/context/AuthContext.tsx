'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { getSupabaseClient, isSupabaseConfigured, isNetworkOrReachabilityError, mapSupabaseAuthError } from '@/lib/supabase';

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

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  hotelName?: string;
  hotelSlug?: string;
  createdAt: string;
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
  checkAccountExists: (email: string) => boolean;
}

const DEFAULT_GUEST: Persona = PERSONAS[0];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidEmailFormat(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

// Simple deterministic hash for local client-side password verification
function hashLocalPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hs_h_${Math.abs(hash).toString(36)}_${password.length}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Persona | null>(null);
  const [activePersona, setActivePersona] = useState<Persona>(DEFAULT_GUEST);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: 'signup',
    role: 'guest',
  });

  // Restore session from localStorage on initial render
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('hotelstay_active_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id && parsed.email) {
          setCurrentUser(parsed);
          setActivePersona(parsed);
        }
      }
    } catch {
      // ignore parsing error
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      // Check Supabase session with timeout to avoid blocking if network/DNS is down
      const sessionCheck = async () => {
        try {
          const timeoutPromise = new Promise<{ data: { session: null }; error: Error }>((_, reject) =>
            setTimeout(() => reject(new Error('Supabase session check timeout')), 3000)
          );
          const { data } = await Promise.race([supabase.auth.getSession(), timeoutPromise]);
          if (data?.session?.user) {
            const user = data.session.user;
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
          }
        } catch (err) {
          // If Supabase session lookup times out or fails (e.g. paused free tier), keep local session intact
          console.warn('[HotelStay Auth] Supabase remote session unreachable, using persistent local session state.');
        }
      };

      sessionCheck();

      try {
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
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch {
        // ignore subscription errors
      }
    }
  }, []);

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const data = localStorage.getItem('hotelstay_registered_users');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveStoredAccount = (account: StoredAccount) => {
    try {
      const current = getStoredAccounts();
      const filtered = current.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
      filtered.push(account);
      localStorage.setItem('hotelstay_registered_users', JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const checkAccountExists = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const stored = getStoredAccounts();
    return stored.some((a) => a.email.toLowerCase() === cleanEmail);
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

    const supabase = getSupabaseClient();
    let supabaseSuccess = false;

    if (supabase && password) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout reaching Supabase Auth')), 4000)
        );

        const { data, error } = await Promise.race([
          supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          }),
          timeoutPromise,
        ]);

        if (error) {
          // If it is a real credential error from Supabase, throw friendly message
          if (!isNetworkOrReachabilityError(error)) {
            throw new Error(mapSupabaseAuthError(error));
          }
          // If network / DNS error, fall through to verified local account check
          console.warn('[HotelStay Auth] Supabase unreachable on signIn, falling back to local verification.');
        } else if (data?.user) {
          supabaseSuccess = true;
          const user = data.user;
          const persona: Persona = {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || cleanEmail,
            role: (user.user_metadata?.role as UserRole) || asRole || 'guest',
            createdAt: user.created_at,
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
      } catch (err: any) {
        if (!isNetworkOrReachabilityError(err)) {
          throw err;
        }
        console.warn('[HotelStay Auth] Supabase network failure, verifying with local auth store.');
      }
    }

    if (!supabaseSuccess) {
      // Verify against local persistent accounts registry
      const stored = getStoredAccounts();
      const account = stored.find((a) => a.email.toLowerCase() === cleanEmail);

      if (!account) {
        // Also check default personas
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
        throw new Error('Incorrect email or password. Please double check and try again.');
      }

      // Verify password hash
      const expectedHash = hashLocalPassword(password);
      if (account.passwordHash !== expectedHash) {
        throw new Error('Incorrect email or password. Please double check and try again.');
      }

      const persona: Persona = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role || asRole || 'hotel_manager',
        hotelName: account.hotelName,
        hotelSlug: account.hotelSlug,
        createdAt: account.createdAt,
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

    throw new Error('Unable to sign in. Please verify your details and try again.');
  };

  const signUp = async (params: {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    hotelName?: string;
    hotelSlug?: string;
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

    // Check duplicate in local storage registry
    if (checkAccountExists(cleanEmail)) {
      throw new Error('An account with this email already exists. Try signing in instead.');
    }

    const supabase = getSupabaseClient();
    let supabaseUser: any = null;

    if (supabase && cleanPassword) {
      try {
        const redirectUrl =
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback?next=/partner/onboard`
            : undefined;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout reaching Supabase Auth')), 4000)
        );

        const { data, error } = await Promise.race([
          supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: {
                full_name: cleanName,
                role: cleanRole,
                hotel_name: params.hotelName,
                hotel_slug: params.hotelSlug,
              },
              emailRedirectTo: redirectUrl,
            },
          }),
          timeoutPromise,
        ]);

        if (error) {
          if (!isNetworkOrReachabilityError(error)) {
            throw new Error(mapSupabaseAuthError(error));
          }
          console.warn('[HotelStay Auth] Supabase unreachable on signUp, proceeding with persistent local registration.');
        } else if (data?.user) {
          // Check if Supabase returned a dummy user with empty identities (user already registered security measure)
          if (data.user.identities && data.user.identities.length === 0) {
            throw new Error('An account with this email already exists. Try signing in instead.');
          }
          supabaseUser = data.user;
        }
      } catch (err: any) {
        if (!isNetworkOrReachabilityError(err)) {
          throw err;
        }
        console.warn('[HotelStay Auth] Supabase network failure, registering in local persistent store.');
      }
    }

    // Create the persona record
    const accountId = supabaseUser?.id || `usr-partner-${Date.now()}`;
    const persona: Persona = {
      id: accountId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
      createdAt: supabaseUser?.created_at || new Date().toISOString(),
    };

    // Store in local accounts registry for persistent sign-in verification
    saveStoredAccount({
      id: accountId,
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashLocalPassword(cleanPassword),
      role: cleanRole,
      hotelName: params.hotelName,
      hotelSlug: params.hotelSlug,
      createdAt: persona.createdAt || new Date().toISOString(),
    });

    // Establish active session
    setCurrentUser(persona);
    setActivePersona(persona);
    try {
      localStorage.setItem('hotelstay_active_user', JSON.stringify(persona));
    } catch {
      // ignore
    }

    return persona;
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
