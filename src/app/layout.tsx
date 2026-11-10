import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}

