'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { BootScene } from '../game/scenes/BootScene';
import { GameScene } from '../game/scenes/GameScene';

interface GameCanvasProps {
  currentSemesterNumber: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ currentSemesterNumber }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: '100%',
      height: '100%',
      backgroundColor: '#6ee7b7',
      physics: {
        default: 'matter',
        matter: {
          gravity: { x: 0, y: 1.4 },
          debug: false,
          runner: {
            fps: 60,
          },
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, GameScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    game.registry.set('semesterNumber', currentSemesterNumber);

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

