'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Hotel, RoomType } from '@/lib/types';
import { getSupabaseClient } from '@/lib/supabase';
import {
  Building2,
  CheckCircle2,
  Upload,
  Calendar as CalendarIcon,
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
  Globe,
  Share2,
  Search,
  ChevronDown,
  X,
  CreditCard,
  Edit3,
  Image as ImageIcon,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================================================
// COUNTRY & CITY-STATE DATASETS
// ============================================================================
interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
];

// Nigeria City -> State intelligent mapping dataset
const NIGERIA_CITY_STATE_MAP: Record<string, string> = {
  'Ibadan': 'Oyo',
  'Lagos': 'Lagos',
  'Ikeja': 'Lagos',
  'Victoria Island': 'Lagos',
  'Lekki': 'Lagos',
  'Abuja': 'Federal Capital Territory',
  'Port Harcourt': 'Rivers',
  'Kano': 'Kano',
  'Enugu': 'Enugu',
  'Calabar': 'Cross River',
  'Benin City': 'Edo',
  'Owerri': 'Imo',
  'Abeokuta': 'Ogun',
  'Jos': 'Plateau',
  'Kaduna': 'Kaduna',
  'Asaba': 'Delta',
  'Akure': 'Ondo',
  'Uyo': 'Akwa Ibom',
  'Ilorin': 'Kwara',
  'Warri': 'Delta',
  'Maiduguri': 'Borno',
  'Sokoto': 'Sokoto',
  'Minna': 'Niger',
  'Abakaliki': 'Ebonyi',
  'Awka': 'Anambra',
  'Ado Ekiti': 'Ekiti',
  'Lokoja': 'Kogi',
  'Yola': 'Adamawa',
};

const HOTEL_TYPES = [
  'Hotel',
  'Resort',
  'Apartment',
  'Guest House',
  'Boutique Hotel',
  'Villa',
  'Lodge',
  'Hostel',
  'Other',
];

const HOTEL_AMENITY_OPTIONS = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Restaurant',
  'Bar',
  'Gym',
  'Parking',
  'Air Conditioning',
  'Airport Shuttle',
  'Spa',
  'Room Service',
  '24/7 Reception',
  'Laundry',
  'Conference Facilities',
];

const NIGERIAN_BANKS = [
  'Access Bank',
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Fidelity Bank',
  'FCMB',
  'Stanbic IBTC Bank',
  'Sterling Bank',
  'Union Bank',
  'Wema Bank',
  'Kuda Bank',
  'Moniepoint Microfinance Bank',
  'OPay',
  'Palmpay',
];

