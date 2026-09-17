'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronDown,
  Sparkles,
  Plane,
  Car,
  Compass,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function FloatingSearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { filters, setFilters, destinations } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'cars' | 'experiences'>('hotels');

  // Hotels State
  const [destination, setDestination] = useState(filters.destination);
  const [checkIn, setCheckIn] = useState(filters.checkInDate);
  const [checkOut, setCheckOut] = useState(filters.checkOutDate);
  const [adults, setAdults] = useState(filters.adults);
  const [childrenCount, setChildrenCount] = useState(filters.children);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isDestPickerOpen, setIsDestPickerOpen] = useState(false);

  // Flights State
  const [flightFrom, setFlightFrom] = useState('London (LHR)');
  const [flightTo, setFlightTo] = useState('Lagos (LOS)');
  const [flightDeparture, setFlightDeparture] = useState('2026-10-10');
  const [flightReturn, setFlightReturn] = useState('2026-10-24');
  const [flightClass, setFlightClass] = useState('Business');

  // Cars State
  const [carService, setCarService] = useState<'driver' | 'rental' | 'suv'>('driver');
  const [carCity, setCarCity] = useState('Lagos');
  const [carPickupDate, setCarPickupDate] = useState('2026-09-24');

  // Experiences State
  const [expCategory, setExpCategory] = useState<'all' | 'tours' | 'honeymoon' | 'events'>('all');
  const [expCity, setExpCity] = useState('Santorini');

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      category: 'hotels',
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

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services/flights?from=${encodeURIComponent(flightFrom)}&to=${encodeURIComponent(flightTo)}&date=${flightDeparture}&class=${flightClass}`);
  };

  const handleCarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services/cars?service=${carService}&city=${encodeURIComponent(carCity)}&date=${carPickupDate}`);
  };

  const handleExperienceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services/dmc?cat=${expCategory}&city=${encodeURIComponent(expCity)}`);
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto'}`}>
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 mb-3 px-2">
        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'hotels'
              ? 'bg-white text-[#141413] shadow-md border border-[#E8E2D8]'
              : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10'
          }`}
        >
          <Building2 className={`w-3.5 h-3.5 ${activeTab === 'hotels' ? 'text-[#C5A880]' : 'text-white'}`} />
          <span>Hotels & Resorts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'flights'
              ? 'bg-white text-[#141413] shadow-md border border-[#E8E2D8]'
              : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10'
          }`}
        >
          <Plane className={`w-3.5 h-3.5 ${activeTab === 'flights' ? 'text-[#C5A880]' : 'text-white'}`} />
          <span>Flights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cars')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'cars'
              ? 'bg-white text-[#141413] shadow-md border border-[#E8E2D8]'
              : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10'
          }`}
        >
          <Car className={`w-3.5 h-3.5 ${activeTab === 'cars' ? 'text-[#C5A880]' : 'text-white'}`} />
          <span>Cars & Chauffeur</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'experiences'
              ? 'bg-white text-[#141413] shadow-md border border-[#E8E2D8]'
              : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${activeTab === 'experiences' ? 'text-[#C5A880]' : 'text-white'}`} />
          <span>Experiences & DMC</span>
        </button>
      </div>

      {/* HOTELS SEARCH FORM */}
      {activeTab === 'hotels' && (
        <form
          onSubmit={handleHotelSearch}
          className="bg-white border border-[#E8E2D8] rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1] gap-2 sm:gap-0 animate-in fade-in duration-300"
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
                Destination
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Lagos, Paris, Dubai, Santorini..."
                className="w-full bg-transparent text-sm font-semibold text-[#141413] placeholder-stone-400 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {isDestPickerOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-[#E8E2D8] rounded-2xl shadow-2xl p-3 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[#85837B] px-2 pb-2 mb-1 border-b border-[#F0EAE1]">
                  Featured Destinations
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {destinations.map((d) => (
                    <button
                      key={d.id}
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
                        <span className="text-[10px] text-[#85837B]">{d.headline}</span>
                      </div>
                      <Sparkles className="w-3 h-3 text-[#C5A880] shrink-0" />
                    </button>
                  ))}
                </div>
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
              className="w-full sm:w-auto px-7 py-3.5 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-xl sm:rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C5A880]" />
              <span>Search</span>
            </button>
          </div>
        </form>
      )}

      {/* FLIGHTS SEARCH FORM */}
      {activeTab === 'flights' && (
        <form
          onSubmit={handleFlightSearch}
          className="bg-white border border-[#E8E2D8] rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1] gap-2 sm:gap-0 animate-in fade-in duration-300"
        >
          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Departure Airport</div>
            <input
              type="text"
              value={flightFrom}
              onChange={(e) => setFlightFrom(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden"
              placeholder="e.g. London (LHR)"
            />
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Destination Airport</div>
            <input
              type="text"
              value={flightTo}
              onChange={(e) => setFlightTo(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden"
              placeholder="e.g. Lagos (LOS), Dubai (DXB)"
            />
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Departure Date</div>
            <input
              type="date"
              value={flightDeparture}
              onChange={(e) => setFlightDeparture(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden"
            />
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Cabin Class</div>
            <select
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
            >
              <option value="First Class Suite">First Class Suite</option>
              <option value="Business">Business Class</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Economy">Economy</option>
            </select>
          </div>

          <div className="p-1 sm:pl-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-xl sm:rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Plane className="w-4 h-4 text-[#C5A880]" />
              <span>Find Routes</span>
            </button>
          </div>
        </form>
      )}

      {/* CARS SEARCH FORM */}
      {activeTab === 'cars' && (
        <form
          onSubmit={handleCarSearch}
          className="bg-white border border-[#E8E2D8] rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1] gap-2 sm:gap-0 animate-in fade-in duration-300"
        >
          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Service Type</div>
            <select
              value={carService}
              onChange={(e) => setCarService(e.target.value as any)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
            >
              <option value="driver">Private Chauffeur & Driver</option>
              <option value="suv">Armored / VIP Luxury SUV</option>
              <option value="rental">Self-Drive Luxury Sports/Sedan</option>
            </select>
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">City / Destination</div>
            <select
              value={carCity}
              onChange={(e) => setCarCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
            >
              <option value="Lagos">Lagos, Nigeria</option>
              <option value="Abuja">Abuja, Nigeria</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Paris">Paris, France</option>
              <option value="Nice">Nice / Côte d'Azur</option>
            </select>
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Pickup Date</div>
            <input
              type="date"
              value={carPickupDate}
              onChange={(e) => setCarPickupDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden"
            />
          </div>

          <div className="p-1 sm:pl-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-xl sm:rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Car className="w-4 h-4 text-[#C5A880]" />
              <span>Explore Fleet</span>
            </button>
          </div>
        </form>
      )}

      {/* EXPERIENCES SEARCH FORM */}
      {activeTab === 'experiences' && (
        <form
          onSubmit={handleExperienceSearch}
          className="bg-white border border-[#E8E2D8] rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1] gap-2 sm:gap-0 animate-in fade-in duration-300"
        >
          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Experience Type</div>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as any)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Experiences</option>
              <option value="tours">Curated Private Tours & Safaris</option>
              <option value="honeymoon">Bespoke Honeymoon Retreats</option>
              <option value="events">Events & Destination Weddings</option>
            </select>
          </div>

          <div className="flex-1 px-4 py-2 hover:bg-[#FAF8F5] rounded-2xl sm:rounded-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#85837B]">Destination</div>
            <select
              value={expCity}
              onChange={(e) => setExpCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
            >
              <option value="Lagos">Lagos, Nigeria</option>
              <option value="Santorini">Santorini, Greece</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Inverness">Scottish Highlands, UK</option>
            </select>
          </div>

          <div className="p-1 sm:pl-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-xl sm:rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C5A880]" />
              <span>Discover Experiences</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
