'use client';

import React, { useState, useEffect } from 'react';
import { Hotel } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Star, X, ArrowUpRight, MapPin, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface InteractiveMapProps {
  hotels: Hotel[];
  selectedHotelId?: string;
  highlightedHotelId?: string;
  onSelectHotel?: (hotelId: string) => void;
}

export function InteractiveMap({ hotels, selectedHotelId, highlightedHotelId, onSelectHotel }: InteractiveMapProps) {
  const [activeHotel, setActiveHotel] = useState<Hotel | null>(
    hotels.find((h) => h.id === (highlightedHotelId || selectedHotelId)) || hotels[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (highlightedHotelId) {
      const found = hotels.find((h) => h.id === highlightedHotelId);
      if (found) setActiveHotel(found);
    }
  }, [highlightedHotelId, hotels]);

  // Approximate relative coordinates on an artistic Mediterranean/European/African travel canvas
  const hotelCoordinates: Record<string, { top: string; left: string }> = {
    'hotel-eko-royal': { top: '65%', left: '35%' }, // Lagos, Nigeria
    'hotel-azure': { top: '56%', left: '52%' }, // Nice, France
    'hotel-serenita': { top: '68%', left: '74%' }, // Santorini, Greece
    'hotel-mirage-dubai': { top: '62%', left: '82%' }, // Dubai, UAE
    'hotel-highland-loch': { top: '28%', left: '38%' }, // Inverness, UK
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[#EBE4D8] rounded-3xl overflow-hidden border border-[#D5CCC0] shadow-inner select-none flex flex-col justify-between">
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
              'radial-gradient(circle at 1px 1px, #141413 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Interactive Hotel Markers */}
        {hotels.map((hotel, index) => {
          const coords = hotelCoordinates[hotel.id] || {
            top: `${35 + (index * 15) % 45}%`,
            left: `${30 + (index * 20) % 50}%`,
          };
          const isSelected = activeHotel?.id === hotel.id;

          return (
            <div
              key={hotel.id}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setActiveHotel(hotel);
                if (onSelectHotel) onSelectHotel(hotel.id);
              }}
            >
              <div
                className={`relative px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#141413] text-[#FAF8F5] scale-110 ring-4 ring-[#C5A880]/50 z-30'
                    : 'bg-white text-[#141413] hover:bg-[#FAF8F5] hover:scale-105 border border-[#D5CCC0]'
                }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-[#C5A880]' : 'text-[#85837B]'
                  }`}
                />
                <span>${hotel.startingPrice}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Header / Controls */}
      <div className="relative z-30 p-4 flex items-center justify-between">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D8] text-[11px] font-semibold text-[#575650] flex items-center gap-2 shadow-xs">
          <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Regional Topography · {hotels.length} Pins</span>
        </div>

        {/* Zoom Buttons */}
        <div className="flex items-center rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D8] p-1 shadow-xs">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Selected Hotel Popover Card (Bottom of Map) */}
      {activeHotel && (
        <div className="relative z-30 p-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white/95 backdrop-blur-md border border-[#E8E2D8] p-3 rounded-2xl shadow-xl flex items-center gap-4 max-w-md ml-auto">
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
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#AF8F64]">
                  {activeHotel.location.city}, {activeHotel.location.country}
                </span>
                <button
                  onClick={() => setActiveHotel(null)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-editorial text-sm font-bold text-[#141413] truncate mt-0.5">
                {activeHotel.name}
              </h4>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EAE1]">
                <div className="flex items-center gap-1 text-xs font-semibold text-[#141413]">
                  <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
                  <span>{activeHotel.guestRating}</span>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="text-xs font-bold text-[#141413]">
                    ${activeHotel.startingPrice}
                    <span className="text-[10px] font-normal text-[#85837B]">/nt</span>
                  </span>
                  <Link
                    href={`/hotel/${activeHotel.slug}`}
                    className="p-1 rounded-full bg-[#141413] text-[#FAF8F5] hover:bg-black transition-colors"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
