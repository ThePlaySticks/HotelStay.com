'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { IndividualRoom } from '@/lib/types';
import { BedDouble, CheckCircle2, Clock, AlertTriangle, Brush, Wrench, ShieldAlert } from 'lucide-react';

export default function RoomsManagementPage() {
  const { currentPersona } = useAuth();
  const { hotels, rooms, updateRoomStatus } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0] || null;
  const tenantRooms = rooms.filter((r) => r.hotelId === currentHotelId);

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRooms = tenantRooms.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  const STATUS_STYLES = {
    available: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, label: 'Available (Clean)' },
    occupied: { bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: BedDouble, label: 'Occupied' },
    reserved: { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: Clock, label: 'Reserved' },
    cleaning: { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Brush, label: 'Cleaning in Progress' },
    maintenance: { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: Wrench, label: 'Under Maintenance' },
    out_of_service: { bg: 'bg-stone-100 text-stone-700 border-stone-300', icon: ShieldAlert, label: 'Out of Service' },
  };

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Physical Inventory Control
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Rooms & Status Grid
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Real-time physical status tracking for {currentHotel?.name || 'Sanctuary'}. Total: {tenantRooms.length} keys.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#D5CCC0] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#141413] focus:outline-hidden"
          >
            <option value="all">All Rooms ({tenantRooms.length})</option>
            <option value="available">Available Clean</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const style = STATUS_STYLES[room.status] || STATUS_STYLES.available;
          const Icon = style.icon;

          return (
            <div
              key={room.id}
              className="bg-white border border-[#E8E2D8] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-xl font-bold text-[#141413]">
                      {room.roomNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
                      Floor {room.floor}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.bg}`}
                  >
                    <Icon className="w-3 h-3" />
                    {style.label}
                  </span>
                </div>

                <div className="text-xs text-[#575650] mt-2">
                  <div className="font-semibold text-[#141413]">{room.roomTypeName}</div>
                  {room.currentGuestName && (
                    <div className="mt-1 text-blue-700 font-medium">
                      Current Guest: {room.currentGuestName} ({room.currentReservationId})
                    </div>
                  )}
                  {room.notes && (
                    <div className="mt-1 text-stone-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-[11px]">
                      {room.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Switcher */}
              <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-stone-400">Set Status:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateRoomStatus(room.id, 'available')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      room.status === 'available'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'cleaning')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      room.status === 'cleaning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    Cleaning
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'maintenance')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      room.status === 'maintenance'
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    Maint.
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
