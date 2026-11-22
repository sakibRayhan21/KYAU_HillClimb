// Tailwind CSS কনফিগারেশন ফাইল (Tailwind CSS Configuration)
// প্রকল্পের কালার থিম, ফন্ট এবং কাস্টম অ্যানিমেশন এখানে কনফিগার করা হয়েছে

import type { Config } from "tailwindcss";

const config: Config = {
  // কোন কোন ফাইলে টেলউইন্ড ক্লাসগুলো স্ক্যান করা হবে তার তালিকা
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // খাজা ইউনুস আলী বিশ্ববিদ্যালয় (KYAU) থিমের জন্য কাস্টম রঙের প্যালেট
        kyau: {
          primary: "#0f5132", // মূল গাঢ় সবুজ রঙ (ইউনিভার্সিটি ব্র্যান্ড কালার)
          secondary: "#198754", // হালকা সবুজ
          accent: "#ffc107", // উজ্জ্বল অ্যাকসেন্ট (হলুদ/গোল্ডেন)
          dark: "#0b2e1f", // ব্যাকগ্রাউন্ডের জন্য অতি গাঢ় সবুজ
          gold: "#e6a100", // স্বর্ণালি রঙ (সিজিপিএ ও স্টারসের জন্য)
        },
      },
      fontFamily: {
        // ফন্ট ফ্যামিলি কনফিগারেশন
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        // কাস্টম দ্রুত পালস এবং মৃদু বাউন্স অ্যানিমেশন
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slight": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
