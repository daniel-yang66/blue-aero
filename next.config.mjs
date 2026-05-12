/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "images.flightradar24.com",
      "cdn.jetphotos.com",
      "www.flightradar24.com",
    ],
  },
};

export default nextConfig;
