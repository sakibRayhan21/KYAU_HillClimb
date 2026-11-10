'use client';

import React from 'react';
import { SEMESTERS_CONFIG } from '../game/config/semestersConfig';
import { StorageService } from '../game/services/storageService';
import { Lock, Play, X, Star, BookOpen, Flag } from 'lucide-react';

interface SemesterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSemester: (semesterNumber: number) => void;
}

export const SemesterSelectModal: React.FC<SemesterSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectSemester,
}) => {
  if (!isOpen) return null;

  const saveData = StorageService.load();
  const unlocked = saveData.unlockedSemesters || 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">KYAU CSE</span> 8-SEMESTER ROADMAP
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Survive all 8 semesters to earn your Bachelor of Science in Computer Science & Engineering degree!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Semesters Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {SEMESTERS_CONFIG.map((sem) => {
            const isUnlocked = sem.number <= unlocked;
            const transcriptEntry = saveData.transcript.find((t) => t.semesterNumber === sem.number);

            return (
              <div
                key={sem.id}
                className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/60 hover:bg-slate-800/90 border-emerald-500/30 hover:border-emerald-400 shadow-lg'
                    : 'bg-slate-950/40 border-white/5 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-black font-mono text-white shadow-sm"
                        style={{ backgroundColor: sem.theme.accentColor }}
                      >
                        SEM 0{sem.number}
                      </span>
                      {transcriptEntry && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 font-mono">
                          <Star className="w-3 h-3 text-amber-400" /> GPA: {transcriptEntry.gpa.toFixed(2)} ({transcriptEntry.grade})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Flag className="w-3.5 h-3.5 text-emerald-400" />
                      {sem.targetDistance}m
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    {sem.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold mb-2">
                    {sem.tagline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {sem.description}
                  </p>

                  {/* Enrolled Courses Preview */}
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 mb-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3 h-3 text-emerald-400" /> Enrolled Subjects:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                      {sem.courses.map((c) => (
                        <div key={c.code} className="truncate">
                          <span className="font-mono text-emerald-300">{c.code}:</span> {c.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectSemester(sem.number)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4 fill-white" /> DRIVE SEMESTER
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-slate-800/80 text-slate-400 font-bold rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs">
                      <Lock className="w-4 h-4 text-slate-400" /> Pass Semester {sem.number - 1} to Unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

