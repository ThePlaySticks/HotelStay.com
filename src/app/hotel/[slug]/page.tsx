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
} from 'lucide-react';

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { hotels, reviews, isWishlisted, toggleWishlist, showToast } = useMarketplace();

  const hotel = hotels.find((h) => h.slug === resolvedParams.slug) || hotels[0];
  const hotelReviews = reviews.filter((r) => r.hotelId === hotel.id);
  const wishlisted = isWishlisted(hotel.id);

  // Gallery Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Booking Widget State
  const [checkIn, setCheckIn] = useState('2026-09-24');
  const [checkOut, setCheckOut] = useState('2026-09-28');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(hotel.roomTypes[0]);

  // Calculate nights
  const nights = 4;
  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0;
  const taxes = Math.round(roomTotal * 0.12);
  const platformServiceFee = 65;
  const grandTotal = roomTotal + taxes + platformServiceFee;

  const handleBookNow = (room?: RoomType) => {
    const roomToBook = room || selectedRoom;
    const query = new URLSearchParams({
      roomId: roomToBook.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/book/${hotel.slug}?${query.toString()}`);
  };

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
              <span className="text-[#141413] font-semibold">{hotel.location.city}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#141413] text-white">
                {hotel.luxuryTier}
              </span>
              <span className="text-xs text-[#C5A880] font-bold flex items-center gap-1">
                {'★'.repeat(hotel.starRating)} {hotel.starRating}-Star Standard
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] mt-2">
              {hotel.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-[#575650] mt-2">
              <MapPin className="w-4 h-4 text-[#C5A880]" />
              {hotel.location.address}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast({ title: 'Link Copied', description: 'Sanctuary link copied to clipboard.', type: 'info' });
              }}
              className="p-2.5 rounded-full border border-[#D5CCC0] bg-white hover:bg-[#F5EFEB] text-stone-700 transition-colors"
              title="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(hotel.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                wishlisted
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-white border-[#D5CCC0] text-stone-700 hover:bg-[#F5EFEB]'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              <span>{wishlisted ? 'Saved' : 'Save to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* EDITORIAL 5-PHOTO GALLERY */}
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 h-[340px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg border border-[#E8E2D8] relative">
            {/* Primary Hero Photo */}
            <div
              onClick={() => { setActivePhotoIdx(0); setLightboxOpen(true); }}
              className="md:col-span-2 relative h-full cursor-pointer img-zoom-container group"
            >
              <Image
                src={hotel.galleryImages[0] || hotel.heroImage}
                alt={`${hotel.name} primary view`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Sub Photo 1 */}
            <div
              onClick={() => { setActivePhotoIdx(1); setLightboxOpen(true); }}
              className="hidden md:block relative h-full cursor-pointer img-zoom-container group"
            >
              <Image
                src={hotel.galleryImages[1] || hotel.heroImage}
                alt={`${hotel.name} detail`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Sub Photo 2 & 3 Column */}
            <div className="hidden md:flex flex-col gap-3.5 h-full">
              <div
                onClick={() => { setActivePhotoIdx(2); setLightboxOpen(true); }}
                className="relative h-1/2 cursor-pointer img-zoom-container group rounded-lg overflow-hidden"
              >
                <Image
                  src={hotel.galleryImages[2] || hotel.heroImage}
                  alt={`${hotel.name} terrace`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div
                onClick={() => { setActivePhotoIdx(3); setLightboxOpen(true); }}
                className="relative h-1/2 cursor-pointer img-zoom-container group rounded-lg overflow-hidden"
              >
                <Image
                  src={hotel.galleryImages[3] || hotel.heroImage}
                  alt={`${hotel.name} interior`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs group-hover:bg-black/40 transition-colors">
                  View All Gallery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT & STICKY BOOKING PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
          {/* LEFT: Hotel Details, Amenities, Rooms, Policies, Reviews */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#141413]">
                About The Sanctuary
              </h2>
              <p className="text-sm text-[#575650] mt-3 leading-relaxed font-light">
                {hotel.description}
              </p>
              <div className="mt-4 p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8E2D8] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0" />
                <p className="text-xs text-[#575650]">
                  {hotel.location.neighborhoodDescription}
                </p>
              </div>
            </div>

            {/* Curated Amenities */}
            <div className="pt-6 border-t border-[#E8E2D8]">
              <h3 className="font-editorial text-2xl font-bold text-[#141413] mb-6">
                Curated Amenities & Privileges
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E2D8] text-xs font-semibold text-[#141413] shadow-2xs"
                  >
                    <Check className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AVAILABLE ROOMS & SUITES */}
            <div id="rooms" className="pt-6 border-t border-[#E8E2D8]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                    Available Suites & Residences
                  </h3>
                  <p className="text-xs text-[#85837B] mt-1">
                    Select your preferred accommodation to proceed with reservation.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {hotel.roomTypes.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`bg-white border rounded-3xl p-6 transition-all ${
                        isSelected
                          ? 'border-[#141413] ring-2 ring-[#C5A880] shadow-md'
                          : 'border-[#E8E2D8] hover:border-[#D5CCC0]'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Room Image */}
                        <div className="md:col-span-4 relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100">
                          <Image
                            src={room.images[0] || hotel.heroImage}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Room Information */}
                        <div className="md:col-span-8 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-editorial text-xl font-bold text-[#141413]">
                                {room.name}
                              </h4>
                              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                {room.availableCount} Available
                              </span>
                            </div>

                            <p className="text-xs text-[#575650] mt-1.5 leading-relaxed">
                              {room.description}
                            </p>

                            {/* Specs */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#85837B] mt-3">
                              <span>{room.sizeSqFt} sq.ft</span>
                              <span>•</span>
                              <span>{room.bedType}</span>
                              <span>•</span>
                              <span>Up to {room.maxGuests} guests</span>
                              <span>•</span>
                              <span className="text-[#141413] font-medium">{room.view}</span>
                            </div>

                            {/* Perks */}
                            <div className="mt-3 space-y-1 text-xs">
                              <div className="text-emerald-700 flex items-center gap-1.5">
                                <Coffee className="w-3.5 h-3.5" />
                                <span>{room.mealPlan}</span>
                              </div>
                              <div className="text-[#575650] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                                <span>{room.cancellationPolicy}</span>
                              </div>
                            </div>
                          </div>

                          {/* Room Pricing & CTA */}
                          <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-[#85837B] uppercase block">Rate per night</span>
                              <div className="flex items-baseline gap-1">
                                <span className="font-editorial text-2xl font-bold text-[#141413]">
                                  {hotel.currencySymbol}{room.basePricePerNight}
                                </span>
                                <span className="text-xs text-[#85837B]">/ night</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedRoom(room)}
                                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-stone-100 text-stone-900 border border-stone-300'
                                    : 'border border-[#D5CCC0] text-stone-700 hover:bg-[#FAF8F5]'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                              <button
                                onClick={() => handleBookNow(room)}
                                className="px-6 py-2.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-all hover:scale-105"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* POLICIES */}
            <div className="pt-6 border-t border-[#E8E2D8]">
              <h3 className="font-editorial text-2xl font-bold text-[#141413] mb-6">
                Property Policies & Guidelines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#575650]">
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <h4 className="font-semibold text-[#141413] flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#C5A880]" />
                    Check-in & Check-out
                  </h4>
                  <p>Check-in from {hotel.policies.checkInTime} · Check-out until {hotel.policies.checkOutTime}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <h4 className="font-semibold text-[#141413] flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                    Cancellation Terms
                  </h4>
                  <p>Complimentary cancellation up to {hotel.policies.cancellationDeadlineHours} hours before check-in.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <h4 className="font-semibold text-[#141413] mb-1">Pets</h4>
                  <p>{hotel.policies.petPolicy}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8]">
                  <h4 className="font-semibold text-[#141413] mb-1">Children & Families</h4>
                  <p>{hotel.policies.childPolicy}</p>
                </div>
              </div>
            </div>

            {/* REVIEWS */}
            <div className="pt-6 border-t border-[#E8E2D8]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                    Verified Guest Experiences
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                    <span className="font-bold text-[#141413] text-sm">{hotel.guestRating} out of 5.0</span>
                    <span className="text-[#85837B]">· Based on {hotel.reviewCount} verified stays</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {hotelReviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-3xl bg-white border border-[#E8E2D8]">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#141413]">{rev.authorName}</h4>
                        <span className="text-xs text-[#85837B]">{rev.authorLocation} · {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#C5A880]">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-[#141413] mt-2">{rev.title}</h5>
                    <p className="text-xs text-[#575650] mt-1 leading-relaxed">{rev.comment}</p>

                    {rev.hotelResponse && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#F0EAE1] text-xs">
                        <div className="font-bold text-[#141413] mb-1">
                          Response from General Manager
                        </div>
                        <p className="text-[#575650]">{rev.hotelResponse.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: STICKY BOOKING SUMMARY PANEL (DESKTOP) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-[#E8E2D8] rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-[#F0EAE1]">
                <div>
                  <span className="text-[11px] text-[#85837B] uppercase tracking-wider block">Selected Suite</span>
                  <h4 className="font-editorial text-lg font-bold text-[#141413]">
                    {selectedRoom?.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-editorial text-2xl font-bold text-[#141413]">
                    {hotel.currencySymbol}{selectedRoom?.basePricePerNight}
                  </span>
                  <span className="text-xs text-[#85837B] block">/ night</span>
                </div>
              </div>

              {/* Date & Guest Controls */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <div className="px-2">
                    <label className="text-[10px] uppercase font-bold text-[#85837B] block">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#141413] focus:outline-hidden"
                    />
                  </div>
                  <div className="px-2 border-l border-[#E8E2D8]">
                    <label className="text-[10px] uppercase font-bold text-[#85837B] block">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#141413] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-semibold text-[#141413]">Guests: {guests} Adults</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={guests <= 1}
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-6 h-6 rounded-full border border-stone-300 text-xs font-bold disabled:opacity-30"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      disabled={guests >= selectedRoom.maxGuests}
                      onClick={() => setGuests(guests + 1)}
                      className="w-6 h-6 rounded-full border border-stone-300 text-xs font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="space-y-2 text-xs text-[#575650] pt-2 border-t border-[#F0EAE1]">
                <div className="flex justify-between">
                  <span>{hotel.currencySymbol}{selectedRoom.basePricePerNight} × {nights} nights</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{roomTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Taxes & Tourism Levy (12%)</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span>HotelStay Concierge Protection</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{platformServiceFee}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#F0EAE1] text-sm">
                  <span className="font-bold text-[#141413]">Total (Taxes included)</span>
                  <span className="font-editorial text-xl font-bold text-[#141413]">{hotel.currencySymbol}{grandTotal}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => handleBookNow()}
                className="w-full py-4 bg-[#141413] hover:bg-black text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Reserve Sanctuary</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>

              <div className="text-[11px] text-[#85837B] text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero charge until confirmation step</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* GALLERY LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-4">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              {hotel.name} — Photo {activePhotoIdx + 1} of {hotel.galleryImages.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 max-w-5xl mx-auto w-full my-auto flex items-center justify-center">
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden">
              <Image
                src={hotel.galleryImages[activePhotoIdx] || hotel.heroImage}
                alt={`${hotel.name} photo preview`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto justify-center pt-4 max-w-2xl mx-auto">
            {hotel.galleryImages.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                  activePhotoIdx === idx ? 'ring-2 ring-[#C5A880] scale-105' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
