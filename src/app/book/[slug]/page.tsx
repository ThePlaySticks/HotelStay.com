'use client';

import React, { useState, use, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import {
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  User,
  Coffee,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Printer,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function BookingFlowContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hotels, createReservation } = useMarketplace();
  const { currentPersona } = useAuth();

  const hotel = hotels.find((h) => h.slug === resolvedParams.slug) || hotels[0];
  const initialRoomId = searchParams.get('roomId') || hotel.roomTypes[0].id;
  const initialRoom = hotel.roomTypes.find((r) => r.id === initialRoomId) || hotel.roomTypes[0];

  // Booking Flow Steps: 1 -> 2 -> 3 -> 4 -> 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);
  const [checkInDate, setCheckInDate] = useState(searchParams.get('checkIn') || '2026-09-24');
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get('checkOut') || '2026-09-28');
  const [adults, setAdults] = useState(Number(searchParams.get('guests')) || 2);

  // Guest Information
  const [firstName, setFirstName] = useState(currentPersona.name.split(' ')[0] || 'Julian');
  const [lastName, setLastName] = useState(currentPersona.name.split(' ')[1] || 'Vance');
  const [email, setEmail] = useState(currentPersona.email || 'julian.vance@vanceholdings.co.uk');
  const [phone, setPhone] = useState('+44 7911 123456');
  const [specialRequests, setSpecialRequests] = useState('High floor preferred. Chilled sparkling water upon check-in.');
  const [estimatedArrival, setEstimatedArrival] = useState('15:00 - 17:00');

  // Extras
  const EXTRAS_OPTIONS = [
    { id: 'transfer', name: 'Private Limousine Chauffeur Airport Transfer', price: 180, description: 'Mercedes S-Class meet-and-greet directly at the jet bridge.' },
    { id: 'spa', name: 'Couples Holistic Thermal Spa Massage (90 mins)', price: 250, description: 'Organic herbal essential oils & heated mineral stones.' },
    { id: 'late_checkout', name: 'Guaranteed Late Checkout Privilege (3:00 PM)', price: 60, description: 'Relax without rushing on your departure day.' },
    { id: 'champagne', name: 'Chilled Vintage Champagne & Artisan Strawberries', price: 120, description: 'Arranged inside your suite prior to arrival.' },
  ];
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['transfer']);

  // Payment
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState('JULIAN VANCE');

  // Completed Booking Details
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  // Calculations
  const nights = 4;
  const roomSubtotal = selectedRoom.basePricePerNight * nights;
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const item = EXTRAS_OPTIONS.find((e) => e.id === extraId);
    return sum + (item ? item.price : 0);
  }, 0);
  const taxes = Math.round((roomSubtotal + extrasTotal) * 0.12);
  const platformFee = 65;
  const discountAmount = 0;
  const grandTotal = roomSubtotal + extrasTotal + taxes + platformFee - discountAmount;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const reservation = createReservation({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: `${hotel.location.city}, ${hotel.location.country}`,
      hotelImage: hotel.heroImage,
      roomTypeId: selectedRoom.id,
      roomTypeName: selectedRoom.name,
      guestId: currentPersona.id,
      guestName: `${firstName} ${lastName}`,
      guestEmail: email,
      guestPhone: phone,
      checkInDate,
      checkOutDate,
      nightsCount: nights,
      guestsCount: { adults, children: 0 },
      basePrice: roomSubtotal,
      taxesAndFees: taxes,
      extrasTotal,
      discountAmount,
      totalAmount: grandTotal,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingSource: 'Marketplace',
      specialRequests,
      selectedExtras: selectedExtras.map((id) => {
        const item = EXTRAS_OPTIONS.find((e) => e.id === id)!;
        return { name: item.name, price: item.price };
      }),
    });

    setConfirmedBookingId(reservation.id);
    setCurrentStep(5);

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const STEPS = [
    { num: 1, label: 'Room' },
    { num: 2, label: 'Guest Details' },
    { num: 3, label: 'Preferences' },
    { num: 4, label: 'Payment' },
    { num: 5, label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Step Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E8E2D8] -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-700 text-white'
                        : isCurrent
                        ? 'bg-[#141413] text-[#C5A880] ring-4 ring-[#C5A880]/30 shadow-md'
                        : 'bg-white text-stone-400 border border-[#D5CCC0]'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 uppercase tracking-wider ${
                      isCurrent ? 'text-[#141413]' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Step Content */}
          <div className="lg:col-span-8">
            {/* STEP 1: SELECT / CONFIRM ROOM */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                    Step 1 of 5
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
                    Confirm Accommodation & Rate Plan
                  </h2>
                  <p className="text-xs text-[#575650] mt-1">
                    Select between available suites at {hotel.name} for your scheduled itinerary.
                  </p>
                </div>

                <div className="space-y-4">
                  {hotel.roomTypes.map((room) => {
                    const isSelected = selectedRoom.id === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-5 ${
                          isSelected
                            ? 'border-[#141413] ring-2 ring-[#C5A880] bg-[#FAF8F5]'
                            : 'border-[#E8E2D8] hover:border-stone-400'
                        }`}
                      >
                        <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-200">
                          <Image
                            src={room.images[0] || hotel.heroImage}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="font-editorial text-lg font-bold text-[#141413]">
                                {room.name}
                              </h3>
                              <span className="text-xs font-bold text-[#141413]">
                                {hotel.currencySymbol}{room.basePricePerNight} / night
                              </span>
                            </div>
                            <p className="text-xs text-[#575650] mt-1">{room.description}</p>
                            <div className="text-[11px] text-stone-500 mt-2 flex gap-3">
                              <span>{room.bedType}</span>
                              <span>•</span>
                              <span>{room.view}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-medium">{room.mealPlan}</span>
                            <span
                              className={`font-semibold ${
                                isSelected ? 'text-[#141413]' : 'text-stone-400'
                              }`}
                            >
                              {isSelected ? '✓ Selected Plan' : 'Click to select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3.5 bg-[#141413] hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Proceed to Guest Details</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GUEST INFORMATION */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                    Step 2 of 5
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
                    Primary Guest & Contact Information
                  </h2>
                  <p className="text-xs text-[#575650] mt-1">
                    We securely transmit this record directly to the hotel front desk.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden focus:border-[#141413]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141413] block mb-1.5">Estimated Arrival Time</label>
                  <select
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full sm:w-72 bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden"
                  >
                    <option>14:00 - 16:00 (Standard Check-in)</option>
                    <option>16:00 - 18:00</option>
                    <option>18:00 - 20:00 (Evening)</option>
                    <option>Late Arrival (After 20:00)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141413] block mb-1.5">
                    Special Requests & Concierge Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Dietary preferences, anniversary arrangements, room placement..."
                    className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl p-3 text-xs text-[#141413] focus:outline-hidden"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-stone-600 hover:text-black"
                  >
                    ← Back to Room
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 bg-[#141413] hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Proceed to Extras</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EXTRAS & PREFERENCES */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                    Step 3 of 5
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
                    Bespoke Extras & Amenities
                  </h2>
                  <p className="text-xs text-[#575650] mt-1">
                    Tailor your stay with private experiences curated exclusively by {hotel.name}.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {EXTRAS_OPTIONS.map((extra) => {
                    const isChecked = selectedExtras.includes(extra.id);
                    return (
                      <div
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                          isChecked
                            ? 'border-[#141413] ring-1 ring-[#C5A880] bg-[#FAF8F5]'
                            : 'border-[#E8E2D8] hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-[#D5CCC0] text-[#141413]"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-[#141413]">{extra.name}</h4>
                            <p className="text-xs text-[#575650] mt-0.5">{extra.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#141413] shrink-0">
                          +{hotel.currencySymbol}{extra.price}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-stone-600 hover:text-black"
                  >
                    ← Back to Guest Details
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-8 py-3.5 bg-[#141413] hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {currentStep === 4 && (
              <form onSubmit={handleCompletePayment} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                    Step 4 of 5
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
                    Secure Payment & Authorization
                  </h2>
                  <p className="text-xs text-[#575650] mt-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit SSL End-to-End Encrypted Checkout
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-[#C5A880]" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">
                      Payment Simulation Card
                    </span>
                  </div>
                  <div className="font-mono text-base tracking-widest pt-2">
                    {cardNumber}
                  </div>
                  <div className="flex justify-between text-xs text-stone-400 pt-1">
                    <span>{cardHolder}</span>
                    <span>EXP: {expiry}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] font-mono focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] font-mono focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">CVV Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] font-mono focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#141413] block mb-1.5">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-xs text-[#141413] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    HotelStay Direct Settlement Guarantee
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    By confirming, your card will be charged {hotel.currencySymbol}{grandTotal}. Free cancellation remains valid until {hotel.policies.cancellationDeadlineHours} hours prior to arrival.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-semibold text-stone-600 hover:text-black"
                  >
                    ← Back to Preferences
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-wider font-bold rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Confirm ({hotel.currencySymbol}{grandTotal})</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: BOOKING CONFIRMATION */}
            {currentStep === 5 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-md space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                    Reservation Confirmed
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-1">
                    Your Stay Is Reserved
                  </h2>
                  <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                    A formal booking voucher has been issued and dispatched to <span className="font-semibold text-black">{email}</span>. Your host hotel has registered your arrival.
                  </p>
                </div>

                {/* BOARDING PASS / LUXURY VOUCHER */}
                <div className="border border-[#D5CCC0] rounded-3xl overflow-hidden bg-[#FAF8F5] shadow-xs">
                  <div className="bg-[#141413] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">
                        Official Stay Voucher
                      </span>
                      <h3 className="font-editorial text-xl font-bold">{hotel.name}</h3>
                      <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C5A880]" />
                        {hotel.location.address}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                        Booking Reference
                      </span>
                      <span className="font-mono text-xl font-bold text-[#C5A880]">
                        {confirmedBookingId || 'RES-8892'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs border-b border-[#E8E2D8]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#85837B] block">Primary Guest</span>
                      <span className="font-bold text-[#141413] mt-1 block">{firstName} {lastName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#85837B] block">Suite Category</span>
                      <span className="font-bold text-[#141413] mt-1 block">{selectedRoom.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#85837B] block">Itinerary Dates</span>
                      <span className="font-bold text-[#141413] mt-1 block">{checkInDate} → {checkOutDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#85837B] block">Total Settled</span>
                      <span className="font-bold text-emerald-700 text-sm mt-1 block">{hotel.currencySymbol}{grandTotal}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-[#141413]">Check-in Directions:</div>
                      <p className="text-stone-500 text-[11px]">
                        Front desk concierge will welcome you upon arrival. Valid photo identification matching the guest name is required.
                      </p>
                    </div>

                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Pass
                      </button>
                      <Link
                        href="/guest"
                        className="px-5 py-2 rounded-full bg-[#141413] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>View in Bookings</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Persistent Itemized Booking Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-[#E8E2D8] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F0EAE1]">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
                  <Image
                    src={hotel.heroImage}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#AF8F64] tracking-wider">
                    {hotel.location.city}, {hotel.location.country}
                  </span>
                  <h4 className="font-editorial text-sm font-bold text-[#141413] leading-snug">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                    <span>★ {hotel.guestRating}</span>
                    <span>({hotel.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Itinerary Details */}
              <div className="space-y-2.5 text-xs text-[#575650]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    Dates
                  </span>
                  <span className="font-semibold text-[#141413]">
                    {checkInDate} — {checkOutDate} ({nights} nights)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-[#C5A880]" />
                    Guests
                  </span>
                  <span className="font-semibold text-[#141413]">{adults} Adults</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    Suite
                  </span>
                  <span className="font-semibold text-[#141413]">{selectedRoom.name}</span>
                </div>
              </div>

              {/* Itemized Price Breakdown */}
              <div className="pt-4 border-t border-[#F0EAE1] space-y-2 text-xs text-[#575650]">
                <div className="flex justify-between">
                  <span>{hotel.currencySymbol}{selectedRoom.basePricePerNight} × {nights} nights</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{roomSubtotal}</span>
                </div>

                {extrasTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Selected Extras ({selectedExtras.length})</span>
                    <span className="font-semibold">+{hotel.currencySymbol}{extrasTotal}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Occupancy Taxes & Tourism Surcharges (12%)</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{taxes}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Protection & Service Fee</span>
                  <span className="font-semibold text-[#141413]">{hotel.currencySymbol}{platformFee}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#F0EAE1] text-sm">
                  <span className="font-bold text-[#141413]">Total (All inclusive)</span>
                  <span className="font-editorial text-xl font-bold text-[#141413]">
                    {hotel.currencySymbol}{grandTotal}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] text-[#575650] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    No hidden resort charges. Cancellation allowed without penalty up to 48 hours before check-in.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingFlowPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold">Loading booking reservation...</div>}>
      <BookingFlowContent params={params} />
    </Suspense>
  );
}
