'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HUD } from '../components/HUD';
import { ControlsOverlay } from '../components/ControlsOverlay';
import { MainMenu } from '../components/MainMenu';
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

// Dynamically load Phaser GameCanvas without SSR
const GameCanvas = dynamic(
  () => import('../components/GameCanvas').then((mod) => mod.GameCanvas),
  { ssr: false }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [gameKey, setGameKey] = useState<number>(1); // used to force remount game when changing semester

  // Game UI flow state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Modals
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showGarage, setShowGarage] = useState<boolean>(false);
  const [showSemesterSelect, setShowSemesterSelect] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showGraduation, setShowGraduation] = useState<boolean>(false);

  // Results
  const [semesterResult, setSemesterResult] = useState<SemesterRunResult | null>(null);
  const [gameOverResult, setGameOverResult] = useState<SemesterRunResult | null>(null);

  useEffect(() => {
    setMounted(true);
    const save = StorageService.load();
    setCurrentSemester(save.currentSemester || 1);

    // Event bus listeners
    const handleSemesterCompleted = (result: SemesterRunResult) => {
      setSemesterResult(result);
      if (result.semesterNumber === 8) {
        setShowGraduation(true);
      }
    };

    const handleGameOver = (result: SemesterRunResult) => {
      setGameOverResult(result);
    };

    const handleGamePaused = () => {
      setIsPaused(true);
    };

    const handleGameResumed = () => {
      setIsPaused(false);
    };

    gameEvents.on('SEMESTER_COMPLETED', handleSemesterCompleted);
    gameEvents.on('GAME_OVER', handleGameOver);
    gameEvents.on('GAME_PAUSED', handleGamePaused);
    gameEvents.on('GAME_RESUMED', handleGameResumed);

    return () => {
      gameEvents.off('SEMESTER_COMPLETED', handleSemesterCompleted);
      gameEvents.off('GAME_OVER', handleGameOver);
      gameEvents.off('GAME_PAUSED', handleGamePaused);
      gameEvents.off('GAME_RESUMED', handleGameResumed);
    };
  }, []);

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

  const handlePause = () => {
    gameEvents.emit('PAUSE_GAME');
  };

  const handleResume = () => {
    gameEvents.emit('RESUME_GAME');
  };

  const handleRestartSemester = () => {
    setIsPaused(false);
    setSemesterResult(null);
    setGameOverResult(null);
    setGameKey((prev) => prev + 1);
  };

  const handleGoHome = () => {
    setIsPaused(false);
    setIsPlaying(false);
    setShowMainMenu(true);
    setSemesterResult(null);
    setGameOverResult(null);
  };

  const handleContinueAfterResult = () => {
    setSemesterResult(null);
    if (currentSemester >= 8) {
      setShowGraduation(true);
    } else {
      const nextSem = currentSemester + 1;
      handleStartSemester(nextSem);
    }
  };

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
      {/* 2D Phaser Game Canvas */}
      {isPlaying && (
        <GameCanvas key={gameKey} currentSemesterNumber={currentSemester} />
      )}

      {/* In-Game HUD & Touch Controls */}
      {isPlaying && !showMainMenu && (
        <>
          <HUD onPause={handlePause} />
          <ControlsOverlay />
        </>
      )}

      {/* Main Menu Overlay */}
      {showMainMenu && (
        <MainMenu
          onPlaySemester={handleStartSemester}
          onOpenSemesterSelect={() => setShowSemesterSelect(true)}
          onOpenGarage={() => setShowGarage(true)}
          onOpenTranscript={() => setShowTranscript(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
        />
      )}

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestartSemester}
        onOpenGarage={() => setShowGarage(true)}
        onGoHome={handleGoHome}
      />

      {/* Semester Completed Result Modal */}
      <SemesterResultModal
        result={semesterResult}
        onContinue={handleContinueAfterResult}
        onOpenGarage={() => setShowGarage(true)}
        onOpenTranscript={() => setShowTranscript(true)}
      />

      {/* Game Over Modal */}
      <GameOverModal
        result={gameOverResult}
        onRetry={handleRestartSemester}
        onOpenGarage={() => setShowGarage(true)}
        onGoHome={handleGoHome}
      />

      {/* Garage Modal */}
      <GarageModal
        isOpen={showGarage}
        onClose={() => setShowGarage(false)}
        onStateChanged={() => {}}
      />

      {/* Semester Select Modal */}
      <SemesterSelectModal
        isOpen={showSemesterSelect}
        onClose={() => setShowSemesterSelect(false)}
        onSelectSemester={(sem) => {
          setShowSemesterSelect(false);
          handleStartSemester(sem);
        }}
      />

      {/* Academic Transcript Modal */}
      <TranscriptModal
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
      />

      {/* Graduation Ceremony Modal */}
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onResetProgress={() => {
          const fresh = StorageService.load();
          setCurrentSemester(fresh.currentSemester);
          setGameKey((k) => k + 1);
        }}
      />

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}

