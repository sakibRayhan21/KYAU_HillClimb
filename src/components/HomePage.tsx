'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StorageService } from '../game/services/storageService';
import { soundService } from '../game/services/soundService';
import { Play, Volume2, VolumeX, Sparkles, GraduationCap } from 'lucide-react';

interface HomePageProps {
  onPlaySemester: (semesterNumber: number) => void;
  onOpenSemesterSelect?: () => void;
  onOpenGarage?: () => void;
  onOpenTranscript?: () => void;
  onOpenSettings?: () => void;
  onOpenHowToPlay?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPlaySemester }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [isHoveringPlay, setIsHoveringPlay] = useState<boolean>(false);

  useEffect(() => {
    const save = StorageService.load();
    setCurrentSemester(save.currentSemester || 1);
    setSoundEnabled(save.settings?.soundEnabled ?? true);

    // Keyboard shortcut to start playing directly with Enter or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleStartGame = () => {
    if (soundEnabled) {
      soundService.playTurbo();
    }
    onPlaySemester(currentSemester);
  };

  // --------------------------------------------------------------------------
  // CINEMATIC GAME POSTER CANVAS RENDERER
  // Full-picture theme: Rolling hills, off-road buggy jump, citation laser,
  // graduation mortarboards, chai thermoses, coins, and university silhouette!
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Ambient floating particles
    interface AmbientParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      pulse: number;
    }
    const particles: AmbientParticle[] = [];

    // Exhaust particles
    interface ExhaustParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }
    const exhaustParticles: ExhaustParticle[] = [];

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize floating academic embers & binary particles
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.4 ? '#34d399' : '#fbbf24',
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. SKY GRADIENT (Atmospheric Twilight / Dawn over Campus)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#02120b'); // deep space forest
      skyGrad.addColorStop(0.35, '#063520'); // emerald twilight
      skyGrad.addColorStop(0.65, '#0d5738'); // lush glowing horizon
      skyGrad.addColorStop(0.85, '#92400e'); // golden dusk amber
      skyGrad.addColorStop(1, '#022c22'); // deep ground
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. CELESTIAL SUN/MOON RADIAL GLOW
      const sunX = width * 0.72;
      const sunY = height * 0.42;
      const sunRad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 320);
      sunRad.addColorStop(0, 'rgba(253, 230, 138, 0.55)');
      sunRad.addColorStop(0.25, 'rgba(245, 158, 11, 0.25)');
      sunRad.addColorStop(0.6, 'rgba(16, 185, 129, 0.12)');
      sunRad.addColorStop(1, 'rgba(2, 44, 34, 0)');
      ctx.fillStyle = sunRad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 320, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core Orb
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
      ctx.fill();

      // 3. STARS & BINARY CODE CONSTELLATIONS
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 127 + 43) % width);
        const sy = ((i * 67 + 21) % (height * 0.55));
        const twinkle = Math.sin(time * 2 + i) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      ctx.globalAlpha = 1.0;

      // Draw faint binary constellation lines (CSE theme: 0 1 0 1)
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.15);
      ctx.lineTo(width * 0.22, height * 0.12);
      ctx.lineTo(width * 0.35, height * 0.2);
      ctx.lineTo(width * 0.28, height * 0.28);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(110, 231, 183, 0.3)';
      ctx.font = '10px monospace';
      ctx.fillText('01000011 (C)', width * 0.11, height * 0.14);
      ctx.fillText('01010011 (S)', width * 0.23, height * 0.11);
      ctx.fillText('01000101 (E)', width * 0.32, height * 0.24);

      // 4. DISTANT SILHOUETTE MOUNTAIN RANGE & KYAU CAMPUS
      // Layer A: Far distant purple-green peaks
      ctx.fillStyle = '#06281b';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.58);
      for (let x = 0; x <= width; x += 40) {
        const my = height * 0.56 + Math.sin(x * 0.003) * 60 + Math.cos(x * 0.007) * 30;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Convocation Arch on the distant far peak
      const archX = width * 0.82;
      const archY = height * 0.52;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(archX, archY, 18, Math.PI, 0);
      ctx.lineTo(archX + 18, archY + 24);
      ctx.moveTo(archX - 18, archY);
      ctx.lineTo(archX - 18, archY + 24);
      ctx.stroke();

      // Golden Convocation Star atop arch
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(archX, archY - 22, 5, 0, Math.PI * 2);
      ctx.fill();

      // Micro celebration fireworks / confetti near arch
      for (let c = 0; c < 6; c++) {
        const cx = archX + Math.sin(time * 3 + c * 1.5) * (18 + c * 5);
        const cy = archY - 28 + Math.cos(time * 3 + c * 1.5) * (12 + c * 3);
        ctx.fillStyle = c % 2 === 0 ? '#34d399' : '#fbbf24';
        ctx.fillRect(cx, cy, 2.5, 2.5);
      }

      // Layer B: KYAU Campus Building & Clock Tower Silhouette
      ctx.fillStyle = '#031f14';
      const towerBaseX = width * 0.28;
      const towerBaseY = height * 0.62;
      // Clock tower body
      ctx.fillRect(towerBaseX, towerBaseY - 140, 50, 140);
      // Tower spire
      ctx.beginPath();
      ctx.moveTo(towerBaseX - 8, towerBaseY - 140);
      ctx.lineTo(towerBaseX + 25, towerBaseY - 185);
      ctx.lineTo(towerBaseX + 58, towerBaseY - 140);
      ctx.closePath();
      ctx.fill();
      // Glowing Clock Dial
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(towerBaseX + 25, towerBaseY - 115, 12, 0, Math.PI * 2);
      ctx.fill();
      // Clock hands pointing to 11:59 (Deadline time!)
      ctx.strokeStyle = '#022c22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(towerBaseX + 25, towerBaseY - 115);
      ctx.lineTo(towerBaseX + 25, towerBaseY - 124);
      ctx.moveTo(towerBaseX + 25, towerBaseY - 115);
      ctx.lineTo(towerBaseX + 22, towerBaseY - 123);
      ctx.stroke();

      // Campus faculty hall silhouette
      ctx.fillRect(towerBaseX - 110, towerBaseY - 70, 100, 70);
      ctx.fillRect(towerBaseX + 60, towerBaseY - 60, 130, 60);

      // Lit windows
      ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
      for (let r = 0; r < 3; r++) {
        for (let col = 0; col < 4; col++) {
          ctx.fillRect(towerBaseX - 100 + col * 22, towerBaseY - 60 + r * 18, 10, 8);
        }
      }

      // Course Teacher Boss Silhouette looming in clouds/hill on left
      const bossX = width * 0.12;
      const bossY = height * 0.58;
      ctx.fillStyle = 'rgba(2, 38, 24, 0.85)';
      // Boss head & shoulders
      ctx.beginPath();
      ctx.arc(bossX, bossY - 50, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(bossX - 35, bossY - 26, 70, 70);
      // Glowing red grading spectacles
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bossX - 9, bossY - 50, 5, 0, Math.PI * 2);
      ctx.arc(bossX + 9, bossY - 50, 5, 0, Math.PI * 2);
      ctx.fill();
      // Red grading pen emitting red line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bossX + 25, bossY - 20);
      ctx.lineTo(bossX + 55, bossY - 45);
      ctx.stroke();

      // 5. DRAMATIC FOREGROUND HILL CLIMB CLIFFS
      // Main dramatic S-curve hill
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.78);
      // Curve up to a high summit cliff at center-right
      const summitX = width * 0.62;
      const summitY = height * 0.66;
      ctx.bezierCurveTo(
        width * 0.25,
        height * 0.88,
        width * 0.42,
        height * 0.68,
        summitX,
        summitY
      );
      // Descends sharply into steep valley to the right
      ctx.bezierCurveTo(
        width * 0.78,
        height * 0.64,
        width * 0.88,
        height * 0.82,
        width,
        height * 0.76
      );
      ctx.lineTo(width, height);
      ctx.closePath();

      // Hill soil gradient
      const hillSoilGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
      hillSoilGrad.addColorStop(0, '#064e3b'); // forest top soil
      hillSoilGrad.addColorStop(0.2, '#043828');
      hillSoilGrad.addColorStop(0.6, '#022419');
      hillSoilGrad.addColorStop(1, '#01140e');
      ctx.fillStyle = hillSoilGrad;
      ctx.fill();

      // Lush emerald grass ridge stroke
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Neon grass highlight line
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 6. UNIVERSITY OBSTACLES & COLLECTIBLES INTEGRATED INTO THE POSTER SCENERY
      // A. Steaming Campus Chai Thermos ☕ on left slope
      const chaiX = width * 0.35;
      const chaiY = height * 0.76;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(chaiX - 10, chaiY - 20, 20, 26);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(chaiX - 12, chaiY - 24, 24, 6);
      // Chai handle
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(chaiX + 10, chaiY - 18, 8, 16);
      // Steam drifting up
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(chaiX - 2, chaiY - 32 + Math.sin(time * 3) * 3, 5, 0, Math.PI);
      ctx.arc(chaiX + 4, chaiY - 42 + Math.cos(time * 3) * 3, 5, Math.PI, 0);
      ctx.stroke();

      // Label below Chai
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('+40 FUEL CHAI', chaiX, chaiY + 16);

      // B. Giant Gold Tuition Coin 🪙
      const coinX = width * 0.45;
      const coinY = height * 0.70;
      const coinGlow = Math.sin(time * 4) * 3;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(coinX, coinY - 10, 14 + coinGlow * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('$', coinX, coinY - 5);

      // C. Cracked "RETAKE STAMP: GRADE F ❌" Stone Plaque on right slope
      const retakeX = width * 0.85;
      const retakeY = height * 0.78;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(retakeX - 28, retakeY - 20, 56, 32);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(retakeX - 28, retakeY - 20, 56, 32);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('GRADE: F', retakeX, retakeY - 2);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px monospace';
      ctx.fillText('RETAKE STAMP', retakeX, retakeY + 8);

      // 7. THE HERO OF THE POSTER: OFF-ROAD STUDENT RACING BUGGY LEAPING IN MID-AIR!
      // Leaping off the summit cliff into the glowing sky
      const carBaseX = summitX - 20;
      const carBaseY = summitY - 55 + Math.sin(time * 2.5) * 6; // floating leap
      const carAngle = -0.32; // aggressive nose-up 18 degree leap angle

      ctx.save();
      ctx.translate(carBaseX, carBaseY);
      ctx.rotate(carAngle);

      // Twin Exhaust flame particles spawning
      if (Math.random() < 0.7) {
        exhaustParticles.push({
          x: carBaseX - Math.cos(carAngle) * 55 - Math.sin(carAngle) * 12,
          y: carBaseY - Math.sin(carAngle) * 55 + Math.cos(carAngle) * 12,
          vx: -(Math.cos(carAngle) * 6) + (Math.random() - 0.5) * 2,
          vy: -(Math.sin(carAngle) * 6) + (Math.random() - 0.5) * 2,
          size: 7 + Math.random() * 8,
          alpha: 0.9,
          color: Math.random() > 0.3 ? '#ef4444' : '#f59e0b',
          life: 0,
          maxLife: 20,
        });
      }

      // CITATION CANNON LASER BLAST SHOOTING ACROSS POSTER
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(35, -42);
      ctx.lineTo(260, -85);
      ctx.stroke();

      // Laser glow core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, -42);
      ctx.lineTo(260, -85);
      ctx.stroke();

      // Laser muzzle flare
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.arc(36, -42, 8, 0, Math.PI * 2);
      ctx.fill();

      // BUGGY CHASSIS & ROLL-CAGE
      // Roll-cage green tubes
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-45, 5);
      ctx.lineTo(-20, -32);
      ctx.lineTo(25, -32);
      ctx.lineTo(45, 5);
      ctx.stroke();

      // Cross brace
      ctx.beginPath();
      ctx.moveTo(-5, -32);
      ctx.lineTo(-5, 5);
      ctx.stroke();

      // Main sporty body shell
      ctx.fillStyle = '#10b981'; // bright emerald green
      ctx.beginPath();
      ctx.roundRect(-50, -8, 100, 26, 8);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Racing Stripes (Gold)
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-35, -4, 70, 5);

      // CSE 4.00 Decal
      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CSE 4.00', 0, 10);

      // Student Driver with Graduation Gown & Mortarboard
      // Face
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(-2, -18, 11, 0, Math.PI * 2);
      ctx.fill();

      // Red Racing Goggles
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-10, -22, 16, 7);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(-8, -20, 5, 4);
      ctx.fillRect(-1, -20, 5, 4);

      // Black Graduation Mortarboard Cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-18, -30);
      ctx.lineTo(-2, -37);
      ctx.lineTo(14, -30);
      ctx.lineTo(-2, -23);
      ctx.closePath();
      ctx.fill();

      // Golden Tassel flying in wind
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-2, -30);
      ctx.lineTo(-14, -20 + Math.sin(time * 6) * 3);
      ctx.stroke();

      // Rooftop Citation Cannon Turret
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(8, -44, 28, 9);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(14, -39, 10, 8);

      // Oversized Rugged Off-Road Wheels
      const drawPosterWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(time * 8); // spinning fast in air!

        // Heavy tire rubber
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Knobby tire treads
        ctx.fillStyle = '#1e293b';
        for (let t = 0; t < 8; t++) {
          const a = (t * Math.PI) / 4;
          ctx.fillRect(Math.cos(a) * 16 - 2, Math.sin(a) * 16 - 2, 4, 4);
        }

        // Silver rim
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Suspension coils (Chrome Springs)
      const drawSpring = (sx: number, sy: number) => {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx, 12);
        ctx.lineTo(sx - 4, 16);
        ctx.lineTo(sx + 4, 20);
        ctx.lineTo(sx, 24);
        ctx.stroke();
      };

      drawSpring(-32, 12);
      drawSpring(32, 12);

      drawPosterWheel(-32, 24);
      drawPosterWheel(32, 24);

      ctx.restore();

      // 8. UPDATE & DRAW EXHAUST NITRO PARTICLES
      for (let i = exhaustParticles.length - 1; i >= 0; i--) {
        const ep = exhaustParticles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.life++;
        ep.alpha = 1 - ep.life / ep.maxLife;

        if (ep.life >= ep.maxLife) {
          exhaustParticles.splice(i, 1);
        } else {
          ctx.fillStyle = ep.color;
          ctx.globalAlpha = ep.alpha;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // 9. UPDATE & DRAW AMBIENT SPARKS & FLYING GRADUATION MORTARBOARDS
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.05;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const alpha = p.alpha * (Math.sin(p.pulse) * 0.3 + 0.7);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Tossed Graduation Mortarboards flying across the poster
      const drawFlyingCap = (fx: number, fy: number, fsize: number, frot: number) => {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(frot);
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(-fsize, 0);
        ctx.lineTo(0, -fsize * 0.5);
        ctx.lineTo(fsize, 0);
        ctx.lineTo(0, fsize * 0.5);
        ctx.closePath();
        ctx.fill();
        // Golden tassel
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-fsize * 0.6, fsize * 0.5);
        ctx.stroke();
        ctx.restore();
      };

      drawFlyingCap(width * 0.18, height * 0.32 + Math.sin(time) * 12, 14, -0.2 + Math.sin(time * 0.8) * 0.1);
      drawFlyingCap(width * 0.88, height * 0.28 + Math.cos(time) * 10, 12, 0.3 + Math.cos(time * 0.7) * 0.1);
      drawFlyingCap(width * 0.52, height * 0.18 + Math.sin(time * 1.2) * 8, 10, -0.4);

      // 10. VIGNETTE & CINEMATIC POSTER LIGHTING
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(2, 6, 23, 0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans">
      {/* ---------------------------------------------------- */}
      {/* FULL PICTURE THEME CANVAS (THE GAME POSTER) */}
      {/* ---------------------------------------------------- */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* ---------------------------------------------------- */}
      {/* POSTER TYPOGRAPHY & HEADER OVERLAY */}
      {/* ---------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center p-6 sm:p-10 md:p-12 z-20">
        {/* Top Studio / University Billing */}
        <header className="flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            Khwaja Yunus Ali University (KYAU) • Dept. of CSE
          </div>
          <div className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400/80 tracking-[0.3em] uppercase mt-2 drop-shadow">
            AN ORIGINAL 2D CSE PHYSICS RACING ADVENTURE
          </div>
        </header>

        {/* Center / Hero Poster Title Treatment */}
        <div className="flex flex-col items-center text-center max-w-4xl -mt-6 sm:-mt-10">
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] leading-none">
            UNIVERSITY
          </h1>
          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 drop-shadow-[0_10px_25px_rgba(16,185,129,0.4)] leading-tight -mt-1 sm:-mt-3">
            SURVIVAL
          </h2>

          {/* Retro-Arcade Subtitle Banner */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-950/75 border border-white/20 backdrop-blur-md text-slate-200 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase mt-2 shadow-xl">
            <span className="text-emerald-400 font-black">HILL CLIMB CSE EDITION</span>
            <span className="text-white/30">•</span>
            <span>8 SEMESTERS</span>
            <span className="text-white/30">•</span>
            <span className="text-amber-400">140 CREDITS</span>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-semibold tracking-wide drop-shadow-md mt-3 max-w-xl">
            DRIVE • DEBUG • CONQUER OBSTACLES • GRADUATE
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* THE ONLY BUTTON: START PLAY */}
        {/* ---------------------------------------------------- */}
        <div className="flex flex-col items-center gap-3 pointer-events-auto w-full max-w-sm sm:max-w-md pb-2 sm:pb-4">
          <button
            onClick={handleStartGame}
            onMouseEnter={() => setIsHoveringPlay(true)}
            onMouseLeave={() => setIsHoveringPlay(false)}
            className="group relative w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xl sm:text-2xl md:text-3xl tracking-wider uppercase shadow-[0_10px_0_rgb(6,95,70),0_0_40px_rgba(16,185,129,0.6)] active:shadow-[0_2px_0_rgb(6,95,70),0_0_20px_rgba(16,185,129,0.4)] active:translate-y-2 transition-all flex items-center justify-center gap-3 border-2 border-emerald-300/60"
            title="Start Game (Press Space or Enter)"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>START PLAY</span>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 animate-pulse" />
          </button>

          {/* Subtitle Hint */}
          <div className="text-[11px] sm:text-xs font-mono font-bold text-emerald-300/90 tracking-wider flex items-center gap-1.5 drop-shadow">
            <span>Press</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-900/90 border border-white/20 text-white font-mono shadow">
              SPACE
            </kbd>
            <span>or</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-900/90 border border-white/20 text-white font-mono shadow">
              ENTER
            </kbd>
            <span>to Launch Semester {currentSemester}</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* UNOBTRUSIVE SOUND TOGGLE (CORNER) */}
      {/* ---------------------------------------------------- */}
      <button
        onClick={handleToggleSound}
        className="absolute top-5 right-5 z-30 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg active:scale-95"
        title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <VolumeX className="w-5 h-5 text-slate-500" />
        )}
      </button>
    </div>
  );
};
