'use client';

import React from 'react';
import { gameEvents } from '../game/services/eventBus';
import { Crosshair, Flame } from 'lucide-react';

export const ControlsOverlay: React.FC = () => {
  const handleGasStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_GAS_DOWN');
  };

  const handleGasEnd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_GAS_UP');
  };

  const handleBrakeStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_BRAKE_DOWN');
  };

  const handleBrakeEnd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_BRAKE_UP');
  };

  const handleFire = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_FIRE');
  };

  const handleTurbo = (e: React.SyntheticEvent) => {
    e.preventDefault();
    gameEvents.emit('INPUT_TURBO');
  };

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 pointer-events-none flex justify-between items-end z-20 select-none">
      {/* Left: Brake / Reverse Pedal */}
      <div className="flex flex-col items-center gap-1 pointer-events-auto">
        <button
          onMouseDown={handleBrakeStart}
          onMouseUp={handleBrakeEnd}
          onMouseLeave={handleBrakeEnd}
          onTouchStart={handleBrakeStart}
          onTouchStartCapture={handleBrakeStart}
          onTouchEndCapture={handleBrakeEnd}
          onTouchCancelCapture={handleBrakeEnd}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-t from-red-800 to-rose-600 active:from-red-900 active:to-rose-700 text-white font-black text-sm sm:text-base rounded-3xl border-4 border-red-400/80 shadow-[0_8px_0_rgb(153,27,27)] active:shadow-[0_2px_0_rgb(153,27,27)] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-wider backdrop-blur-md"
        >
          <div className="w-12 h-1 bg-white/40 rounded-full mb-1" />
          <div className="w-10 h-1 bg-white/40 rounded-full mb-1" />
          <span>BRAKE</span>
          <span className="text-[10px] font-normal text-red-200">Tilt Down</span>
        </button>
        <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
          [Left / A]
        </span>
      </div>

      {/* Center: Action Buttons (Fire & Turbo) */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto mb-2">
        {/* Fire Weapon */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleFire}
            onTouchStartCapture={handleFire}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-t from-sky-700 to-blue-500 active:from-sky-800 active:to-blue-600 text-white font-bold rounded-2xl border-3 border-sky-300 shadow-[0_6px_0_rgb(3,105,161)] active:shadow-[0_2px_0_rgb(3,105,161)] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95"
            title="Shoot Citation Blaster (Space)"
          >
            <Crosshair className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow" />
            <span className="text-[10px] uppercase font-black tracking-wider">FIRE</span>
          </button>
          <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
            [Space]
          </span>
        </div>

        {/* Turbo Boost */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleTurbo}
            onTouchStartCapture={handleTurbo}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-t from-amber-600 to-yellow-500 active:from-amber-700 active:to-yellow-600 text-white font-bold rounded-2xl border-3 border-amber-300 shadow-[0_6px_0_rgb(180,83,9)] active:shadow-[0_2px_0_rgb(180,83,9)] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95"
            title="Turbo Nitro Boost (Shift)"
          >
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow" />
            <span className="text-[10px] uppercase font-black tracking-wider">BOOST</span>
          </button>
          <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
            [Shift]
          </span>
        </div>
      </div>

      {/* Right: Gas / Accelerate Pedal */}
      <div className="flex flex-col items-center gap-1 pointer-events-auto">
        <button
          onMouseDown={handleGasStart}
          onMouseUp={handleGasEnd}
          onMouseLeave={handleGasEnd}
          onTouchStartCapture={handleGasStart}
          onTouchEndCapture={handleGasEnd}
          onTouchCancelCapture={handleGasEnd}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-t from-emerald-800 to-green-600 active:from-emerald-900 active:to-green-700 text-white font-black text-sm sm:text-base rounded-3xl border-4 border-emerald-400/80 shadow-[0_8px_0_rgb(6,95,70)] active:shadow-[0_2px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-wider backdrop-blur-md"
        >
          <div className="w-12 h-1 bg-white/40 rounded-full mb-1" />
          <div className="w-10 h-1 bg-white/40 rounded-full mb-1" />
          <span>GAS</span>
          <span className="text-[10px] font-normal text-emerald-200">Tilt Up</span>
        </button>
        <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
          [Right / D]
        </span>
      </div>
    </div>
  );
};

