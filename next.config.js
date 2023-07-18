/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ftcdn.net',
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
