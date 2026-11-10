'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SemesterRunResult } from '../game/types/game';
import { SEMESTERS_CONFIG } from '../game/config/semestersConfig';
import { Award, Coins, Zap, Crosshair, ArrowRight, Wrench, FileText } from 'lucide-react';

interface SemesterResultModalProps {
  result: SemesterRunResult | null;
  onContinue: () => void;
  onOpenGarage: () => void;
  onOpenTranscript: () => void;
}

export const SemesterResultModal: React.FC<SemesterResultModalProps> = ({
  result,
  onContinue,
  onOpenGarage,
  onOpenTranscript,
}) => {
  useEffect(() => {
    if (result && result.completed) {
      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    }
  }, [result]);

  if (!result) return null;

  const currentSem = SEMESTERS_CONFIG.find((s) => s.number === result.semesterNumber);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900/80 via-slate-800 to-slate-900 border-b border-white/10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider mb-2">
            ★ Semester {result.semesterNumber} Completed ★
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            SEMESTER PASSED!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {currentSem?.title}
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* GPA & Grade Hero Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Earned Semester GPA</div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-0.5">
                {result.semesterGPA.toFixed(2)}{' '}
                <span className="text-sm font-bold text-emerald-400">({result.semesterGrade})</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Credits Earned: <strong className="text-white font-mono">{result.creditsEarned} Cr</strong>
              </div>
            </div>

            <div className="p-3 bg-emerald-900/50 rounded-2xl border border-emerald-400/40">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          {/* Reward Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Coins Earned</div>
              <div className="text-base sm:text-lg font-bold text-amber-300 font-mono mt-1 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" /> +{result.coinsEarned}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Academic Power</div>
              <div className="text-base sm:text-lg font-bold text-sky-300 font-mono mt-1 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-sky-400" /> +{result.academicPowerEarned} AP
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Obstacles Cleared</div>
              <div className="text-base sm:text-lg font-bold text-purple-300 font-mono mt-1 flex items-center justify-center gap-1">
                <Crosshair className="w-4 h-4 text-purple-400" /> {result.obstaclesDestroyed}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Fuel Remaining</div>
              <div className="text-base sm:text-lg font-bold text-emerald-300 font-mono mt-1">
                {result.fuelLeft}%
              </div>
            </div>
          </div>

          {/* Course Grades Breakdown */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Semester Subject Grades Breakdown
            </h4>
            <div className="divide-y divide-white/5 text-xs">
              {result.courseGrades.map((c) => (
                <div key={c.code} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-emerald-400 mr-2">{c.code}</span>
                    <span className="text-white font-medium">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{c.credits} Cr</span>
                    <span className="font-bold text-amber-300">{c.grade} ({c.gpa.toFixed(2)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGarage}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Wrench className="w-4 h-4 text-emerald-400" /> Garage
            </button>
            <button
              onClick={onOpenTranscript}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" /> Transcript
            </button>
          </div>

          <button
            onClick={onContinue}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {result.semesterNumber === 8 ? 'GO TO GRADUATION' : 'NEXT SEMESTER'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

