'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, BedDouble } from 'lucide-react';

export default function HotelCalendarPage() {
  const { currentPersona } = useAuth();
  const { hotels, rooms, reservations } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0] || null;
  const tenantRooms = rooms.filter((r) => r.hotelId === currentHotelId);
  const tenantReservations = reservations.filter((r) => r.hotelId === currentHotelId);

  // Generate 14 days from Sep 12 to Sep 25, 2026
  const dates = [
    { label: 'Sat 12', iso: '2026-09-12' },
    { label: 'Sun 13', iso: '2026-09-13' },
    { label: 'Mon 14', iso: '2026-09-14', today: true },
    { label: 'Tue 15', iso: '2026-09-15' },
    { label: 'Wed 16', iso: '2026-09-16' },
    { label: 'Thu 17', iso: '2026-09-17' },
    { label: 'Fri 18', iso: '2026-09-18' },
    { label: 'Sat 19', iso: '2026-09-19' },
    { label: 'Sun 20', iso: '2026-09-20' },
    { label: 'Mon 21', iso: '2026-09-21' },
    { label: 'Tue 22', iso: '2026-09-22' },
    { label: 'Wed 23', iso: '2026-09-23' },
    { label: 'Thu 24', iso: '2026-09-24' },
    { label: 'Fri 25', iso: '2026-09-25' },
  ];

  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Live Inventory Matrix
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Availability & Occupancy Calendar
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Real-time room status and scheduled reservations for {currentHotel?.name || 'Sanctuary'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[#D5CCC0] p-1 bg-white">
            <button className="p-1 rounded-full hover:bg-stone-100 text-stone-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 text-[#141413]">September 2026</span>
            <button className="p-1 rounded-full hover:bg-stone-100 text-stone-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-2xs">
        <span className="font-semibold text-stone-700">Status Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-600" />
          <span className="text-stone-600">Checked In</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span className="text-stone-600">Confirmed Booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-stone-600">Cleaning / Turnover</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-stone-400" />
          <span className="text-stone-600">Maintenance Block</span>
        </div>
      </div>

      {/* CALENDAR TIMELINE MATRIX */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8E2D8]">
                <th className="p-4 text-left font-bold text-[#141413] w-48 sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#E8E2D8]">
                  Room & Suite
                </th>
                {dates.map((d) => (
                  <th
                    key={d.iso}
                    className={`p-3 text-center min-w-[76px] font-semibold ${
                      d.today ? 'bg-[#C5A880]/20 text-[#141413] font-bold ring-2 ring-[#C5A880] inset-0' : 'text-stone-600'
                    }`}
                  >
                    {d.label}
                    {d.today && <span className="block text-[9px] uppercase tracking-wider text-[#C5A880] font-bold">Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {tenantRooms.map((room) => {
                return (
                  <tr key={room.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                    {/* Room title header */}
                    <td className="p-4 font-semibold text-[#141413] sticky left-0 bg-white z-10 border-r border-[#E8E2D8]">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{room.roomNumber}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-normal block truncate max-w-[150px]">
                        {room.roomTypeName}
                      </span>
                    </td>

                    {/* Date cells */}
                    {dates.map((d) => {
                      // Check if there is an active reservation overlapping this date
                      const res = tenantReservations.find(
                        (r) =>
                          (r.roomNumber === room.roomNumber || (room.currentReservationId && r.id === room.currentReservationId)) &&
                          d.iso >= r.checkInDate &&
                          d.iso < r.checkOutDate &&
                          r.status !== 'cancelled'
                      );

                      const isMaintenance = room.status === 'maintenance';
                      const isCleaning = room.status === 'cleaning' && d.today;

                      return (
                        <td
                          key={d.iso}
                          className={`p-1 text-center border-r border-[#F0EAE1] h-14 ${
                            d.today ? 'bg-[#FAF8F5]' : ''
                          }`}
                        >
                          {res ? (
                            <button
                              onClick={() => setSelectedBlock(res)}
                              className={`w-full h-10 rounded-lg px-2 text-[10px] font-bold text-white flex items-center justify-center truncate shadow-xs transition-transform hover:scale-105 ${
                                res.status === 'checked_in'
                                  ? 'bg-blue-600'
                                  : 'bg-emerald-600'
                              }`}
                            >
                              {res.guestName.split(' ')[1] || res.guestName}
                            </button>
                          ) : isMaintenance ? (
                            <div className="w-full h-10 rounded-lg bg-stone-300 text-stone-700 text-[10px] font-semibold flex items-center justify-center">
                              Maint.
                            </div>
                          ) : isCleaning ? (
                            <div className="w-full h-10 rounded-lg bg-amber-200 text-amber-900 text-[10px] font-semibold flex items-center justify-center">
                              Clean
                            </div>
                          ) : (
                            <div className="w-full h-full min-h-[36px] rounded hover:bg-emerald-50/50 cursor-pointer flex items-center justify-center text-[10px] text-stone-300 hover:text-emerald-700">
                              +
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Block Quick Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E8E2D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <h3 className="font-editorial text-lg font-bold text-[#141413]">
                Reservation Block
              </h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-stone-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2 text-[#575650]">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Guest</span>
                <span className="font-bold text-black text-sm">{selectedBlock.guestName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Booking Reference</span>
                <span className="font-mono font-bold text-[#C5A880]">{selectedBlock.id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Dates</span>
                <span>{selectedBlock.checkInDate} to {selectedBlock.checkOutDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Status</span>
                <span className="font-bold text-emerald-700 capitalize">{selectedBlock.status}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBlock(null)}
              className="w-full py-2 bg-[#141413] text-white text-xs font-semibold rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
