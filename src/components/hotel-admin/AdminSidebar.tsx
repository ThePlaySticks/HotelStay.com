'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  BedDouble,
  Users,
  UserCheck,
  Sparkles,
  Settings,
  ArrowUpRight,
  ArrowRight,
  Shield,
  Building2,
  Brush,
  Globe,
  LogOut,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentUser, signOut } = useAuth();
  const { hotels } = useMarketplace();

  // Find active tenant hotel
  const currentHotel =
    hotels.find((h) => h.managerId === currentUser?.id || h.slug === currentUser?.hotelSlug) ||
    hotels[0] ||
    null;

  const NAV_ITEMS = [
    { href: '/hotel-admin', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/hotel-admin/reservations', label: 'Reservations', icon: CalendarCheck },
    { href: '/hotel-admin/calendar', label: 'Availability Calendar', icon: CalendarRange },
    { href: '/hotel-admin/rooms', label: 'Suites & Inventory', icon: BedDouble },
    { href: '/hotel-admin/housekeeping', label: 'Housekeeping', icon: Brush },
    { href: '/hotel-admin/guests', label: 'Guest CRM', icon: Users },
    { href: '/hotel-admin/settings', label: 'Hotel Identity Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080A0F] text-white flex flex-col justify-between shrink-0 border-r border-white/10 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-[#C5A880] transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-[#C5A880] border border-white/10">
              OPERATE PMS
            </span>
          </Link>

          {/* Tenant Property Badge */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#0E121B] border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Active Property
              </span>
              <span className={`w-2 h-2 rounded-full ${currentHotel ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'}`} />
            </div>
            <div className="font-editorial text-sm font-bold text-white mt-1 truncate">
              {currentHotel ? currentHotel.name : 'No Property Onboarded'}
            </div>
            {currentHotel && (
              <div className="text-[11px] text-[#C5A880] flex items-center gap-1 mt-0.5 font-mono truncate">
                <span>/hotels/{currentHotel.slug}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#C5A880] text-black font-bold shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Sign Out */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {currentHotel && (
          <Link
            href={`/hotels/${currentHotel.slug}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-colors border border-white/5"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>View Public Domain</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-stone-400 px-2">
          <span className="truncate max-w-[130px] font-medium text-stone-300">
            {currentUser?.name || 'Manager'}
          </span>
          <button
            onClick={() => signOut()}
            className="hover:text-rose-400 text-stone-400 p-1 rounded-md transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
