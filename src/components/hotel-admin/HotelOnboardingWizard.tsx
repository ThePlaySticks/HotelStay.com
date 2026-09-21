'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Hotel, RoomType, LuxuryTier } from '@/lib/types';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  MapPin,
  BedDouble,
  DollarSign,
  Image as ImageIcon,
  ShieldCheck,
  Plus,
  Trash2,
  User,
  Mail,
  Lock,
} from 'lucide-react';

const CURATED_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
];

const PROPERTY_TYPES: { id: LuxuryTier; name: string; desc: string }[] = [
  { id: 'Boutique', name: 'Luxury Boutique Hotel', desc: 'Refined hotel with curated suites & concierge' },
  { id: 'Guesthouse', name: 'Guesthouse & Suites', desc: 'Charming private rooms and personal hosting' },
  { id: 'Beachfront Villa', name: 'Private Beachfront Villa', desc: 'Secluded luxury coastal estate' },
  { id: 'Bed & Breakfast', name: 'Historic Bed & Breakfast', desc: 'Intimate estate with gourmet breakfast' },
  { id: 'Resort & Spa', name: 'Resort & Thermal Spa', desc: 'Full-service wellness sanctuary' },
  { id: '5-Star Luxury', name: '5-Star Grand Luxury', desc: 'Opulent palatial suites & 24/7 butler service' },
  { id: 'Ocean Resort', name: 'Ocean Resort & Marina', desc: 'Private waterfront beaches & yacht slips' },
  { id: 'Heritage Chateau', name: 'Heritage Baronial Chateau', desc: 'Historic stone estate with private acreage' },
];

