'use client';

import React from 'react';
import { SemesterRunResult } from '../game/types/game';
import { SEMESTERS_CONFIG } from '../game/config/semestersConfig';
import { AlertCircle, RotateCcw, Wrench, Home, Fuel, Coins, Zap } from 'lucide-react';

interface GameOverModalProps {
  result: SemesterRunResult | null;
  onRetry: () => void;
  onOpenGarage: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  onRetry,
  onOpenGarage,
  onGoHome,
}) => {
  if (!result) return null;

  const currentSem = SEMESTERS_CONFIG.find((s) => s.number === result.semesterNumber);
  const targetDist = result.targetDistance || currentSem?.targetDistance || 1000;
  const distancePct = Math.min(100, Math.max(0, Math.round(((result.distanceCovered || 0) / targetDist) * 100)));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/80 via-slate-800 to-slate-900 border-b border-white/10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-500/40 flex items-center justify-center mx-auto mb-2 text-rose-400">
            <Fuel className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            SEMESTER BREAKDOWN!
          </h2>
          <p className="text-xs sm:text-sm text-rose-300 mt-1">
            Fuel Depleted • Vehicle Ran Out of Campus Energy
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Distance Progress */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
              <span>Distance Reached</span>
              <span className="font-mono text-white">
                {result.distanceCovered}m / {result.targetDistance}m ({distancePct}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full"
                style={{ width: `${distancePct}%` }}
              />
            </div>
          </div>

          {/* Preserved Rewards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Coins Collected</div>
              <div className="text-sm sm:text-base font-bold text-amber-300 font-mono mt-1 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" /> +{result.coinsEarned}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Academic Power Saved</div>
              <div className="text-sm sm:text-base font-bold text-sky-300 font-mono mt-1 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-sky-400" /> +{result.academicPowerEarned} AP
              </div>
            </div>
          </div>

          {/* Student Advisor Tip */}
          <div className="bg-emerald-950/40 border border-emerald-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200">
            <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Faculty Advisor Tip:</strong> Upgrade your <em>Chai Fuel Reservoir</em> in the Garage, blast obstacles before collision with your <em>Citation Cannon</em>, and pick up red coffee canisters along the track!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> RETRY SEMESTER
          </button>

          <button
            onClick={onOpenGarage}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Wrench className="w-4 h-4 text-emerald-400" /> VISIT GARAGE
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all flex items-center justify-center"
            title="Main Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

