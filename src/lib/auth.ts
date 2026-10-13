import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail, saveUserToSupabase, verifyPassword } from '@/lib/userStore';
import { verifySystemOtp } from '@/lib/otp';
import { UserRole } from '@/lib/types';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'hotelstay-nextauth-production-secure-secret-key-2026',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies:
    process.env.NODE_ENV === 'production' &&
    (Boolean(process.env.NEXTAUTH_URL?.startsWith('https://')) ||
      Boolean(process.env.VERCEL) ||
      Boolean(process.env.VERCEL_URL) ||
      Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://'))),
  pages: {
    signIn: '/login',
  },
  providers: [
    // 1. Password Credentials Provider
    CredentialsProvider({
      id: 'credentials',
      name: 'Password Authentication',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const cleanEmail = credentials.email.trim().toLowerCase();
        const user = await findUserByEmail(cleanEmail);

        if (!user) {
          throw new Error('No account found with this email. Please check your email or sign up.');
        }

        const isValid = verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Incorrect password. Please try again or request a one-time code.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hotelId: user.hotelId,
          hotelName: user.hotelName,
          hotelSlug: user.hotelSlug,
          phone: user.phone,
          image: user.avatarUrl,
        } as any;
      },
    }),

    // 2. System OTP Credentials Provider
    CredentialsProvider({
      id: 'otp',
      name: 'One-Time Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP Code', type: 'text' },
        purpose: { label: 'Purpose', type: 'text' },
        role: { label: 'Role', type: 'text' },
        name: { label: 'Name', type: 'text' },
        hotelName: { label: 'Hotel Name', type: 'text' },
        hotelSlug: { label: 'Hotel Slug', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error('Email address and one-time code are required.');
        }

        const cleanEmail = credentials.email.trim().toLowerCase();
        const cleanOtp = credentials.otp.trim();
        const purpose = credentials.purpose || 'login';

        // Verify the system-generated OTP using Supabase database storage
        const isValid = await verifySystemOtp(cleanEmail, cleanOtp, purpose);
        if (!isValid) {
          throw new Error('Invalid or expired one-time verification code. Please request a new one.');
        }

        // Retrieve existing user record from Supabase storage
        let user = await findUserByEmail(cleanEmail);

        // If user doesn't exist yet (e.g. OTP sign-up), create user record in Supabase
        if (!user) {
          user = await saveUserToSupabase({
            email: cleanEmail,
            name: credentials.name || cleanEmail.split('@')[0],
            role: (credentials.role as UserRole) || 'guest',
            hotelName: credentials.hotelName,
            hotelSlug: credentials.hotelSlug,
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hotelId: user.hotelId,
          hotelName: user.hotelName,
          hotelSlug: user.hotelSlug,
          phone: user.phone,
          image: user.avatarUrl,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'guest';
        token.hotelId = (user as any).hotelId;
        token.hotelName = (user as any).hotelName;
        token.hotelSlug = (user as any).hotelSlug;
        token.phone = (user as any).phone;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name || token.name;
        token.role = session.user.role || token.role;
        token.hotelName = session.user.hotelName || token.hotelName;
        token.hotelSlug = session.user.hotelSlug || token.hotelSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || 'guest';
        (session.user as any).hotelId = token.hotelId;
        (session.user as any).hotelName = token.hotelName;
        (session.user as any).hotelSlug = token.hotelSlug;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
};
