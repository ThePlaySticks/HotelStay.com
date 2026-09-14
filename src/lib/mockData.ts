import {
  Hotel,
  IndividualRoom,
  Reservation,
  GuestProfile,
  StaffMember,
  HousekeepingTask,
  Review,
  TenantApplication,
  PayoutRequest,
} from './types';

// Clean, zero-mock initial state.
// Real data is populated dynamically by guests and hotel tenant administrators.
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_ROOMS: IndividualRoom[] = [];
export const INITIAL_RESERVATIONS: Reservation[] = [];
export const INITIAL_GUESTS: GuestProfile[] = [];
export const INITIAL_STAFF: StaffMember[] = [];
export const INITIAL_HOUSEKEEPING: HousekeepingTask[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_TENANT_APPLICATIONS: TenantApplication[] = [];
export const INITIAL_PAYOUTS: PayoutRequest[] = [];
