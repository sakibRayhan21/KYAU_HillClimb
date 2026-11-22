'use client';

// ============================================================================
// গেম পজ বা বিরতি মোডাল (Pause Modal Component)
// গেম চলাকালে Esc চাপলে বা পজ বাটনে ক্লিক করলে প্রদর্শিত হয়।
// গেম পুনরায় শুরু, রিস্টার্ট, গ্যারেজ এবং মেইন মেনুতে যাওয়ার সুবিধা প্রদান করে।
// ============================================================================

import React from 'react';
import { Play, RotateCcw, Wrench, Home, X } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean; // মোডাল খোলা আছে কিনা
  onResume: () => void; // গেম পুনরায় চালু করার কলব্যাক
  onRestart: () => void; // সেমিস্টার রিস্টার্ট করার কলব্যাক
  onOpenGarage: () => void; // গ্যারেজ ওপেন করার কলব্যাক
  onGoHome: () => void; // মেইন মেনুতে ফিরে যাওয়ার কলব্যাক
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenGarage,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
        {/* পজ হেডার বার্তা */}
        <h3 className="text-2xl font-black text-white">GAME PAUSED</h3>
        <p className="text-xs text-slate-300">
          Take a breath, grab some campus chai, and prepare for the next hill!
        </p>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="space-y-2.5 pt-2">
          {/* গেম রিজ্যুম বাটন */}
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Play className="w-4 h-4 fill-white" /> RESUME GAME
          </button>

          {/* সেমিস্টার রিস্টার্ট বাটন */}
          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" /> RESTART SEMESTER
          </button>

          {/* গ্যারেজ যাওয়ার বাটন */}
          <button
            onClick={onOpenGarage}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Wrench className="w-4 h-4 text-emerald-400" /> GARAGE & UPGRADES
          </button>

          {/* মেইন মেনু বাটন */}
          <button
            onClick={onGoHome}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> MAIN MENU
          </button>
        </div>

        {/* কীবোর্ড শর্টকাট গাইড */}
        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex justify-between">
          <span>Gas / Tilt Up: [Right / D]</span>
          <span>Brake / Tilt Down: [Left / A]</span>
          <span>Fire: [Space]</span>
        </div>
      </div>
    </div>
  );
};
