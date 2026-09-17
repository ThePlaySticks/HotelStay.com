'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingSearchBar } from '@/components/marketplace/FloatingSearchBar';
import { HotelCard } from '@/components/marketplace/HotelCard';
import { InteractiveMap } from '@/components/marketplace/InteractiveMap';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  SlidersHorizontal,
  Map as MapIcon,
  ListFilter,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
  Building2,
  ArrowRight,
  Compass,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const destQuery = searchParams.get('dest') || '';
  const { approvedHotels, destinations } = useMarketplace();

  // Local filter states
  const [selectedCity, setSelectedCity] = useState<string>(destQuery);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [highlightedHotelId, setHighlightedHotelId] = useState<string | undefined>(undefined);

  const ALL_AMENITIES = [
    'Infinity Cliffside Pool',
    'Rooftop Ocean Infinity Pool',
    'Private Beach Club',
    'Michelin-Starred Dining',
    'Holistic Thermal Spa & Hammam',
    'Caldera Heated Jacuzzi',
    '24/7 Dedicated Butler Service',
    'Chauffeured Armored Escort Available',
    'Subterranean Vintage Wine Vault',
  ];

  const ALL_TIERS = ['5-Star Luxury', 'Ocean Resort', 'Heritage Chateau', 'Boutique'];

  // Filter computation
  const filteredHotels = useMemo(() => {
    return approvedHotels
      .filter((hotel) => {
        // City / Country filter
        if (
          selectedCity &&
          !hotel.location.city.toLowerCase().includes(selectedCity.toLowerCase()) &&
          !hotel.location.country.toLowerCase().includes(selectedCity.toLowerCase())
        ) {
          return false;
        }
        // Price filter
        if (hotel.startingPrice > maxPrice) {
          return false;
        }
        // Tier filter
        if (selectedTiers.length > 0 && !selectedTiers.includes(hotel.luxuryTier)) {
          return false;
        }
        // Stars filter
        if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating)) {
          return false;
        }
        // Amenities filter
        if (selectedAmenities.length > 0 && !selectedAmenities.some((a) => hotel.amenities.includes(a))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price_high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'rating') return b.guestRating - a.guestRating;
        return 0; // recommended
      });
  }, [approvedHotels, selectedCity, maxPrice, selectedTiers, selectedStars, selectedAmenities, sortBy]);

  const handleResetFilters = () => {
    setSelectedCity('');
    setMaxPrice(2500);
    setSelectedTiers([]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSortBy('recommended');
  };

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
        <h3 className="font-editorial text-lg font-bold text-[#141413] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
          Refine Results
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-[#85837B] hover:text-[#141413] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Destination Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#141413] mb-2">Destination / Region</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
        >
          <option value="">All Global Destinations</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.city}>
              {d.city}, {d.country}
            </option>
          ))}
        </select>
      </div>

      {/* Max Price Range */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#141413] mb-2">
          <span>Max Nightly Rate</span>
          <span className="text-[#AF8F64] font-bold">Up to ${maxPrice}</span>
        </div>
        <input
          type="range"
          min={300}
          max={2500}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#141413] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#85837B] mt-1 font-mono">
          <span>$300</span>
          <span>$2,500+</span>
        </div>
      </div>

      {/* Luxury Tier */}
      <div>
        <label className="block text-xs font-semibold text-[#141413] mb-2.5">Sanctuary Collection</label>
        <div className="space-y-1.5">
          {ALL_TIERS.map((tier) => {
            const active = selectedTiers.includes(tier);
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#141413] text-white'
                    : 'bg-[#FAF8F5] text-[#575650] hover:bg-[#F0EAE1]'
                }`}
              >
                <span>{tier}</span>
                {active && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-xs font-semibold text-[#141413] mb-2.5">Star Rating</label>
        <div className="flex gap-2">
          {[5, 4].map((stars) => {
            const active = selectedStars.includes(stars);
            return (
              <button
                key={stars}
                onClick={() => toggleStar(stars)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  active
                    ? 'bg-[#141413] text-white border-[#141413]'
                    : 'bg-white border-[#E8E2D8] text-[#575650] hover:border-[#D5CCC0]'
                }`}
              >
                <span>{stars} Stars</span>
                {active && <Check className="w-3 h-3 text-[#C5A880]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Amenities */}
      <div>
        <label className="block text-xs font-semibold text-[#141413] mb-2.5">Curated Amenities</label>
        <div className="space-y-1.5">
          {ALL_AMENITIES.map((amenity) => {
            const active = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs text-[#575650] hover:text-[#141413] cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded-md border-[#D5CCC0] text-[#141413] focus:ring-0 w-3.5 h-3.5 accent-[#141413]"
                />
                <span className="leading-tight">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* SEARCH HEADER */}
      <section className="bg-white border-b border-[#E8E2D8] py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          <FloatingSearchBar compact />
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E8E2D8] gap-4">
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
              {selectedCity ? `Stays in ${selectedCity}` : 'All Verified Sanctuaries'}
            </h1>
            <p className="text-xs text-[#85837B] mt-1">
              Showing <span className="font-bold text-[#141413]">{filteredHotels.length}</span> verified properties meeting criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 text-xs font-semibold text-[#575650]">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#E8E2D8] rounded-full px-4 py-2 text-xs font-semibold text-[#141413] focus:outline-hidden cursor-pointer shadow-2xs"
              >
                <option value="recommended">HotelStay Curated</option>
                <option value="rating">Highest Guest Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141413] text-white text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
              Filters
            </button>

            {/* Mobile View Toggle */}
            <div className="sm:hidden flex rounded-full border border-[#E8E2D8] bg-white p-1">
              <button
                onClick={() => setMobileView('list')}
                className={`p-1.5 rounded-full ${mobileView === 'list' ? 'bg-[#141413] text-white' : 'text-stone-500'}`}
              >
                <ListFilter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView('map')}
                className={`p-1.5 rounded-full ${mobileView === 'map' ? 'bg-[#141413] text-white' : 'text-stone-500'}`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-COLUMN GRID (Filters + Hotel Listings / Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E8E2D8] shadow-xs sticky top-28">
            {FilterPanel}
          </aside>

          {/* HOTEL LISTINGS & MAP */}
          <div className="lg:col-span-9 space-y-6">
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C5A880] flex items-center justify-center mx-auto">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                  {selectedCity ? `Hotels coming soon to ${selectedCity}` : 'No matching sanctuaries found'}
                </h3>
                <p className="text-xs text-[#575650] max-w-md mx-auto leading-relaxed">
                  We are actively expanding our curated stays in this region. Try adjusting your filters or explore other destinations.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <Link
                    href="/destinations"
                    className="px-6 py-2.5 rounded-full border border-[#D5CCC0] bg-white text-xs font-bold uppercase tracking-wider text-[#141413] hover:bg-[#FAF8F5]"
                  >
                    View All Destinations
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onMouseEnter={() => setHighlightedHotelId(hotel.id)}
                    onMouseLeave={() => setHighlightedHotelId(undefined)}
                  >
                    <HotelCard hotel={hotel} />
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Map Visual */}
            {filteredHotels.length > 0 && (
              <div className="mt-12 bg-white p-6 rounded-3xl border border-[#E8E2D8] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#141413]">Interactive Regional Map</h3>
                    <p className="text-xs text-[#85837B]">Explore coordinates and location topography</p>
                  </div>
                </div>
                <InteractiveMap hotels={filteredHotels} highlightedHotelId={highlightedHotelId} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <h3 className="font-editorial text-xl font-bold text-[#141413]">Filter Properties</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3.5 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Show {filteredHotels.length} Results
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
