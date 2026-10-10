'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { NotificationItem } from '@/lib/types';
import { cn } from '@/lib/utils';

// Low damping spring for bell ringing
const SWING_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 10,
  mass: 1,
  restDelta: 0.01,
} as const;
const CLAPPER_SPRING = { stiffness: 300, damping: 14, mass: 1 };
const COLUMN_SPRING = { stiffness: 400, damping: 30, mass: 0.9 };
const ENTER_SPRING = { type: 'spring', stiffness: 600, damping: 20 } as const;
const FADE = { duration: 0.15 } as const;

const IMPULSE = 500;
const MAX_VELOCITY = 900;
const BURST = 5;
const CLAPPER_SWEEP = 13;
const CLAPPER_VELOCITY = 450;
const WINDOW = 3;
const LAG = 2;
const ROLL_FADE = 34;
const ROLL_VELOCITY = 9;

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

const digitOf = (value: number) => ((value % 10) + 10) % 10;

function useBellRing(total: number, reduced: boolean) {
  const swing = useMotionValue(0);
  const swingVelocity = useVelocity(swing);
  const clapperLag = useTransform(
    swingVelocity,
    [-CLAPPER_VELOCITY, 0, CLAPPER_VELOCITY],
    [CLAPPER_SWEEP, 0, -CLAPPER_SWEEP],
    { clamp: true }
  );
  const clapper = useSpring(clapperLag, CLAPPER_SPRING);
  const previous = useRef(total);
  const ringing = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const delta = total - previous.current;
    previous.current = total;
    if (delta <= 0 || reduced) return;

    const weight = 0.7 + (0.6 * Math.min(delta, BURST)) / BURST;
    const moving = swing.getVelocity();
    const along = moving > 1 ? 1 : -1;

    ringing.current = (swing as any).animate?.(0, {
      ...SWING_SPRING,
      velocity: clamp(moving + along * IMPULSE * weight, MAX_VELOCITY),
    });
  }, [total, reduced, swing]);

  useEffect(() => () => ringing.current?.stop(), []);

  return { swing, clapper };
}

function BellIcon({
  side,
  swing,
  clapper,
}: {
  side: number;
  swing: MotionValue<number>;
  clapper: MotionValue<number>;
}) {
  return (
    <motion.svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      width={side}
      height={side}
      style={{ rotate: swing, transformOrigin: '50% 12%' }}
      className="text-stone-300 group-hover:text-white transition-colors"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fillOpacity={0.85}
        d="M3.5 6.5C3.5 3.46279 5.96279 1 9 1C12.0372 1 14.5 3.46279 14.5 6.5V10.75C14.5 11.4408 15.0592 12 15.75 12C16.1642 12 16.5 12.3358 16.5 12.75C16.5 13.1642 16.1642 13.5 15.75 13.5H2.25C1.83579 13.5 1.5 13.1642 1.5 12.75C1.5 12.3358 1.83579 12 2.25 12C2.94079 12 3.5 11.4408 3.5 10.75V6.5Z"
      />
      <motion.path
        style={{
          rotate: clapper,
          transformBox: 'fill-box',
          transformOrigin: '50% 0%',
        }}
        d="M10.2 15H7.80099C7.64999 15 7.50799 15.068 7.41299 15.185C7.31799 15.302 7.28099 15.456 7.31199 15.603C7.48499 16.425 8.17999 17 9.00099 17C9.82199 17 10.517 16.425 10.69 15.603C10.721 15.456 10.684 15.302 10.589 15.185C10.494 15.068 10.351 15 10.2 15Z"
      />
    </motion.svg>
  );
}

function DigitColumn({ value, reduced }: { value: number; reduced: boolean }) {
  const position = useSpring(value, COLUMN_SPRING);
  const y = useTransform(position, (p) => `${-p * 100}%`);
  const velocity = useVelocity(position);
  const mask = useTransform(velocity, (v) => {
    const fade = Math.min(ROLL_FADE, (Math.abs(v) / ROLL_VELOCITY) * ROLL_FADE);
    return `linear-gradient(to bottom, transparent 0%, #000 ${fade}%, #000 ${100 - fade}%, transparent 100%)`;
  });

  useEffect(() => {
    const gap = value - position.get();
    if (Math.abs(gap) > LAG) position.jump(value - Math.sign(gap) * LAG);
    if (reduced) position.jump(value);
    else position.set(value);
  }, [value, reduced, position]);

  return (
    <motion.span
      className="relative inline-block h-[1em] overflow-hidden"
      style={{
        width: '1ch',
        maskImage: reduced ? undefined : mask,
        WebkitMaskImage: reduced ? undefined : mask,
      }}
    >
      <motion.span className="absolute inset-0" style={{ y }}>
        {Array.from({ length: WINDOW * 2 + 1 }, (_, i) => {
          const tile = value - WINDOW + i;
          return (
            <span
              key={tile}
              className="absolute inset-x-0 flex justify-center"
              style={{ top: `${tile * 100}%` }}
            >
              {digitOf(tile)}
            </span>
          );
        })}
      </motion.span>
    </motion.span>
  );
}

