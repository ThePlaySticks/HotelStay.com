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
  Car,
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
  const { approvedHotels } = useMarketplace();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(destQuery);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hotels' | 'vacation_stays' | 'cars'>('all');

  // Filtered onboarded properties & services
  const filteredHotels = useMemo(() => {
    return approvedHotels.filter((hotel) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        hotel.name.toLowerCase().includes(q) ||
        hotel.location.city.toLowerCase().includes(q) ||
        hotel.location.country.toLowerCase().includes(q) ||
        (hotel.description && hotel.description.toLowerCase().includes(q))
      );
    });
  }, [approvedHotels, searchQuery]);

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

  const handleOnboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'signup',
        role: 'hotel_manager',
        title: 'Create Partner Account to Onboard',
        description: 'Create a host or partner account first to list your hotel, vacation rental, or travel service in the Operate sector.',
        redirectUrl: '/partner/onboard',
      });
    } else {
      router.push('/partner/onboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* =========================================================================
            BEUI MINIMALIST DISCOVER HEADER & SEARCH BAR
            ("Curated travel discovery" button removed completely as requested)
            ========================================================================= */}
        <div className="space-y-4 text-center max-w-3xl mx-auto pt-2">
          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413]">
            Discover Exceptional Stays & Vacation Services
          </h1>

          <p className="text-sm sm:text-base text-[#575650] leading-relaxed">
            Explore verified onboarded hotels, luxury vacation homes, and travel services listed across cities in Nigeria and around the world.
          </p>

          {/* Search Input Box */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-full border border-[#E8E2D8] shadow-lg p-2 hover:border-[#C5A880] transition-colors">
              <div className="pl-4 text-[#85837B]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, hotel, vacation home, or service..."
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
            CATEGORY PILL FILTER BAR
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
            All Listed Discoveries ({filteredHotels.length})
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
            <span>Hotels & Resorts ({filteredHotels.length})</span>
          </button>
          <button
            onClick={() => setCategoryFilter('vacation_stays')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              categoryFilter === 'vacation_stays'
                ? 'bg-[#141413] text-white shadow-md'
                : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vacation Spots & Villas</span>
          </button>
          <button
            onClick={() => setCategoryFilter('cars')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              categoryFilter === 'cars'
                ? 'bg-[#141413] text-white shadow-md'
                : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-600" />
            <span>Car Hire & Services</span>
          </button>
        </div>

        {/* =========================================================================
            DYNAMIC DISCOVER LISTINGS & EMPTY STATE
            Automatically updates when properties or services are onboarded in Operate
            ========================================================================= */}
        <div className="space-y-6 pt-2">
          {filteredHotels.length === 0 ? (
            /* Rich Informative Empty State when no properties/services have been onboarded */
            <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#E8E2D8] text-center space-y-6 shadow-sm max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#C5A880] ring-8 ring-[#FAF8F5]">
                <Building2 className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#AF8F64] px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8]">
                  Marketplace Ready
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413]">
                  No properties have been listed yet
                </h2>
                <p className="text-sm text-[#575650] max-w-xl mx-auto leading-relaxed">
                  The Discover section automatically updates whenever a partner lists a property or vacation service. From luxury hotels, boutique guesthouses, and scenic vacation spots across cities in Nigeria and around the world, to car hire and chauffeur services — everything and anything needed for a vacation can be listed in the Operate section.
                </p>
              </div>

              {/* Feature Highlights Grid in Empty State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <div className="text-xs font-bold text-[#141413] flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Hotels & Resorts</span>
                  </div>
                  <p className="text-[11px] text-[#575650] leading-snug">
                    List independent hotels, boutique suites & island resorts.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <div className="text-xs font-bold text-[#141413] flex items-center gap-1.5 mb-1">
                    <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vacation Homes</span>
                  </div>
                  <p className="text-[11px] text-[#575650] leading-snug">
                    List beach houses, private villas & luxury apartments globally.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <div className="text-xs font-bold text-[#141413] flex items-center gap-1.5 mb-1">
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>Car Hire & Rides</span>
                  </div>
                  <p className="text-[11px] text-[#575650] leading-snug">
                    List executive airport transfers, chauffeur services & car rentals.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleOnboardClick}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
                >
                  <span>Onboard an Hotel</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-[#C5A880]">
                    Verified Listings
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                    Onboarded Properties & Services
                  </h2>
                </div>
                <span className="text-xs text-[#85837B] font-semibold">
                  {filteredHotels.length} {filteredHotels.length === 1 ? 'Listing' : 'Listings'} Available
                </span>
              </div>

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
                          {hotel.luxuryTier || 'Verified Listing'}
                        </div>
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-white font-mono">
                          {hotel.currencySymbol || '₦'}{hotel.startingPrice.toLocaleString()} <span className="text-[10px] font-normal text-stone-300">/ rate</span>
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
                        View Details
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
            </div>
          )}
        </div>
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
