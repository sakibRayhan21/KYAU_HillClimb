'use client';

import React, { useState } from 'react';
import { StorageService } from '../game/services/storageService';
import { UPGRADES_CONFIG } from '../game/config/upgradesConfig';
import { UpgradeType } from '../game/types/game';
import { soundService } from '../game/services/soundService';
import { Zap, Fuel, Activity, Shield, Crosshair, Flame, Coins, ChevronRight, X, Check } from 'lucide-react';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChanged?: () => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({ isOpen, onClose, onStateChanged }) => {
  const [saveData, setSaveData] = useState(() => StorageService.load());
  const [activeTab, setActiveTab] = useState<UpgradeType>('engine');

  if (!isOpen) return null;

  const currentLevel = saveData.upgrades?.[activeTab] || 1;
  const config = UPGRADES_CONFIG[activeTab];
  const nextLevel = currentLevel < 10 && config ? config.levels[currentLevel] : null;
  const curLevelInfo = config ? (config.levels[Math.max(0, currentLevel - 1)] || config.levels[0]) : null;

  const canAfford = nextLevel
    ? saveData.coins >= nextLevel.costCoins && saveData.academicPower >= nextLevel.costPower
    : false;

  const handleUpgrade = () => {
    if (!nextLevel || !canAfford) return;

    const updated = StorageService.update((s) => ({
      ...s,
      coins: s.coins - nextLevel.costCoins,
      academicPower: s.academicPower - nextLevel.costPower,
      upgrades: {
        ...s.upgrades,
        [activeTab]: s.upgrades[activeTab] + 1,
      },
    }));

    setSaveData(updated);
    soundService.playChime('finalExam');
    if (onStateChanged) onStateChanged();
  };

  const getTabIcon = (type: UpgradeType) => {
    switch (type) {
      case 'engine':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'fuelTank':
        return <Fuel className="w-5 h-5 text-red-400" />;
      case 'suspension':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'armor':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'weapon':
        return <Crosshair className="w-5 h-5 text-purple-400" />;
      case 'turbo':
        return <Flame className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-800/80 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">KYAU CSE</span> GARAGE & WORKSHOP
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Upgrade your student vehicle specs using Tuition Coins and Academic Power (AP)
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Balances */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950/70 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold font-mono text-sm sm:text-base">
                  {saveData.coins}
                </span>
              </div>
              <div className="bg-slate-950/70 border border-sky-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" />
                <span className="text-sky-300 font-bold font-mono text-sm sm:text-base">
                  {saveData.academicPower} AP
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {/* Upgrade Systems Sidebar */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {(Object.keys(UPGRADES_CONFIG) as UpgradeType[]).map((type) => {
              const item = UPGRADES_CONFIG[type];
              const lvl = saveData.upgrades[type];
              const isSelected = activeTab === type;

              return (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left flex-shrink-0 md:flex-shrink ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500/80 shadow-lg text-white'
                      : 'bg-slate-800/50 hover:bg-slate-800/80 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                      {getTabIcon(type)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{item.name.split(' ')[0]}</div>
                      <div className="text-[11px] text-slate-400">Level {lvl}/10</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Upgrade Detail & Vehicle Preview Area */}
          <div className="w-full md:w-2/3 flex flex-col justify-between bg-slate-950/50 border border-white/10 rounded-2xl p-5">
            <div>
              {/* Vehicle Graphic & Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    System Upgrade
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {config.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {config.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-white/10">
                  {getTabIcon(activeTab)}
                </div>
              </div>

              {/* Progress Pip Meter */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span>Upgrade Progression</span>
                  <span className="text-emerald-400 font-mono">Level {currentLevel} / 10</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-4 rounded-md transition-all ${
                        idx < currentLevel
                          ? 'bg-gradient-to-t from-emerald-600 to-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                          : idx === currentLevel
                          ? 'bg-amber-500/40 border border-amber-400/80 animate-pulse'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stats Comparison Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Current Spec</div>
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    {curLevelInfo?.label || 'Standard'}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono mt-0.5">
                    Multiplier: x{curLevelInfo?.value || 1.0}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Next Level Spec</div>
                  {nextLevel ? (
                    <>
                      <div className="text-sm sm:text-base font-bold text-amber-300 mt-1">
                        {nextLevel.label}
                      </div>
                      <div className="text-xs text-amber-400 font-mono mt-0.5">
                        Multiplier: x{nextLevel.value}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Maximum Level Achieved!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Purchase Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {nextLevel ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-bold text-slate-400">Upgrade Cost:</div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 font-mono font-bold text-sm ${saveData.coins < nextLevel.costCoins ? 'text-red-400' : 'text-amber-300'}`}>
                        <Coins className="w-4 h-4 text-amber-400" />
                        {nextLevel.costCoins}
                      </div>
                      <div className={`flex items-center gap-1 font-mono font-bold text-sm ${saveData.academicPower < nextLevel.costPower ? 'text-red-400' : 'text-sky-300'}`}>
                        <Zap className="w-4 h-4 text-sky-400" />
                        {nextLevel.costPower} AP
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    disabled={!canAfford}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-40 disabled:hover:from-emerald-600 disabled:hover:to-green-500 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    UPGRADE SYSTEM
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-2 text-emerald-400 font-bold text-sm">
                  ★ Fully Upgraded to Max Faculty Standard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

