'use client';

// ============================================================================
// প্রধান গেম পেজ (Main Application Page)
// গেমের মূল স্টেট ম্যানেজমেন্ট (খেলার অবস্থা, বিরতি, ফলাফল, মোডাল কন্ট্রোল)
// এবং Phaser ক্যানভাস, HUD, কন্ট্রোল ওভারলে ও মেইন মেনু সংযুক্ত করে।
// ============================================================================

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HUD } from '../components/HUD';
import { ControlsOverlay } from '../components/ControlsOverlay';
import { MainMenu } from '../components/MainMenu';
import { HomePage } from '../components/HomePage';
import { GarageModal } from '../components/GarageModal';
import { SemesterSelectModal } from '../components/SemesterSelectModal';
import { TranscriptModal } from '../components/TranscriptModal';
import { SemesterResultModal } from '../components/SemesterResultModal';
import { GameOverModal } from '../components/GameOverModal';
import { PauseModal } from '../components/PauseModal';
import { GraduationModal } from '../components/GraduationModal';
import { SettingsModal } from '../components/SettingsModal';
import { HowToPlayModal } from '../components/HowToPlayModal';
import { StorageService } from '../game/services/storageService';
import { SemesterRunResult } from '../game/types/game';
import { gameEvents } from '../game/services/eventBus';
import { useAuth } from '../context/AuthContext';

