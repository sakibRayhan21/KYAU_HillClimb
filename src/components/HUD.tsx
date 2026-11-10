'use client';

import React, { useEffect, useState } from 'react';
import { GameHUDState } from '../game/types/game';
import { gameEvents } from '../game/services/eventBus';
import { Fuel, Coins, Award, Crosshair, Zap, Pause, Flame, AlertTriangle, Home } from 'lucide-react';
import { WEAPON_CONFIG } from '../game/config/gameConfig';

interface HUDProps {
  onPause: () => void;
  onGoHome?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onPause, onGoHome }) => {
  const [hudState, setHudState] = useState<GameHUDState>({
    distance: 0,
    targetDistance: 1000,
    speed: 0,
    fuel: 100,
    maxFuel: 100,
    fuelPercentage: 100,
    coins: 0,
    academicPower: 0,
    ammo: 20,
    maxAmmo: 20,
    semesterNumber: 1,
    cgpa: 4.0,
    currentEffect: null,
    effectTimer: 0,
    isPaused: false,
    turboReady: true,
    turboCooldown: 0,
    turboActive: false,
  });

  useEffect(() => {
    const handleUpdate = (state: GameHUDState) => {
      setHudState(state);
    };

    gameEvents.on('HUD_UPDATE', handleUpdate);
    return () => {
      gameEvents.off('HUD_UPDATE', handleUpdate);
    };
  }, []);

  const targetDist = hudState.targetDistance || 1000;
  const distancePct = Math.min(100, Math.max(0, Math.round(((hudState.distance || 0) / targetDist) * 100)));

  const handleSynthesizeAmmo = () => {
    gameEvents.emit('SYNTHESIZE_AMMO');
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between select-none z-10">
      {/* Top Bar */}
      <div className="flex flex-wrap items-start justify-between gap-3 w-full">
        {/* Left: Semester, Distance & Speedometer */}
        <div className="flex flex-col gap-2">
          {/* Semester Badge & Pause */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-95"
                title="Exit to Homepage"
              >
                <Home className="w-5 h-5 text-emerald-400" />
              </button>
            )}

            <button
              onClick={onPause}
              className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="Pause Game (Esc)"
            >
              <Pause className="w-5 h-5 text-amber-400" />
            </button>

            <div className="bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                SEMESTER {hudState.semesterNumber}
              </span>
              <span className="text-emerald-400 font-mono text-xs font-semibold">
                KYAU CSE
              </span>
            </div>

            {/* CGPA Badge */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium">CGPA:</span>
              <span className="text-amber-400 font-bold font-mono text-xs sm:text-sm">
                {(hudState.cgpa ?? 4.0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Distance Progress Bar */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-2 rounded-xl shadow-lg w-56 sm:w-72">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
              <span>Progress</span>
              <span className="text-white font-mono">
                {hudState.distance}m / {hudState.targetDistance}m
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full transition-all duration-100 ease-out"
                style={{ width: `${distancePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Active Status Effect Toast */}
        {hudState.currentEffect && (
          <div className="animate-bounce-slight pointer-events-auto bg-rose-600/90 backdrop-blur-md border-2 border-rose-400 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold uppercase tracking-wide">
                Obstacle Effect: {hudState.currentEffect}
              </div>
              <div className="text-[11px] text-rose-100">
                Vehicle impaired ({hudState.effectTimer}s remaining)
              </div>
            </div>
          </div>
        )}

        {/* Right: Fuel, Coins, Academic Power, Ammo */}
        <div className="flex flex-col items-end gap-2">
          {/* Currency / Stats Badges */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Coins */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="text-amber-300 font-bold font-mono text-xs sm:text-sm">
                {hudState.coins}
              </span>
            </div>

            {/* Academic Power */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-sky-500/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-sky-300 font-bold font-mono text-xs sm:text-sm">
                {hudState.academicPower} AP
              </span>
            </div>

            {/* Ammo & Synthesize Button */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-purple-500/40 px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-bold font-mono text-xs sm:text-sm">
                {hudState.ammo}/{hudState.maxAmmo}
              </span>
              <button
                onClick={handleSynthesizeAmmo}
                disabled={hudState.academicPower < WEAPON_CONFIG.ammoSynthesisCost}
                className="text-[10px] bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded transition-all active:scale-95"
                title={`Synthesize 10 Ammo for ${WEAPON_CONFIG.ammoSynthesisCost} Academic Power`}
              >
                +Craft
              </button>
            </div>
          </div>

          {/* Fuel Gauge */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-2 rounded-xl shadow-lg w-52 sm:w-64">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Fuel className={`w-3.5 h-3.5 ${hudState.fuelPercentage < 25 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
                Campus Fuel
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  (hudState.fuelPercentage || 0) < 25
                    ? 'text-rose-500 animate-pulse'
                    : (hudState.fuelPercentage || 0) < 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {Math.round(hudState.fuelPercentage || 0)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  (hudState.fuelPercentage || 0) < 25
                    ? 'bg-rose-500 animate-pulse'
                    : (hudState.fuelPercentage || 0) < 50
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-green-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, hudState.fuelPercentage || 0))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Speedometer & Turbo Status (Bottom Center) */}
      <div className="self-center flex flex-col items-center gap-1 mb-20 sm:mb-16">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Speed</div>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {hudState.speed} <span className="text-xs font-normal text-slate-300">km/h</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-white/20" />

          {/* Turbo Badge */}
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Turbo Boost</div>
            {hudState.turboActive ? (
              <span className="text-xs font-black text-amber-400 flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> ACTIVE!
              </span>
            ) : hudState.turboReady ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> READY (Shift)
              </span>
            ) : (
              <span className="text-xs font-mono font-semibold text-slate-400">
                {hudState.turboCooldown}s cooldown
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
