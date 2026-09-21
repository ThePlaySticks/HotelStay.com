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
      <main className="min-h-screen bg-[#080A0F] text-white p-6 sm:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          {hotels.length > 0 && showOnboarding && (
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 cursor-pointer mb-2"
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
    <main className="min-h-screen bg-[#080A0F] text-white p-6 sm:p-10 space-y-8">
      {/* =========================================================================
          RAREUI LUXURY HEADER & TENANT DOMAIN BAR
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Tenant Domain
            </span>
            <span className="text-xs text-stone-400">
              Property ID: <span className="font-mono text-stone-300">{currentHotel.id}</span>
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white mt-2 flex items-center gap-3">
            <span>{currentHotel.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {currentHotel.tagline} • <span className="text-[#C5A880]">{currentHotel.location.city}, {currentHotel.location.country}</span>
          </p>
        </div>

        {/* Action Controls & Public Domain Preview */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={copyDomainLink}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Copy Public URL"
          >
            <Copy className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Copy Domain</span>
          </button>

          <Link
            href={`/hotels/${currentHotel.slug}`}
            target="_blank"
            className="px-5 py-2.5 rounded-2xl bg-[#1A2233] hover:bg-[#222C42] border border-[#C5A880]/30 text-xs font-semibold text-[#C5A880] hover:text-white flex items-center gap-2 transition-all shadow-md"
          >
            <span>View Live Domain</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setShowOnboarding(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#C5A880] hover:bg-[#b0926b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Property</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CUSTOM TENANT DOMAIN SPOTLIGHT BANNER
          ========================================================================= */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#121722] via-[#161E2E] to-[#121722] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/20">
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
        <div className="p-6 rounded-3xl bg-[#0E121B] border border-white/10 shadow-lg relative overflow-hidden group hover:border-[#C5A880]/40 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Occupancy</span>
            <div className="p-2 rounded-xl bg-white/5 text-[#C5A880]">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {occupancyRate}%
          </div>
          <div className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{occupiedRooms} occupied</span>
            <span>•</span>
            <span>{availableRooms || totalRooms} available</span>
          </div>
        </div>

        {/* Metric 2: Gross Realized Revenue */}
        <div className="p-6 rounded-3xl bg-[#0E121B] border border-white/10 shadow-lg relative overflow-hidden group hover:border-[#C5A880]/40 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Realized Revenue</span>
            <div className="p-2 rounded-xl bg-white/5 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-stone-400 mt-2">
            From {tenantReservations.length} guest reservations
          </div>
        </div>

        {/* Metric 3: Base Starting Rate */}
        <div className="p-6 rounded-3xl bg-[#0E121B] border border-white/10 shadow-lg relative overflow-hidden group hover:border-[#C5A880]/40 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Starting Rate / Night</span>
            <div className="p-2 rounded-xl bg-white/5 text-[#C5A880]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            ${currentHotel.startingPrice}
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Currency: {currentHotel.currency} ({currentHotel.currencySymbol})
          </div>
        </div>

        {/* Metric 4: Active Suites / Inventory */}
        <div className="p-6 rounded-3xl bg-[#0E121B] border border-white/10 shadow-lg relative overflow-hidden group hover:border-[#C5A880]/40 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Suites</span>
            <div className="p-2 rounded-xl bg-white/5 text-purple-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {currentHotel.roomTypes.length}
          </div>
          <div className="text-xs text-stone-400 mt-2">
            {currentHotel.amenities.length} amenities configured
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUITES & INVENTORY MATRIX
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-white">
              Suites & Inventory Staging
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Real-time room configuration and public availability for {currentHotel.name}.
            </p>
          </div>

          <div className="text-xs font-semibold text-stone-400">
            {currentHotel.roomTypes.length} Active Room Types
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentHotel.roomTypes.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-2xl bg-[#151B28] border border-white/10 hover:border-[#C5A880]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10">
                  <Image
                    src={room.images[0] || currentHotel.heroImage}
                    alt={room.name}
                    fill
                    sizes="350px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                    ${room.basePricePerNight} / night
                  </div>
                </div>

                <h3 className="font-editorial text-lg font-bold text-white">{room.name}</h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">{room.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-stone-300">
                    {room.bedType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-stone-300">
                    Up to {room.maxGuests} guests
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Available for Booking
                </span>
                <Link
                  href={`/hotels/${currentHotel.slug}`}
                  className="text-[#C5A880] hover:underline font-semibold"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-white">
              Guest Reservations
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Live guest bookings for {currentHotel.name}.
            </p>
          </div>
        </div>

        {tenantReservations.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#151B28]/60 border border-white/5 text-center space-y-3">
            <Clock className="w-8 h-8 text-[#C5A880] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white">No Guest Reservations Yet</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Your property is live at <span className="font-mono text-[#C5A880]">hotelstay.com/hotels/{currentHotel.slug}</span>. When guests make bookings through Discover or your custom domain, they will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-white/5 text-stone-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Guest</th>
                  <th className="p-3.5">Suite</th>
                  <th className="p-3.5">Dates</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenantReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-medium text-white">
                      <div>{res.guestName}</div>
                      <div className="text-[10px] text-stone-500">{res.guestEmail}</div>
                    </td>
                    <td className="p-3.5">{res.roomTypeName}</td>
                    <td className="p-3.5 font-mono text-stone-400">
                      {res.checkInDate} → {res.checkOutDate}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      ${res.totalAmount}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                        {res.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => updateReservationStatus(res.id, 'checked_in')}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer"
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
