import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', '@supabase/supabase-js'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/hotels',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/hotel',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/hotel/:slug',
        destination: '/hotels/:slug',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/hotel-admin',
        permanent: true,
      },
      {
        source: '/pms',
        destination: '/hotel-admin',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/hotel-admin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