// Phaser ক্যানভাসকে ক্লায়েন্ট-সাইডে ডায়নামিকভাবে লোড করা (SSR বন্ধ রেখে)
const GameCanvas = dynamic(
  () => import('../components/GameCanvas').then((mod) => mod.GameCanvas),
  { ssr: false }
);

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [gameKey, setGameKey] = useState<number>(1); // সেমিস্টার পরিবর্তনের সময় ক্যানভাস রিমাইন্ড করার জন্য ইউনিক কী

  // গেম খেলার অবস্থা (প্লেয়িং ও পজ স্টেট)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // বিভিন্ন পপআপ মোডাল প্রদর্শনের স্টেট
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showGarage, setShowGarage] = useState<boolean>(false);
  const [showSemesterSelect, setShowSemesterSelect] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showGraduation, setShowGraduation] = useState<boolean>(false);

  // রান রেজাল্ট স্টেট (সেমিস্টার পাস ও গেম ওভার)
  const [semesterResult, setSemesterResult] = useState<SemesterRunResult | null>(null);
  const [gameOverResult, setGameOverResult] = useState<SemesterRunResult | null>(null);

  // কম্পোনেন্ট মাউন্ট এবং ইভেন্ট বাস লিসেনার রেজিস্টার করা
  useEffect(() => {
    setMounted(true);
    const save = StorageService.load();
    setCurrentSemester(save.currentSemester || 1);

    // সেমিস্টার সফলভাবে সম্পন্ন হলে
    const handleSemesterCompleted = (result: SemesterRunResult) => {
      setSemesterResult(result);
      if (result.semesterNumber === 8) {
        setShowGraduation(true);
      }
    };

    // ফুয়েল শেষ বা গাড়ি উল্টে গিয়ে গেম ওভার হলে
    const handleGameOver = (result: SemesterRunResult) => {
      setGameOverResult(result);
    };

    // গেম পজ হলে
    const handleGamePaused = () => {
      setIsPaused(true);
    };

    // গেম রিজ্যুম হলে
    const handleGameResumed = () => {
      setIsPaused(false);
    };

    gameEvents.on('SEMESTER_COMPLETED', handleSemesterCompleted);
    gameEvents.on('GAME_OVER', handleGameOver);
    gameEvents.on('GAME_PAUSED', handleGamePaused);
    gameEvents.on('GAME_RESUMED', handleGameResumed);

    // ক্লিনআপ ফাংশন
    return () => {
      gameEvents.off('SEMESTER_COMPLETED', handleSemesterCompleted);
      gameEvents.off('GAME_OVER', handleGameOver);
      gameEvents.off('GAME_PAUSED', handleGamePaused);
      gameEvents.off('GAME_RESUMED', handleGameResumed);
    };
  }, []);

  // ইউজার পরিবর্তন হলে সেভ ফাইল পুনরায় লোড করা
  useEffect(() => {
    if (mounted) {
      const save = StorageService.load();
      setCurrentSemester(save.currentSemester || 1);
      setGameKey((prev) => prev + 1);
    }
  }, [user, mounted]);

  // নতুন সেমিস্টার খেলা শুরু করা
  const handleStartSemester = (semNumber: number) => {
    setCurrentSemester(semNumber);
    setGameKey((prev) => prev + 1);
    setShowMainMenu(false);
    setShowSemesterSelect(false);
    setSemesterResult(null);
    setGameOverResult(null);
    setIsPaused(false);
    setIsPlaying(true);
  };

  // গেম পজ করা
  const handlePause = () => {
    gameEvents.emit('PAUSE_GAME');
  };

  // গেম রিজ্যুম করা
  const handleResume = () => {
    gameEvents.emit('RESUME_GAME');
  };

  // সেমিস্টার পুনরায় রিস্টার্ট করা
  const handleRestartSemester = () => {
    setIsPaused(false);
    setSemesterResult(null);
    setGameOverResult(null);
    setGameKey((prev) => prev + 1);
  };

  // হোম স্ক্রিন বা মেইন মেনুতে ফিরে যাওয়া
  const handleGoHome = () => {
    setIsPaused(false);
    setIsPlaying(false);
    setShowMainMenu(true);
    setSemesterResult(null);
    setGameOverResult(null);
  };

  // সেমিস্টার পাস করার পর পরবর্তী ধাপে যাওয়া
  const handleContinueAfterResult = () => {
    setSemesterResult(null);
    if (currentSemester >= 8) {
      setShowGraduation(true);
    } else {
      const nextSem = currentSemester + 1;
      handleStartSemester(nextSem);
    }
  };

  // হাইড্রেশন এবং মাউন্টিং লোডার স্ক্রিন
  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-white font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-bold tracking-wider">LOADING UNIVERSITY SURVIVAL...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Phaser 2D গেম ক্যানভাস */}
      {isPlaying && (
        <GameCanvas key={gameKey} currentSemesterNumber={currentSemester} />
      )}

      {/* ইন-গেম HUD এবং টাচ কন্ট্রোলস */}
      {isPlaying && (
        <>
          <HUD onPause={handlePause} onGoHome={handleGoHome} />
          <ControlsOverlay />
        </>
      )}

      {/* ইন্টারঅ্যাক্টিভ হোমপেজ ভিউ */}
      {!isPlaying && (
        <HomePage
          onPlaySemester={handleStartSemester}
          onOpenSemesterSelect={() => setShowSemesterSelect(true)}
          onOpenGarage={() => setShowGarage(true)}
          onOpenTranscript={() => setShowTranscript(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
        />
      )}

      {/* গেম পজ মোডাল */}
      <PauseModal
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestartSemester}
        onOpenGarage={() => setShowGarage(true)}
        onGoHome={handleGoHome}
      />

      {/* সেমিস্টার সফলভাবে সম্পন্নের ফলাফল মোডাল */}
      <SemesterResultModal
        result={semesterResult}
        onContinue={handleContinueAfterResult}
        onOpenGarage={() => setShowGarage(true)}
        onOpenTranscript={() => setShowTranscript(true)}
      />

      {/* গেম ওভার মোডাল */}
      <GameOverModal
        result={gameOverResult}
        onRetry={handleRestartSemester}
        onOpenGarage={() => setShowGarage(true)}
        onGoHome={handleGoHome}
      />

      {/* যানবাহন আপগ্রেড গ্যারেজ মোডাল */}
      <GarageModal
        isOpen={showGarage}
        onClose={() => setShowGarage(false)}
        onStateChanged={() => {}}
      />

      {/* সেমিস্টার নির্বাচন মোডাল */}
      <SemesterSelectModal
        isOpen={showSemesterSelect}
        onClose={() => setShowSemesterSelect(false)}
        onSelectSemester={(sem) => {
          setShowSemesterSelect(false);
          handleStartSemester(sem);
        }}
      />

      {/* একাডেমিক ট্রান্সক্রিপ্ট ও গ্রেডশীট মোডাল */}
      <TranscriptModal
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
      />

      {/* সমাবর্তন বা কনভোকেশন সেরেমনি মোডাল */}
      <GraduationModal
        isOpen={showGraduation}
        onClose={() => setShowGraduation(false)}
        onOpenTranscript={() => {
          setShowGraduation(false);
          setShowTranscript(true);
        }}
        onPlayAgain={() => {
          setShowGraduation(false);
          setShowSemesterSelect(true);
        }}
      />

      {/* অডিও ও গেম সেটিংস মোডাল */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onResetProgress={() => {
          const fresh = StorageService.load();
          setCurrentSemester(fresh.currentSemester);
          setGameKey((k) => k + 1);
        }}
      />

      {/* কীভাবে খেলতে হয় নির্দেশিকা মোডাল */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}
