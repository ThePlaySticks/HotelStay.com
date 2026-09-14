'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';

export interface Persona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string;
  hotelName?: string;
  avatar?: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'persona-guest',
    name: 'Julian Vance',
    email: 'julian.vance@vanceholdings.co.uk',
    role: 'guest',
  },
  {
    id: 'persona-azure-admin',
    name: 'Camille Laurent',
    email: 'camille.laurent@azureriviera.com',
    role: 'hotel_manager',
    hotelId: 'hotel-azure',
    hotelName: 'The Azure Riviera Resort & Spa',
  },
  {
    id: 'persona-serenita-admin',
    name: 'Dimitris Kostas',
    email: 'dimitris@serenitahaven.gr',
    role: 'hotel_manager',
    hotelId: 'hotel-serenita',
    hotelName: 'Serenita Coastal Haven & Spa',
  },
  {
    id: 'persona-super-admin',
    name: 'Elena Rostova (Platform Super Admin)',
    email: 'admin@hotelstay.com',
    role: 'super_admin',
  },
];

interface AuthContextType {
  currentPersona: Persona;
  setPersona: (personaId: string) => void;
  isGuest: boolean;
  isHotelAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);

  useEffect(() => {
    const saved = localStorage.getItem('hotelstay_persona_id');
    if (saved) {
      const found = PERSONAS.find(p => p.id === saved);
      if (found) setCurrentPersona(found);
    }
  }, []);

  const handleSetPersona = (personaId: string) => {
    const found = PERSONAS.find(p => p.id === personaId);
    if (found) {
      setCurrentPersona(found);
      localStorage.setItem('hotelstay_persona_id', found.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentPersona,
        setPersona: handleSetPersona,
        isGuest: currentPersona.role === 'guest',
        isHotelAdmin: currentPersona.role === 'hotel_manager' || currentPersona.role === 'hotel_owner',
        isSuperAdmin: currentPersona.role === 'super_admin',
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
