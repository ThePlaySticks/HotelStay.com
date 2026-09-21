'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Hotel,
  Reservation,
  IndividualRoom,
  Review,
  TenantApplication,
  PayoutRequest,
  Destination,
  MobilityVehicle,
  DMCExperience,
  FlightRoute,
  NotificationItem,
  HotelApprovalStatus,
} from '@/lib/types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_HOTELS,
  INITIAL_RESERVATIONS,
  INITIAL_ROOMS,
  INITIAL_REVIEWS,
  INITIAL_TENANT_APPLICATIONS,
  INITIAL_PAYOUTS,
  INITIAL_VEHICLES,
  INITIAL_EXPERIENCES,
  INITIAL_FLIGHTS,
  INITIAL_NOTIFICATIONS,
} from '@/lib/mockData';

export interface SearchFilters {
  destination: string;
  category: 'hotels' | 'flights' | 'cars' | 'experiences';
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
  destinations: Destination[];
  hotels: Hotel[];
  approvedHotels: Hotel[];
  reservations: Reservation[];
  rooms: IndividualRoom[];
  reviews: Review[];
  applications: TenantApplication[];
  payouts: PayoutRequest[];
  vehicles: MobilityVehicle[];
  experiences: DMCExperience[];
  flights: FlightRoute[];
  notifications: NotificationItem[];
  wishlist: string[];
  toggleWishlist: (hotelId: string) => void;
  isWishlisted: (hotelId: string) => boolean;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  addHotel: (hotel: Hotel) => void;
  updateHotel: (hotel: Hotel) => void;
  deleteHotel: (hotelId: string) => void;
  submitHotelForReview: (hotel: Hotel) => void;
  updateHotelStatus: (hotelId: string, status: HotelApprovalStatus, adminFeedbackNotes?: string) => void;
  addDestination: (destination: Destination) => void;
  updateDestination: (destination: Destination) => void;
  createReservation: (newReservation: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;
  updateRoomStatus: (roomId: string, status: IndividualRoom['status']) => void;
  updateApplicationStatus: (appId: string, status: 'approved' | 'rejected' | 'needs_changes') => void;
  updatePayoutStatus: (payoutId: string, status: PayoutRequest['status']) => void;
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'date' | 'read'> & { read?: boolean }) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: SearchFilters = {
  destination: '',
  category: 'hotels',
  checkInDate: '2026-09-24',
  checkOutDate: '2026-09-28',
  adults: 2,
  children: 0,
  priceRange: [0, 5000],
  starRatings: [],
  propertyTypes: [],
  amenities: [],
  sortBy: 'recommended',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [rooms, setRooms] = useState<IndividualRoom[]>(INITIAL_ROOMS);
  const [reviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [applications, setApplications] = useState<TenantApplication[]>(INITIAL_TENANT_APPLICATIONS);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [vehicles] = useState<MobilityVehicle[]>(INITIAL_VEHICLES);
  const [experiences] = useState<DMCExperience[]>(INITIAL_EXPERIENCES);
  const [flights] = useState<FlightRoute[]>(INITIAL_FLIGHTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [wishlist, setWishlist] = useState<string[]>(['hotel-eko-royal', 'hotel-azure']);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const savedHotels = localStorage.getItem('hotelstay_v2_hotels');
      if (savedHotels) {
        const parsed = JSON.parse(savedHotels);
        const realOnboarded = Array.isArray(parsed)
          ? parsed.filter((h: Hotel) => h && !['hotel-eko-royal', 'hotel-azure', 'hotel-serenita', 'hotel-mirage-dubai', 'hotel-highland-loch'].includes(h.id))
          : [];
        setHotels(realOnboarded);
      }

      const savedDestinations = localStorage.getItem('hotelstay_v2_destinations');
      if (savedDestinations) setDestinations(JSON.parse(savedDestinations));

      const savedWishlist = localStorage.getItem('hotelstay_v2_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedReservations = localStorage.getItem('hotelstay_v2_reservations');
      if (savedReservations) {
        const parsedRes = JSON.parse(savedReservations);
        const realRes = Array.isArray(parsedRes)
          ? parsedRes.filter((r: Reservation) => r && !['HS-78921'].includes(r.id))
          : [];
        setReservations(realRes);
      }

      const savedRooms = localStorage.getItem('hotelstay_v2_rooms');
      if (savedRooms) {
        const parsedRooms = JSON.parse(savedRooms);
        const realRooms = Array.isArray(parsedRooms)
          ? parsedRooms.filter((rm: IndividualRoom) => rm && !['rm-eko-401', 'rm-eko-402'].includes(rm.id))
          : [];
        setRooms(realRooms);
      }

      const savedNotifs = localStorage.getItem('hotelstay_v2_notifs');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch {
      // ignore
    }
  }, []);

  // Approved hotels that can be publicly discovered on the marketplace
  const approvedHotels = hotels.filter((h) => h.status === 'approved' || h.status === 'active');

  const addHotel = (newHotel: Hotel) => {
    setHotels((prev) => {
      const updated = [newHotel, ...prev.filter((h) => h.id !== newHotel.id)];
      localStorage.setItem('hotelstay_v2_hotels', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Property Registered',
      description: `${newHotel.name} has been added to the system.`,
      type: 'success',
    });
  };

  const updateHotel = (updatedHotel: Hotel) => {
    setHotels((prev) => {
      const updated = prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h));
      localStorage.setItem('hotelstay_v2_hotels', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Property Updated',
      description: `${updatedHotel.name} details were saved successfully.`,
      type: 'info',
    });
  };

  const deleteHotel = (hotelId: string) => {
    setHotels((prev) => {
      const updated = prev.filter((h) => h.id !== hotelId);
      localStorage.setItem('hotelstay_v2_hotels', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Hotel Removed',
      description: 'Property removed from directory.',
      type: 'info',
    });
  };

  const submitHotelForReview = (hotel: Hotel) => {
    const submittedHotel: Hotel = {
      ...hotel,
      status: 'submitted',
      updatedAt: new Date().toISOString(),
    };
    setHotels((prev) => {
      const exists = prev.some((h) => h.id === hotel.id);
      const updated = exists ? prev.map((h) => (h.id === hotel.id ? submittedHotel : h)) : [submittedHotel, ...prev];
      localStorage.setItem('hotelstay_v2_hotels', JSON.stringify(updated));
      return updated;
    });

    addNotification({
      userId: 'persona-super-admin',
      title: 'New Property Submission',
      message: `${hotel.name} in ${hotel.location.city} was submitted for marketplace review.`,
      type: 'partner_approval',
      linkUrl: '/super-admin/applications',
    });

    showToast({
      title: 'Submission Received',
      description: `${hotel.name} submitted for HotelStay administrative review.`,
      type: 'success',
    });
  };

  const updateHotelStatus = (hotelId: string, status: HotelApprovalStatus, adminFeedbackNotes?: string) => {
    setHotels((prev) => {
      const updated = prev.map((h) => {
        if (h.id === hotelId) {
          return {
            ...h,
            status,
            adminFeedbackNotes: adminFeedbackNotes !== undefined ? adminFeedbackNotes : h.adminFeedbackNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return h;
      });
      localStorage.setItem('hotelstay_v2_hotels', JSON.stringify(updated));
      return updated;
    });

    const targetHotel = hotels.find((h) => h.id === hotelId);
    showToast({
      title: `Status: ${status.toUpperCase().replace('_', ' ')}`,
      description: `${targetHotel?.name || 'Property'} is now marked as ${status}.`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning',
    });
  };

  const addDestination = (destination: Destination) => {
    setDestinations((prev) => {
      const updated = [...prev, destination];
      localStorage.setItem('hotelstay_v2_destinations', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Destination Added',
      description: `${destination.city}, ${destination.country} added to the travel catalog.`,
      type: 'success',
    });
  };

  const updateDestination = (destination: Destination) => {
    setDestinations((prev) => {
      const updated = prev.map((d) => (d.id === destination.id ? destination : d));
      localStorage.setItem('hotelstay_v2_destinations', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Destination Updated',
      description: `${destination.city} details saved.`,
      type: 'info',
    });
  };

  const toggleWishlist = (hotelId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId];
      localStorage.setItem('hotelstay_v2_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (hotelId: string) => wishlist.includes(hotelId);

  const showToast = ({ title, description, type }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createReservation = (newReservationData: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
    const randomCode = 'HS-' + Math.floor(10000 + Math.random() * 90000);
    const newReservation: Reservation = {
      ...newReservationData,
      id: randomCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setReservations((prev) => {
      const updated = [newReservation, ...prev];
      localStorage.setItem('hotelstay_v2_reservations', JSON.stringify(updated));
      return updated;
    });

    addNotification({
      userId: newReservation.guestId,
      title: `Booking Confirmed (${newReservation.id})`,
      message: `Your stay at ${newReservation.hotelName} is confirmed for ${newReservation.checkInDate}.`,
      type: 'booking',
      linkUrl: '/guest?tab=upcoming',
    });

    showToast({
      title: 'Reservation Confirmed',
      description: `Your stay at ${newReservation.hotelName} is booked. Reference: ${newReservation.id}`,
      type: 'success',
    });

    return newReservation;
  };

  const updateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    setReservations((prev) => {
      const updated = prev.map((r) => (r.id === reservationId ? { ...r, status } : r));
      localStorage.setItem('hotelstay_v2_reservations', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Status Updated',
      description: `Reservation ${reservationId} is now marked as ${status.replace('_', ' ')}.`,
      type: 'info',
    });
  };

  const updateRoomStatus = (roomId: string, status: IndividualRoom['status']) => {
    setRooms((prev) => {
      const updated = prev.map((room) => (room.id === roomId ? { ...room, status } : room));
      localStorage.setItem('hotelstay_v2_rooms', JSON.stringify(updated));
      return updated;
    });
    showToast({
      title: 'Room Status Updated',
      description: `Room updated to ${status.toUpperCase()}`,
      type: 'info',
    });
  };

  const updateApplicationStatus = (appId: string, status: 'approved' | 'rejected' | 'needs_changes') => {
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    showToast({
      title: `Application ${status === 'approved' ? 'Approved' : status === 'needs_changes' ? 'Requested Changes' : 'Rejected'}`,
      description: `Tenant onboarding application has been updated.`,
      type: status === 'approved' ? 'success' : 'warning',
    });
  };

  const updatePayoutStatus = (payoutId: string, status: PayoutRequest['status']) => {
    setPayouts((prev) => prev.map((p) => (p.id === payoutId ? { ...p, status } : p)));
    showToast({
      title: `Payout ${status.toUpperCase()}`,
      description: `Disbursement batch updated successfully.`,
      type: 'success',
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
      localStorage.setItem('hotelstay_v2_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'date' | 'read'> & { read?: boolean }) => {
    const newItem: NotificationItem = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      linkUrl: notification.linkUrl,
      read: notification.read ?? false,
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      date: 'Just now',
    };
    setNotifications((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('hotelstay_v2_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        destinations,
        hotels,
        approvedHotels,
        reservations,
        rooms,
        reviews,
        applications,
        payouts,
        vehicles,
        experiences,
        flights,
        notifications,
        wishlist,
        toggleWishlist,
        isWishlisted,
        filters,
        setFilters,
        addHotel,
        updateHotel,
        deleteHotel,
        submitHotelForReview,
        updateHotelStatus,
        addDestination,
        updateDestination,
        createReservation,
        updateReservationStatus,
        updateRoomStatus,
        updateApplicationStatus,
        updatePayoutStatus,
        markNotificationAsRead,
        addNotification,
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
