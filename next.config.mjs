// Next.js কনফিগারেশন ফাইল (Next.js Configuration)
// এই ফাইলে প্রোডাকশন বিল্ড, বেস পাথ এবং এক্সপোর্ট সেটিংস নির্ধারণ করা হয়েছে

// প্রোডাকশন এনভায়রনমেন্ট চেক (Production environment check)
const isProd = process.env.NODE_ENV === 'production';
// গিটহাব পেজেস বা সাব-পাথ ডিপ্লয়মেন্টের জন্য রিপোজিটরির নাম
const repoName = 'KYAU_HillClimb';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // স্ট্যাটিক সাইট হিসেবে এক্সপোর্ট করার নির্দেশ (GitHub Pages-এর জন্য প্রয়োজনীয়)
  output: 'export',
  // বেস পাথ কনফিগারেশন: গিটহাব পেজেসে সাব-ডিরেক্টরি অনুযায়ী পাথ সেট করা হয়
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? `/${repoName}` : ''),
  // ইউআরএলের শেষে স্ল্যাশ যোগ করা
  trailingSlash: true,
  images: {
    // স্ট্যাটিক এক্সপোর্টের সময় নেক্সট ইমেজ অপটিমাইজেশন বন্ধ রাখা হয়
    unoptimized: true,
  },
  // ডেভেলপমেন্টে ডাবল মাউন্ট বা ক্যানভাস ডুপ্লিকেট হওয়া রোধ করতে StrictMode অফ রাখা হয়েছে
  reactStrictMode: false, 
  webpack: (config) => {
    // ওয়েবপ্যাক এক্সটার্নালস কনফিগারেশন
    config.externals = [...(config.externals || [])];
    return config;
  },
};

export default nextConfig;
