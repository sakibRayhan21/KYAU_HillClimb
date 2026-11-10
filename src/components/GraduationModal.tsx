'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StorageService } from '../game/services/storageService';
import { calculateCumulativeCGPA } from '../game/services/cgpaService';
import { Award, GraduationCap, FileText, RotateCcw, X, Star } from 'lucide-react';

interface GraduationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTranscript: () => void;
  onPlayAgain: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({
  isOpen,
  onClose,
  onOpenTranscript,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (isOpen) {
      const end = Date.now() + 4 * 1000;
      const colors = ['#0f5132', '#e6a100', '#3b82f6', '#ec4899', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveData = StorageService.load();
  const { cgpa, totalCredits, degreeHonor } = calculateCumulativeCGPA(saveData.transcript);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Certificate Border & Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/40 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 mb-3">
            <GraduationCap className="w-10 h-10 text-amber-400" />
          </div>

          <h3 className="text-xs uppercase font-black tracking-widest text-emerald-400 font-mono">
            KHOJA YUNUS ALI UNIVERSITY (KYAU)
          </h3>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-white mt-1">
            OFFICIAL DEGREE CONVOCATION
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
            Faculty of Science and Engineering • Department of Computer Science & Engineering
          </p>
        </div>

        {/* Certificate Body */}
        <div className="flex-1 overflow-y-auto p-6 text-center space-y-6">
          <div className="text-slate-300 text-xs sm:text-sm italic">
            This is to certify that the student driver has successfully navigated and survived all eight rigorous semesters of academic obstacles, programming pressure, retakes, and final thesis defense to be awarded the degree of
          </div>

          <div className="py-2">
            <h2 className="text-xl sm:text-3xl font-serif font-black text-amber-300 uppercase tracking-wide">
              Bachelor of Science in Computer Science & Engineering
            </h2>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              (B.Sc. in CSE)
            </div>
          </div>

          {/* Honors & Distinction Badge */}
          <div className="max-w-md mx-auto bg-slate-950/80 border-2 border-amber-500/30 rounded-2xl p-4 flex items-center justify-around gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Final CGPA</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
                {cgpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 4.00</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10" />

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Credits</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
                {totalCredits} <span className="text-xs font-normal text-slate-400">Cr</span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Standing: {degreeHonor}
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6 text-xs text-slate-400">
            <div>
              <div className="font-serif italic text-white text-sm">Prof. Dr. Head of Department</div>
              <div className="border-t border-white/20 mt-1 pt-1 text-[11px]">Chairperson, Dept. of CSE</div>
            </div>
            <div>
              <div className="font-serif italic text-white text-sm">Vice-Chancellor</div>
              <div className="border-t border-white/20 mt-1 pt-1 text-[11px]">Khwaja Yunus Ali University</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onOpenTranscript}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" /> View Transcript
          </button>

          <button
            onClick={onPlayAgain}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN / SELECT SEMESTER
          </button>
        </div>
      </div>
    </div>
  );
};

