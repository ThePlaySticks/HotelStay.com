'use client';

import React, { useState } from 'react';
import { Hotel } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Star, X, ArrowUpRight, MapPin, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface InteractiveMapProps {
  hotels: Hotel[];
  selectedHotelId?: string;
  onSelectHotel?: (hotelId: string) => void;
}

export function InteractiveMap({ hotels, selectedHotelId, onSelectHotel }: InteractiveMapProps) {
  const [activeHotel, setActiveHotel] = useState<Hotel | null>(
    hotels.find((h) => h.id === selectedHotelId) || hotels[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  // Approximate relative coordinates on an artistic Mediterranean/European travel canvas
  const hotelCoordinates: Record<string, { top: string; left: string }> = {
    'hotel-azure': { top: '56%', left: '52%' }, // Nice, France
    'hotel-serenita': { top: '68%', left: '74%' }, // Santorini, Greece
    'hotel-palacio': { top: '64%', left: '42%' }, // Mallorca, Spain
    'hotel-sanctuary': { top: '28%', left: '38%' }, // Inverness, UK
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[720px] bg-[#EBE4D8] rounded-3xl overflow-hidden border border-[#D5CCC0] shadow-inner select-none flex flex-col justify-between">
      {/* Map Canvas Background with stylized topographic / coastline contours */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg
          className="w-full h-full opacity-35"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle coastline vectors */}
          <path
            d="M 120,40 C 220,100 240,180 300,220 C 360,260 410,230 460,280 C 510,330 490,420 560,460 C 630,500 710,480 780,540"
            fill="none"
            stroke="#C5A880"
            strokeWidth="3"
            strokeDasharray="4 6"
          />
          <path
            d="M 200,80 C 260,150 280,240 380,310 C 440,350 520,380 610,430 C 690,470 730,530 790,580"
            fill="none"
            stroke="#B59A72"
            strokeWidth="1.5"
          />
          {/* Waterway curves */}
          <circle cx="416" cy="336" r="160" fill="#DFD7CA" opacity="0.4" />
          <circle cx="590" cy="408" r="90" fill="#DFD7CA" opacity="0.4" />
        </svg>

        {/* Ambient Topo Grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(#141413 0.75px, transparent 0.75px), radial-gradient(#141413 0.75px, #EBE4D8 0.75px)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* Dynamic Hotel Map Markers */}
        {hotels.map((hotel) => {
          const coords = hotelCoordinates[hotel.id] || { top: '50%', left: '50%' };
          const isSelected = activeHotel?.id === hotel.id;

          return (
            <div
              key={hotel.id}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveHotel(hotel);
                  if (onSelectHotel) onSelectHotel(hotel.id);
                }}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#141413] text-white scale-110 ring-4 ring-[#C5A880]/50'
                    : 'bg-white text-[#141413] hover:bg-[#141413] hover:text-white border border-[#D5CCC0]'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A880]' : 'text-[#85837B]'}`} />
                <span>{hotel.currencySymbol}{hotel.startingPrice}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Map Overlay Controls */}
      <div className="relative z-30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D5CCC0] text-xs font-semibold text-[#141413] shadow-xs">
          <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Interactive Sanctuary Map</span>
        </div>

        {/* Zoom controls */}
        <div className="flex flex-col bg-white rounded-xl border border-[#D5CCC0] shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="p-2 hover:bg-[#FAF8F5] text-stone-700 transition-colors border-b border-[#E8E2D8]"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-2 hover:bg-[#FAF8F5] text-stone-700 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Hotel Floating Preview Card */}
      {activeHotel && (
        <div className="relative z-30 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/95 backdrop-blur-md border border-[#D5CCC0] rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <Image
                src={activeHotel.heroImage}
                alt={activeHotel.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#AF8F64] tracking-wider">
                  {activeHotel.location.city}, {activeHotel.location.country}
                </span>
                <button
                  onClick={() => setActiveHotel(null)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-editorial text-sm font-bold text-[#141413] truncate">
                {activeHotel.name}
              </h4>

              <div className="flex items-center gap-1 text-xs text-stone-600 mt-0.5">
                <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
                <span className="font-semibold text-stone-900">{activeHotel.guestRating}</span>
                <span>({activeHotel.reviewCount})</span>
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-bold text-[#141413]">
                  {activeHotel.currencySymbol}{activeHotel.startingPrice} <span className="text-[10px] text-stone-500 font-normal">/ night</span>
                </span>
                <Link
                  href={`/hotel/${activeHotel.slug}`}
                  className="text-[11px] font-bold text-[#141413] hover:text-[#AF8F64] flex items-center gap-0.5 underline"
                >
                  View Details
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