export default function PartnerOnboardingPage() {
  const router = useRouter();
  const { submitHotelForReview, showToast } = useMarketplace();
  const { currentPersona, isAuthenticated, openAuthModal } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // CATEGORY SELECTION (Hotels, Holiday Rentals, Transport, Tours & Experiences, Other)
  const [selectedCategory, setSelectedCategory] = useState<'hotels' | 'holiday_rentals' | 'transport' | 'tours_experiences' | 'other_hospitality'>('hotels');

  // STEP 1: BUSINESS IDENTITY & LOCATION
  const [hotelName, setHotelName] = useState('The Victoria Cliffside Boutique Hotel');
  const [hotelType, setHotelType] = useState('Boutique Hotel');
  const [description, setDescription] = useState(
    'A secluded waterfront boutique sanctuary crafted with monolithic stone architecture, private heated terrace plunge pools, and bespoke African art curation.'
  );
  const [hotelPhone, setHotelPhone] = useState('+234 802 987 6543');
  const [hotelEmail, setHotelEmail] = useState(currentPersona?.email || 'stay@victoriacliffside.com');
  const [website, setWebsite] = useState('https://victoriacliffside.com');
  const [socialMedia, setSocialMedia] = useState('@victoriacliffside_lagos');

  // CATEGORY-SPECIFIC DETAILS
  // Holiday Rental details
  const [rentalPropertyType, setRentalPropertyType] = useState('Waterfront Villa');
  const [bedroomsCount, setBedroomsCount] = useState(4);
  const [bathroomsCount, setBathroomsCount] = useState(5);
  const [maxCapacity, setMaxCapacity] = useState(8);
  const [minimumStayNights, setMinimumStayNights] = useState(2);
  const [nightlyRate, setNightlyRate] = useState(950);

  // Transport details
  const [vehicleType, setVehicleType] = useState('Range Rover Autobiography SV / Maybach S-Class');
  const [passengerCapacity, setPassengerCapacity] = useState(4);
  const [luggageCapacity, setLuggageCapacity] = useState(4);
  const [driverOption, setDriverOption] = useState<'self_drive' | 'with_driver' | 'both'>('with_driver');
  const [dailyRate, setDailyRate] = useState(480);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [serviceAreas, setServiceAreas] = useState('Lagos, Victoria Island, Ikoyi, Ikeja Airport');

  // Tours & Experiences details
  const [durationHours, setDurationHours] = useState(8);
  const [groupSizeLimit, setGroupSizeLimit] = useState(12);
  const [includedServices, setIncludedServices] = useState('Yacht Charter, Private Chef Lunch, Open Bar, Watersports');
  const [pricePerPerson, setPricePerPerson] = useState(350);
  const [meetingPoint, setMeetingPoint] = useState('Lekki Phase 1 Marina Berth 4');

  // LOCATION FIELDS
  const [country, setCountry] = useState('Nigeria');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [city, setCity] = useState('Lagos');
  const [stateProvince, setStateProvince] = useState('Lagos');
  const [fullAddress, setFullAddress] = useState('8 Marina Terrace, Victoria Island');
  const [postalCode, setPostalCode] = useState('101241');

  // STEP 2: AMENITIES, PHOTOS & POLICIES
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Free Wi-Fi',
    'Swimming Pool',
    'Restaurant',
    'Bar',
    'Spa',
    '24/7 Reception',
  ]);

  // Categorized Photos
  const [exteriorPhoto, setExteriorPhoto] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80');
  const [lobbyPhoto, setLobbyPhoto] = useState('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80');
  const [roomPhoto, setRoomPhoto] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80');
  const [poolPhoto, setPoolPhoto] = useState('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80');
  const [facilityPhoto, setFacilityPhoto] = useState('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Draft Management Logic
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('hotelstay_onboard_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.hotelName) setHotelName(parsed.hotelName);
        if (parsed.selectedCategory) setSelectedCategory(parsed.selectedCategory);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.city) setCity(parsed.city);
        if (parsed.fullAddress) setFullAddress(parsed.fullAddress);
        showToast({
          title: 'Draft Restored',
          description: 'Your saved onboarding progress has been restored.',
          type: 'info',
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const saveDraft = () => {
    const draftData = {
      selectedCategory,
      hotelName,
      hotelType,
      description,
      hotelPhone,
      hotelEmail,
      website,
      country,
      city,
      stateProvince,
      fullAddress,
      rentalPropertyType,
      bedroomsCount,
      bathroomsCount,
      maxCapacity,
      nightlyRate,
      vehicleType,
      dailyRate,
      durationHours,
      pricePerPerson,
      step,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('hotelstay_onboard_draft', JSON.stringify(draftData));
      showToast({
        title: 'Draft Saved Successfully',
        description: 'You can pause and resume onboarding anytime.',
        type: 'success',
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Policies
  const [checkInTime, setCheckInTime] = useState('15:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [cancellationPolicy, setCancellationPolicy] = useState('Free cancellation up to 48 hours prior to check-in.');
  const [childPolicy, setChildPolicy] = useState('Children of all ages welcomed.');
  const [petPolicy, setPetPolicy] = useState('Pets permitted in designated villas with prior notice.');
  const [smokingPolicy, setSmokingPolicy] = useState('Strictly non-smoking indoors; designated outdoor lounges available.');
  const [otherRules, setOtherRules] = useState('Quiet hours between 22:00 and 07:00.');

  // STEP 3: ADD ROOMS
  const [rooms, setRooms] = useState<RoomType[]>([
    {
      id: 'rm-onboard-1',
      hotelId: 'hotel-partner',
      name: 'Deluxe King Suite',
      slug: 'deluxe-king-suite',
      description: 'Private terrace suite with ocean panorama, marble rain shower, and teak furnishings.',
      sizeSqFt: 750,
      bedType: '1 King Bed',
      maxGuests: 2,
      basePricePerNight: 120000,
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Private Balcony', 'Nespresso Atelier', 'Marble Soaking Tub'],
      cancellationPolicy: 'Free cancellation up to 48h prior.',
      mealPlan: 'Breakfast Included',
      availableCount: 4,
    },
    {
      id: 'rm-onboard-2',
      hotelId: 'hotel-partner',
      name: 'Executive Presidential Penthouse',
      slug: 'executive-presidential-penthouse',
      description: 'Corner penthouse with private heated plunge pool, dedicated butler pantry, and 360-degree vistas.',
      sizeSqFt: 1800,
      bedType: '2 King Beds',
      maxGuests: 4,
      basePricePerNight: 280000,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Private Plunge Pool', 'Personal Butler', 'Chef Kitchen'],
      cancellationPolicy: '72-hour cancellation policy.',
      mealPlan: 'Full In-Suite Breakfast Included',
      availableCount: 2,
    },
  ]);

  // Modal State for Adding/Editing Room
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    bedType: '1 King Bed',
    maxGuests: 2,
    sizeSqFt: 500,
    basePricePerNight: 85000,
    availableCount: 3,
    mealPlan: 'Breakfast Included',
  });

  // STEP 4: PRICING & AVAILABILITY
  const [baseNightlyRate, setBaseNightlyRate] = useState<number>(120000);
  const [availableCount, setAvailableCount] = useState<number>(6);

  // Calendar dates matrix state
  const [calendarDates, setCalendarDates] = useState([
    { date: '2026-10-01', status: 'available', price: 120000 },
    { date: '2026-10-02', status: 'available', price: 120000 },
    { date: '2026-10-03', status: 'limited', price: 150000 },
    { date: '2026-10-04', status: 'blocked', price: 120000 },
    { date: '2026-10-05', status: 'available', price: 120000 },
    { date: '2026-10-06', status: 'available', price: 120000 },
    { date: '2026-10-07', status: 'available', price: 120000 },
  ]);

  // STEP 5: NIGERIAN PAYOUT DETAILS
  const [bankName, setBankName] = useState('Zenith Bank');
  const [accountName, setAccountName] = useState('Balogun Heritage Hospitality Ltd');
  const [accountNumber, setAccountNumber] = useState('1012345678');

  // Auto-fill state based on city selection
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (country === 'Nigeria') {
      const foundState = NIGERIA_CITY_STATE_MAP[newCity];
      if (foundState) {
        setStateProvince(foundState);
      }
    }
  };

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Open Room Modal
  const openRoomModal = (roomToEdit?: RoomType) => {
    if (roomToEdit) {
      setEditingRoom(roomToEdit);
      setRoomForm({
        name: roomToEdit.name,
        description: roomToEdit.description || '',
        bedType: roomToEdit.bedType,
        maxGuests: roomToEdit.maxGuests,
        sizeSqFt: roomToEdit.sizeSqFt || 500,
        basePricePerNight: roomToEdit.basePricePerNight,
        availableCount: roomToEdit.availableCount,
        mealPlan: roomToEdit.mealPlan || 'Breakfast Included',
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        name: '',
        description: '',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqFt: 500,
        basePricePerNight: 85000,
        availableCount: 3,
        mealPlan: 'Breakfast Included',
      });
    }
    setIsRoomModalOpen(true);
  };

  const saveRoomModal = () => {
    if (!roomForm.name.trim()) return;

    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? {
                ...r,
                name: roomForm.name,
                description: roomForm.description,
                bedType: roomForm.bedType,
                maxGuests: roomForm.maxGuests,
                sizeSqFt: roomForm.sizeSqFt,
                basePricePerNight: roomForm.basePricePerNight,
                availableCount: roomForm.availableCount,
                mealPlan: roomForm.mealPlan,
              }
            : r
        )
      );
    } else {
      const newRoom: RoomType = {
        id: `rm-${Date.now()}`,
        hotelId: 'hotel-partner',
        name: roomForm.name,
        slug: roomForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: roomForm.description,
        sizeSqFt: roomForm.sizeSqFt,
        bedType: roomForm.bedType,
        maxGuests: roomForm.maxGuests,
        basePricePerNight: roomForm.basePricePerNight,
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
        amenities: ['Wi-Fi', 'Air Conditioning', 'En-suite Bathroom'],
        mealPlan: roomForm.mealPlan,
        availableCount: roomForm.availableCount,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setIsRoomModalOpen(false);
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // Submit Hotel Application
  const handleSubmitApplication = async () => {
    const newHotel: Hotel = {
      id: `hotel-${Date.now()}`,
      slug: hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: hotelName,
      tagline: `${hotelType} in ${city}, ${stateProvince}`,
      description,
      managerId: currentPersona.id,
      managerEmail: hotelEmail,
      destinationId: 'dest-lagos',
      location: {
        city,
        country,
        address: fullAddress,
        latitude: 6.4281,
        longitude: 3.4219,
        neighborhoodDescription: `${fullAddress}, ${city}, ${stateProvince}`,
      },
      starRating: 5,
      guestRating: 5.0,
      reviewCount: 0,
      heroImage: exteriorPhoto,
      galleryImages: [exteriorPhoto, lobbyPhoto, roomPhoto, poolPhoto, facilityPhoto],
      categorizedPhotos: {
        cover: exteriorPhoto,
        exterior: [exteriorPhoto],
        lobby: [lobbyPhoto],
        rooms: [roomPhoto],
        dining: [facilityPhoto],
        pool: [poolPhoto],
        facilities: [facilityPhoto],
      },
      startingPrice: baseNightlyRate,
      currency: 'NGN',
      currencySymbol: '₦',
      featured: false,
      luxuryTier: '5-Star Luxury',
      amenities: selectedAmenities,
      roomTypes: rooms,
      policies: {
        checkInTime,
        checkOutTime,
        cancellationDeadlineHours: 48,
        cancellationFeePercent: 0,
        petPolicy,
        smokingPolicy,
        childPolicy,
      },
      contactEmail: hotelEmail,
      contactPhone: hotelPhone,
      status: 'pending_review' as any,
      commissionRatePercent: 12.5,
      subscriptionPlan: 'enterprise',
      createdAt: new Date().toISOString(),
    };

    submitHotelForReview(newHotel);

    // Write application record to Supabase if client active
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('hotels').insert({
          id: newHotel.id,
          name: hotelName,
          slug: newHotel.slug,
          description,
          city,
          country,
          state_province: stateProvince,
          address: fullAddress,
          postal_code: postalCode,
          phone: hotelPhone,
          email: hotelEmail,
          website,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
          amenities: selectedAmenities,
          images: [exteriorPhoto, lobbyPhoto, roomPhoto, poolPhoto],
          status: 'pending_review',
        });

        await client.from('payout_accounts').insert({
          id: `payout-${Date.now()}`,
          hotel_id: newHotel.id,
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          currency: 'NGN',
        });
      } catch (err) {
        console.error('Supabase write error:', err);
      }
    }

    setSubmitted(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#AF8F64] mb-2">
            <Building2 className="w-4 h-4" />
            HotelStay Partner Onboarding
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413]">
            Create Your Hotel Profile
          </h1>
          <p className="text-xs text-[#575650] mt-1.5 leading-relaxed">
            Provide your property details, room configurations, and payout details to get listed.
          </p>
        </div>

        {/* STEP PROGRESS BAR */}
        {!submitted && (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 mb-8 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#575650] mb-2">
              <span>Step {step} of 6</span>
              <span className="text-[#AF8F64] font-bold">
                {step === 1 && 'Hotel Information & Location'}
                {step === 2 && 'Amenities, Photos & Policies'}
                {step === 3 && 'Add Rooms'}
                {step === 4 && 'Pricing & Availability'}
                {step === 5 && 'Payment / Payout Details'}
                {step === 6 && 'Review & Final Submit'}
              </span>
            </div>
            <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#E8E2D8]">
              <div
                className="bg-[#141413] h-full transition-all duration-500 rounded-full"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SUBMITTED CONFIRMATION VIEW */}
        {submitted ? (
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Pending Review
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#141413] mt-3">
                {hotelName} Submitted for Verification
              </h2>
              <p className="text-xs text-[#575650] max-w-md mx-auto mt-2 leading-relaxed">
                Your hotel has been submitted and is currently being reviewed by HotelStay. You will be notified once verification is complete.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1] max-w-md mx-auto text-left text-xs space-y-2.5 text-[#575650]">
              <div className="flex justify-between">
                <span className="text-[#85837B]">Submission Date:</span>
                <span className="font-semibold text-[#141413]">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Location:</span>
                <span className="font-semibold text-[#141413]">{city}, {stateProvince}, {country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Configured Rooms:</span>
                <span className="font-semibold text-[#141413]">{rooms.length} Room Types</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85837B]">Review Status:</span>
                <span className="font-bold text-amber-700">pending_review</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hotel-admin"
                className="px-7 py-3.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Go to Partner Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            {/* STEP 1: HOTEL INFORMATION & LOCATION */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">1. Hotel Information & Location</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Basic details and property location.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Hotel Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Hotel Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hotelType}
                      onChange={(e) => setHotelType(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    >
                      {HOTEL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={hotelEmail}
                      onChange={(e) => setHotelEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Property Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={hotelPhone}
                      onChange={(e) => setHotelPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* SEARCHABLE COUNTRY SELECTOR */}
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium flex items-center justify-between cursor-pointer hover:border-[#C5A880]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{COUNTRIES.find((c) => c.name === country)?.flag || '🌐'}</span>
                        <span className="font-semibold text-[#141413]">{country}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    </div>

                    {isCountryOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl z-30 p-2 space-y-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Type to search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredCountries.map((c) => (
                            <div
                              key={c.code}
                              onClick={() => {
                                setCountry(c.name);
                                setIsCountryOpen(false);
                              }}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] cursor-pointer"
                            >
                              <span>{c.flag}</span>
                              <span className="font-medium text-[#141413]">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CITY AND AUTOMATIC STATE LOOKUP */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    >
                      {Object.keys(NIGERIA_CITY_STATE_MAP).map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      State / Province (Auto-populated)
                    </label>
                    <input
                      type="text"
                      value={stateProvince}
                      onChange={(e) => setStateProvince(e.target.value)}
                      className="w-full bg-stone-100 border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-bold text-[#141413] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: AMENITIES, PHOTOS & POLICIES */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">2. Amenities, Photos & Policies</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Select amenities, upload photos, and set property rules.</p>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-3">
                    Hotel Amenities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {HOTEL_AMENITY_OPTIONS.map((item) => {
                      const isSelected = selectedAmenities.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAmenity(item)}
                          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#141413] text-white border-[#141413]'
                              : 'bg-[#FAF8F5] text-stone-700 border-[#E8E2D8] hover:bg-stone-100'
                          }`}
                        >
                          <span>{item}</span>
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#C5A880]" /> : <Square className="w-4 h-4 text-stone-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photo Manager */}
                <div className="pt-4 border-t border-[#E8E2D8]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-3">
                    Hotel Photography (Categorized Uploads)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] font-semibold text-stone-600 mb-1">Exterior Photo URL</span>
                      <input
                        type="url"
                        value={exteriorPhoto}
                        onChange={(e) => setExteriorPhoto(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-stone-600 mb-1">Lobby Photo URL</span>
                      <input
                        type="url"
                        value={lobbyPhoto}
                        onChange={(e) => setLobbyPhoto(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Photo Preview Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[exteriorPhoto, lobbyPhoto, roomPhoto, poolPhoto, facilityPhoto].map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-stone-200">
                        <Image src={img} alt="Photo Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(img)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
                        >
                          Preview
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div className="pt-4 border-t border-[#E8E2D8] space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Property Policies
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] font-semibold text-stone-700 mb-1">Check-in Time</span>
                      <input
                        type="time"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-stone-700 mb-1">Check-out Time</span>
                      <input
                        type="time"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[11px] font-semibold text-stone-700 mb-1">Cancellation Policy</span>
                      <input
                        type="text"
                        value={cancellationPolicy}
                        onChange={(e) => setCancellationPolicy(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ADD ROOMS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-[#141413]">3. Room Types & Inventory</h2>
                    <p className="text-xs text-[#85837B] mt-0.5">Configure room categories and nightly pricing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRoomModal()}
                    className="py-2.5 px-4 rounded-2xl bg-[#141413] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#C5A880]" />
                    <span>Add Room Type</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-5 rounded-2xl border border-[#E8E2D8] bg-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-editorial text-lg font-bold text-[#141413]">{room.name}</h4>
                        <p className="text-xs text-stone-500">{room.description}</p>
                        <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-stone-600 font-medium">
                          <span>🛏 {room.bedType}</span>
                          <span>•</span>
                          <span>👥 Max {room.maxGuests} Guests</span>
                          <span>•</span>
                          <span className="font-bold text-[#141413]">₦{room.basePricePerNight.toLocaleString()}/night</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openRoomModal(room)}
                          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-black"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRoom(room.id)}
                          className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: PRICING & AVAILABILITY */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">4. Pricing & Calendar Availability</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Manage nightly base pricing and availability dates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Base Nightly Price (₦ NGN)
                    </label>
                    <input
                      type="number"
                      value={baseNightlyRate}
                      onChange={(e) => setBaseNightlyRate(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-bold text-[#141413]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Total Rooms Available
                    </label>
                    <input
                      type="number"
                      value={availableCount}
                      onChange={(e) => setAvailableCount(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-bold text-[#141413]"
                    />
                  </div>
                </div>

                {/* Calendar Grid Status Legend */}
                <div className="pt-4 border-t border-[#E8E2D8] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#141413] uppercase tracking-wider">Availability Calendar Matrix</span>
                    <div className="flex items-center gap-3 font-semibold text-[11px]">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green = Available</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Red = Unavailable</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow = Limited</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDates.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-center space-y-1 ${
                          item.status === 'available'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : item.status === 'blocked'
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase">{item.date}</span>
                        <span className="block text-xs font-bold">₦{(item.price / 1000).toFixed(0)}k</span>
                        <span className="block text-[9px] uppercase font-bold tracking-wider">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT / PAYOUT DETAILS */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">5. Payout Account Details (Nigeria)</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Collect payout bank details for HotelStay disbursements.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Your banking credentials are kept strictly confidential and used solely for payout transfers.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none"
                    >
                      {NIGERIAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-1.5">
                      Account Number (10 digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl px-4 py-3 text-xs font-mono font-bold text-[#141413] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & FINAL SUBMIT */}
            {step === 6 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413]">6. Final Review Before Submission</h2>
                  <p className="text-xs text-[#85837B] mt-0.5">Inspect all property details before sending to verification.</p>
                </div>

                <div className="space-y-4">
                  {/* Hotel info summary */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#141413]">{hotelName} ({hotelType})</h4>
                      <p className="text-xs text-stone-500">{fullAddress}, {city}, {stateProvince}, {country}</p>
                      <p className="text-xs text-stone-500 mt-1">Email: {hotelEmail} · Phone: {hotelPhone}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-[#C5A880] underline">Edit</button>
                  </div>

                  {/* Rooms summary */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#141413]">Room Inventory ({rooms.length} Types)</h4>
                      <p className="text-xs text-stone-500">{rooms.map((r) => r.name).join(', ')}</p>
                    </div>
                    <button onClick={() => setStep(3)} className="text-xs font-bold text-[#C5A880] underline">Edit</button>
                  </div>

                  {/* Payout summary */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#141413]">Payout Bank Account</h4>
                      <p className="text-xs text-stone-500">{bankName} · {accountName} · ••••••{accountNumber.slice(-4)}</p>
                    </div>
                    <button onClick={() => setStep(5)} className="text-xs font-bold text-[#C5A880] underline">Edit</button>
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="pt-6 border-t border-[#E8E2D8] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="py-3 px-6 rounded-2xl border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="py-3 px-6 rounded-2xl bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="py-3.5 px-8 rounded-2xl bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Submit Hotel for Verification</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ROOM ADD/EDIT MODAL */}
        {isRoomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-editorial text-xl font-bold text-[#141413]">
                  {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
                </h3>
                <button onClick={() => setIsRoomModalOpen(false)} className="text-stone-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    placeholder="e.g. Deluxe Ocean View Suite"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={roomForm.description}
                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                    placeholder="Short description"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">Price per Night (₦)</label>
                    <input
                      type="number"
                      value={roomForm.basePricePerNight}
                      onChange={(e) => setRoomForm({ ...roomForm, basePricePerNight: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">Max Guests</label>
                    <input
                      type="number"
                      value={roomForm.maxGuests}
                      onChange={(e) => setRoomForm({ ...roomForm, maxGuests: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRoomModal}
                  className="px-5 py-2 rounded-xl bg-[#141413] text-white text-xs font-bold hover:bg-black"
                >
                  Save Room
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
