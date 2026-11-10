'use client';

import React from 'react';
import { OBSTACLES_CONFIG, ACADEMIC_COLLECTIBLES_CONFIG } from '../game/config/gameConfig';
import { BookOpen, Crosshair, Fuel, Zap, HelpCircle, X, Shield, ArrowRight } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Controls Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Driving & Balancing Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Gas / Accelerate:</span> [Right Arrow] or [D]
                <p className="text-slate-400 text-[11px] mt-1">Drives wheels forward. When mid-air, tilts vehicle nose UP for smooth landings.</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="font-bold text-white">Brake / Reverse:</span> [Left Arrow] or [A]
                <p className="text-slate-400 text-[11px] mt-1">Slows down. When mid-air, tilts vehicle nose DOWN to align with slopes.</p>
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

          {/* Academic Power Collectibles */}
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

          {/* 8 University Obstacles */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4" /> 8 University Obstacles
            </h3>
            <div className="space-y-2 text-xs">
              {Object.values(OBSTACLES_CONFIG).map((obs) => (
                <div key={obs.type} className="bg-slate-900 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${obs.color.toString(16).padStart(6, '0')}` }} />
                      {obs.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{obs.subtitle}</div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-300">
                    <div>HP: {obs.maxHp}</div>
                    <div className="text-rose-400">Damage: -{obs.damage} Fuel</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

