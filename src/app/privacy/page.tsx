import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: September 2026 · HotelStay Marketplace Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-stone-700 leading-relaxed bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">1. Information We Collect</h2>
            <p>
              When you create an account on HotelStay, we collect your full name, email address, and reservation preferences to facilitate hotel bookings and guest communications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">2. How We Protect Your Data</h2>
            <p>
              We utilize Supabase enterprise-grade authentication with 256-bit encryption. We never store passwords in plaintext and do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#141413]">3. Email Communications</h2>
            <p>
              We send email verification links, reservation confirmations, and essential account security notifications. You can manage email preferences in your account settings.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
