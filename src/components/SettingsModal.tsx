'use client';

// ============================================================================
// গেম সেটিংস মোডাল (Settings Modal Component)
// অডিও ও মিউজিক ভলিউম নিয়ন্ত্রণ, সাউন্ড চালু/বন্ধ, সেভ ফাইল ব্যাকআপ এক্সপোর্ট
// ও ইমপোর্ট, স্টুডেন্ট অ্যাকাউন্ট ম্যানেজমেন্ট এবং প্রগ্রেস রিসেটের সুবিধা প্রদান করে।
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { StorageService } from '../game/services/storageService';
import { soundService } from '../game/services/soundService';
import { useAuth } from '../context/AuthContext';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  X,
  Check,
  User,
  LogIn,
  UserPlus,
  LogOut,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean; // মোডাল খোলা কিনা
  onClose: () => void; // বন্ধ করার কলব্যাক
  onResetProgress: () => void; // অগ্রগতি রিসেটের কলব্যাক
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [saveData, setSaveData] = useState(() => StorageService.load());
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // সাউন্ড চালু বা বন্ধের টগল
  const handleSoundToggle = (enabled: boolean) => {
    const updated = StorageService.update((s) => ({
      ...s,
      settings: { ...s.settings, soundEnabled: enabled },
    }));
    soundService.setSoundEnabled(enabled);
    setSaveData(updated);
  };

  // সাউন্ড ইফেক্ট ভলিউম নিয়ন্ত্রণ (০ - ১)
  const handleSoundVolumeChange = (vol: number) => {
    const updated = StorageService.update((s) => ({
      ...s,
      settings: { ...s.settings, soundVolume: vol },
    }));
    soundService.setSoundVolume(vol);
    setSaveData(updated);
  };

  // ব্যাকগ্রাউন্ড মিউজিক ভলিউম নিয়ন্ত্রণ (০ - ১)
  const handleMusicVolumeChange = (vol: number) => {
    const updated = StorageService.update((s) => ({
      ...s,
      settings: { ...s.settings, musicVolume: vol },
    }));
    soundService.setMusicVolume(vol);
    setSaveData(updated);
  };

  // গেম সেভ ডেটা JSON ফাইল হিসেবে ডাউনলোড/এক্সপোর্ট করা
  const handleExport = () => {
    const json = StorageService.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `university_survival_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // পূর্বে সেভ করা JSON ফাইল থেকে অগ্রগতি ইমপোর্ট করা
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importJSON(content);
      if (success) {
        setImportStatus('Save data loaded successfully!');
        setSaveData(StorageService.load());
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error importing save file.');
      }
    };
    reader.readAsText(file);
  };

  // সমস্ত অগ্রগতি রিসেট করে ১ম সেমিস্টারে ফিরিয়ে নেওয়া
  const executeReset = () => {
    StorageService.reset();
    setConfirmReset(false);
    onResetProgress();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            GAME SETTINGS & AUDIO
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Academic Identity & Authentication Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Student Account
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                {isAuthenticated ? 'Authenticated' : 'Guest Mode'}
              </span>
            </div>

            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-inner">
                    {user.avatar || '🎓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{user.name}</div>
                    <div className="text-xs font-mono text-emerald-400 truncate">{user.studentId}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Link
                    href="/signin"
                    onClick={onClose}
                    className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg text-center transition-all"
                  >
                    Switch Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setSaveData(StorageService.load());
                    }}
                    className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-300">
                  You are currently playing as a <strong className="text-amber-400 font-semibold">Guest Cadet</strong>. Sign in or register to preserve your custom vehicle garage and official CGPA.
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl text-center shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl text-center border border-white/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sound Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                {saveData.settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                Sound Effects & Synth Audio
              </span>
              <input
                type="checkbox"
                checked={saveData.settings.soundEnabled}
                onChange={(e) => handleSoundToggle(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Sound Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>SFX Volume</span>
                <span className="font-mono">{Math.round(saveData.settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={saveData.settings.soundVolume}
                onChange={(e) => handleSoundVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Music Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>BGM Volume</span>
                <span className="font-mono">{Math.round(saveData.settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={saveData.settings.musicVolume}
                onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Backup & Save Management */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Save Game Data (LocalStorage)
            </h4>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" /> Export Save
              </button>

              <label className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-sky-400" /> Import Save
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            {importStatus && (
              <div className="text-xs text-emerald-400 font-semibold text-center">
                {importStatus}
              </div>
            )}
          </div>

          {/* Reset Progress Section */}
          <div className="pt-4 border-t border-white/10">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Reset Academic Progress
              </button>
            ) : (
              <div className="bg-rose-950/60 border border-rose-500/60 rounded-xl p-3 text-center space-y-2">
                <p className="text-xs text-rose-200 font-semibold">
                  Are you sure? This will erase all unlocked semesters, vehicle upgrades, and your transcript!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={executeReset}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

