'use client';

import React from 'react';
import { StorageService } from '../game/services/storageService';
import { Play, Grid, Wrench, Award, HelpCircle, Settings, Coins, Zap, GraduationCap } from 'lucide-react';

interface MainMenuProps {
  onPlaySemester: (semesterNumber: number) => void;
  onOpenSemesterSelect: () => void;
  onOpenGarage: () => void;
  onOpenTranscript: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlaySemester,
  onOpenSemesterSelect,
  onOpenGarage,
  onOpenTranscript,
  onOpenSettings,
  onOpenHowToPlay,
}) => {
  const saveData = StorageService.load();
  const currentSemester = saveData.currentSemester || 1;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none">
      <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-6 sm:p-8 flex flex-col items-center text-center animate-fade-in">
        {/* University Crest / Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <GraduationCap className="w-4 h-4 text-emerald-400" /> Khwaja Yunus Ali University (KYAU)
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
          UNIVERSITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">SURVIVAL</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
          The 8-Semester CSE Physics Racing Challenge • Drive, Debug, Graduate!
        </p>

        {/* Player Status Ribbon */}
        <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-3 my-5 flex items-center justify-around gap-2 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Semester</div>
            <div className="font-bold text-white text-sm sm:text-base font-mono">
              Sem {currentSemester} / 8
            </div>
          </div>

          <div className="h-7 w-[1px] bg-white/10" />

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">CGPA</div>
            <div className="font-bold text-amber-400 text-sm sm:text-base font-mono">
              {saveData.cgpa.toFixed(2)}
            </div>
          </div>

          <div className="h-7 w-[1px] bg-white/10" />

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Coins</div>
            <div className="font-bold text-amber-300 text-sm sm:text-base font-mono flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {saveData.coins}
            </div>
          </div>

          <div className="h-7 w-[1px] bg-white/10" />

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Academic Power</div>
            <div className="font-bold text-sky-400 text-sm sm:text-base font-mono flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-400" /> {saveData.academicPower}
            </div>
          </div>
        </div>

        {/* Main Menu Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => onPlaySemester(currentSemester)}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-black text-base sm:text-lg rounded-2xl shadow-[0_6px_0_rgb(6,95,70)] active:shadow-[0_2px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            {currentSemester === 1 && saveData.transcript.length === 0 ? 'START FIRST SEMESTER' : `CONTINUE SEMESTER ${currentSemester}`}
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenSemesterSelect}
              className="py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/10 hover:border-emerald-500/50 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-4 h-4 text-emerald-400" /> All 8 Semesters
            </button>

            <button
              onClick={onOpenGarage}
              className="py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/10 hover:border-emerald-500/50 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-400" /> Vehicle Garage
            </button>

            <button
              onClick={onOpenTranscript}
              className="py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/10 hover:border-emerald-500/50 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-sky-400" /> CGPA Transcript
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/10 hover:border-emerald-500/50 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" /> How to Play
            </button>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-white/5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Settings className="w-4 h-4" /> Settings & Audio
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 text-[11px] text-slate-500">
          Designed with ❤️ for CSE University Students everywhere
        </div>
      </div>
    </div>
  );
};

