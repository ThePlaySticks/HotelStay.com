export type UserRole = 'guest' | 'hotel_owner' | 'hotel_manager' | 'front_desk' | 'housekeeping' | 'super_admin';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'wellness' | 'dining' | 'comfort' | 'services' | 'activities';
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  slug: string;
  description: string;
  sizeSqFt: number;
  bedType: string;
  maxGuests: number;
  view: string;
  basePricePerNight: number;
  images: string[];
  amenities: string[];
  cancellationPolicy: string;
  mealPlan: string;
  availableCount: number;
}

export interface IndividualRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  floor: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'out_of_service';
  currentGuestName?: string;
  currentReservationId?: string;
  lastCleaned?: string;
  notes?: string;
}

export interface Review {
  id: string;
  hotelId: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  rating: number;
  subRatings: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
  };
  date: string;
  title: string;
  comment: string;
  verifiedBooking: boolean;
  hotelResponse?: {
    date: string;
    text: string;
  };
}

export interface HotelPolicy {
  checkInTime: string;
  checkOutTime: string;
  cancellationDeadlineHours: number;
  cancellationFeePercent: number;
  petPolicy: string;
  smokingPolicy: string;
  childPolicy: string;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
    latitude: number;
    longitude: number;
    neighborhoodDescription: string;
  };
  starRating: number;
  guestRating: number;
  reviewCount: number;
  heroImage: string;
  galleryImages: string[];
  startingPrice: number;
  currency: string;
  currencySymbol: string;
  featured: boolean;
  luxuryTier: 'Boutique' | '5-Star Luxury' | 'Ocean Resort' | 'Heritage Chateau';
  amenities: string[];
  roomTypes: RoomType[];
  policies: HotelPolicy;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  brandColors?: {
    primary: string;
    accent: string;
  };
  status: 'active' | 'pending' | 'suspended';
  commissionRatePercent: number;
  subscriptionPlan: 'starter' | 'pro' | 'enterprise';
}

export interface Reservation {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  roomTypeId: string;
  roomTypeName: string;
  roomNumber?: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  guestsCount: {
    adults: number;
    children: number;
  };
  basePrice: number;
  taxesAndFees: number;
  extrasTotal: number;
  discountAmount: number;
  totalAmount: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partially_refunded';
  bookingSource: 'Marketplace' | 'Direct Website' | 'Corporate' | 'Concierge';
  specialRequests?: string;
  selectedExtras?: {
    name: string;
    price: number;
  }[];
  createdAt: string;
}

export interface GuestProfile {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  totalStays: number;
  lifetimeSpend: number;
  vipStatus: boolean;
  preferences: string[];
  internalStaffNotes?: string;
  lastStayDate?: string;
}

export interface StaffMember {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  role: 'Owner' | 'General Manager' | 'Front Desk' | 'Housekeeping' | 'Accountant';
  phone: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
}

export interface HousekeepingTask {
  id: string;
  hotelId: string;
  roomNumber: string;
  taskType: 'Full Turnover' | 'Daily Refresh' | 'Deep Clean' | 'Inspection';
  assignedTo: string;
  priority: 'High' | 'Normal' | 'Urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  notes?: string;
}

export interface TenantApplication {
  id: string;
  hotelName: string;
  applicantName: string;
  applicantEmail: string;
  location: string;
  roomsCount: number;
  starRatingProposed: number;
  requestedTier: 'starter' | 'pro' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export interface PayoutRequest {
  id: string;
  hotelId: string;
  hotelName: string;
  amount: number;
  currency: string;
  period: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  bankAccountLast4: string;
  requestedAt: string;
}
