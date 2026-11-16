'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Car
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, quickDemoLogin, isAuthenticated, user } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await signIn({
        identifier,
        password,
        rememberMe,
      });

      if (!res.success) {
        setError(res.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Authenticated as ${res.user?.name || 'Student'}! Redirecting to campus...`);
      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await quickDemoLogin();
      if (res.success) {
        setSuccess('Logged into Demo Student Account! Launching semester...');
        setTimeout(() => {
          router.push('/');
        }, 600);
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError('Failed to log into demo account');
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
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
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

        {/* Main Content Split: Sign-in Form & Info Column */}
        <main className="my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sign In Form Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fade-in">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Student Portal Access
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Sign In to Campus
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Access your semester grades, custom vehicle garage, and graduation progress.
                </p>
              </div>

              {/* Already authenticated banner */}
              {isAuthenticated && user && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar || '🎓'}</span>
                    <div>
                      <div className="text-xs text-emerald-400 font-mono font-bold uppercase">
                        Currently Signed In
                      </div>
                      <div className="font-bold text-white text-sm">
                        {user.name} ({user.studentId})
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    Go to Game
                  </Link>
                </div>
              )}

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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                    Student ID or University Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. KYAU-CSE-2024-001 or student@kyau.edu.bd"
                      required
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      Default: <code className="text-emerald-400 font-bold">password123</code>
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your student password"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-sans transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer"
                    />
                    <span>Remember this session on this computer</span>
                  </label>
                </div>

                {/* Sign In Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_6px_0_rgb(6,95,70),0_0_25px_rgba(16,185,129,0.4)] active:shadow-[0_2px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{isSubmitting ? 'Verifying Student...' : 'Sign In to Campus'}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono text-slate-400">
                  <span className="bg-slate-900 px-3">or fast test login</span>
                </div>
              </div>

              {/* 1-Click Demo Account Quick Action */}
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span>1-Click Demo Login (CSE Student • Sem 3 Progress)</span>
              </button>

              {/* Footer Switch to Sign Up */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
                <div>
                  New student to the university?{' '}
                  <Link
                    href="/signup"
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                  >
                    Register / Sign Up
                  </Link>
                </div>
                <Link
                  href="/"
                  className="font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Return to Main Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Right Info Showcase Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-400" />
                Why Sign In with an Account?
              </h2>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      Persistent Garage Upgrades
                    </strong>
                    Save all tuned Engine, Suspension, Armor, and Turbo level pips permanently.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      Official CSE Academic Transcript
                    </strong>
                    Record earned letter grades across 8 semesters and calculate real-time cumulative CGPA.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      Multi-Student Profiles
                    </strong>
                    Allows roommates and classmates to maintain independent game saves on the same browser.
                  </div>
                </li>
              </ul>
            </div>

            {/* Demo Student Credentials Box */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs font-mono">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Demo Account Credentials:
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white select-all">student@kyau.edu.bd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID:</span>
                  <span className="text-white select-all">KYAU-CSE-2024-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Password:</span>
                  <span className="text-emerald-300 select-all font-bold">password123</span>
                </div>
              </div>
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
