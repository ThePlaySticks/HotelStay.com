'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Hotel, RoomType } from '@/lib/types';
import {
  Building2,
  CheckCircle2,
  Upload,
  Calendar,
  BedDouble,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Check,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartnerOnboardingPage() {
  const router = useRouter();
  const { destinations, submitHotelForReview, showToast } = useMarketplace();
  const { currentPersona } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // STEP 1: PARTNER ACCOUNT & COMPANY
  const [partnerName, setPartnerName] = useState(currentPersona.name || 'Adewale Balogun');
  const [partnerEmail, setPartnerEmail] = useState(currentPersona.email || 'partner@hospitalitygroup.ng');
  const [partnerPhone, setPartnerPhone] = useState('+234 802 987 6543');
  const [companyName, setCompanyName] = useState('Balogun Heritage Hospitality Ltd');

  // STEP 2: PROPERTY INFORMATION
  const [hotelName, setHotelName] = useState('The Victoria Cliffside Boutique Hotel');
  const [tagline, setTagline] = useState('Panoramic Atlantic Horizons & Teakwood Private Terraces');
  const [luxuryTier, setLuxuryTier] = useState<Hotel['luxuryTier']>('5-Star Luxury');
  const [selectedDestCity, setSelectedDestCity] = useState('Lagos');
  const [address, setAddress] = useState('8 Marina Terrace, Victoria Island');
  const [description, setDescription] = useState(
    'A secluded waterfront boutique sanctuary crafted with monolithic stone architecture, private heated terrace plunge pools, and bespoke African art curation.'
  );
  const [checkInTime, setCheckInTime] = useState('15:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Rooftop Ocean Infinity Pool',
    'Michelin-Caliber African Fusion Dining',
    'Holistic Thermal Spa & Hammam',
    '24/7 Dedicated Butler Service',
  ]);

  // STEP 3: PROPERTY PHOTOS
  const [coverPhoto, setCoverPhoto] = useState(
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  );
  const [exteriorPhoto, setExteriorPhoto] = useState(
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
  );
  const [roomPhoto, setRoomPhoto] = useState(
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
  );
  const [poolPhoto, setPoolPhoto] = useState(
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'
  );

  // STEP 4: ROOMS CREATION
  const [rooms, setRooms] = useState<RoomType[]>([
    {
      id: 'rm-onboard-1',
      hotelId: 'hotel-new-partner',
      name: 'Atlantic Horizon Deluxe Suite',
      slug: 'atlantic-horizon-deluxe',
      description: 'Private terrace suite with ocean panorama, marble rain shower, and teak furnishings.',
      sizeSqFt: 750,
      bedType: '1 King Bed',
      maxGuests: 2,
      view: 'Atlantic Ocean Horizon',
      basePricePerNight: 550,
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Private Balcony', 'Nespresso Atelier', 'Marble Soaking Tub'],
      cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival.',
      mealPlan: 'Gourmet Organic Breakfast Included',
      availableCount: 4,
    },
    {
      id: 'rm-onboard-2',
      hotelId: 'hotel-new-partner',
      name: 'The Sovereign Presidential Penthouse',
      slug: 'sovereign-presidential-penthouse',
      description: 'Expansive corner penthouse with private heated plunge pool, dedicated butler pantry, and 360-degree vistas.',
      sizeSqFt: 1800,
      bedType: '2 Emperor King Beds',
      maxGuests: 4,
      view: '360° Coastal & Skyline Panorama',
      basePricePerNight: 1450,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Private Plunge Pool', 'Personal Butler', 'Chef Kitchen'],
      cancellationPolicy: '72-hour cancellation policy.',
      mealPlan: 'All In-Suite Dining Inclusions',
      availableCount: 1,
    },
  ]);

  // STEP 5: PRICING & AVAILABILITY
  const [baseNightlyRate, setBaseNightlyRate] = useState<number>(550);
  const [commissionTier, setCommissionTier] = useState<'standard' | 'preferred'>('standard');

  const ALL_AMENITY_OPTIONS = [
    'Rooftop Ocean Infinity Pool',
    'Michelin-Caliber African Fusion Dining',
    'Holistic Thermal Spa & Hammam',
    '24/7 Dedicated Butler Service',
    'Chauffeured Armored Escort Available',
    'Private Helipad Access',
    'Subterranean Vintage Wine Vault',
    'Private Beach Club Access',
  ];

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleAddRoom = () => {
    const newRoom: RoomType = {
      id: `rm-onboard-${Date.now()}`,
      hotelId: 'hotel-new-partner',
      name: 'Executive Garden Villa',
      slug: `executive-garden-villa-${Date.now()}`,
      description: 'Secluded courtyard villa surrounded by tropical palms with freestanding outdoor stone tub.',
      sizeSqFt: 900,
      bedType: '1 King Bed',
      maxGuests: 2,
      view: 'Private Tropical Garden',
      basePricePerNight: 720,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Private Garden Patio', 'Outdoor Stone Tub', 'Daily High Tea'],
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
      mealPlan: 'Full Gourmet Breakfast Included',
      availableCount: 2,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const handleRemoveRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmitApplication = () => {
    const matchedDest = destinations.find(
      (d) => d.city.toLowerCase() === selectedDestCity.toLowerCase()
    );

    const newHotel: Hotel = {
      id: `hotel-${Date.now()}`,
      slug: hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: hotelName,
      tagline,
      description,
      managerId: currentPersona.id,
      managerEmail: partnerEmail,
      destinationId: matchedDest?.id || 'dest-lagos',
      location: {
        city: selectedDestCity,
        country: matchedDest?.country || 'Nigeria',
        address,
        latitude: 6.4281,
        longitude: 3.4219,
        neighborhoodDescription: `${address}, ${selectedDestCity}`,
      },
      starRating: 5,
      guestRating: 5.0,
      reviewCount: 0,
      heroImage: coverPhoto,
      galleryImages: [coverPhoto, exteriorPhoto, roomPhoto, poolPhoto],
      categorizedPhotos: {
        cover: coverPhoto,
        exterior: [exteriorPhoto],
        lobby: [coverPhoto],
        rooms: [roomPhoto],
        dining: [coverPhoto],
        pool: [poolPhoto],
        facilities: [exteriorPhoto],
      },
      startingPrice: baseNightlyRate,
      currency: 'USD',
      currencySymbol: '$',
      featured: false,
      luxuryTier,
      amenities: selectedAmenities,
      roomTypes: rooms,
      policies: {
        checkInTime,
        checkOutTime,
        cancellationDeadlineHours: 48,
        cancellationFeePercent: 0,
        petPolicy: 'Pets permitted in designated villas.',
        smokingPolicy: 'Non-smoking suites.',
        childPolicy: 'Children welcomed.',
      },
      contactEmail: partnerEmail,
      contactPhone: partnerPhone,
      status: 'submitted',
      commissionRatePercent: commissionTier === 'preferred' ? 10.0 : 12.5,
      subscriptionPlan: 'enterprise',
      createdAt: new Date().toISOString(),
    };

    submitHotelForReview(newHotel);
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#AF8F64] mb-2">
            <Building2 className="w-4 h-4" />
            HotelStay Partner Portal
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413]">
            List Your Property with HotelStay
          </h1>
          <p className="text-xs text-[#575650] mt-1.5 leading-relaxed">
            Join our curated global portfolio of independent luxury hotels, private villas, and bespoke sanctuaries.
          </p>
        </div>

        {/* ONBOARDING PROGRESS BAR */}
        {!submitted && (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 mb-8 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#575650] mb-2">
              <span>Step {step} of 5</span>
              <span className="text-[#AF8F64]">
                {step === 1 && 'Partner Identity'}
                {step === 2 && 'Property Details'}
                {step === 3 && 'Photography'}
                {step === 4 && 'Room Inventory'}
                {step === 5 && 'Pricing & Submit'}
              </span>
            </div>
            <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#E8E2D8]">
              <div
                className="bg-[#141413] h-full transition-all duration-500 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SUBMITTED SUCCESS VIEW */}
        {submitted ? (
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Application Submitted · Status: Under Review
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#141413] mt-3">
                {hotelName} Received for Curation Review
              </h2>
              <p className="text-xs text-[#575650] max-w-md mx-auto mt-2 leading-relaxed">
                Our HotelStay property curation committee is reviewing your details, room inventory, and photography against our 120-point quality index.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1] max-w-md mx-auto text-left text-xs space-y-2 text-[#575650]">
              <div className="flex justify-between">
                <span className="text-[#85837B]">Submission Date:</span>
                <span className="font-semibold text-[#141413]">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Destination:</span>
                <span className="font-semibold text-[#141413]">{selectedDestCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Configured Rooms:</span>
                <span className="font-semibold text-[#141413]">{rooms.length} Room Types</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Expected Review Time:</span>
                <span className="font-semibold text-emerald-700">Within 24 Hours</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hotel-admin"
                className="px-7 py-3.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Access Hotel PMS Dashboard
              </Link>
              <Link
                href="/"
                className="px-7 py-3.5 rounded-full border border-[#D5CCC0] bg-white text-[#141413] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF8F5]"
              >
                Return to Marketplace
              </Link>
            </div>
          </div>
        ) : (
          /* MULTI-STEP WIZARD FORM */
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            {/* STEP 1: PARTNER IDENTITY */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">1. Partner & Company Information</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Please provide your official business details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Primary Contact Name</label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Business Email</label>
                    <input
                      type="email"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Direct Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Hospitality / Operating Entity</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY INFORMATION */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">2. Property Information & Location</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Define your sanctuary's location and positioning.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Hotel / Property Name</label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Luxury Tier</label>
                    <select
                      value={luxuryTier}
                      onChange={(e) => setLuxuryTier(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden cursor-pointer"
                    >
                      <option value="5-Star Luxury">5-Star Luxury Palace / Resort</option>
                      <option value="Boutique">Boutique Sanctuary</option>
                      <option value="Ocean Resort">Oceanfront Island Resort</option>
                      <option value="Heritage Chateau">Heritage Chateau & Estate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Destination Database City</label>
                    <select
                      value={selectedDestCity}
                      onChange={(e) => setSelectedDestCity(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden cursor-pointer"
                    >
                      {destinations.map((d) => (
                        <option key={d.id} value={d.city}>
                          {d.city}, {d.country} ({d.region || 'International'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Physical Address / Street</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Architectural Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-4 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Check-In Time</label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">Check-Out Time</label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Amenities Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-2">Verified Property Amenities</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_AMENITY_OPTIONS.map((am) => {
                      const active = selectedAmenities.includes(am);
                      return (
                        <button
                          key={am}
                          type="button"
                          onClick={() => toggleAmenity(am)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                            active
                              ? 'bg-[#141413] text-white border-[#141413]'
                              : 'bg-[#FAF8F5] text-[#575650] border-[#E8E2D8] hover:bg-[#F0EAE1]'
                          }`}
                        >
                          <span>{am}</span>
                          {active && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROPERTY PHOTOGRAPHY */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">3. Categorized High-Resolution Photos</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">
                    Upload or link high-resolution architectural photographs. Avoid placeholder watermarks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#141413]">Main Cover Hero Photo</label>
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-[#E8E2D8]">
                      <Image src={coverPhoto} alt="Cover" fill className="object-cover" />
                    </div>
                    <input
                      type="text"
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      placeholder="Image URL"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#141413]">Exterior / Grounds</label>
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-[#E8E2D8]">
                      <Image src={exteriorPhoto} alt="Exterior" fill className="object-cover" />
                    </div>
                    <input
                      type="text"
                      value={exteriorPhoto}
                      onChange={(e) => setExteriorPhoto(e.target.value)}
                      placeholder="Image URL"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#141413]">Suites & Rooms</label>
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-[#E8E2D8]">
                      <Image src={roomPhoto} alt="Rooms" fill className="object-cover" />
                    </div>
                    <input
                      type="text"
                      value={roomPhoto}
                      onChange={(e) => setRoomPhoto(e.target.value)}
                      placeholder="Image URL"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#141413]">Pool / Wellness Facilities</label>
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-[#E8E2D8]">
                      <Image src={poolPhoto} alt="Pool" fill className="object-cover" />
                    </div>
                    <input
                      type="text"
                      value={poolPhoto}
                      onChange={(e) => setPoolPhoto(e.target.value)}
                      placeholder="Image URL"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ROOM INVENTORY CREATION */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-[#141413]">4. Room Types & Inventory Configuration</h2>
                    <p className="text-xs text-[#85837B] mt-0.5">Configure room categories and nightly base pricing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="px-4 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Room Type
                  </button>
                </div>

                <div className="space-y-4">
                  {rooms.map((rm, idx) => (
                    <div key={rm.id} className="p-4 sm:p-6 rounded-2xl border border-[#E8E2D8] bg-[#FAF8F5] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#AF8F64]">
                          Room Type #{idx + 1}
                        </span>
                        {rooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(rm.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Room Name</label>
                          <input
                            type="text"
                            value={rm.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRooms((prev) =>
                                prev.map((r) => (r.id === rm.id ? { ...r, name: val } : r))
                              );
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Nightly Rate ($)</label>
                          <input
                            type="number"
                            value={rm.basePricePerNight}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRooms((prev) =>
                                prev.map((r) => (r.id === rm.id ? { ...r, basePricePerNight: val } : r))
                              );
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Bed Configuration</label>
                          <input
                            type="text"
                            value={rm.bedType}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRooms((prev) =>
                                prev.map((r) => (r.id === rm.id ? { ...r, bedType: val } : r))
                              );
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Max Occupancy</label>
                          <input
                            type="number"
                            value={rm.maxGuests}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRooms((prev) =>
                                prev.map((r) => (r.id === rm.id ? { ...r, maxGuests: val } : r))
                              );
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Physical Units Available</label>
                          <input
                            type="number"
                            value={rm.availableCount}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRooms((prev) =>
                                prev.map((r) => (r.id === rm.id ? { ...r, availableCount: val } : r))
                              );
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: PRICING & SUBMIT */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">5. Settlement Agreement & Review Submission</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Confirm commission terms and submit for curation review.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setCommissionTier('standard')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      commissionTier === 'standard'
                        ? 'bg-white border-[#141413] ring-2 ring-[#141413]/20 shadow-md'
                        : 'bg-[#FAF8F5] border-[#E8E2D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#141413]">Standard Marketplace Plan</span>
                      <span className="text-xs font-bold text-[#C5A880]">12.5% Commission</span>
                    </div>
                    <p className="text-xs text-[#575650] mt-2">
                      Full PMS suite, direct guest messaging, multi-currency booking engine, and standard payout cycle.
                    </p>
                  </div>

                  <div
                    onClick={() => setCommissionTier('preferred')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      commissionTier === 'preferred'
                        ? 'bg-white border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-md'
                        : 'bg-[#FAF8F5] border-[#E8E2D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#141413]">Preferred Partner Plan</span>
                      <span className="text-xs font-bold text-[#C5A880]">10.0% Commission</span>
                    </div>
                    <p className="text-xs text-[#575650] mt-2">
                      Dedicated account manager, promoted placement across featured destinations, and priority settlement.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#AF8F64]" />
                    Quality & Curation Review Policy
                  </div>
                  <p>
                    Submitted properties are vetted by the HotelStay Super Admin panel before appearing publicly. You will receive an email confirmation upon approval.
                  </p>
                </div>
              </div>
            )}

            {/* WIZARD ACTIONS */}
            <div className="pt-6 border-t border-[#F0EAE1] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2.5 rounded-full border border-[#D5CCC0] text-xs font-semibold text-stone-700 hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-7 py-3 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="px-8 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Property for Review</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
