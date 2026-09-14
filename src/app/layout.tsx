import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { PersonaSwitcher } from '@/components/common/PersonaSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HotelStay — Exceptional Luxury Stays & Multi-Tenant Hospitality',
  description: 'Curated international collection of verified luxury boutique hotels, private cliffside villas, and heritage estates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#141413] antialiased selection:bg-[#C5A880]/30">
        <AuthProvider>
          <MarketplaceProvider>
            {children}
            <PersonaSwitcher />
            <ToastContainer />
          </MarketplaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
