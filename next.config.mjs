/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pen-tutor-api.onrender.com",
      },
      {
        protocol: "https",
        hostname: "pentutor.onrender.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
      },
    ],
  },
};

export default nextConfig;
