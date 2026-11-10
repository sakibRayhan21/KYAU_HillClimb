const isProd = process.env.NODE_ENV === 'production';
const repoName = 'KYAU_HillClimb';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? `/${repoName}` : ''),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: false, // Prevents duplicate Phaser canvas mounting in development
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

export default nextConfig;
