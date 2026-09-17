'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { RoomType } from '@/lib/types';
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Users,
  Check,
  Clock,
  Coffee,
  Waves,
  X,
  ChevronRight,
  ArrowRight,
  Info,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { hotels, reviews, isWishlisted, toggleWishlist, showToast } = useMarketplace();

  const hotel = hotels.find((h) => h.slug === resolvedParams.slug) || hotels[0] || null;
  const hotelReviews = hotel ? reviews.filter((r) => r.hotelId === hotel.id) : [];
  const wishlisted = hotel ? isWishlisted(hotel.id) : false;

  // Gallery Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Booking Widget State
  const [checkIn, setCheckIn] = useState('2026-09-24');
  const [checkOut, setCheckOut] = useState('2026-09-28');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(hotel?.roomTypes?.[0] || null);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))) || 4;

  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0;
  const taxes = Math.round(roomTotal * 0.12);
  const platformServiceFee = 65;
  const grandTotal = roomTotal + taxes + platformServiceFee;

  const handleBookNow = (room?: RoomType) => {
    const roomToBook = room || selectedRoom;
    if (!roomToBook || !hotel) return;
    const query = new URLSearchParams({
      roomId: roomToBook.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/book/${hotel.slug}?${query.toString()}`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        title: 'Link Copied',
        description: 'Hotel link copied to clipboard.',
        type: 'success',
      });
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
          <Building2 className="w-12 h-12 text-[#C5A880] mx-auto mb-4" />
          <h1 className="font-editorial text-3xl font-bold text-[#141413] mb-2">Sanctuary Not Found</h1>
          <p className="text-sm text-[#575650] mb-8">No hotel matches this destination at the moment.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#141413] hover:bg-[#2A2925] text-white rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Explore Sanctuaries
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allPhotos = [
    hotel.heroImage,
    ...(hotel.galleryImages || []),
    ...(hotel.categorizedPhotos?.rooms || []),
    ...(hotel.categorizedPhotos?.dining || []),
    ...(hotel.categorizedPhotos?.pool || []),
  ].filter((url, index, self) => url && self.indexOf(url) === index);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#85837B] mb-1">
              <Link href="/" className="hover:text-[#141413]">Home</Link>
              <span>/</span>
              <Link href="/search" className="hover:text-[#141413]">Hotels</Link>
              <span>/</span>
              <Link href={`/destinations/${hotel.location.city.toLowerCase()}`} className="hover:text-[#141413]">
                {hotel.location.city}
              </Link>
              <span>/</span>
              <span className="text-[#141413] font-semibold">{hotel.name}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413]">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#575650]">
              <span className="flex items-center gap-1 font-semibold text-[#141413]">
                <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                {hotel.guestRating} ({hotel.reviewCount} verified guest reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                {hotel.location.address}, {hotel.location.city}, {hotel.location.country}
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-800">
                {hotel.luxuryTier}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full border border-[#D5CCC0] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleWishlist(hotel.id)}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                wishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#D5CCC0] text-stone-700 hover:bg-[#FAF8F5]'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* PHOTO GALLERY (Grid Composition + Lightbox Trigger) */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-md">
          {/* Main Large Cover */}
          <div
            onClick={() => {
              setActivePhotoIdx(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 relative h-80 md:h-[450px] cursor-pointer img-zoom-container group"
          >
            <Image
              src={allPhotos[0] || hotel.heroImage}
              alt={hotel.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary Photo 1 */}
          <div
            onClick={() => {
              setActivePhotoIdx(1);
              setLightboxOpen(true);
            }}
            className="relative h-40 md:h-[450px] cursor-pointer img-zoom-container group hidden sm:block"
          >
            <Image
              src={allPhotos[1] || allPhotos[0]}
              alt={`${hotel.name} View 2`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary Stack (2 Photos) */}
          <div className="flex flex-col gap-3 h-80 md:h-[450px]">
            <div
              onClick={() => {
                setActivePhotoIdx(2);
                setLightboxOpen(true);
              }}
              className="relative flex-1 cursor-pointer img-zoom-container group"
            >
              <Image
                src={allPhotos[2] || allPhotos[0]}
                alt={`${hotel.name} View 3`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>

            <div
              onClick={() => {
                setActivePhotoIdx(3);
                setLightboxOpen(true);
              }}
              className="relative flex-1 cursor-pointer img-zoom-container group"
            >
              <Image
                src={allPhotos[3] || allPhotos[0]}
                alt={`${hotel.name} View 4`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center text-white font-semibold text-xs transition-colors">
                <span>View All {allPhotos.length} Photos</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-COLUMN MAIN CONTENT (Overview & Rooms vs Booking Widget) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Property Narrative, Amenities, Rooms, Policies, Reviews */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview & Tagline */}
            <section className="space-y-4 pb-8 border-b border-[#E8E2D8]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#AF8F64] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hotel.tagline}</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#141413]">About the Sanctuary</h2>
              <p className="text-sm sm:text-base text-[#575650] leading-relaxed font-light">
                {hotel.description}
              </p>
              <p className="text-xs text-[#85837B] leading-relaxed">
                <strong>Neighborhood:</strong> {hotel.location.neighborhoodDescription}
              </p>
            </section>

            {/* Curated Amenities */}
            <section className="pb-8 border-b border-[#E8E2D8]">
              <h2 className="font-editorial text-2xl font-bold text-[#141413] mb-6">Property Highlights & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E2D8]">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C5A880] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#141413] block">{amenity}</span>
                      <span className="text-[11px] text-[#85837B]">Verified by HotelStay index</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AVAILABLE ROOM TYPES SELECTION */}
            <section className="pb-8 border-b border-[#E8E2D8]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">Available Room Types & Suites</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Select a suite configured for your dates</p>
                </div>
              </div>

              <div className="space-y-6">
                {hotel.roomTypes.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`p-6 rounded-3xl border transition-all ${
                        isSelected
                          ? 'bg-white border-[#C5A880] shadow-md ring-2 ring-[#C5A880]/30'
                          : 'bg-white border-[#E8E2D8] hover:border-[#D5CCC0]'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Room Photo */}
                        <div className="md:col-span-4 relative h-48 rounded-2xl overflow-hidden">
                          <Image
                            src={room.images[0] || hotel.heroImage}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Room Info */}
                        <div className="md:col-span-8 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="font-editorial text-xl font-bold text-[#141413]">{room.name}</h3>
                              <span className="text-xs font-bold text-[#C5A880] bg-amber-50 px-2.5 py-0.5 rounded-full">
                                {room.sizeSqFt} sq ft
                              </span>
                            </div>

                            <p className="text-xs text-[#575650] mt-1.5 leading-relaxed font-light">
                              {room.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-[#575650]">
                              <div>
                                <span className="text-[#85837B] block text-[10px] uppercase">Bed Type</span>
                                <span className="font-semibold text-[#141413]">{room.bedType}</span>
                              </div>
                              <div>
                                <span className="text-[#85837B] block text-[10px] uppercase">Occupancy</span>
                                <span className="font-semibold text-[#141413]">Up to {room.maxGuests} guests</span>
                              </div>
                              <div>
                                <span className="text-[#85837B] block text-[10px] uppercase">View</span>
                                <span className="font-semibold text-[#141413]">{room.view}</span>
                              </div>
                              <div>
                                <span className="text-[#85837B] block text-[10px] uppercase">Meal Plan</span>
                                <span className="font-semibold text-emerald-700">{room.mealPlan}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-[#141413]">
                                {hotel.currencySymbol}{room.basePricePerNight}
                                <span className="text-xs font-normal text-[#85837B]"> / night</span>
                              </div>
                              <div className="text-[10px] text-[#85837B]">
                                {room.cancellationPolicy}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRoom(room);
                                handleBookNow(room);
                              }}
                              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#141413] text-white hover:bg-black'
                                  : 'bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413]'
                              }`}
                            >
                              Reserve Suite
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* POLICIES */}
            <section className="pb-8 border-b border-[#E8E2D8]">
              <h2 className="font-editorial text-2xl font-bold text-[#141413] mb-6">Policies & Check-In</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#575650]">
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <Clock className="w-4 h-4 text-[#C5A880] mb-1.5" />
                  <span className="font-bold text-[#141413] block">Check-In & Check-Out</span>
                  <p className="mt-1">Check-in: {hotel.policies.checkInTime} · Check-out: {hotel.policies.checkOutTime}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880] mb-1.5" />
                  <span className="font-bold text-[#141413] block">Cancellation Guarantee</span>
                  <p className="mt-1">{hotel.policies.cancellationDeadlineHours}h free cancellation window.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <Info className="w-4 h-4 text-[#C5A880] mb-1.5" />
                  <span className="font-bold text-[#141413] block">Pet Policy</span>
                  <p className="mt-1">{hotel.policies.petPolicy}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <Users className="w-4 h-4 text-[#C5A880] mb-1.5" />
                  <span className="font-bold text-[#141413] block">Children & Family</span>
                  <p className="mt-1">{hotel.policies.childPolicy}</p>
                </div>
              </div>
            </section>

            {/* VERIFIED GUEST REVIEWS */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">Verified Traveler Reviews</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Reviews submitted exclusively after verified stays</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-editorial font-bold text-[#141413] flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#C5A880] text-[#C5A880]" />
                    {hotel.guestRating}
                  </div>
                  <div className="text-[10px] text-[#85837B] uppercase">Out of 5.0 Rating</div>
                </div>
              </div>

              {hotelReviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E8E2D8] text-center">
                  <p className="text-xs text-[#575650]">Reviews will appear here following completed guest stays.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hotelReviews.map((rev) => (
                    <div key={rev.id} className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm text-[#141413] block">{rev.authorName}</span>
                          <span className="text-[11px] text-[#85837B]">{rev.authorLocation} · {rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#C5A880]">
                          <Star className="w-3.5 h-3.5 fill-[#C5A880]" />
                          {rev.rating}.0
                        </div>
                      </div>
                      <h4 className="font-semibold text-xs text-[#141413]">{rev.title}</h4>
                      <p className="text-xs text-[#575650] leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING WIDGET */}
          <aside className="lg:col-span-4 sticky top-28">
            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                <div>
                  <span className="text-2xl font-editorial font-bold text-[#141413]">
                    {hotel.currencySymbol}{selectedRoom?.basePricePerNight || hotel.startingPrice}
                  </span>
                  <span className="text-xs text-[#85837B] font-light"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#141413]">
                  <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                  {hotel.guestRating}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5]">
                    <span className="block text-[10px] uppercase font-bold text-[#85837B]">Check in</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#141413] focus:outline-hidden"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5]">
                    <span className="block text-[10px] uppercase font-bold text-[#85837B]">Check out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#141413] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5]">
                  <span className="block text-[10px] uppercase font-bold text-[#85837B]">Guests</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-semibold text-[#141413] focus:outline-hidden cursor-pointer"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#F0EAE1] text-xs text-[#575650]">
                <div className="flex justify-between">
                  <span>{hotel.currencySymbol}{selectedRoom?.basePricePerNight || hotel.startingPrice} × {nights} nights</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{roomTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Itemized Taxes & Municipal Levies (12%)</span>
                  <span>{hotel.currencySymbol}{taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span>HotelStay Concierge Guarantee Fee</span>
                  <span>{hotel.currencySymbol}{platformServiceFee}</span>
                </div>
                <div className="pt-3 border-t border-[#F0EAE1] flex justify-between text-sm font-bold text-[#141413]">
                  <span>Estimated Total</span>
                  <span>{hotel.currencySymbol}{grandTotal}</span>
                </div>
              </div>

              {/* CTA Action */}
              <button
                type="button"
                onClick={() => handleBookNow()}
                className="w-full py-4 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-102 shadow-lg cursor-pointer"
              >
                <span>Reserve Room</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>

              <p className="text-[11px] text-center text-[#85837B]">
                Direct reservation transmitted instantly to {hotel.name} front desk.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-300">
              {hotel.name} Photo {activePhotoIdx + 1} of {allPhotos.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full max-w-5xl h-full max-h-[75vh]">
              <Image
                src={allPhotos[activePhotoIdx]}
                alt={`Photo ${activePhotoIdx + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {allPhotos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoIdx === i ? 'border-[#C5A880] scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <Image src={photo} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