export function HotelOnboardingWizard({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const { currentUser, signUp, updateCurrentUser, signIn } = useAuth();
  const { addHotel, showToast } = useMarketplace();

  // Wizard Step: 1 (Account/Auth) -> 2 (Identity & Slug) -> 3 (Location) -> 4 (Suites & Rates) -> 5 (Visuals)
  const [step, setStep] = useState<number>(currentUser ? 2 : 1);
  const [loading, setLoading] = useState(false);

  // Step 1: Account
  const [managerName, setManagerName] = useState(currentUser?.name || '');
  const [managerEmail, setManagerEmail] = useState(currentUser?.email || '');
  const [managerPassword, setManagerPassword] = useState('');

  // Step 2: Hotel Identity
  const [hotelName, setHotelName] = useState('');
  const [slug, setSlug] = useState('');
  const [propertyType, setPropertyType] = useState<LuxuryTier>('Boutique');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  // Step 3: Location
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  // Step 4: Suite & Pricing
  const [suiteName, setSuiteName] = useState('Executive Panoramic Suite');
  const [basePrice, setBasePrice] = useState<number>(350);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [bedType, setBedType] = useState('1 King Bed');
  const [amenities, setAmenities] = useState<string[]>([
    'High-Speed Satellite Wi-Fi',
    'Private Ocean Balcony',
    'Full Gourmet Breakfast Included',
    '24/7 Concierge Support',
    'Rain Shower & Soaking Tub',
  ]);
  const [newAmenity, setNewAmenity] = useState('');

  // Step 5: Visuals
  const [heroImage, setHeroImage] = useState(CURATED_SAMPLE_PHOTOS[0]);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    CURATED_SAMPLE_PHOTOS[1],
    CURATED_SAMPLE_PHOTOS[2],
  ]);

  // Generate slug automatically when name changes if slug wasn't manually edited
  const handleHotelNameChange = (val: string) => {
    setHotelName(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generated);
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (item: string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleFinishOnboarding = async () => {
    if (!hotelName || !city || !country) {
      showToast({
        title: 'Missing Required Fields',
        description: 'Please provide property name, city, and country.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      let activeUser = currentUser;

      // If user wasn't registered yet, sign up now
      if (!activeUser) {
        activeUser = await signUp({
          name: managerName || 'Hotel Manager',
          email: managerEmail || `host-${Date.now()}@hotelstay.com`,
          password: managerPassword || 'hotelstay123',
          role: 'hotel_manager',
          hotelName,
          hotelSlug: slug,
        });
      }

      const finalSlug = slug || hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const hotelId = `hotel-${Date.now()}`;
      const roomId = `room-${Date.now()}`;

      const primaryRoom: RoomType = {
        id: roomId,
        hotelId,
        name: suiteName,
        slug: suiteName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Spacious, beautifully appointed ${suiteName.toLowerCase()} with premium finishes and private bathroom.`,
        sizeSqFt: 650,
        bedType,
        maxGuests,
        view: 'Scenic Landscape View',
        basePricePerNight: basePrice,
        images: [heroImage, ...galleryImages],
        amenities,
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in.',
        mealPlan: 'Artisan Breakfast Included',
        availableCount: 3,
      };

      const newHotel: Hotel = {
        id: hotelId,
        slug: finalSlug,
        name: hotelName,
        tagline: tagline || `${propertyType} in ${city}`,
        description:
          description ||
          `${hotelName} is an exceptional ${propertyType.toLowerCase()} located in ${city}, ${country}. Experience personalized hospitality, exquisite suites, and seamless check-in.`,
        managerId: activeUser.id,
        managerEmail: activeUser.email,
        destinationId: `dest-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        location: {
          city,
          country,
          address: address || `${city} Center`,
          neighborhoodDescription: neighborhood || `Prime location in ${city}`,
          latitude: 0,
          longitude: 0,
        },
        starRating: 5,
        guestRating: 5.0,
        reviewCount: 0,
        heroImage,
        galleryImages,
        startingPrice: basePrice,
        currency: 'USD',
        currencySymbol: '$',
        featured: true,
        luxuryTier: propertyType,
        amenities,
        roomTypes: [primaryRoom],
        policies: {
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cancellationDeadlineHours: 48,
          cancellationFeePercent: 0,
          petPolicy: 'Pet friendly upon request.',
          smokingPolicy: 'Non-smoking interiors.',
          childPolicy: 'Children of all ages welcome.',
        },
        contactEmail: activeUser.email,
        contactPhone: '+1 800 555 0199',
        website: `https://hotelstay.com/hotels/${finalSlug}`,
        status: 'approved',
        commissionRatePercent: 10,
        subscriptionPlan: 'pro',
      };

      // Register hotel in Marketplace state
      addHotel(newHotel);

      // Link hotel to manager's user account
      updateCurrentUser({
        hotelId,
        hotelName,
        hotelSlug: finalSlug,
        role: 'hotel_manager',
      });

      showToast({
        title: 'Property Successfully Onboarded!',
        description: `Your custom domain hotelstay.com/hotels/${finalSlug} is now live.`,
        type: 'success',
      });

      if (onComplete) {
        onComplete();
      }
    } catch {
      showToast({
        title: 'Onboarding Error',
        description: 'Failed to onboard hotel. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0E121B] text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* RareUI Gradient Glow Header */}
      <div className="relative p-6 sm:p-10 border-b border-white/10 overflow-hidden bg-radial from-[#1A2233] to-[#0E121B]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                RareUI Host Onboarding Engine
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Onboard Your Hotel or Guesthouse
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl leading-relaxed">
              Create your account, configure your property, and automatically provision your dedicated tenant domain.
            </p>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-[#C5A880] text-black ring-4 ring-[#C5A880]/20'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 text-stone-500 border border-white/10'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* STEP 1: Account Registration */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 1: Host / Hotel Manager Account</h2>
              <p className="text-xs text-stone-400">
                Create your manager credentials to access PMS tools and oversee your property.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Manager Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Adebayo Adeleke"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="manager@yourhotel.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="password"
                    value={managerPassword}
                    onChange={(e) => setManagerPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!managerEmail) {
                    showToast({ title: 'Email required', type: 'warning' });
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b0926b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Continue to Property Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Hotel Identity & Custom Domain Slug */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 2: Property Identity & Custom Domain</h2>
              <p className="text-xs text-stone-400">
                Choose your hotel or guesthouse name and claim your custom tenant domain slug.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Hotel or Guesthouse Name
                </label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={(e) => handleHotelNameChange(e.target.value)}
                  placeholder="e.g. The Willows Hotel & Residences"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              {/* Custom Domain Slug Live Preview */}
              <div className="p-4 rounded-2xl bg-[#151B28] border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A880] mb-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Your Dedicated Domain Preview:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-stone-400 font-mono">hotelstay.com/hotels/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="thewillows"
                    className="font-mono text-sm font-bold text-white bg-black/40 px-3 py-1.5 rounded-lg border border-[#C5A880]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Guests will access your property directly at this URL to view suites, check availability, and make bookings.
                </p>
              </div>

              {/* Property Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Property Classification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map((pt) => (
                    <div
                      key={pt.id}
                      onClick={() => setPropertyType(pt.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        propertyType === pt.id
                          ? 'bg-[#C5A880]/15 border-[#C5A880] text-white'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{pt.name}</span>
                        {propertyType === pt.id && <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">{pt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Coastal Serenity & Tailored Private Butler Service"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!hotelName) {
                    showToast({ title: 'Property Name required', type: 'warning' });
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b0926b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 3: Location & Coordinates</h2>
              <p className="text-xs text-stone-400">
                Where is your property situated? This helps guests find your hotel during search.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  City / Destination
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos, Nice, Santorini, London, Bali"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nigeria, France, Greece, United Kingdom"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Physical Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 14 Admiralty Way, Victoria Island"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Neighborhood Highlights
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Quiet clifftop road 5 minutes from pristine beaches and yacht marinas."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!city || !country) {
                    showToast({ title: 'City and Country are required', type: 'warning' });
                    return;
                  }
                  setStep(4);
                }}
                className="px-6 py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b0926b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Continue to Suites & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Suites & Nightly Rates */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 4: Primary Suite & Nightly Pricing</h2>
              <p className="text-xs text-stone-400">
                Define your signature accommodation, night rates, and guest capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Signature Suite Name
                </label>
                <input
                  type="text"
                  value={suiteName}
                  onChange={(e) => setSuiteName(e.target.value)}
                  placeholder="e.g. Master Garden View Suite"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Base Price per Night ($ USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A880]" />
                  <input
                    type="number"
                    min="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Bed Setup
                </label>
                <input
                  type="text"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  placeholder="e.g. 1 King Bed, 2 Queen Beds"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>

              {/* Amenities List */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Featured Amenities
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {amenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-stone-200"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(item)}
                        className="text-stone-400 hover:text-rose-400 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                    placeholder="Add an amenity (e.g. Heated Plunge Pool)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b0926b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Continue to Visual Staging</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Visual Staging & Launch */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 5: Visual Staging & Launch</h2>
              <p className="text-xs text-stone-400">
                Select your cover photo from our curated collection or enter a custom photo URL.
              </p>
            </div>

            {/* Curated Gallery Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Select Main Hero Cover Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CURATED_SAMPLE_PHOTOS.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setHeroImage(img)}
                    className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      heroImage === img
                        ? 'border-[#C5A880] ring-4 ring-[#C5A880]/30 scale-[1.02]'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Property Sample" fill sizes="300px" className="object-cover" />
                    {heroImage === img && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#C5A880] text-black text-[10px] font-bold">
                        Selected Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Summary Card */}
            <div className="p-5 rounded-2xl bg-[#151B28] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                  Ready for Instant Deployment
                </div>
                <div className="font-editorial text-xl font-bold text-white mt-1">
                  {hotelName || 'Your Hotel'}
                </div>
                <div className="text-xs text-stone-400 font-mono mt-0.5">
                  hotelstay.com/hotels/{slug || 'thewillows'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-400">Starting Rate</div>
                <div className="text-xl font-bold text-white font-mono">${basePrice} <span className="text-xs font-normal text-stone-400">/ night</span></div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinishOnboarding}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A880] to-[#DFCAAB] hover:opacity-95 text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <span>Deploying Hotel Domain...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Hotel & Live Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
