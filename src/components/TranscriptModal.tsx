'use client';

import React from 'react';
import { StorageService } from '../game/services/storageService';
import { calculateCumulativeCGPA } from '../game/services/cgpaService';
import { Award, GraduationCap, X, CheckCircle, Printer } from 'lucide-react';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const saveData = StorageService.load();
  const { cgpa, totalCredits, degreeHonor } = calculateCumulativeCGPA(saveData.transcript);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/40">
              <GraduationCap className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ACADEMIC TRANSCRIPT
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Khwaja Yunus Ali University • Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold px-3"
              title="Print Academic Transcript"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Cumulative CGPA</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                {cgpa > 0 ? cgpa.toFixed(2) : '4.00'}{' '}
                <span className="text-sm font-normal text-slate-400">/ 4.00</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Total Credits Earned</div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                {totalCredits}{' '}
                <span className="text-sm font-normal text-slate-400">/ 140.0 Cr</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Graduation Standing</div>
              <div className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{degreeHonor}</span>
              </div>
            </div>
          </div>

          {/* Semesters Records */}
          {saveData.transcript.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-300">No Semester Records Yet</p>
              <p className="text-xs mt-1">Drive through and pass Semester 1 to record your initial GPA!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {saveData.transcript.map((sem) => (
                <div
                  key={sem.semesterNumber}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-mono font-bold text-xs">
                        SEM {sem.semesterNumber}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {sem.semesterTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        Credits: <strong className="text-white font-mono">{sem.credits}</strong>
                      </span>
                      <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg font-bold font-mono">
                        GPA: {(sem.gpa ?? 0).toFixed(2)} ({sem.grade || 'P'})
                      </span>
                    </div>
                  </div>

                  {/* Course list table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase text-[10px]">
                          <th className="py-2 px-2">Course Code</th>
                          <th className="py-2 px-2">Course Title</th>
                          <th className="py-2 px-2 text-center">Credits</th>
                          <th className="py-2 px-2 text-center">Grade</th>
                          <th className="py-2 px-2 text-right">GPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {(sem.courses || []).map((c) => (
                          <tr key={c.code} className="hover:bg-white/5 transition-colors">
                            <td className="py-2 px-2 font-bold text-emerald-400">{c.code}</td>
                            <td className="py-2 px-2 font-sans text-white">{c.title}</td>
                            <td className="py-2 px-2 text-center">{c.credits}</td>
                            <td className="py-2 px-2 text-center font-bold text-amber-300">{c.grade}</td>
                            <td className="py-2 px-2 text-right font-bold text-white">{c.gpa.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BookOpen = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

