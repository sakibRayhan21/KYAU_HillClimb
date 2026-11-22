// ============================================================================
// ওয়েব অডিও সাউন্ড সার্ভিস (Web Audio API Sound Synthesizer)
// কোনো বাহ্যিক অডিও ফাইল ছাড়া ব্রাউজারের Web Audio API অসিলেটর ব্যবহার করে
// রিয়েল-টাইমে ইঞ্জিনের আরপিএম সাউন্ড, লেজার ফায়ার, কয়েন চাইম, ফুয়েল পিকআপ,
// বিস্ফোরণ, টার্বো বুস্ট, ফ্যানফেয়ার এবং ব্যাকগ্রাউন্ড মিউজিক (BGM) সিন্থেসিস করে।
// ============================================================================

class SoundService {
  private ctx: AudioContext | null = null; // অডিও কনটেক্সট রেফারেন্স
  private soundVolume: number = 0.7; // সাউন্ড ইফেক্ট ভলিউম
  private musicVolume: number = 0.4; // মিউজিক ভলিউম
  private soundEnabled: boolean = true; // শব্দ সক্রিয় আছে কিনা
  private musicPlaying: boolean = false; // বিজিএম চলছে কিনা
  private musicInterval: NodeJS.Timeout | null = null; // মিউজিক নোট লুপ টাইমার
  private engineOsc: OscillatorNode | null = null; // ইঞ্জিনের সাউন্ড অসিলেটর
  private engineGain: GainNode | null = null; // ইঞ্জিনের ভলিউম গেইন নোড

  /**
   * ব্রাউজারের AudioContext সক্রিয় ও রিজ্যুম করে
   */
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

  /**
   * সাউন্ড ইফেক্ট চালু বা বন্ধ করা
   */
  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopEngine();
      this.stopBGM();
    }
  }

  /**
   * সাউন্ড ইফেক্টসের ভলিউম সেট করা (০.০ থেকে ১.০)
   */
  public setSoundVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * ব্যাকগ্রাউন্ড মিউজিকের ভলিউম সেট করা (০.০ থেকে ১.০)
   */
  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // --------------------------------------------------------------------------
  // গাড়ির ইঞ্জিনের শব্দ (গতি ও এক্সিলারেশনের সাথে পিচ পরিবর্তন)
  // --------------------------------------------------------------------------
  public startEngine() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || this.engineOsc) return;

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

      // গাড়ির ইঞ্জিনের গভীর গর্জন ফুটিয়ে তুলতে লো-পাস ফিল্টার
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.08 * this.soundVolume, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch {
      // ব্রাউজার অটোপ্লে পলিসি মসৃণভাবে হ্যান্ডেল করা
    }
  }

  /**
   * গাড়ির গতি ও এক্সিলারেশনের ওপর ভিত্তি করে ইঞ্জিনের আরপিএম পিচ আপডেট করা
   */
  public updateEnginePitch(speedRatio: number, isAccelerating: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineGain || !this.soundEnabled) return;
    const targetFreq = 60 + speedRatio * 140 + (isAccelerating ? 30 : 0);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    const targetGain = (0.05 + (isAccelerating ? 0.08 : 0.02) + speedRatio * 0.05) * this.soundVolume;
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  /**
   * ইঞ্জিন শব্দ বন্ধ করা
   */
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

  // --------------------------------------------------------------------------
  // লেজার ওয়েপন ফায়ার সাউন্ড (Laser Gun Sound)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // কয়েন ও একাডেমিক আইটেম কুড়িয়ে পাওয়ার মিষ্টি চাইম সাউন্ড (Chime Sound)
  // --------------------------------------------------------------------------
  public playChime(itemType?: string) {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      let freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 মেজর কর্ড
      if (itemType === 'finalExam') {
        freqs = [523.25, 659.25, 783.99, 1046.5]; // ফাইনাল পরীক্ষার বিশেষ হাই কর্ড
      } else if (itemType === 'midterm') {
        freqs = [440, 554.37, 659.25]; // মিডটার্ম A মেজর
      } else if (itemType === 'assignment') {
        freqs = [392, 493.88, 587.33]; // অ্যাসাইনমেন্ট G মেজর
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

  // --------------------------------------------------------------------------
  // জ্বালানি বা ফুয়েল রিফিল সাউন্ড (Fuel Pickup Sound)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // বাধা ধ্বংস ও বিস্ফোরণ সাউন্ড (Explosion Noise Synthesizer)
  // --------------------------------------------------------------------------
  public playExplosion(boss: boolean = false) {
    if (!this.soundEnabled || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const duration = boss ? 0.6 : 0.35;
      const now = this.ctx.currentTime;

      // হোয়াইট নয়েজ বাফার তৈরি
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // বিস্ফোরণের ভারী অনুভূতির জন্য লো-পাস সুইপ ফিল্টার
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

  // --------------------------------------------------------------------------
  // গাড়িতে ধাক্কা লাগার সাউন্ড (Obstacle Impact Sound)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // টার্বো বুস্ট সাউন্ড (Turbo Boost Sound)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // কম জ্বালানি সতর্কতা সংকেত (Low Fuel Beep Alert)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // সেমিস্টার জয় ও সমাবর্তন ফ্যানফেয়ার (Victory Fanfare)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // গেম ওভার স্যাড টিউন (Game Over Sound)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // ক্যাম্পাস ৮-বিট ব্যাকগ্রাউন্ড মিউজিক সিন্থেসাইজার (8-bit Campus BGM)
  // --------------------------------------------------------------------------
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

  /**
   * ব্যাকগ্রাউন্ড মিউজিক বন্ধ করা
   */
  public stopBGM() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// গেম জুড়ে ব্যবহারের জন্য একক ইনস্ট্যান্স (Singleton Instance)
export const soundService = new SoundService();
