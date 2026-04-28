import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "qmezvkqjkohljdnnwsja.supabase.co",
        pathname: "/storage/v1/object/public/recipe-photos/**",
      },
    ],
  },
};

export default nextConfig;
