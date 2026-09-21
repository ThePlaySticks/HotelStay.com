'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  Building2,
  Palmtree,
  Waves,
  Compass,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
} from 'lucide-react';

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destQuery = searchParams.get('dest') || '';
  const { approvedHotels, destinations } = useMarketplace();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(destQuery);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hotels' | 'vacation_spots'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Filtered onboarded hotels
  const filteredHotels = useMemo(() => {
    return approvedHotels.filter((hotel) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        hotel.name.toLowerCase().includes(q) ||
        hotel.location.city.toLowerCase().includes(q) ||
        hotel.location.country.toLowerCase().includes(q)
      );
    });
  }, [approvedHotels, searchQuery]);

  // Filtered vacation spots & beach houses (curated scenic destinations that don't need onboarding)
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        dest.city.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.headline.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q)
      );
    });
  }, [destinations, searchQuery]);

  const handleBookHotelClick = (e: React.MouseEvent, hotelSlug: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'signup',
        role: 'guest',
        title: 'Sign Up to Book Suite',
        description: 'Create an account or sign in to complete your reservation and payments.',
        redirectUrl: `/hotels/${hotelSlug}`,
      });
    } else {
      router.push(`/hotels/${hotelSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* =========================================================================
            BEUI MINIMALIST DISCOVER HEADER & SEARCH BAR
            ========================================================================= */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#575650]">
              Curated Travel Discovery
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413]">
            Discover Exceptional Stays & Sanctuaries
          </h1>

          <p className="text-sm sm:text-base text-[#575650] leading-relaxed">
            Explore verified onboarded luxury hotels and scenic vacation spots across the world’s most coveted coastlines and retreats.
          </p>

          {/* BeUI Sleek Search Box */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-full border border-[#E8E2D8] shadow-lg p-2 hover:border-[#C5A880] transition-colors">
              <div className="pl-4 text-[#85837B]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, hotel name, or beach retreat..."
                className="w-full px-3.5 py-2.5 text-sm bg-transparent placeholder-stone-400 focus:outline-none text-[#141413]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 text-xs font-semibold text-stone-400 hover:text-black cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            BEUI CATEGORY PILL FILTER BAR
            ========================================================================= */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#141413] text-white shadow-md'
                : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
            }`}
          >
            All Explorations ({filteredHotels.length + filteredDestinations.length})
          </button>
          <button
            onClick={() => setCategoryFilter('hotels')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              categoryFilter === 'hotels'
                ? 'bg-[#141413] text-white shadow-md'
                : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Onboarded Hotels ({filteredHotels.length})</span>
          </button>
          <button
            onClick={() => setCategoryFilter('vacation_spots')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              categoryFilter === 'vacation_spots'
                ? 'bg-[#141413] text-white shadow-md'
                : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vacation Spots & Beach Houses ({filteredDestinations.length})</span>
          </button>
        </div>

        {/* =========================================================================
            SECTION 1: ONBOARDED REAL HOTELS (Created via Operate)
            ========================================================================= */}
        {(categoryFilter === 'all' || categoryFilter === 'hotels') && (
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D8] gap-2">
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-[#C5A880]">
                  Verified Hospitality
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                  Onboarded Luxury Hotels & Guesthouses
                </h2>
              </div>
              <span className="text-xs text-[#85837B] font-semibold">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'Property Available' : 'Properties Available'}
              </span>
            </div>

            {filteredHotels.length === 0 ? (
              /* BeUI Host Call-to-action Banner when no hotels are onboarded */
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E2D8] text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#C5A880]">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                  No Onboarded Hotels Yet
                </h3>
                <p className="text-sm text-[#575650] max-w-lg mx-auto leading-relaxed">
                  Hotels only appear here once onboarded by real property owners and hosts. Explore scenic vacation spots below, or list your hotel to claim your custom domain.
                </p>
                <div className="pt-2">
                  <Link
                    href="/hotel-admin"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                  >
                    <span>Onboard a Hotel in Operate</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D8] hover:border-[#C5A880]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Photo */}
                      <Link href={`/hotels/${hotel.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-100">
                        <Image
                          src={hotel.heroImage}
                          alt={hotel.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#141413] shadow-xs">
                          {hotel.luxuryTier || 'Luxury Hotel'}
                        </div>
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-white font-mono">
                          ${hotel.startingPrice} <span className="text-[10px] font-normal text-stone-300">/ night</span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#85837B]">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{hotel.location.city}, {hotel.location.country}</span>
                        </div>

                        <Link href={`/hotels/${hotel.slug}`} className="block">
                          <h3 className="font-editorial text-xl font-bold text-[#141413] group-hover:text-[#AF8F64] transition-colors leading-snug">
                            {hotel.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#575650] line-clamp-2 leading-relaxed">
                          {hotel.tagline || hotel.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#575650]"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 border-t border-[#F0EAE1] flex items-center justify-between gap-3 mt-4">
                      <Link
                        href={`/hotels/${hotel.slug}`}
                        className="text-xs font-semibold text-[#575650] hover:text-[#141413]"
                      >
                        View Suite Details
                      </Link>

                      <button
                        onClick={(e) => handleBookHotelClick(e, hotel.slug)}
                        className="px-4 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECTION 2: SCENIC VACATION SPOTS & BEACH HOUSES (Open to All)
            ========================================================================= */}
        {(categoryFilter === 'all' || categoryFilter === 'vacation_spots') && (
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D8] gap-2">
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-emerald-600">
                  Scenic Getaways
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                  Vacation Spots & Beach House Destinations
                </h2>
              </div>
              <span className="text-xs text-[#85837B] font-semibold">
                {filteredDestinations.length} Destinations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D8] hover:border-[#C5A880]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Destination Cover */}
                    <Link href={`/destinations/${dest.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <Image
                        src={dest.heroImage}
                        alt={dest.city}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                        {dest.region}
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#141413]">
                        {dest.climate || 'Tropical & Scenic'}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#85837B]">
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dest.city}, {dest.country}</span>
                      </div>

                      <Link href={`/destinations/${dest.slug}`} className="block">
                        <h3 className="font-editorial text-xl font-bold text-[#141413] group-hover:text-[#AF8F64] transition-colors leading-snug">
                          {dest.headline || `${dest.city} Coastal Sanctuaries`}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#575650] line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {dest.attractions.slice(0, 3).map((attr, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#575650]"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Link */}
                  <div className="p-6 pt-0 border-t border-[#F0EAE1] flex items-center justify-between gap-3 mt-4">
                    <span className="text-[11px] text-[#85837B]">
                      Best: {dest.bestTimeToVisit || 'Year-round'}
                    </span>

                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#141413] text-[#141413] hover:text-white border border-[#E8E2D8] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <span>Explore Destination</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DiscoverSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-stone-400">Loading Discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
