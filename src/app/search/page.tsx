'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const destQuery = searchParams.get('dest') || '';
  const { hotels, filters, setFilters } = useMarketplace();

  // Local filter states
  const [selectedCity, setSelectedCity] = useState<string>(destQuery);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [highlightedHotelId, setHighlightedHotelId] = useState<string | undefined>(undefined);

  const ALL_AMENITIES = [
    'Infinity Cliffside Pool',
    'Private Beach Club',
    'Michelin-Starred Dining',
    'Holistic Wellness Spa',
    'Caldera Heated Jacuzzi',
    'Championship Golf Course',
    'Whisky Tasting Vault',
  ];

  const ALL_TIERS = ['Ocean Resort', 'Heritage Chateau', 'Boutique'];

  // Filter computation
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // City filter
      if (selectedCity && !hotel.location.city.toLowerCase().includes(selectedCity.toLowerCase()) && !hotel.location.country.toLowerCase().includes(selectedCity.toLowerCase())) {
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
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price_high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'rating') return b.guestRating - a.guestRating;
      return 0; // recommended
    });
  }, [hotels, selectedCity, maxPrice, selectedTiers, selectedStars, selectedAmenities, sortBy]);

  const handleResetFilters = () => {
    setSelectedCity('');
    setMaxPrice(1500);
    setSelectedTiers([]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSortBy('recommended');
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
          className="text-xs font-semibold text-[#85837B] hover:text-[#141413] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Max Price Range */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#141413] mb-2">
          <span>Max Nightly Rate</span>
          <span className="text-[#C5A880] font-bold">Up to €{maxPrice}</span>
        </div>
        <input
          type="range"
          min={300}
          max={1500}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#141413] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#85837B] mt-1">
          <span>€300</span>
          <span>€1,500+</span>
        </div>
      </div>

      {/* Luxury Tier */}
      <div className="pt-4 border-t border-[#F0EAE1]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#85837B] mb-3">
          Property Tier
        </h4>
        <div className="space-y-2">
          {ALL_TIERS.map((tier) => {
            const checked = selectedTiers.includes(tier);
            return (
              <label
                key={tier}
                className="flex items-center gap-2.5 text-xs text-[#575650] hover:text-[#141413] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedTiers(
                      checked ? selectedTiers.filter((t) => t !== tier) : [...selectedTiers, tier]
                    );
                  }}
                  className="rounded border-[#D5CCC0] text-[#141413] focus:ring-[#C5A880]"
                />
                <span>{tier}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Star Rating */}
      <div className="pt-4 border-t border-[#F0EAE1]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#85837B] mb-3">
          Star Rating
        </h4>
        <div className="flex gap-2">
          {[5, 4].map((star) => {
            const active = selectedStars.includes(star);
            return (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setSelectedStars(
                    active ? selectedStars.filter((s) => s !== star) : [...selectedStars, star]
                  );
                }}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#141413] text-white border-[#141413]'
                    : 'bg-white border-[#D5CCC0] text-[#575650] hover:border-[#141413]'
                }`}
              >
                {star} ★ Luxury
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="pt-4 border-t border-[#F0EAE1]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#85837B] mb-3">
          Curated Amenities
        </h4>
        <div className="space-y-2">
          {ALL_AMENITIES.map((amenity) => {
            const checked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs text-[#575650] hover:text-[#141413] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedAmenities(
                      checked
                        ? selectedAmenities.filter((a) => a !== amenity)
                        : [...selectedAmenities, amenity]
                    );
                  }}
                  className="rounded border-[#D5CCC0] text-[#141413] focus:ring-[#C5A880]"
                />
                <span className="line-clamp-1">{amenity}</span>
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

      {/* Top Search Bar Strip */}
      <div className="bg-white border-b border-[#E8E2D8] py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <FloatingSearchBar compact />
        </div>
      </div>

      {/* Main Results Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Results Header & Mobile Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
              Marketplace Discovery
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-0.5">
              {selectedCity ? `Stays in ${selectedCity}` : 'All Verified Sanctuaries'}
            </h1>
            <p className="text-xs text-[#85837B] mt-1">
              Showing {filteredHotels.length} luxury {filteredHotels.length === 1 ? 'property' : 'properties'} matching your criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Sheet Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D5CCC0] bg-white text-xs font-semibold text-[#141413]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Filters</span>
            </button>

            {/* Mobile Map / List Toggle */}
            <div className="lg:hidden flex rounded-full border border-[#D5CCC0] p-0.5 bg-white">
              <button
                onClick={() => setMobileView('list')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  mobileView === 'list' ? 'bg-[#141413] text-white' : 'text-[#575650]'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileView('map')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  mobileView === 'map' ? 'bg-[#141413] text-white' : 'text-[#575650]'
                }`}
              >
                Map
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-[#85837B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#D5CCC0] rounded-full px-3 py-2 text-xs font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3-Column Desktop Layout: FILTERS | HOTEL RESULTS | INTERACTIVE MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* LEFT: Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E8E2D8] h-fit sticky top-28 shadow-xs">
            {FilterPanel}
          </aside>

          {/* CENTER: Hotel Results */}
          <div
            className={`lg:col-span-5 space-y-6 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E2D8]">
                <Sparkles className="w-8 h-8 text-[#C5A880] mx-auto mb-3" />
                <h3 className="font-editorial text-lg font-bold text-[#141413]">
                  No sanctuaries matched your filters
                </h3>
                <p className="text-xs text-[#85837B] mt-1.5 max-w-sm mx-auto">
                  Try broadening your price range or clearing amenity tags to see all verified properties.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2 rounded-full bg-[#141413] text-white text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onMouseEnter={() => setHighlightedHotelId(hotel.id)}
                  className={`transition-transform ${
                    highlightedHotelId === hotel.id ? 'ring-2 ring-[#C5A880] rounded-3xl' : ''
                  }`}
                >
                  <HotelCard hotel={hotel} />
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Interactive Map */}
          <div
            className={`lg:col-span-4 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-28">
              <InteractiveMap
                hotels={filteredHotels}
                selectedHotelId={highlightedHotelId}
                onSelectHotel={(id) => setHighlightedHotelId(id)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <h3 className="font-editorial text-lg font-bold text-[#141413]">Filter Properties</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-4">{FilterPanel}</div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D8]">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#141413] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                View {filteredHotels.length} Stays
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold">Loading luxury stays...</div>}>
      <SearchContent />
    </Suspense>
  );
}
