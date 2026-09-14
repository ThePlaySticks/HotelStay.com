import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
