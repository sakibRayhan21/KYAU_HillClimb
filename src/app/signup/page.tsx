'use client';

// ============================================================================
// শিক্ষার্থী সাইন-আপ ও রেজিস্ট্রেশন পেজ (Student Registration / Sign-Up Page)
// নাম, স্টুডেন্ট আইডি, ইমেইল, ডিপার্টমেন্ট ও সেমিস্টার নির্বাচন, পছন্দের অবতার
// এবং গেস্ট হিসেবে খেলার ডেটা নতুন অ্যাকাউন্টে স্থানান্তরের সুবিধা প্রদান করে।
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Car,
  RotateCcw
} from 'lucide-react';

// বিশ্ববিদ্যালয়ের বিভাগসমূহের তালিকা
const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Electrical & Electronic Engineering (EEE)',
  'Civil Engineering (CE)',
  'Textile Engineering (TE)',
  'Pharmacy (Pharm)',
  'Business Administration (BBA)',
];

// পছন্দের প্রোফাইল ইমোজি অবতার তালিকা
const AVATAR_OPTIONS = ['🎓', '🚗', '⚡', '🚀', '💻', '☕', '🏆', '🛠️'];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, user } = useAuth();

  // ফর্মের ফিল্ড স্টেটসমূহ
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering (CSE)');
  const [semester, setSemester] = useState(1);
  const [avatar, setAvatar] = useState('🎓');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [migrateGuestProgress, setMigrateGuestProgress] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // শিক্ষার্থীদের সুবিধার জন্য স্বয়ংক্রিয় রেন্ডম স্টুডেন্ট আইডি জেনারেটর
  const handleGenerateId = () => {
    const year = new Date().getFullYear();
    const randomRoll = Math.floor(100 + Math.random() * 900);
    const generated = `KYAU-CSE-${year}-${randomRoll}`;
    setStudentId(generated);
    if (!email) {
      setEmail(`cse${year}${randomRoll}@kyau.edu.bd`);
    }
  };

  // ফর্ম সাবমিশন এবং রেজিস্ট্রেশন হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signUp({
        name,
        studentId,
        email,
        department,
        semester,
        avatar,
        password,
        confirmPassword,
        migrateGuestProgress,
      });

      if (!res.success) {
        setError(res.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Student profile created! Welcome to KYAU, ${name}! Redirecting to campus...`);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Failed to create student account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-slate-950 font-sans text-white select-none">
      {/* Background Ambient Photo Backdrop & Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Authentic KYAU Campus Aerial Background Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{ backgroundImage: `url('/images/kyau_campus_aerial.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        {/* Top Navbar Header */}
        <header className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Car className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  UNIVERSITY <span className="text-emerald-400">SURVIVAL</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                  HILL CLIMB CSE
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Khwaja Yunus Ali University (KYAU)
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Play as Guest</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </header>

        {/* Form Container */}
        <main className="my-auto py-8 sm:py-10 max-w-2xl mx-auto w-full">
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fade-in">
            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Freshman Student Registration
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Create Student Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enroll at KYAU Department of CSE, link your driver profile, and start racing.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-400/60 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-medium">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
                  Choose Cadet Mascot / Avatar
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAvatar(icon)}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        avatar === icon
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-110 shadow-lg'
                          : 'bg-slate-950/80 border border-white/10 hover:border-emerald-500/50 text-white'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Student ID Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-300">
                      Student ID *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateId}
                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      title="Auto-generate an ID"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Generate
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. KYAU-CSE-2024-042"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                  University / Student Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@kyau.edu.bd"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans outline-none"
                  />
                </div>
              </div>

              {/* Department & Starting Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-white text-xs sm:text-sm font-sans outline-none appearance-none cursor-pointer"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-slate-900 text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Starting Semester
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full pl-10 pr-8 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-white text-xs sm:text-sm font-sans outline-none appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          Semester {s} ({s === 1 ? 'Freshman' : s <= 4 ? 'Sophomore' : s <= 6 ? 'Junior' : 'Senior'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Password * (Min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Migrate Progress Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer bg-slate-950/50 p-3 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    checked={migrateGuestProgress}
                    onChange={(e) => setMigrateGuestProgress(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">
                      Import current guest progress
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Keep any coins, vehicle upgrades, and completed semesters already achieved in guest mode.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_6px_0_rgb(6,95,70),0_0_25px_rgba(16,185,129,0.4)] active:shadow-[0_2px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isSubmitting ? 'Registering Cadet...' : 'Create Student Account'}</span>
              </button>
            </form>

            {/* Footer Switch to Sign In */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
              <div>
                Already registered with KYAU?{' '}
                <Link
                  href="/signin"
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                >
                  Sign In here
                </Link>
              </div>
              <Link
                href="/"
                className="font-mono text-slate-400 hover:text-white transition-colors"
              >
                Return to Campus Main Menu
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="pt-6 border-t border-white/10 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>Khwaja Yunus Ali University (KYAU) • Department of Computer Science & Engineering</div>
          <div>Hill Climb 2D Physics Engine • Version 1.0</div>
        </footer>
      </div>
    </div>
  );
}
