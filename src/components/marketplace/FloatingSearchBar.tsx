'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import { MapPin, Calendar, Users, Search, ChevronDown, Sparkles } from 'lucide-react';

export function FloatingSearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { filters, setFilters } = useMarketplace();

  const [destination, setDestination] = useState(filters.destination);
  const [checkIn, setCheckIn] = useState(filters.checkInDate);
  const [checkOut, setCheckOut] = useState(filters.checkOutDate);
  const [adults, setAdults] = useState(filters.adults);
  const [childrenCount, setChildrenCount] = useState(filters.children);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isDestPickerOpen, setIsDestPickerOpen] = useState(false);

  const POPULAR_DESTINATIONS = [
    { city: 'Nice', country: 'France', label: 'French Riviera & Monaco' },
    { city: 'Santorini', country: 'Greece', label: 'Cyclades Islands' },
    { city: 'Mallorca', country: 'Spain', label: 'Balearic Islands' },
    { city: 'Inverness', country: 'United Kingdom', label: 'Scottish Highlands' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      destination,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children: childrenCount,
    }));
    const query = new URLSearchParams();
    if (destination) query.set('dest', destination);
    if (checkIn) query.set('checkIn', checkIn);
    if (checkOut) query.set('checkOut', checkOut);
    query.set('adults', adults.toString());
    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto'}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white border border-[#E8E2D8] rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1] gap-2 sm:gap-0"
      >
        {/* DESTINATION */}
        <div className="relative flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full transition-colors cursor-pointer group">
          <div
            onClick={() => {
              setIsDestPickerOpen(!isDestPickerOpen);
              setIsGuestPickerOpen(false);
            }}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#85837B]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              Where
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Any luxury destination"
              className="w-full bg-transparent text-sm font-semibold text-[#141413] placeholder-stone-400 focus:outline-hidden cursor-pointer"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isDestPickerOpen && (
            <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl p-3 z-30 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#85837B] px-2 pb-2 mb-1 border-b border-[#F0EAE1]">
                Featured Regions
              </div>
              {POPULAR_DESTINATIONS.map((d) => (
                <button
                  key={d.city}
                  type="button"
                  onClick={() => {
                    setDestination(d.city);
                    setIsDestPickerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF8F5] flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-semibold text-[#141413] block">
                      {d.city}, {d.country}
                    </span>
                    <span className="text-[11px] text-[#85837B]">{d.label}</span>
                  </div>
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CHECK IN */}
        <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#85837B]">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            Check in
          </div>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
          />
        </div>

        {/* CHECK OUT */}
        <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#85837B]">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            Check out
          </div>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
          />
        </div>

        {/* GUESTS */}
        <div className="relative flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full transition-colors cursor-pointer">
          <div
            onClick={() => {
              setIsGuestPickerOpen(!isGuestPickerOpen);
              setIsDestPickerOpen(false);
            }}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#85837B]">
              <Users className="w-3.5 h-3.5 text-[#C5A880]" />
              Guests
            </div>
            <div className="text-sm font-semibold text-[#141413] flex items-center justify-between">
              <span>
                {adults} {adults === 1 ? 'adult' : 'adults'}
                {childrenCount > 0 ? `, ${childrenCount} kids` : ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {/* Guest Selector popover */}
          {isGuestPickerOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl p-4 z-30 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between py-2 border-b border-[#F0EAE1]">
                <div>
                  <div className="text-xs font-semibold text-[#141413]">Adults</div>
                  <div className="text-[11px] text-[#85837B]">Ages 13+</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 disabled:opacity-30 hover:bg-stone-100 flex items-center justify-center text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 8}
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 mt-1">
                <div>
                  <div className="text-xs font-semibold text-[#141413]">Children</div>
                  <div className="text-[11px] text-[#85837B]">Ages 0-12</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 disabled:opacity-30 hover:bg-stone-100 flex items-center justify-center text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{childrenCount}</span>
                  <button
                    type="button"
                    disabled={childrenCount >= 6}
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGuestPickerOpen(false)}
                className="w-full mt-3 py-1.5 rounded-lg bg-[#141413] text-white text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <div className="p-1 sm:pl-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-xl sm:rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            <Search className="w-4 h-4 text-[#C5A880]" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
