'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StorageService } from '../game/services/storageService';
import { SEMESTERS_CONFIG } from '../game/config/semestersConfig';
import { UPGRADES_CONFIG } from '../game/config/upgradesConfig';
import { soundService } from '../game/services/soundService';
import { SaveData } from '../game/types/game';
import {
  GraduationCap,
  Play,
  Wrench,
  Award,
  HelpCircle,
  Settings,
  Coins,
  Zap,
  Fuel,
  Shield,
  Flame,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  Lock,
  ArrowUp,
  Crosshair,
  Coffee,
  Heart,
  Skull,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface HomePageProps {
  onPlaySemester: (semesterNumber: number) => void;
  onOpenSemesterSelect: () => void;
  onOpenGarage: () => void;
  onOpenTranscript: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlaySemester,
  onOpenSemesterSelect,
  onOpenGarage,
  onOpenTranscript,
  onOpenSettings,
  onOpenHowToPlay,
}) => {
  const [saveData, setSaveData] = useState<SaveData>(() => StorageService.load());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bubbleText, setBubbleText] = useState<string | null>(
    'Welcome to KYAU CSE! Click me for Turbo Rev!'
  );
  const [turboActive, setTurboActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'garage' | 'obstacles' | 'controls'>('journey');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSemester = saveData.currentSemester || 1;
  const unlockedSemesters = saveData.unlockedSemesters || 1;
  const currentSemesterInfo = SEMESTERS_CONFIG.find((s) => s.number === currentSemester) || SEMESTERS_CONFIG[0];

  // Refresh save data periodically or on focus
  useEffect(() => {
    const fresh = StorageService.load();
    setSaveData(fresh);
    setSoundEnabled(fresh.settings?.soundEnabled ?? true);

    const onStorageChange = () => {
      setSaveData(StorageService.load());
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setSoundEnabled(next);
    StorageService.update((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: next },
    }));
    if (next) {
      soundService.playChime();
    }
  };

  // Play button click sound
  const handlePlaySound = (type: 'chime' | 'laser' | 'turbo' = 'chime') => {
    if (!soundEnabled) return;
    if (type === 'chime') soundService.playChime();
    else if (type === 'laser') soundService.playLaser();
    else if (type === 'turbo') soundService.playTurbo();
  };

  // Interactive Buggy Speech Bubbles
  const triggerCarInteraction = () => {
    handlePlaySound('turbo');
    setTurboActive(true);
    const quotes = [
      'Gotta make it to class at 8:00 AM!',
      'Fuel low? Grab a cup of campus Chai! ☕',
      'Citation Blaster armed & ready! 🔫',
      'Who needs sleep when you have Algorithms?! 💻',
      'Defending Thesis at 120 km/h! 🎓',
      'Submitted at 11:58:59 PM! Phew! ⏰',
      'Maintaining 4.00 CGPA like a boss! ⭐',
      'Turbo Nitro activated! Hold on! 🚀',
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setBubbleText(randomQuote);

    setTimeout(() => {
      setTurboActive(false);
    }, 1400);
  };

  // ----------------------------------------------------
  // Interactive Animated Hero Canvas (Physics Hill + Buggy)
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;
    let wheelAngle = 0;
    let speed = 2.8;

    // Particles array
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      maxAge: number;
      age: number;
    }
    const particles: Particle[] = [];

    // Terrain math function
    const getTerrainHeight = (worldX: number, baseH: number): number => {
      return (
        baseH +
        Math.sin(worldX * 0.004) * 42 +
        Math.sin(worldX * 0.012) * 18 +
        Math.cos(worldX * 0.002) * 25
      );
    };

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 280);

      const currentSpeed = turboActive ? speed * 2.2 : speed;
      offset += currentSpeed;
      wheelAngle += currentSpeed * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#091e14'); // deep emerald night
      skyGrad.addColorStop(0.65, '#0d3322');
      skyGrad.addColorStop(1, '#061a11');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars in sky
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 28; i++) {
        const sx = ((i * 137 + offset * 0.1) % width);
        const sy = (i * 31) % (height * 0.45);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // 2. Parallax Distant Campus Silhouette
      ctx.fillStyle = 'rgba(6, 44, 28, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const bgY = height - 100 + Math.sin((x + offset * 0.25) * 0.005) * 16;
        ctx.lineTo(x, bgY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Campus Clock Tower / Building silhouette
      const towerX = ((600 - offset * 0.3) % (width + 300)) - 100;
      ctx.fillStyle = 'rgba(10, 50, 32, 0.6)';
      ctx.fillRect(towerX, height - 150, 40, 80);
      ctx.beginPath();
      ctx.moveTo(towerX - 6, height - 150);
      ctx.lineTo(towerX + 20, height - 180);
      ctx.lineTo(towerX + 46, height - 150);
      ctx.closePath();
      ctx.fill();
      // Tower clock dial glow
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.beginPath();
      ctx.arc(towerX + 20, height - 135, 6, 0, Math.PI * 2);
      ctx.fill();

      // 3. Foreground Terrain (Rolling Lush Green Hills)
      const baseGroundY = height - 65;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        const gy = getTerrainHeight(x + offset, baseGroundY);
        ctx.lineTo(x, gy);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      // Grass gradient
      const hillGrad = ctx.createLinearGradient(0, height - 120, 0, height);
      hillGrad.addColorStop(0, '#10b981'); // bright emerald grass
      hillGrad.addColorStop(0.12, '#059669');
      hillGrad.addColorStop(0.35, '#047857');
      hillGrad.addColorStop(1, '#064e3b'); // dark earth
      ctx.fillStyle = hillGrad;
      ctx.fill();

      // Grass stroke highlight
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#34d399';
      ctx.stroke();

      // 4. Floating Collectibles along the hill (Chai Thermos, Coins, Exam Sheet)
      for (let i = 0; i < 4; i++) {
        const itemWorldX = (i * 320) + 180;
        const screenX = ((itemWorldX - offset) % (width + 400)) - 50;
        if (screenX > -40 && screenX < width + 40) {
          const itemY = getTerrainHeight(screenX + offset, baseGroundY) - 35 + Math.sin(offset * 0.05 + i) * 6;

          // Draw item
          if (i % 3 === 0) {
            // Chai Thermos ☕
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(screenX - 7, itemY - 12, 14, 20);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(screenX - 9, itemY - 15, 18, 4);
            // Handle
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(screenX + 7, itemY - 10, 5, 12);
            // Steam
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(screenX, itemY - 20, 4, 0, Math.PI);
            ctx.stroke();
          } else if (i % 3 === 1) {
            // Tuition Coin 🪙
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(screenX, itemY - 5, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('$', screenX, itemY - 2);
          } else {
            // Exam Paper A+ 📝
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(screenX - 8, itemY - 12, 16, 20);
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('A+', screenX, itemY + 2);
          }
        }
      }

      // 5. Draw the Student Physics Buggy
      const carScreenX = Math.min(220, width * 0.28);
      const groundYFront = getTerrainHeight(carScreenX + offset + 24, baseGroundY);
      const groundYRear = getTerrainHeight(carScreenX + offset - 24, baseGroundY);
      const carSlope = Math.atan2(groundYFront - groundYRear, 48);
      const carY = (groundYFront + groundYRear) / 2 - 20;

      ctx.save();
      ctx.translate(carScreenX, carY);
      ctx.rotate(carSlope);

      // Chassis suspension bounce
      const bounce = Math.sin(offset * 0.12) * 2;
      ctx.translate(0, bounce);

      // Exhaust pipe & particles
      const exhaustX = -32;
      const exhaustY = 4;
      if (Math.random() < (turboActive ? 0.9 : 0.4)) {
        particles.push({
          x: carScreenX + Math.cos(carSlope) * exhaustX - Math.sin(carSlope) * (exhaustY + bounce),
          y: carY + Math.sin(carSlope) * exhaustX + Math.cos(carSlope) * (exhaustY + bounce),
          vx: -(Math.cos(carSlope) * (turboActive ? 4 : 2)) + (Math.random() - 0.5) * 1.5,
          vy: -(Math.sin(carSlope) * 2) - Math.random() * 1.2,
          size: turboActive ? 6 + Math.random() * 5 : 3 + Math.random() * 3,
          alpha: 0.8,
          color: turboActive ? '#ef4444' : '#94a3b8',
          maxAge: 25,
          age: 0,
        });
      }

      // Roll cage & Frame
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(-28, 4);
      ctx.lineTo(-12, -22);
      ctx.lineTo(14, -22);
      ctx.lineTo(26, 4);
      ctx.stroke();

      // Main Body
      ctx.fillStyle = turboActive ? '#10b981' : '#059669';
      ctx.beginPath();
      ctx.roundRect(-30, -5, 60, 16, 5);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Student Driver with Graduation Cap
      // Head
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(-2, -14, 7, 0, Math.PI * 2);
      ctx.fill();

      // Black Graduation Mortarboard Cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-12, -22);
      ctx.lineTo(-2, -26);
      ctx.lineTo(8, -22);
      ctx.lineTo(-2, -18);
      ctx.closePath();
      ctx.fill();
      // Golden Tassel
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-2, -22);
      ctx.lineTo(4, -16);
      ctx.stroke();

      // Citation Cannon Blaster on Top
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4, -28, 18, 5);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(8, -25, 6, 6);
      // Muzzle glow
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.arc(22, -25.5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Wheels
      const drawWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(wheelAngle);

        // Tire rubber
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Rim
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // Spokes
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < 4; a++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos((a * Math.PI) / 2) * 11, Math.sin((a * Math.PI) / 2) * 11);
          ctx.stroke();
        }
        ctx.restore();
      };

      drawWheel(-20, 10);
      drawWheel(20, 10);

      ctx.restore();

      // 6. Update and Draw Particles (Smoke / Nitro Flame)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.age++;
        p.alpha = 1 - p.age / p.maxAge;

        if (p.age >= p.maxAge) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [turboActive]);

  // Honors classification based on CGPA
  const getHonorsLabel = (cgpa: number) => {
    if (cgpa >= 3.8) return "Summa Cum Laude (Chancellor's Medal)";
    if (cgpa >= 3.65) return "Magna Cum Laude (Dean's List)";
    if (cgpa >= 3.5) return 'Cum Laude (Academic Honors)';
    if (cgpa >= 3.0) return 'Satisfactory Standing';
    return 'Academic Probation Warning';
  };

  const completedSemestersCount = saveData.transcript?.length || 0;
  const progressPercent = Math.min(100, Math.round((completedSemestersCount / 8) * 100));

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col scroll-smooth">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-emerald-500/20 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        {/* Brand Crest */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-300/40">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black tracking-tight text-sm sm:text-base">
                UNIVERSITY <span className="text-emerald-400">SURVIVAL</span>
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                KYAU CSE
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
              2D Physics Racing • Hill Climb CSE Edition
            </div>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
          <button
            onClick={() => {
              setActiveTab('journey');
              document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Semesters
          </button>
          <button
            onClick={() => {
              setActiveTab('garage');
              document.getElementById('garage-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Vehicle Garage
          </button>
          <button
            onClick={() => {
              setActiveTab('obstacles');
              document.getElementById('obstacles-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Campus Hazards
          </button>
          <button
            onClick={() => {
              setActiveTab('controls');
              document.getElementById('controls-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Controls & Guide
          </button>
          <button
            onClick={onOpenTranscript}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" /> Transcript
          </button>
        </nav>

        {/* Live Status Ribbon & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Stats Pill */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono">
            <span className="text-emerald-400 font-bold">Sem {currentSemester}/8</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> {saveData.cgpa.toFixed(2)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> {saveData.coins}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Settings & Reset"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Play Now Button */}
          <button
            onClick={() => {
              handlePlaySound('turbo');
              onPlaySemester(currentSemester);
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY NOW</span>
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION & INTERACTIVE CANVAS */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-emerald-500/20 overflow-hidden">
        {/* Interactive Animated Hill Climb Canvas */}
        <div
          onClick={triggerCarInteraction}
          className="relative w-full h-64 sm:h-72 md:h-80 cursor-pointer overflow-hidden group"
          title="Click the car to rev the engine and fire turbo nitro!"
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Speech Bubble Above Car */}
          {bubbleText && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-48 sm:translate-x-0 bg-slate-900/90 border border-emerald-400/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-2 animate-bounce-slight pointer-events-none z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{bubbleText}</span>
            </div>
          )}

          {/* Canvas click hint */}
          <div className="absolute bottom-3 right-4 bg-slate-950/70 border border-white/10 text-[10px] text-slate-400 px-2.5 py-1 rounded-full pointer-events-none">
            ⚡ Click hill / car to trigger Turbo Nitro!
          </div>
        </div>

        {/* Hero Title & Primary CTAs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-inner">
            <GraduationCap className="w-4 h-4" /> Khwaja Yunus Ali University (KYAU) • Dept. of CSE
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
            UNIVERSITY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300">
              SURVIVAL
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-slate-300 mt-2 font-medium leading-relaxed">
            Survive 8 rigorous semesters of Computer Science & Engineering! Balance your off-road
            student buggy, blast GPA-destroying obstacles with your Citation Cannon, refuel on
            campus Chai, and cross the convocation finish line with top honors!
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
            <button
              onClick={() => {
                handlePlaySound('turbo');
                onPlaySemester(currentSemester);
              }}
              className="flex-1 min-w-[200px] py-3.5 px-6 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-white font-black text-base sm:text-lg rounded-2xl shadow-[0_6px_0_rgb(6,95,70)] active:shadow-[0_2px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2.5 group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>
                {currentSemester === 1 && completedSemestersCount === 0
                  ? 'START FIRST SEMESTER'
                  : `CONTINUE SEMESTER ${currentSemester}`}
              </span>
            </button>

            <button
              onClick={() => {
                handlePlaySound('chime');
                onOpenGarage();
              }}
              className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-emerald-500/50 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Garage ({Object.values(saveData.upgrades).reduce((a, b) => a + b, 0)} Pips)</span>
            </button>

            <button
              onClick={() => {
                handlePlaySound('chime');
                onOpenTranscript();
              }}
              className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-amber-500/50 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Transcript & CGPA</span>
            </button>

            <button
              onClick={() => {
                handlePlaySound('chime');
                onOpenHowToPlay();
              }}
              className="py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-sky-500/50 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. LIVE ACADEMIC PROFILE & PROGRESS BANNER */}
      {/* ---------------------------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Left: Overall Semester Progress */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                <span className="text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  B.Sc. in Computer Science & Engineering (140 Credits)
                </span>
                <span className="text-emerald-400 font-mono">
                  {completedSemestersCount} / 8 Semesters Completed ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Current Goal: {currentSemesterInfo.title}</span>
                <span>Target: {currentSemesterInfo.targetDistance}m Track</span>
              </div>
            </div>

            {/* Right: Key Academic Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-around md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">CGPA</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {saveData.cgpa.toFixed(2)}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold truncate max-w-[100px]">
                  {getHonorsLabel(saveData.cgpa).split(' ')[0]}
                </div>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tuition Coins</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {saveData.coins}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">For Garage</div>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Academic Power</div>
                <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-sky-400" />
                  {saveData.academicPower}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">For Blaster</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. THE 8 SEMESTERS ROADMAP */}
      {/* ---------------------------------------------------- */}
      <section id="roadmap-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" /> 8-Semester Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The Academic Journey Roadmap
            </h2>
          </div>
          <button
            onClick={onOpenSemesterSelect}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Grid Modal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEMESTERS_CONFIG.map((sem) => {
            const isUnlocked = sem.number <= unlockedSemesters;
            const isCurrent = sem.number === currentSemester;
            const record = saveData.transcript.find((t) => t.semesterNumber === sem.number);
            const isCompleted = !!record;

            return (
              <div
                key={sem.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-slate-900/95 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                    : isUnlocked
                    ? 'bg-slate-900/70 border-white/15 hover:border-emerald-500/50'
                    : 'bg-slate-950/60 border-white/5 opacity-60'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-slate-400">
                      SEMESTER {sem.number.toString().padStart(2, '0')}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-500 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {record.grade} ({record.gpa.toFixed(2)})
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                        ACTIVE
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-mono text-slate-400 font-bold">UNLOCKED</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-black text-white text-base leading-snug">{sem.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sem.tagline}</p>

                  {/* Courses chips */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {sem.courses.slice(0, 3).map((c) => (
                      <span
                        key={c.code}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5"
                      >
                        {c.code}
                      </span>
                    ))}
                    {sem.courses.length > 3 && (
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded text-slate-500">
                        +{sem.courses.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    Track: <span className="text-white font-bold">{sem.targetDistance}m</span>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        handlePlaySound('turbo');
                        onPlaySemester(sem.number);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-md"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      {isCurrent ? 'Play' : 'Launch'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-600 font-mono">Reach Sem {sem.number}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. VEHICLE GARAGE & TUNING PREVIEW */}
      {/* ---------------------------------------------------- */}
      <section id="garage-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Wrench className="w-3.5 h-3.5" /> High-Performance Engineering
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Vehicle Garage & Buggy Upgrades
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Upgrade 6 vital subsystems up to Level 10 to conquer steeper hills and survive tough obstacles.
              </p>
            </div>

            <button
              onClick={() => {
                handlePlaySound('chime');
                onOpenGarage();
              }}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Wrench className="w-4 h-4" />
              <span>OPEN GARAGE MODAL</span>
            </button>
          </div>

          {/* 6 Upgrade Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(UPGRADES_CONFIG).map(([key, item]) => {
              const currentLevel = saveData.upgrades[item.type] || 1;
              const levelInfo = item.levels.find((l) => l.level === currentLevel) || item.levels[0];

              const getUpgradeIcon = (type: string) => {
                switch (type) {
                  case 'engine':
                    return <Zap className="w-5 h-5 text-amber-400" />;
                  case 'fuelTank':
                    return <Fuel className="w-5 h-5 text-emerald-400" />;
                  case 'suspension':
                    return <Shield className="w-5 h-5 text-sky-400" />;
                  case 'armor':
                    return <Shield className="w-5 h-5 text-indigo-400" />;
                  case 'weapon':
                    return <Crosshair className="w-5 h-5 text-purple-400" />;
                  case 'turbo':
                    return <Flame className="w-5 h-5 text-rose-400" />;
                  default:
                    return <Wrench className="w-5 h-5 text-slate-400" />;
                }
              };

              return (
                <div
                  key={key}
                  className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                        {getUpgradeIcon(item.type)}
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Level {currentLevel} / 10
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                  </div>

                  {/* Visual Level Pips */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-mono">
                      <span>Tier: {levelInfo.label}</span>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-sm transition-colors ${
                            idx < currentLevel ? 'bg-emerald-400 shadow-sm' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. CAMPUS OBSTACLES BESTIARY */}
      {/* ---------------------------------------------------- */}
      <section id="obstacles-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
            <Skull className="w-3.5 h-3.5" /> Dangerous University Hazards
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Campus Obstacles & Bosses Bestiary
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every semester throws unique hurdles in your path. Learn their weaknesses to survive!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Obstacle 1 */}
          <div className="bg-slate-900/80 border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💔</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-500/30">
                  THREAT: MEDIUM
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Relationship Distraction</h4>
              <p className="text-xs text-pink-300/80 italic mt-0.5">"We need to talk... 📱"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Causes steering flutter and heavy fuel depletion while arguing on calls.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Vaporize with Citation Blaster!
            </div>
          </div>

          {/* Obstacle 2 */}
          <div className="bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🦥</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                  THREAT: HIGH
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Laziness & Procrastination</h4>
              <p className="text-xs text-amber-300/80 italic mt-0.5">"5 more minutes in bed..."</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Cuts engine torque and top speed by 45% for 3 seconds on impact.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Fire Turbo Nitro or dodge cleanly!
            </div>
          </div>

          {/* Obstacle 3 */}
          <div className="bg-slate-900/80 border border-rose-500/20 hover:border-rose-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">❌</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
                  THREAT: SEVERE
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Semester Retake Stamp</h4>
              <p className="text-xs text-rose-300/80 italic mt-0.5">"Grade: F 📄"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Massive impact durability that causes severe fuel loss and crash potential.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: 3 direct laser hits from distance.
            </div>
          </div>

          {/* Obstacle 4 */}
          <div className="bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👨‍🏫</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
                  BOSS LEVEL
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Course Teacher Boss</h4>
              <p className="text-xs text-purple-300/80 italic mt-0.5">"Attendance is mandatory!"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Towering faculty boss with huge HP bar. Throws unexpected exam questions!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Synthesize ammo & continuous fire.
            </div>
          </div>

          {/* Obstacle 5 */}
          <div className="bg-slate-900/80 border border-sky-500/20 hover:border-sky-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📱</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
                  THREAT: MEDIUM
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Social Media Doomscroll</h4>
              <p className="text-xs text-sky-300/80 italic mt-0.5">"Just one more reel..."</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Endless notifications stall engine momentum on critical steep ascents.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Stay focused and shoot early!
            </div>
          </div>

          {/* Obstacle 6 */}
          <div className="bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌀</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/30">
                  THREAT: HIGH
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Midnight Overthinking</h4>
              <p className="text-xs text-indigo-300/80 italic mt-0.5">"What if I fail?!"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Wobbles air balance controls for 2.5 seconds, risking catastrophic flips!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Keep both wheels on the ground.
            </div>
          </div>

          {/* Obstacle 7 */}
          <div className="bg-slate-900/80 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏰</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 font-bold border border-orange-500/30">
                  THREAT: CRITICAL
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">11:59 PM Deadline Bomb</h4>
              <p className="text-xs text-orange-300/80 italic mt-0.5">"Ticking digital countdown!"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Explosive portal deadline that damages fuel tank if not bypassed in time.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: Use Nitro to soar over the timer!
            </div>
          </div>

          {/* Obstacle 8 */}
          <div className="bg-slate-900/80 border border-red-500/30 hover:border-red-500/60 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚫</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/30">
                  PENALTY NOTICE
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Attendance Shortage (&lt;75%)</h4>
              <p className="text-xs text-red-300/80 italic mt-0.5">"Barred from final exam!"</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Rigid barricade that abruptly halts speed unless disintegrated.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
              Counter: 2 citation blaster hits to clear.
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. CONTROLS & AIR-BALANCE FLIGHT SCHOOL */}
      {/* ---------------------------------------------------- */}
      <section id="controls-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Physics Masterclass
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Controls & Air-Balance Physics
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Master the signature Hill Climb air-tilt physics to stick buttery landings on steep mountain slopes.
              </p>
            </div>

            <button
              onClick={onOpenHowToPlay}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full Interactive Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Control 1: Gas & Tilt Nose Up */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  D
                </kbd>
                <span className="text-slate-500">or</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  →
                </kbd>
              </div>
              <h4 className="font-bold text-emerald-400 text-sm">Gas / Tilt Nose Up</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Applies drive torque on the ground. In mid-air, rotates vehicle chassis nose-up to match upward slopes.
              </p>
            </div>

            {/* Control 2: Brake & Tilt Nose Down */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  A
                </kbd>
                <span className="text-slate-500">or</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  ←
                </kbd>
              </div>
              <h4 className="font-bold text-rose-400 text-sm">Brake / Tilt Nose Down</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Brakes and reverses wheels on ground. In mid-air, rotates chassis nose-down to stick downward slope landings.
              </p>
            </div>

            {/* Control 3: Citation Cannon */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-3 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  Spacebar
                </kbd>
              </div>
              <h4 className="font-bold text-sky-400 text-sm">Citation Blaster</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Fires high-energy laser bolts to disintegrate obstacles ahead before impact drains your fuel!
              </p>
            </div>

            {/* Control 4: Turbo Nitro */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-3 py-1 bg-slate-800 border border-white/20 rounded font-mono text-xs text-white shadow">
                  Shift
                </kbd>
              </div>
              <h4 className="font-bold text-amber-400 text-sm">Caffeine Turbo Nitro</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Unleashes massive nitrous acceleration with tailpipe flames to leap across treacherous ravines.
              </p>
            </div>
          </div>

          {/* Pro Physics Tip Box */}
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300">Hill Climb Flight Pro-Tip:</span>
              <span className="text-slate-300 ml-1">
                Never land on your vehicle's roof! While airborne, tap <strong>[D]</strong> to lift the nose
                or <strong>[A]</strong> to dip the nose until your wheels match the mountain's slope perfectly.
                Landing flat on both wheels transfers all momentum into forward velocity!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. UGC BANGLADESH 4.00 CGPA & HONORS REFERENCE */}
      {/* ---------------------------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" /> Academic Grading System
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Official University CGPA & Degree Honors
              </h3>
            </div>
            <button
              onClick={onOpenTranscript}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Your Transcript</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-center font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
              <div className="text-emerald-400 font-black text-base">A+</div>
              <div className="text-slate-300 font-bold">4.00</div>
              <div className="text-[10px] text-slate-500">80% & Above</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
              <div className="text-emerald-300 font-black text-base">A</div>
              <div className="text-slate-300 font-bold">3.75</div>
              <div className="text-[10px] text-slate-500">75% to 79%</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
              <div className="text-green-300 font-black text-base">A-</div>
              <div className="text-slate-300 font-bold">3.50</div>
              <div className="text-[10px] text-slate-500">70% to 74%</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
              <div className="text-amber-300 font-black text-base">B+</div>
              <div className="text-slate-300 font-bold">3.25</div>
              <div className="text-[10px] text-slate-500">65% to 69%</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
              <div className="text-amber-400 font-black text-base">B</div>
              <div className="text-slate-300 font-bold">3.00</div>
              <div className="text-[10px] text-slate-500">60% to 64%</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-500/30">
              <div className="text-rose-400 font-black text-base">F</div>
              <div className="text-slate-300 font-bold">0.00</div>
              <div className="text-[10px] text-slate-500">Retake Req.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="w-full bg-slate-950 border-t border-white/10 py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                UNIVERSITY SURVIVAL • KYAU CSE EDITION
              </div>
              <div className="text-xs text-slate-500">
                Khwaja Yunus Ali University • Computer Science & Engineering
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <button
              onClick={() => {
                document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              Roadmap
            </button>
            <button onClick={onOpenGarage} className="hover:text-emerald-400 transition-colors">
              Garage
            </button>
            <button onClick={onOpenTranscript} className="hover:text-emerald-400 transition-colors">
              Transcript
            </button>
            <button onClick={onOpenSettings} className="hover:text-emerald-400 transition-colors">
              Settings
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-white/5 text-center text-[11px] text-slate-600">
          Designed with ❤️ for CSE University Students Everywhere • Physics Engine powered by Phaser 3 & Matter.js
        </div>
      </footer>
    </div>
  );
};
