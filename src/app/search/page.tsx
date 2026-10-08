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
  ShieldCheck,
  HelpCircle,
  Clock,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { PublicPlace, Hotel } from '@/lib/types';

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destQuery = searchParams.get('dest') || '';
  const categoryParam = searchParams.get('category') || 'all';
  
  const { approvedHotels, publicPlaces } = useMarketplace();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Search & Category Filter state
  const [searchQuery, setSearchQuery] = useState(destQuery);
  const [activeTab, setActiveTab] = useState<string>(categoryParam);
  const [selectedAttraction, setSelectedAttraction] = useState<PublicPlace | null>(null);

  // Filtered approved managed listings
  const filteredListings = useMemo(() => {
    return approvedHotels.filter((item) => {
      // Status check: managed listings MUST NOT appear publicly before approval and publication
      const isPublished = item.status === 'approved' || item.status === 'live' || item.status === 'active';
      if (!isPublished) return false;

      // Category filter
      if (activeTab !== 'all' && activeTab !== 'public_attractions') {
        const cat = item.category || 'hotels';
        if (cat !== activeTab) return false;
      }

      if (activeTab === 'public_attractions') return false;

      // Search query filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.location.city.toLowerCase().includes(q) ||
        item.location.country.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    });
  }, [approvedHotels, activeTab, searchQuery]);

  // Filtered public attractions
  const filteredAttractions = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'public_attractions') return [];

    return publicPlaces.filter((place) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        place.name.toLowerCase().includes(q) ||
        place.location.city.toLowerCase().includes(q) ||
        place.location.country.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q)
      );
    });
  }, [publicPlaces, activeTab, searchQuery]);

  const handleBookClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'signup',
        role: 'guest',
        title: 'Sign Up to Book Listing',
        description: 'Create an account or sign in to complete your reservation.',
        redirectUrl: `/hotels/${slug}`,
      });
    } else {
      router.push(`/hotels/${slug}`);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent, placeName: string) => {
    e.preventDefault();
    alert(`Thank you for your inquiry about ${placeName}. Our team will respond shortly.`);
    setSelectedAttraction(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* =========================================================================
            HEADER & SEARCH BAR
            ========================================================================= */}
        <div className="space-y-4 text-center max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#AF8F64] text-[10px] font-bold uppercase tracking-[0.25em] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Multi-Tenant Marketplace</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413]">
            Discover Places, Stays & Experiences
          </h1>

          <p className="text-sm sm:text-base text-[#575650] leading-relaxed">
            Explore approved hotels, luxury vacation homes, transport fleets, curated tours, and public attractions across cities in Nigeria and worldwide.
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-full border border-[#E8E2D8] shadow-lg p-2 hover:border-[#C5A880] transition-colors">
              <div className="pl-4 text-[#85837B]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, hotel, villa, transport, tour, or landmark..."
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
            CATEGORY TABS
            ========================================================================= */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
          {[
            { id: 'all', label: 'All Discoveries', icon: Compass },
            { id: 'hotels', label: 'Hotels & Resorts', icon: Building2 },
            { id: 'holiday_rentals', label: 'Holiday Homes & Villas', icon: Palmtree },
            { id: 'transport', label: 'Transport & Chauffeur', icon: Car },
            { id: 'tours_experiences', label: 'Tours & Experiences', icon: Sparkles },
            { id: 'public_attractions', label: 'Public Attractions', icon: MapPin },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#141413] text-white shadow-md'
                    : 'bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A880]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            DYNAMIC LISTINGS GRID & PUBLIC ATTRACTIONS
            ========================================================================= */}
        <div className="space-y-12">
          {/* Managed Listings Section */}
          {activeTab !== 'public_attractions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-[#C5A880]">
                    Approved Managed Listings
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                    Hospitality & Service Providers
                  </h2>
                </div>
                <span className="text-xs text-[#85837B] font-semibold">
                  {filteredListings.length} Approved {filteredListings.length === 1 ? 'Listing' : 'Listings'}
                </span>
              </div>

              {filteredListings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#E8E2D8] space-y-3">
                  <Building2 className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm text-[#575650]">No approved managed listings found for this category or search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D8] hover:border-[#C5A880]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Photo */}
                        <Link href={`/hotels/${listing.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-100">
                          <Image
                            src={listing.heroImage}
                            alt={listing.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#141413] shadow-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved Listing</span>
                          </div>
                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-white font-mono">
                            {listing.currencySymbol || '$'}{listing.startingPrice.toLocaleString()} <span className="text-[10px] font-normal text-stone-300">/ starting</span>
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-xs text-[#85837B]">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>{listing.location.city}, {listing.location.country}</span>
                            </div>
                            <span className="uppercase text-[10px] font-mono tracking-wider text-[#C5A880]">
                              {listing.category?.replace('_', ' ') || 'Hotel'}
                            </span>
                          </div>

                          <Link href={`/hotels/${listing.slug}`} className="block">
                            <h3 className="font-editorial text-xl font-bold text-[#141413] group-hover:text-[#AF8F64] transition-colors leading-snug">
                              {listing.name}
                            </h3>
                          </Link>

                          <p className="text-xs text-[#575650] line-clamp-2 leading-relaxed">
                            {listing.tagline || listing.description}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {listing.amenities.slice(0, 3).map((amenity, idx) => (
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
                          href={`/hotels/${listing.slug}`}
                          className="text-xs font-semibold text-[#575650] hover:text-[#141413]"
                        >
                          View Listing Page
                        </Link>

                        <button
                          onClick={(e) => handleBookClick(e, listing.slug)}
                          className="px-4 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <span>Request / Book</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Public Attractions & Spaces Section (No Provider Onboarding Required) */}
          {(activeTab === 'all' || activeTab === 'public_attractions') && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-[#AF8F64] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Public Places & Unregistered Attractions</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                    Curated Destinations & Public Spaces
                  </h2>
                </div>
                <span className="text-xs text-[#85837B] font-semibold">
                  {filteredAttractions.length} Curated Places
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {filteredAttractions.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D8] hover:border-[#C5A880] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                  >
                    <div className="relative aspect-[16/10] md:w-2/5 overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={place.heroImage}
                        alt={place.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Verification Status Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {place.verificationStatus === 'verified' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified Public Place</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Unverified Info</span>
                            </span>
                          )}

                          <span className="text-[10px] text-stone-500 uppercase font-mono tracking-widest">
                            {place.category}
                          </span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-[#141413]">
                          {place.name}
                        </h3>

                        <p className="text-xs text-[#575650] line-clamp-2 leading-relaxed">
                          {place.description}
                        </p>

                        <div className="text-xs text-[#85837B] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{place.location.address}, {place.location.city}</span>
                        </div>

                        {place.verificationSource && (
                          <p className="text-[10px] text-stone-400 italic">
                            Source: {place.verificationSource}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#AF8F64]">
                          {place.visitorInfo.entryFee || 'Public Entry'}
                        </span>

                        <button
                          onClick={() => setSelectedAttraction(place)}
                          className="px-4 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Visitor Info & Inquiry</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Visitor Info & Inquiry Modal for Public Attractions */}
      {selectedAttraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-[#E8E2D8]">
            <button
              onClick={() => setSelectedAttraction(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                <span>{selectedAttraction.category}</span>
                <span>•</span>
                <span>{selectedAttraction.verificationStatus === 'verified' ? 'Verified Attraction' : 'Community Unverified'}</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                {selectedAttraction.name}
              </h3>
              <p className="text-xs text-[#575650] leading-relaxed">
                {selectedAttraction.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 text-xs text-[#141413]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span><strong>Hours:</strong> {selectedAttraction.visitorInfo.openingHours || 'Daily Daylight Hours'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#C5A880]" />
                <span><strong>Entry:</strong> {selectedAttraction.visitorInfo.entryFee || 'Free Admission'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span><strong>Address:</strong> {selectedAttraction.location.address}, {selectedAttraction.location.city}</span>
              </div>
            </div>

            {/* Submit Inquiry Form */}
            <form onSubmit={(e) => handleInquirySubmit(e, selectedAttraction.name)} className="space-y-4 pt-2">
              <h4 className="font-editorial text-sm font-bold text-[#141413]">
                Send Inquiry to HotelStay Concierge
              </h4>
              <input
                type="text"
                required
                placeholder="Your Full Name"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <input
                type="email"
                required
                placeholder="Your Email Address"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <textarea
                required
                rows={3}
                placeholder="Ask about opening times, tour guides, or custom arrangements..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

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
