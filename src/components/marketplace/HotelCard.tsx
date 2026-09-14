'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hotel } from '@/lib/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Heart, Star, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const { isWishlisted, toggleWishlist } = useMarketplace();
  const wishlisted = isWishlisted(hotel.id);

  return (
    <article className="group relative bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden luxury-card flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full img-zoom-container bg-stone-100">
        {hotel.heroImage ? (
          <Image
            src={hotel.heroImage}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1F26] flex flex-col items-center justify-center text-center p-6 text-white">
            <div className="w-16 h-16 rounded-full border border-[#C5A880]/50 flex items-center justify-center font-editorial text-2xl font-bold text-[#C5A880] mb-2">
              {hotel.name.charAt(0)}
            </div>
            <span className="font-editorial text-sm font-bold text-white">{hotel.name}</span>
            <span className="text-[10px] text-[#C5A880] uppercase tracking-widest mt-1 font-semibold">{hotel.luxuryTier}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <span className="pointer-events-auto text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-[#141413]/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            {hotel.luxuryTier}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(hotel.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-rose-500 text-white scale-110 shadow-md'
                : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Subtle bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-[#85837B] mb-2">
            <span className="flex items-center gap-1 font-medium text-[#575650]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              {hotel.location.city}, {hotel.location.country}
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#141413]">
              <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
              {hotel.guestRating} <span className="text-[#85837B]">({hotel.reviewCount})</span>
            </span>
          </div>

          {/* Title */}
          <Link href={`/hotel/${hotel.slug}`} className="block group-hover:text-[#AF8F64] transition-colors">
            <h3 className="font-editorial text-xl font-bold text-[#141413] leading-snug line-clamp-1">
              {hotel.name}
            </h3>
          </Link>

          <p className="text-xs text-[#575650] mt-1.5 line-clamp-2 leading-relaxed">
            {hotel.tagline}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium text-[#575650] bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-0.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#85837B] block uppercase tracking-wider">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-2xl font-bold text-[#141413]">
                {hotel.currencySymbol}{hotel.startingPrice}
              </span>
              <span className="text-xs text-[#85837B]">/ night</span>
            </div>
          </div>

          <Link
            href={`/hotel/${hotel.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#141413] hover:text-[#AF8F64] py-2 px-3 rounded-full hover:bg-[#FAF8F5] transition-colors"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
