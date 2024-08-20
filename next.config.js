/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: "export",
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true, // This disables the Image Optimization API
  },
};

module.exports = nextConfig;
