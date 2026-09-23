'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { HotelCard } from '@/components/marketplace/HotelCard';
import {
  Calendar,
  Heart,
  User,
  CreditCard,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

function GuestDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'upcoming';
  const { currentPersona, signOut, isAuthenticated } = useAuth();
  const { reservations, hotels, wishlist, updateReservationStatus } = useMarketplace();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [cancelModalReservationId, setCancelModalReservationId] = useState<string | null>(null);

  // Filter reservations for current guest
  const myReservations = reservations.filter(
    (r) => r.guestEmail === currentPersona.email || r.guestName.toLowerCase().includes('julian')
  );

  const upcomingBookings = myReservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'checked_in'
  );
  const pastBookings = myReservations.filter((r) => r.status === 'checked_out');
  const cancelledBookings = myReservations.filter((r) => r.status === 'cancelled');

  const wishlistedHotels = hotels.filter((h) => wishlist.includes(h.id));

  const handleConfirmCancel = () => {
    if (cancelModalReservationId) {
      updateReservationStatus(cancelModalReservationId, 'cancelled');
      setCancelModalReservationId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* User Hero Banner */}
        <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#141413] text-[#C5A880] font-editorial text-2xl font-bold flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-xs">
              {currentPersona.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                  {currentPersona.name}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Privé Member
                </span>
              </div>
              <p className="text-xs text-[#85837B] mt-0.5">
                {currentPersona.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#575650] border-t sm:border-t-0 pt-4 sm:pt-0 border-[#F0EAE1]">
            <div>
              <span className="block text-[#85837B] uppercase tracking-wider text-[10px]">Stays Booked</span>
              <span className="font-bold text-base text-[#141413]">{myReservations.length}</span>
            </div>
            <div className="h-8 w-[1px] bg-[#E8E2D8]" />
            <div>
              <span className="block text-[#85837B] uppercase tracking-wider text-[10px]">Saved Wishlist</span>
              <span className="font-bold text-base text-[#141413]">{wishlist.length}</span>
            </div>
            <div className="h-8 w-[1px] bg-[#E8E2D8]" />
            <button
              type="button"
              onClick={async () => {
                await signOut();
                window.location.href = '/';
              }}
              className="px-3.5 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#E8E2D8] mb-8 text-xs font-semibold">
          {[
            { id: 'upcoming', label: `Upcoming Stays (${upcomingBookings.length})`, icon: Calendar },
            { id: 'past', label: `Past Stays (${pastBookings.length})`, icon: Clock },
            { id: 'cancelled', label: `Cancelled (${cancelledBookings.length})`, icon: XCircle },
            { id: 'wishlist', label: `Saved Wishlist (${wishlistedHotels.length})`, icon: Heart },
            { id: 'profile', label: 'Guest Profile', icon: User },
            { id: 'payment', label: 'Payment Methods', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
                  active
                    ? 'bg-[#141413] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D8] text-[#575650] hover:text-[#141413]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#C5A880]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: UPCOMING BOOKINGS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8]">
                <Calendar className="w-10 h-10 text-[#C5A880] mx-auto mb-3" />
                <h3 className="font-editorial text-xl font-bold text-[#141413]">
                  No upcoming journeys planned
                </h3>
                <p className="text-xs text-[#85837B] mt-1.5 max-w-sm mx-auto">
                  Explore our curated collection of verified sanctuaries and reserve your next escape.
                </p>
                <Link
                  href="/search"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <span>Explore Sanctuaries</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-[#E8E2D8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6"
                >
                  <div className="relative w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
                    <Image
                      src={b.hotelImage}
                      alt={b.hotelName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#AF8F64]">
                          {b.hotelCity}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            b.status === 'checked_in'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {b.status === 'checked_in' ? 'Currently Checked In' : 'Confirmed'}
                        </span>
                      </div>

                      <h3 className="font-editorial text-xl font-bold text-[#141413] mt-1">
                        {b.hotelName}
                      </h3>
                      <p className="text-xs text-[#575650] mt-0.5">{b.roomTypeName}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-xs text-[#575650] bg-[#FAF8F5] p-3 rounded-xl border border-[#F0EAE1]">
                        <div>
                          <span className="text-[10px] text-[#85837B] uppercase font-bold block">Check-in</span>
                          <span className="font-semibold text-[#141413]">{b.checkInDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#85837B] uppercase font-bold block">Check-out</span>
                          <span className="font-semibold text-[#141413]">{b.checkOutDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#85837B] uppercase font-bold block">Total Paid</span>
                          <span className="font-bold text-emerald-700">€{b.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-stone-400 font-mono">Reference: {b.id}</span>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => setCancelModalReservationId(b.id)}
                          className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          Cancel Booking
                        </button>
                        <Link
                          href={`/hotel/${b.hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          className="px-4 py-2 rounded-full bg-[#141413] text-white text-xs font-semibold hover:bg-black transition-colors"
                        >
                          View Sanctuary Page
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAST BOOKINGS */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E2D8] text-xs text-[#85837B]">
                No completed past stays yet.
              </div>
            ) : (
              pastBookings.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D8] flex items-center justify-between">
                  <div>
                    <h4 className="font-editorial text-base font-bold text-[#141413]">{b.hotelName}</h4>
                    <p className="text-xs text-[#85837B]">{b.checkInDate} to {b.checkOutDate} · €{b.totalAmount}</p>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">Completed Stay</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CANCELLED BOOKINGS */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E2D8] text-xs text-[#85837B]">
                You have no cancelled reservations.
              </div>
            ) : (
              cancelledBookings.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D8] flex items-center justify-between">
                  <div>
                    <h4 className="font-editorial text-base font-bold text-[#141413] line-through text-stone-400">{b.hotelName}</h4>
                    <p className="text-xs text-[#85837B]">{b.checkInDate} · Ref: {b.id}</p>
                  </div>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                    Cancelled (Refund Processed)
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8]">
                <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-editorial text-xl font-bold text-[#141413]">
                  Your wishlist is waiting
                </h3>
                <p className="text-xs text-[#85837B] mt-1.5 max-w-sm mx-auto">
                  Click the heart icon on any hotel card to curate your private collection of dream escapes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] max-w-2xl space-y-6">
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Traveler Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={currentPersona.name}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={currentPersona.email}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Telephone</label>
                <input
                  type="tel"
                  defaultValue="+44 7911 123456"
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nationality</label>
                <input
                  type="text"
                  defaultValue="United Kingdom"
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>
            </div>
            <button
              onClick={() => alert('Profile preferences saved successfully.')}
              className="px-6 py-2.5 rounded-full bg-[#141413] text-white text-xs font-semibold"
            >
              Save Profile
            </button>
          </div>
        )}

        {/* TAB 6: PAYMENT METHODS */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] max-w-2xl space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Stored Payment Cards</h3>
            <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#C5A880]" />
                <div>
                  <div className="text-xs font-bold text-[#141413]">Visa Infinite •••• 9821</div>
                  <div className="text-[11px] text-[#85837B]">Expires 08/29 · Default</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          </div>
        )}
      </main>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {cancelModalReservationId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8E2D8] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-editorial text-xl font-bold text-[#141413]">
                Confirm Cancellation
              </h3>
              <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                Are you sure you want to cancel reservation <span className="font-bold text-black">{cancelModalReservationId}</span>? Under the property policy, a 100% refund will be credited back to your original payment method.
              </p>
            </div>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setCancelModalReservationId(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Keep Stay
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function GuestDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold">Loading guest account...</div>}>
      <GuestDashboardContent />
    </Suspense>
  );
}
