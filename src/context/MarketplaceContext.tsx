'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Hotel,
  Reservation,
  IndividualRoom,
  Review,
  TenantApplication,
  PayoutRequest,
} from '@/lib/types';
import {
  INITIAL_HOTELS,
  INITIAL_RESERVATIONS,
  INITIAL_ROOMS,
  INITIAL_REVIEWS,
  INITIAL_TENANT_APPLICATIONS,
  INITIAL_PAYOUTS,
} from '@/lib/mockData';

export interface SearchFilters {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  priceRange: [number, number];
  starRatings: number[];
  propertyTypes: string[];
  amenities: string[];
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating';
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface MarketplaceContextType {
  hotels: Hotel[];
  reservations: Reservation[];
  rooms: IndividualRoom[];
  reviews: Review[];
  applications: TenantApplication[];
  payouts: PayoutRequest[];
  wishlist: string[];
  toggleWishlist: (hotelId: string) => void;
  isWishlisted: (hotelId: string) => boolean;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  createReservation: (newReservation: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;
  updateRoomStatus: (roomId: string, status: IndividualRoom['status']) => void;
  updateApplicationStatus: (appId: string, status: 'approved' | 'rejected') => void;
  updatePayoutStatus: (payoutId: string, status: PayoutRequest['status']) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: SearchFilters = {
  destination: '',
  checkInDate: '2026-09-24',
  checkOutDate: '2026-09-28',
  adults: 2,
  children: 0,
  priceRange: [0, 2000],
  starRatings: [],
  propertyTypes: [],
  amenities: [],
  sortBy: 'recommended',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [hotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [rooms, setRooms] = useState<IndividualRoom[]>(INITIAL_ROOMS);
  const [reviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [applications, setApplications] = useState<TenantApplication[]>(INITIAL_TENANT_APPLICATIONS);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [wishlist, setWishlist] = useState<string[]>(['hotel-azure']);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('hotelstay_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedReservations = localStorage.getItem('hotelstay_reservations');
      if (savedReservations) setReservations(JSON.parse(savedReservations));
    } catch {
      // ignore
    }
  }, []);

  const toggleWishlist = (hotelId: string) => {
    setWishlist(prev => {
      const next = prev.includes(hotelId) ? prev.filter(id => id !== hotelId) : [...prev, hotelId];
      localStorage.setItem('hotelstay_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (hotelId: string) => wishlist.includes(hotelId);

  const showToast = ({ title, description, type }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const createReservation = (newReservationData: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
    const randomCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      ...newReservationData,
      id: randomCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setReservations(prev => {
      const updated = [newReservation, ...prev];
      localStorage.setItem('hotelstay_reservations', JSON.stringify(updated));
      return updated;
    });

    showToast({
      title: 'Reservation Confirmed',
      description: `Your stay at ${newReservation.hotelName} is booked. Reference: ${newReservation.id}`,
      type: 'success',
    });

    return newReservation;
  };

  const updateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    setReservations(prev => {
      const updated = prev.map(r => (r.id === reservationId ? { ...r, status } : r));
      localStorage.setItem('hotelstay_reservations', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Status Updated',
      description: `Reservation ${reservationId} is now marked as ${status.replace('_', ' ')}.`,
      type: 'info',
    });
  };

  const updateRoomStatus = (roomId: string, status: IndividualRoom['status']) => {
    setRooms(prev => prev.map(room => (room.id === roomId ? { ...room, status } : room)));
    showToast({
      title: 'Room Status Updated',
      description: `Room updated to ${status.toUpperCase()}`,
      type: 'info',
    });
  };

  const updateApplicationStatus = (appId: string, status: 'approved' | 'rejected') => {
    setApplications(prev => prev.map(a => (a.id === appId ? { ...a, status } : a)));
    showToast({
      title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `Tenant onboarding application has been ${status}.`,
      type: status === 'approved' ? 'success' : 'warning',
    });
  };

  const updatePayoutStatus = (payoutId: string, status: PayoutRequest['status']) => {
    setPayouts(prev => prev.map(p => (p.id === payoutId ? { ...p, status } : p)));
    showToast({
      title: `Payout ${status.toUpperCase()}`,
      description: `Disbursement batch updated successfully.`,
      type: 'success',
    });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        hotels,
        reservations,
        rooms,
        reviews,
        applications,
        payouts,
        wishlist,
        toggleWishlist,
        isWishlisted,
        filters,
        setFilters,
        createReservation,
        updateReservationStatus,
        updateRoomStatus,
        updateApplicationStatus,
        updatePayoutStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
