'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { HotelOnboardingWizard } from '@/components/hotel-admin/HotelOnboardingWizard';
import {
  Users,
  BedDouble,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Globe,
  Plus,
  Share2,
  Copy,
  ExternalLink,
  Brush,
  Filter,
} from 'lucide-react';

export default function HotelAdminDashboard() {
  const { currentUser, isHotelAdmin } = useAuth();
  const { hotels, reservations, rooms, updateReservationStatus, updateRoomStatus, showToast } = useMarketplace();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings'>('overview');

  // Find hotel managed by current user or first available onboarded hotel
  const currentHotel =
    hotels.find((h) => h.managerId === currentUser?.id || h.slug === currentUser?.hotelSlug) ||
    hotels[0] ||
    null;

  const currentHotelId = currentHotel?.id || '';

  const tenantReservations = reservations.filter((r) => r.hotelId === currentHotelId);
  const tenantRooms = rooms.filter((rm) => rm.hotelId === currentHotelId);

  // Operational metrics calculated strictly from real data
  const totalRooms = tenantRooms.length || (currentHotel ? currentHotel.roomTypes.length : 0);
  const occupiedRooms = tenantRooms.filter((r) => r.status === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const availableRooms = tenantRooms.filter((r) => r.status === 'available').length;
  const cleaningRooms = tenantRooms.filter((r) => r.status === 'cleaning').length;

  const totalRevenue = tenantReservations
    .filter((r) => r.paymentStatus === 'paid' || r.status === 'confirmed')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const copyDomainLink = () => {
    if (!currentHotel) return;
    const url = `${window.location.origin}/hotels/${currentHotel.slug}`;
    navigator.clipboard.writeText(url);
    showToast({
      title: 'Domain Link Copied',
      description: url,
      type: 'success',
    });
  };

  // If no hotel is onboarded yet or user requested onboarding
  if (!currentHotel || showOnboarding) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#141413] p-6 sm:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          {hotels.length > 0 && showOnboarding && (
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer mb-2"
            >
              ← Back to Active Dashboard
            </button>
          )}

          <HotelOnboardingWizard onComplete={() => setShowOnboarding(false)} />
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 sm:p-10 space-y-8 bg-[#FAF8F5] text-[#141413]">
      {/* HOTEL ONBOARDING STATUS NOTIFICATION BANNER */}
      {currentHotel.status === 'pending_review' && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Pending Review</h3>
              <p className="text-xs text-amber-700">
                Your hotel has been submitted and is currently being reviewed by HotelStay.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            Status: pending_review
          </span>
        </div>
      )}

      {currentHotel.status === 'changes_requested' && (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-rose-900">Changes Requested by Admin</h3>
              <p className="text-xs text-rose-700">
                {currentHotel.adminFeedbackNotes || 'Please update clear photos and property policies before resubmitting.'}
              </p>
            </div>
          </div>
          <Link
            href="/partner/onboard"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
          >
            Update & Resubmit
          </Link>
        </div>
      )}

      {/* =========================================================================
          RAREUI LUXURY HEADER & TENANT DOMAIN BAR
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Tenant Domain
            </span>
            <span className="text-xs text-[#85837B]">
              Property ID: <span className="font-mono text-[#141413]">{currentHotel.id}</span>
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2 flex items-center gap-3">
            <span>{currentHotel.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#575650] mt-1">
            {currentHotel.tagline} • <span className="text-[#AF8F64] font-medium">{currentHotel.location.city}, {currentHotel.location.country}</span>
          </p>
        </div>

        {/* Action Controls & Public Domain Preview */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={copyDomainLink}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#D5CCC0] text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title="Copy Public URL"
          >
            <Copy className="w-3.5 h-3.5 text-[#AF8F64]" />
            <span>Copy Domain</span>
          </button>

          <Link
            href={`/hotels/${currentHotel.slug}`}
            target="_blank"
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#D5CCC0] text-xs font-semibold text-[#AF8F64] flex items-center gap-2 transition-all shadow-2xs"
          >
            <span>View Live Domain</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setShowOnboarding(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#141413] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Property</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CUSTOM TENANT DOMAIN SPOTLIGHT BANNER
          ========================================================================= */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#141413] via-[#242320] to-[#141413] text-white border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880]">
              Dedicated Tenant Domain
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-white mt-0.5">
              hotelstay.com/hotels/<span className="text-[#C5A880]">{currentHotel.slug}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/hotels/${currentHotel.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Open Guest View →
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RAREUI METRICS ROW (Strictly Real Data)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Real-time Occupancy */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs relative overflow-hidden group hover:border-[#AF8F64]/40 transition-all">
          <div className="flex items-center justify-between text-[#85837B] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Occupancy</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#AF8F64] border border-[#E8E2D8]">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#141413] tracking-tight">
            {occupancyRate}%
          </div>
          <div className="text-xs text-[#85837B] mt-2 flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold">{occupiedRooms} occupied</span>
            <span>•</span>
            <span>{availableRooms || totalRooms} available</span>
          </div>
        </div>

        {/* Metric 2: Gross Realized Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs relative overflow-hidden group hover:border-[#AF8F64]/40 transition-all">
          <div className="flex items-center justify-between text-[#85837B] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Realized Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#141413] tracking-tight">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#85837B] mt-2">
            From {tenantReservations.length} guest reservations
          </div>
        </div>

        {/* Metric 3: Base Starting Rate */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs relative overflow-hidden group hover:border-[#AF8F64]/40 transition-all">
          <div className="flex items-center justify-between text-[#85837B] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Starting Rate / Night</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#AF8F64] border border-[#E8E2D8]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#141413] tracking-tight">
            ${currentHotel.startingPrice}
          </div>
          <div className="text-xs text-[#85837B] mt-2">
            Currency: {currentHotel.currency} ({currentHotel.currencySymbol})
          </div>
        </div>

        {/* Metric 4: Active Suites / Inventory */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs relative overflow-hidden group hover:border-[#AF8F64]/40 transition-all">
          <div className="flex items-center justify-between text-[#85837B] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Suites</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#141413] tracking-tight">
            {currentHotel.roomTypes.length}
          </div>
          <div className="text-xs text-[#85837B] mt-2">
            {currentHotel.amenities.length} amenities configured
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUITES & INVENTORY MATRIX
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#141413]">
              Suites & Inventory Staging
            </h2>
            <p className="text-xs text-[#85837B] mt-0.5">
              Real-time room configuration and public availability for {currentHotel.name}.
            </p>
          </div>

          <div className="text-xs font-semibold text-[#85837B]">
            {currentHotel.roomTypes.length} Active Room Types
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentHotel.roomTypes.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#AF8F64]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-[#E8E2D8]">
                  <Image
                    src={room.images[0] || currentHotel.heroImage}
                    alt={room.name}
                    fill
                    sizes="350px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                    ${room.basePricePerNight} / night
                  </div>
                </div>

                <h3 className="font-editorial text-lg font-bold text-[#141413]">{room.name}</h3>
                <p className="text-xs text-[#575650] mt-1 line-clamp-2">{room.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E8E2D8] text-stone-700">
                    {room.bedType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E8E2D8] text-stone-700">
                    Up to {room.maxGuests} guests
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Available for Booking
                </span>
                <Link
                  href={`/hotels/${currentHotel.slug}`}
                  className="text-[#AF8F64] hover:underline font-semibold"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          RESERVATIONS & GUEST BOOKINGS TABLE
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#141413]">
              Guest Reservations
            </h2>
            <p className="text-xs text-[#85837B] mt-0.5">
              Live guest bookings for {currentHotel.name}.
            </p>
          </div>
        </div>

        {tenantReservations.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-center space-y-3">
            <Clock className="w-8 h-8 text-[#AF8F64] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#141413]">No Guest Reservations Yet</h3>
            <p className="text-xs text-[#575650] max-w-md mx-auto">
              Your property is live at <span className="font-mono text-[#AF8F64]">hotelstay.com/hotels/{currentHotel.slug}</span>. When guests make bookings through Discover or your custom domain, they will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#141413]">
              <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Guest</th>
                  <th className="p-3.5">Suite</th>
                  <th className="p-3.5">Dates</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {tenantReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-3.5 font-medium text-[#141413]">
                      <div>{res.guestName}</div>
                      <div className="text-[10px] text-[#85837B]">{res.guestEmail}</div>
                    </td>
                    <td className="p-3.5">{res.roomTypeName}</td>
                    <td className="p-3.5 font-mono text-[#575650]">
                      {res.checkInDate} → {res.checkOutDate}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#141413]">
                      ${res.totalAmount}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                        {res.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => updateReservationStatus(res.id, 'checked_in')}
                        className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-stone-200 border border-[#D5CCC0] text-stone-800 text-[11px] font-semibold cursor-pointer"
                      >
                        Check In
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
