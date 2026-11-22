'use client';

// ============================================================================
// গেম খেলার নির্দেশিকা মোডাল (How To Play & Student Survival Guide)
// নতুন শিক্ষার্থীদের জন্য ড্রাইভিং কন্ট্রোল (গ্যাস, ব্রেক, শূন্যে ব্যালেন্স, ফায়ার, টার্বো),
// একাডেমিক কালেক্টিবল পয়েন্ট এবং বিভিন্ন বাধার ক্ষতিকর প্রভাব সংক্রান্ত বিস্তারিত গাইড।
// ============================================================================

import React from 'react';
import { OBSTACLES_CONFIG, ACADEMIC_COLLECTIBLES_CONFIG } from '../game/config/gameConfig';
import { BookOpen, Crosshair, Fuel, Zap, HelpCircle, X, Shield, ArrowRight } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean; // মোডাল খোলা আছে কিনা
  onClose: () => void; // বন্ধ করার কলব্যাক
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* হেডার */}
        <div className="p-5 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 rounded-xl border border-emerald-500/30 text-emerald-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                HOW TO PLAY & STUDENT SURVIVAL GUIDE
              </h2>
              <p className="text-xs text-slate-300">
                Master 2D vehicle physics, destroy obstacles, earn academic power, and graduate!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* কনটেন্ট বডি: কন্ট্রোলস ও নিয়ামাবলী */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ড্রাইভিং ও ব্যালেন্স কন্ট্রোল সেকশন */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Driving & Balancing Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Gas / Accelerate:</span> [Right Arrow] or [D]
                <p className="text-slate-400 text-[11px] mt-1">Drives rear wheel forward. When mid-air, tilts motorcycle nose UP for smooth landings & wheelies.</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Brake / Reverse:</span> [Left Arrow] or [A]
                <p className="text-slate-400 text-[11px] mt-1">Applies dual disc brakes. When mid-air, tilts motorcycle nose DOWN to align with slopes.</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Fire Citation Cannon:</span> [Spacebar]
                <p className="text-slate-400 text-[11px] mt-1">Shoots debug lasers to vaporize dangerous obstacles from distance.</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Turbo Nitro Boost:</span> [Shift Key]
                <p className="text-slate-400 text-[11px] mt-1">Triggers hyper-acceleration to leap over steep peaks.</p>
              </div>
            </div>
          </div>

          {/* একাডেমিক পাওয়ার ও ফুয়েল আইটেম বিবরণ */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Academic Achievements & Fuel
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-sky-300">Class Test</div>
                <div className="font-mono text-xs text-white mt-0.5">+10 AP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-purple-300">Assignment</div>
                <div className="font-mono text-xs text-white mt-0.5">+15 AP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-amber-300">Quiz</div>
                <div className="font-mono text-xs text-white mt-0.5">+10 AP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-pink-300">Midterm</div>
                <div className="font-mono text-xs text-white mt-0.5">+25 AP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-yellow-300">Final Exam</div>
                <div className="font-mono text-xs text-white mt-0.5">+50 AP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center">
                <div className="font-bold text-red-400">Campus Chai</div>
                <div className="font-mono text-xs text-white mt-0.5">+40 Fuel ☕</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-center col-span-2">
                <div className="font-bold text-amber-400">Tuition Coins</div>
                <div className="font-mono text-xs text-white mt-0.5">+15 Coins for Garage Upgrades</div>
              </div>
            </div>
          </div>

          {/* বিশ্ববিদ্যালয়ের বিভিন্ন বাধার তালিকা */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Academic Obstacles & Hazards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5">
                <div className="font-bold text-rose-400">Relationship Distraction ❤️💔</div>
                <div className="text-[11px] text-slate-400">Wobbles vision with heart clouds & drains fuel reserves.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5">
                <div className="font-bold text-slate-300">Procrastination & Laziness 🦥🛌</div>
                <div className="text-[11px] text-slate-400">Cuts vehicle speed by 45% for 3 seconds upon contact.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5">
                <div className="font-bold text-red-500">Retake Stamp ❌📄</div>
                <div className="text-[11px] text-slate-400">Very heavy impact! Smashes chassis and severely drains fuel.</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5">
                <div className="font-bold text-purple-400">Fierce Course Teacher 👨‍🏫👓</div>
                <div className="text-[11px] text-slate-400">High-HP Boss! Shoot multiple citation blasts to defeat him.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="p-4 bg-slate-800/80 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all"
          >
            GOT IT, LET’S RACE!
          </button>
        </div>
      </div>
    </div>
  );
};
