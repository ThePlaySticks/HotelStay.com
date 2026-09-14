'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Reservation } from '@/lib/types';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  CreditCard,
  User,
  Calendar,
  Building2,
  FileText,
} from 'lucide-react';

export default function ReservationsManagementPage() {
  const { currentPersona } = useAuth();
  const { hotels, reservations, updateReservationStatus, showToast } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0] || null;

  // Strictly tenant isolated reservations
  const tenantReservations = reservations.filter((r) => r.hotelId === currentHotelId);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerReservation, setDrawerReservation] = useState<Reservation | null>(null);

  const filteredReservations = tenantReservations.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = 'Booking ID,Guest Name,Email,Room,Check In,Check Out,Nights,Total Amount,Status\n';
    const rows = filteredReservations
      .map(
        (r) =>
          `"${r.id}","${r.guestName}","${r.guestEmail}","${r.roomTypeName}","${r.checkInDate}","${r.checkOutDate}","${r.nightsCount}","${r.totalAmount}","${r.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentHotel?.slug || 'export'}-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast({ title: 'Export Generated', description: 'Reservations exported to CSV.', type: 'info' });
  };

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Property Operations
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Reservation Management
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Managing reservations for {currentHotel?.name || 'Sanctuary'}. Total active: {tenantReservations.length} records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-full border border-[#D5CCC0] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guest Name, Booking ID, Suite..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-xs text-[#141413] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413] focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Data Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Booking ID</th>
                <th className="py-3.5 px-6 font-semibold">Guest</th>
                <th className="py-3.5 px-6 font-semibold">Assigned Room</th>
                <th className="py-3.5 px-6 font-semibold">Check-In</th>
                <th className="py-3.5 px-6 font-semibold">Check-Out</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Amount</th>
                <th className="py-3.5 px-6 font-semibold">Payment</th>
                <th className="py-3.5 px-6 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1] text-[#575650]">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    No reservations matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr
                    key={res.id}
                    onClick={() => setDrawerReservation(res)}
                    className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-[#141413]">{res.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#141413]">{res.guestName}</div>
                      <div className="text-[11px] text-[#85837B]">{res.guestEmail}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#141413]">
                      {res.roomNumber || res.roomTypeName}
                    </td>
                    <td className="py-4 px-6">{res.checkInDate}</td>
                    <td className="py-4 px-6">{res.checkOutDate}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="py-4 px-6">
                      <span className="text-emerald-700 font-semibold text-[11px]">Paid Online</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-[#C5A880] hover:text-black font-semibold text-xs underline">
                        View Drawer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER RESERVATION DETAIL DRAWER */}
      {drawerReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full p-6 sm:p-8 overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#AF8F64] font-bold">
                    Reservation Lifecycle Detail
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#141413] mt-0.5">
                    {drawerReservation.id}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerReservation(null)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guest Profile Details */}
              <div className="mt-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <h4 className="font-bold text-[#141413] flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#C5A880]" />
                    Guest Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[#575650]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Name</span>
                      <span className="font-semibold text-black">{drawerReservation.guestName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Phone</span>
                      <span>{drawerReservation.guestPhone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Email</span>
                      <span>{drawerReservation.guestEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Stay Itinerary */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <h4 className="font-bold text-[#141413] flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#C5A880]" />
                    Stay Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[#575650]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-in</span>
                      <span className="font-semibold text-black">{drawerReservation.checkInDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-out</span>
                      <span className="font-semibold text-black">{drawerReservation.checkOutDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Suite Plan</span>
                      <span className="font-medium text-black">{drawerReservation.roomTypeName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Room Assigned</span>
                      <span className="font-medium text-black">{drawerReservation.roomNumber || 'Auto-assign on arrival'}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Ledger Breakdown */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <h4 className="font-bold text-[#141413] flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                    Financial Audit Ledger
                  </h4>
                  <div className="space-y-1.5 text-[#575650]">
                    <div className="flex justify-between">
                      <span>Room Base Subtotal</span>
                      <span>€{drawerReservation.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extras & Enhancements</span>
                      <span>€{drawerReservation.extrasTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees (12%)</span>
                      <span>€{drawerReservation.taxesAndFees}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-black text-sm">
                      <span>Total Settled</span>
                      <span className="text-emerald-700">€{drawerReservation.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {drawerReservation.specialRequests && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 block mb-1">
                      Guest Notes & Special Requests:
                    </span>
                    <p className="text-amber-800">{drawerReservation.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Action Controls */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-col gap-2">
              {drawerReservation.status === 'confirmed' && (
                <button
                  onClick={() => {
                    updateReservationStatus(drawerReservation.id, 'checked_in');
                    setDrawerReservation({ ...drawerReservation, status: 'checked_in' });
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Mark as Checked In
                </button>
              )}
              {drawerReservation.status === 'checked_in' && (
                <button
                  onClick={() => {
                    updateReservationStatus(drawerReservation.id, 'checked_out');
                    setDrawerReservation({ ...drawerReservation, status: 'checked_out' });
                  }}
                  className="w-full py-3 bg-[#141413] hover:bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Mark as Checked Out
                </button>
              )}
              {drawerReservation.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    updateReservationStatus(drawerReservation.id, 'cancelled');
                    setDrawerReservation({ ...drawerReservation, status: 'cancelled' });
                  }}
                  className="w-full py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-full text-xs font-semibold"
                >
                  Cancel Reservation (Auto Refund)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
