'use client';

// ============================================================================
// গেম ক্যানভাস কম্পোনেন্ট (Phaser Game Canvas Wrapper)
// রিঅ্যাক্ট লাইফসাইকেলে Phaser.Game ইনস্ট্যান্স তৈরি ও মাউন্ট করে।
// Matter.js ফিজিক্স ইঞ্জিন, ৬০ এফপিএস রানার, এবং অটো-রিসাইজ কনফিগার করে।
// ============================================================================

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { BootScene } from '../game/scenes/BootScene';
import { GameScene } from '../game/scenes/GameScene';

interface GameCanvasProps {
  currentSemesterNumber: number; // চলমান সেমিস্টার নম্বর
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ currentSemesterNumber }) => {
  const containerRef = useRef<HTMLDivElement>(null); // ডিভ কন্টেইনার রেফারেন্স
  const gameRef = useRef<Phaser.Game | null>(null); // ফেজার গেম ইনস্ট্যান্স রেফারেন্স

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // ফেজার গেমের সামগ্রিক কনফিগারেশন
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // WebGL সাপোর্ট থাকলে WebGL, অন্যথায় Canvas ব্যবহার
      parent: containerRef.current, // রিঅ্যাক্ট ডিভ প্যারেন্ট
      width: '100%',
      height: '100%',
      backgroundColor: '#6ee7b7', // ডিফল্ট ব্যাকগ্রাউন্ড
      physics: {
        default: 'matter', // Matter.js 2D রিজিড বডি ফিজিক্স ইঞ্জিন
        matter: {
          gravity: { x: 0, y: 1.0 }, // অভিকর্ষ বল
          debug: false, // ডিবাগ মোড বন্ধ
          runner: {
            fps: 60, // মসৃণ ৬০ ফ্রেম পার সেকেন্ড
          },
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE, // স্ক্রিন সাইজ অনুযায়ী অটো-রিসাইজ
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, GameScene], // প্রথমে বুট সিন, পরে গেম সিন
    };

    // ফেজার গেম তৈরি ও সেমিস্টার নম্বর রেজিস্ট্রি করা
    const game = new Phaser.Game(config);
    gameRef.current = game;
    game.registry.set('semesterNumber', currentSemesterNumber);

    // কম্পোনেন্ট আনমাউন্ট হলে ফেজার গেম ধ্বংস ও মেমোরি ক্লিনআপ
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [currentSemesterNumber]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden bg-slate-900 select-none"
    />
  );
};
