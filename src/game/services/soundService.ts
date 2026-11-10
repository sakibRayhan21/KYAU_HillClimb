/**
 * Pure Web Audio API Sound Synthesizer for UNIVERSITY SURVIVAL
 * Zero external audio files required, zero 404s, instant playback with full volume control.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private soundVolume: number = 0.7;
  private musicVolume: number = 0.4;
  private soundEnabled: boolean = true;
  private musicPlaying: boolean = false;
  private musicInterval: NodeJS.Timeout | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  private initContext() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopEngine();
      this.stopBGM();
    }
  }

  public setSoundVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Engine sound with dynamic RPM pitch
  public startEngine() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || this.engineOsc) return;

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

      // Low pass filter to make it sound like a throaty engine
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.08 * this.soundVolume, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  public updateEnginePitch(speedRatio: number, isAccelerating: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineGain || !this.soundEnabled) return;
    const targetFreq = 60 + speedRatio * 140 + (isAccelerating ? 30 : 0);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    const targetGain = (0.05 + (isAccelerating ? 0.08 : 0.02) + speedRatio * 0.05) * this.soundVolume;
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {}
      this.engineOsc = null;
    }
    if (this.engineGain) {
      try {
        this.engineGain.disconnect();
      } catch {}
      this.engineGain = null;
    }
  }

  // Laser Weapon Fire
  public playLaser() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(Math.max(0.001, 0.25 * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Coin & Academic Item Chime
  public playChime(itemType?: string) {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      let freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      if (itemType === 'finalExam') {
        freqs = [523.25, 659.25, 783.99, 1046.5]; // C major high
      } else if (itemType === 'midterm') {
        freqs = [440, 554.37, 659.25]; // A major
      } else if (itemType === 'assignment') {
        freqs = [392, 493.88, 587.33]; // G major
      }

      const now = this.ctx.currentTime;
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(Math.max(0.001, 0.18 * this.soundVolume), now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.23);
      });
    } catch {}
  }

  // Fuel Refill
  public playFuelPickup() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(560, now + 0.25);

      gain.gain.setValueAtTime(Math.max(0.001, 0.22 * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  // Obstacle Explosion / Destroyed
  public playExplosion(boss: boolean = false) {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const duration = boss ? 0.6 : 0.35;
      const now = this.ctx.currentTime;

      // Noise buffer
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(Math.max(0.001, (boss ? 0.45 : 0.3) * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {}
  }

  // Obstacle Impact / Fuel Damaged
  public playImpact() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

      gain.gain.setValueAtTime(Math.max(0.001, 0.28 * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch {}
  }

  // Turbo / Boost
  public playTurbo() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.4);

      gain.gain.setValueAtTime(Math.max(0.001, 0.3 * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch {}
  }

  // Low Fuel Alert
  public playLowFuelAlert() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(Math.max(0.001, 0.18 * this.soundVolume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Level Win / Convocation Fanfare
  public playFanfare() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 523.25, t: 0.0, d: 0.18 }, // C5
        { f: 523.25, t: 0.2, d: 0.18 }, // C5
        { f: 523.25, t: 0.4, d: 0.18 }, // C5
        { f: 659.25, t: 0.6, d: 0.45 }, // E5
        { f: 587.33, t: 1.1, d: 0.22 }, // D5
        { f: 783.99, t: 1.35, d: 0.7 }, // G5
      ];

      const start = this.ctx.currentTime;
      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, start + n.t);

        gain.gain.setValueAtTime(Math.max(0.001, 0.24 * this.soundVolume), start + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + n.t);
        osc.stop(start + n.t + n.d + 0.05);
      });
    } catch {}
  }

  // Game Over Sad Trill
  public playGameOver() {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 440, t: 0.0 },
        { f: 415.3, t: 0.2 },
        { f: 392, t: 0.4 },
        { f: 349.23, t: 0.65 },
      ];

      const start = this.ctx.currentTime;
      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, start + n.t);

        gain.gain.setValueAtTime(Math.max(0.001, 0.2 * this.soundVolume), start + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start + n.t);
        osc.stop(start + n.t + 0.32);
      });
    } catch {}
  }

  // University Campus 8-bit BGM Synthesizer
  public startBGM() {
    if (this.musicPlaying || !this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.musicPlaying = true;
    const melody = [
      261.63, 293.66, 329.63, 349.23, 392.00, 329.63, 261.63, 392.00,
      349.23, 329.63, 293.66, 329.63, 261.63, 196.00, 220.00, 246.94
    ];
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (!this.musicPlaying || !this.ctx || !this.soundEnabled || this.musicVolume <= 0) return;
      try {
        const freq = melody[step % melody.length];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04 * this.musicVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
        step++;
      } catch {}
    }, 280);
  }

  public stopBGM() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundService = new SoundService();

