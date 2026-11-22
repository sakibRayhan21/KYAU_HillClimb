// ============================================================================
// রুট লেআউট (Next.js Root Layout)
// সম্পূর্ণ ওয়েব অ্যাপ্লিকেশনের মূল ফ্রেম, মেটাডেটা, ফন্ট ও গ্লোবাল সিএসএস
// এবং AuthProvider কনটেক্সট র‍্যাপার এখানে যুক্ত করা হয়েছে।
// ============================================================================

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

// অ্যাপ্লিকেশনের এসইও ও ব্রাউজার ট্যাব মেটাডেটা
export const metadata: Metadata = {
  title: 'UNIVERSITY SURVIVAL - CSE 2D Physics Racing Game',
  description: 'Survive eight semesters of university life, overcome academic obstacles, maintain your CGPA, and graduate! Inspired by Hill Climb Racing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen w-screen overflow-hidden bg-slate-950 font-sans">
        {/* সমস্ত চাইল্ড পেজ ও কম্পোনেন্টে অথেন্টিকেশন অ্যাক্সেস নিশ্চিত করতে AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
