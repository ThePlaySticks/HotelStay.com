import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Compass, ArrowRight, Building2, Shield, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
          404 — Sanctuary Not Found
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-[#141413] mt-3">
          The path you seek is elsewhere.
        </h1>
        <p className="text-sm text-[#575650] max-w-md mt-4 leading-relaxed font-light">
          The requested page may have moved, or the sanctuary slug might be mistyped. Let us guide you back to our verified collection.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
          >
            Return to Homepage
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-full border border-[#D5CCC0] bg-white text-[#141413] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A880]" />
            Browse Stays
          </Link>
          <Link
            href="/hotel-admin"
            className="px-6 py-3 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-all flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            Hotel PMS
          </Link>
          <Link
            href="/super-admin"
            className="px-6 py-3 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-all flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            Super Admin
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
