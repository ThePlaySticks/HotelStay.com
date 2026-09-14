'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, PERSONAS } from '@/context/AuthContext';
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
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentPersona, setPersona } = useAuth();
  const { hotels } = useMarketplace();

  // Find active tenant hotel
  const currentHotel =
    hotels.find((h) => h.id === currentPersona.hotelId) || hotels[0] || null;

  const NAV_ITEMS = [
    { href: '/hotel-admin', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/hotel-admin/reservations', label: 'Reservations', icon: CalendarCheck },
    { href: '/hotel-admin/calendar', label: 'Availability Calendar', icon: CalendarRange },
    { href: '/hotel-admin/rooms', label: 'Rooms & Inventory', icon: BedDouble },
    { href: '/hotel-admin/housekeeping', label: 'Housekeeping', icon: Brush },
    { href: '/hotel-admin/guests', label: 'Guest CRM', icon: Users },
    { href: '/hotel-admin/staff', label: 'Staff & Roles', icon: UserCheck },
    { href: '/hotel-admin/settings', label: 'Hotel Identity Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141413] text-white flex flex-col justify-between shrink-0 border-r border-stone-800 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-[#C5A880] transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-stone-800 text-[#C5A880] border border-stone-700">
              PMS
            </span>
          </Link>

          {/* Tenant Property Badge & Quick Switcher */}
          <div className="mt-5 p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Active Hotel Tenant
              </span>
              <span className={`w-2 h-2 rounded-full ${currentHotel ? 'bg-emerald-500 animate-pulse' : 'bg-stone-600'}`} />
            </div>
            <div className="font-editorial text-sm font-bold text-white mt-1 truncate">
              {currentHotel ? currentHotel.name : 'No Hotel Onboarded'}
            </div>
            <div className="text-[11px] text-[#C5A880] flex items-center gap-1 mt-0.5">
              <span>{currentHotel ? `${currentHotel.location.city}, ${currentHotel.location.country}` : 'Register your property to begin'}</span>
            </div>

            {/* Tenant Switcher Pill */}
            {hotels.length > 1 && (
            <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Switch Tenant:</span>
              <button
                type="button"
                onClick={() => {
                  const targetId =
                    currentPersona.hotelId === 'hotel-azure'
                      ? 'persona-serenita-admin'
                      : 'persona-azure-admin';
                  setPersona(targetId);
                }}
                className="text-xs font-semibold text-[#C5A880] hover:underline"
              >
                {currentPersona.hotelId === 'hotel-azure' ? '→ Serenita' : '→ Azure'}
              </button>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-stone-800 text-white font-semibold shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#C5A880]' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switch to Guest or Super Admin */}
      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link
          href="/"
          className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center justify-between transition-colors"
        >
          <span>View Public Marketplace</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
        </Link>
        <Link
          href="/super-admin"
          className="w-full py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/50 text-amber-200 text-xs flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Super Admin Console
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