interface NotificationBellProps {
  className?: string;
  size?: number;
  dropdownAlign?: 'left' | 'right';
}

export function NotificationBell({
  className,
  size = 40,
  dropdownAlign = 'right',
}: NotificationBellProps) {
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion() ?? false;

  // Filter notifications strictly to current user/partner
  const userNotifications = notifications.filter((n) => {
    if (!currentUser) return false;
    if (!n.userId) return true;
    return (
      n.userId === currentUser.id ||
      n.userId === currentUser.email ||
      (currentUser.role === 'super_admin' && n.userId === 'persona-super-admin')
    );
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;
  const { swing, clapper } = useBellRing(unreadCount, reduced);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    userNotifications.filter((n) => !n.read).forEach((n) => markNotificationAsRead(n.id));
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'partner_approval':
        return <Building2 className="w-4 h-4 text-[#C5A880]" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'system':
      case 'review':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        id="notification-bell-button"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 hover:text-white transition-all cursor-pointer group flex items-center justify-center',
          isOpen && 'ring-2 ring-[#C5A880]/50 bg-white/20',
          className
        )}
        style={{ width: size, height: size }}
      >
        <BellIcon side={size * 0.52} swing={swing} clapper={clapper} />

        {/* Real Badge - ONLY rendered when unreadCount > 0 */}
        <AnimatePresence initial={false}>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              layout={!reduced}
              aria-hidden
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={reduced ? FADE : ENTER_SPRING}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C5A880] text-[#06080E] text-[10px] font-extrabold flex items-center justify-center shadow-md border-2 border-[#06080E] tracking-tight tabular-nums"
            >
              {unreadCount > 99 ? (
                '99+'
              ) : (
                <span className="flex leading-none">
                  {Array.from(String(unreadCount)).map((digit, i) => (
                    <DigitColumn key={i} value={parseInt(digit, 10)} reduced={reduced} />
                  ))}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notifications Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute mt-3 w-84 sm:w-96 rounded-3xl bg-[#141413] border border-stone-800 text-stone-100 shadow-2xl p-5 z-50 backdrop-blur-xl',
              dropdownAlign === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-base font-bold text-white tracking-wide">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-bold tracking-wider uppercase border border-[#C5A880]/30">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-[#C5A880] hover:text-[#E2C7A0] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {userNotifications.length === 0 ? (
                // REQUIRED EXACT EMPTY STATE
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-stone-400">
                    <Bell className="w-5 h-5 text-stone-500" />
                  </div>
                  <p className="text-xs text-stone-400 font-medium">
                    You don't have any new notifications.
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Updates regarding property onboarding, verification, and reservations will appear here.
                  </p>
                </div>
              ) : unreadCount === 0 && userNotifications.every((n) => n.read) ? (
                // ALL-READ STATE
                <div className="space-y-2">
                  <div className="py-3 px-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All caught up! No unread notifications.</span>
                  </div>
                  {userNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-2xl bg-stone-900/40 border border-stone-800 text-xs space-y-1 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold text-stone-200">
                          {getNotificationIcon(n.type)}
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] text-stone-500">{n.date || 'Recent'}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed pl-6">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // POPULATED LIST
                userNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={cn(
                      'p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all cursor-pointer',
                      n.read
                        ? 'bg-stone-900/40 border-stone-800 text-stone-300 opacity-75'
                        : 'bg-stone-900 border-[#C5A880]/30 text-white shadow-lg ring-1 ring-[#C5A880]/20'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        {getNotificationIcon(n.type)}
                        <span>{n.title}</span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500">{n.date || 'Just now'}</span>
                    </div>

                    <p className="text-[11px] text-stone-300 leading-relaxed pl-6">
                      {n.message}
                    </p>

                    {n.linkUrl && (
                      <div className="pl-6 pt-1">
                        <Link
                          href={n.linkUrl}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C5A880] hover:underline"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
