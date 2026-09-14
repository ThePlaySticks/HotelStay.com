'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
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
} from 'lucide-react';

export default function HotelAdminDashboard() {
  const { currentPersona } = useAuth();
  const { hotels, reservations, rooms, reviews, updateReservationStatus } = useMarketplace();

  // Strict tenant data isolation
  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0];

  const tenantReservations = reservations.filter((r) => r.hotelId === currentHotelId);
  const tenantRooms = rooms.filter((rm) => rm.hotelId === currentHotelId);
  const tenantReviews = reviews.filter((rev) => rev.hotelId === currentHotelId);

  // Operational metrics
  const totalRooms = tenantRooms.length || 9;
  const occupiedRooms = tenantRooms.filter((r) => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const availableRooms = tenantRooms.filter((r) => r.status === 'available').length;
  const cleaningRooms = tenantRooms.filter((r) => r.status === 'cleaning').length;

  const arrivalsToday = tenantReservations.filter((r) => r.checkInDate === '2026-09-14');
  const departuresToday = tenantReservations.filter((r) => r.checkOutDate === '2026-09-15');

  const totalRevenue = tenantReservations
    .filter((r) => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <main className="p-6 sm:p-10 space-y-8">
      {/* Top Banner with Manager Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
              Tenant Isolated Workspace
            </span>
            <span className="text-xs text-stone-500">
              Property ID: <span className="font-mono text-stone-800">{currentHotel.id}</span>
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-2">
            Good morning, {currentPersona.name}
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Operational dashboard for <span className="font-semibold text-black">{currentHotel.name}</span>. Here is your daily property snapshot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/hotel/${currentHotel.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-full border border-[#D5CCC0] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>View Public Hotel Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/hotel-admin/reservations"
            className="px-4 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-semibold shadow-xs"
          >
            + Create Walk-in Reservation
          </Link>
        </div>
      </div>

      {/* 5 KEY KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#85837B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Occupancy</span>
            <BedDouble className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#141413] mt-2">
            {occupancyRate}%
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">
            {occupiedRooms} of {totalRooms} rooms active
          </p>
        </div>

        {/* Total Settled Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#85837B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#141413] mt-2">
            €{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Settled via Marketplace
          </p>
        </div>

        {/* Today's Arrivals */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#85837B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Today&apos;s Arrivals</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#141413] mt-2">
            {arrivalsToday.length}
          </div>
          <p className="text-[11px] text-blue-700 mt-1">
            {arrivalsToday.length > 0 ? 'VIP check-ins scheduled' : 'All checked in'}
          </p>
        </div>

        {/* Today's Departures */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#85837B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Departures</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#141413] mt-2">
            {departuresToday.length || 1}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            Turnover inspections ready
          </p>
        </div>

        {/* Available Rooms */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#85837B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Vacant Clean</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#141413] mt-2">
            {availableRooms}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Ready for instant allocation
          </p>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Today's Timeline & Operational Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Today's Live Operational Timeline */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8E2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <h2 className="font-editorial text-lg font-bold text-[#141413] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5A880]" />
              Today&apos;s Guest Operational Timeline
            </h2>
            <span className="text-[11px] text-stone-400 font-medium">September 14, 2026</span>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1]">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                IN
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#141413]">Elena Rostova (Suite 103)</span>
                  <span className="text-stone-400 font-mono">15:30</span>
                </div>
                <p className="text-stone-500 mt-0.5">
                  Arrival meet-and-greet confirmed. Anniversary champagne prepared.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1]">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                HK
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#141413]">Suite 104 Turnover Clean</span>
                  <span className="text-amber-700 font-semibold">In Progress</span>
                </div>
                <p className="text-stone-500 mt-0.5">
                  Assigned to Beatrice Fontaine. Linens refreshed & minibar restocked.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1]">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">
                VIP
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#141413]">Alexander Sterling (Villa 201)</span>
                  <span className="text-stone-400 font-mono">11:00</span>
                </div>
                <p className="text-stone-500 mt-0.5">
                  Private yacht excursion departure from harbor jetty.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Revenue & Occupancy Forecast */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8E2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <h2 className="font-editorial text-lg font-bold text-[#141413] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              7-Day Occupancy & Revenue Projection
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              +18.4% vs last week
            </span>
          </div>

          <div className="pt-2">
            {/* Visual Bar Graph */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6">
              {[
                { day: 'Mon', pct: 65, rev: '€3.8k' },
                { day: 'Tue', pct: 78, rev: '€4.6k' },
                { day: 'Wed', pct: 88, rev: '€5.2k' },
                { day: 'Thu', pct: 82, rev: '€4.9k' },
                { day: 'Fri', pct: 100, rev: '€7.4k' },
                { day: 'Sat', pct: 100, rev: '€7.8k' },
                { day: 'Sun', pct: 75, rev: '€4.2k' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#141413] opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.rev}
                  </span>
                  <div
                    className="w-full bg-[#141413] rounded-t-lg group-hover:bg-[#C5A880] transition-colors"
                    style={{ height: `${bar.pct}%` }}
                  />
                  <span className="text-[10px] font-semibold text-stone-500">{bar.day}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-stone-500">
              <span>Avg. Daily Rate (ADR): <strong className="text-black">€{currentHotel.startingPrice}</strong></span>
              <span>RevPAR: <strong className="text-black">€{Math.round(currentHotel.startingPrice * (occupancyRate / 100))}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT RESERVATIONS TABLE */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#141413]">
              Active Property Reservations
            </h2>
            <p className="text-xs text-[#85837B] mt-0.5">
              Strictly filtered to {currentHotel.name} (Tenant ID: {currentHotel.id})
            </p>
          </div>
          <Link
            href="/hotel-admin/reservations"
            className="text-xs font-semibold text-[#141413] hover:text-[#AF8F64] flex items-center gap-1"
          >
            <span>View All Reservations</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Booking ID</th>
                <th className="py-3.5 px-6 font-semibold">Guest Name</th>
                <th className="py-3.5 px-6 font-semibold">Suite Assigned</th>
                <th className="py-3.5 px-6 font-semibold">Dates</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Amount</th>
                <th className="py-3.5 px-6 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1] text-[#575650]">
              {tenantReservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#141413]">{res.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#141413]">{res.guestName}</td>
                  <td className="py-4 px-6">{res.roomNumber || res.roomTypeName}</td>
                  <td className="py-4 px-6">
                    {res.checkInDate} → {res.checkOutDate} ({res.nightsCount}n)
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        res.status === 'checked_in'
                          ? 'bg-blue-100 text-blue-900'
                          : res.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : res.status === 'checked_out'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#141413]">€{res.totalAmount}</td>
                  <td className="py-4 px-6 text-right">
                    {res.status === 'confirmed' ? (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'checked_in')}
                        className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                      >
                        Check-in Guest
                      </button>
                    ) : res.status === 'checked_in' ? (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'checked_out')}
                        className="px-3 py-1 rounded-full bg-stone-800 hover:bg-black text-white font-semibold text-[11px] transition-colors"
                      >
                        Check-out
                      </button>
                    ) : (
                      <span className="text-stone-400 text-[11px]">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
