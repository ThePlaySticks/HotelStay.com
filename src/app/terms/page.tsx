import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8 text-[#141413]">
        <div className="space-y-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#141413] underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign Up</span>
          </Link>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: September 2026 · HotelStay Marketplace Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-stone-700 leading-relaxed bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">1. Agreement to Terms</h2>
            <p>
              By creating an account or using the HotelStay platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">2. Membership & Reservations</h2>
            <p>
              HotelStay provides a curated luxury marketplace connecting discerning travelers with boutique hotel properties and scenic getaways. Reservations are confirmed directly with property hosts through our secure booking engine.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">3. Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or use of your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">4. Host & Partner Terms</h2>
            <p>
              Hotels, guesthouses, and hospitality hosts listed on the platform must maintain verified luxury standards and honor all accepted reservations.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
