// ============================================================================
// গেম স্টোরেজ সার্ভিস (Game Storage Service)
// ব্রাউজারের localStorage-এ গেমের অগ্রগতি, আনলক হওয়া সেমিস্টার, আপগ্রেডস,
// সিজিপিএ ট্রান্সক্রিপ্ট ও সেটিংস সংরক্ষণ, লোড, ব্যাকআপ এবং রিসেট করে।
// প্রতিটি লগইন ব্যবহারকারীর জন্য আলাদা সেভ ফাইল তৈরি করে ডেটা সুরক্ষিত রাখে।
// ============================================================================

import { SaveData, GarageUpgrades, GameSettings, GameStats, TranscriptRecord } from '../types/game';

// লোকাল স্টোরেজ কী (Keys)
const GUEST_STORAGE_KEY = 'university_survival_save_v1';
const SESSION_STORAGE_KEY = 'university_survival_session_v1';

/**
 * ডিফল্ট গ্যারেজ আপগ্রেড লেভেল (সব উপাদান লেভেল ১ থেকে শুরু)
 */
export const DEFAULT_UPGRADES: GarageUpgrades = {
  engine: 1, // ইঞ্জিন
  fuelTank: 1, // ফুয়েল ট্যাংক
  suspension: 1, // সাসপেনশন
  armor: 1, // আর্মার
  weapon: 1, // অস্ত্র
  turbo: 1, // টার্বো
};

/**
 * ডিফল্ট গেম সাউন্ড ও ডিসপ্লে সেটিংস
 */
export const DEFAULT_SETTINGS: GameSettings = {
  soundVolume: 0.7,
  musicVolume: 0.4,
  soundEnabled: true,
  particlesEnabled: true,
  touchControls: false,
};

/**
 * ডিফল্ট প্লেয়ার লাইফটাইম স্ট্যাটিস্টিকস
 */
export const DEFAULT_STATS: GameStats = {
  totalRuns: 0,
  totalDistance: 0,
  totalObstaclesDestroyed: 0,
  totalCoinsEarned: 0,
  totalAcademicPower: 0,
  graduated: false,
};

/**
 * নতুন গেম শুরু করার জন্য ডিফল্ট সেভ ডেটা
 */
export const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  currentSemester: 1, // ১ম সেমিস্টার থেকে শুরু
  unlockedSemesters: 1, // প্রথমে কেবল ১ম সেমিস্টার আনলক
  coins: 50, // প্রারম্ভিক পকেট মানি ৫০ কয়েন
  academicPower: 20, // প্রারম্ভিক পড়ালেখার স্ট্যামিনা
  ammo: 20, // ২০টি বুলেট
  upgrades: { ...DEFAULT_UPGRADES },
  transcript: [],
  cgpa: 4.0,
  totalCredits: 0,
  settings: { ...DEFAULT_SETTINGS },
  stats: { ...DEFAULT_STATS },
};

export class StorageService {
  private static activeUserId: string | null = null;

  /** ব্রাউজার লোকালস্টোরেজ সক্রিয় কিনা যাচাই */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /** সক্রিয় ব্যবহারকারী আইডি সেট করা */
  public static setActiveUser(userId: string | null): void {
    this.activeUserId = userId;
  }

  /** বর্তমান সক্রিয় ব্যবহারকারী আইডি নিয়ে আসা */
  public static getActiveUserId(): string | null {
    if (this.activeUserId) return this.activeUserId;
    if (!this.isBrowser()) return null;

    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.user && session.user.id) {
          this.activeUserId = session.user.id;
          return this.activeUserId;
        }
      }
    } catch (e) {
      // ত্রুটি উপেক্ষা করা
    }
    return null;
  }

  /** ব্যবহারকারী অনুযায়ী ডেডিকেটেড স্টোরেজ কী নির্ধারণ */
  private static getActiveStorageKey(): string {
    const uid = this.getActiveUserId();
    if (uid) {
      return `university_survival_save_${uid}`;
    }
    return GUEST_STORAGE_KEY;
  }

  /**
   * বর্তমান ব্যবহারকারীর সেভ ডেটা লোড করে (না থাকলে ডিফল্ট রিটার্ন করে)
   */
  public static load(): SaveData {
    if (!this.isBrowser()) return { ...DEFAULT_SAVE_DATA };

    try {
      const key = this.getActiveStorageKey();
      const raw = localStorage.getItem(key);
      if (!raw) {
        this.save(DEFAULT_SAVE_DATA);
        return { ...DEFAULT_SAVE_DATA };
      }

      const parsed = JSON.parse(raw) as Partial<SaveData>;
      // নতুন সংস্করণ বা ফিল্ড যুক্ত হলে নিরাপত্তা বজায় রাখতে ডিফল্টের সাথে মার্জ করা
      return {
        ...DEFAULT_SAVE_DATA,
        ...parsed,
        upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        stats: { ...DEFAULT_STATS, ...(parsed.stats || {}) },
        transcript: Array.isArray(parsed.transcript) ? parsed.transcript : [],
      };
    } catch (e) {
      console.warn('Failed to parse save data, falling back to default:', e);
      return { ...DEFAULT_SAVE_DATA };
    }
  }

  /**
   * গেস্ট মোডের সেভ ডেটা লোড করার মেথড (সাইন-আপের সময় মাইগ্রেশনের সুবিধার্থে)
   */
  public static loadGuestSave(): SaveData {
    if (!this.isBrowser()) return { ...DEFAULT_SAVE_DATA };

    try {
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE_DATA };
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      return {
        ...DEFAULT_SAVE_DATA,
        ...parsed,
        upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        stats: { ...DEFAULT_STATS, ...(parsed.stats || {}) },
        transcript: Array.isArray(parsed.transcript) ? parsed.transcript : [],
      };
    } catch (e) {
      return { ...DEFAULT_SAVE_DATA };
    }
  }

  /**
   * গেম ডেটা স্টোরেজে সেভ করা
   */
  public static save(data: SaveData): void {
    if (!this.isBrowser()) return;
    try {
      const key = this.getActiveStorageKey();
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
    }
  }

  /**
   * গেমের অগ্রগতি রিসেট করে নতুনে ফিরিয়ে আনা
   */
  public static reset(): SaveData {
    if (this.isBrowser()) {
      const key = this.getActiveStorageKey();
      localStorage.removeItem(key);
    }
    const fresh = { ...DEFAULT_SAVE_DATA };
    this.save(fresh);
    return fresh;
  }

  /**
   * ফাংশনাল উপায়ে আংশিক বা পূর্ণাঙ্গ সেভ ডেটা আপডেট করার হেল্পার
   */
  public static update(fn: (data: SaveData) => SaveData): SaveData {
    const current = this.load();
    const updated = fn(current);
    this.save(updated);
    return updated;
  }

  /**
   * ব্যাকআপের জন্য সেভ ডেটা JSON স্ট্রিং আকারে এক্সপোর্ট করা
   */
  public static exportJSON(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  /**
   * ব্যাকআপ JSON ফাইল থেকে সেভ ডেটা পুনরুদ্ধার বা ইমপোর্ট করা
   */
  public static importJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        this.save({
          ...DEFAULT_SAVE_DATA,
          ...parsed,
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid save JSON:', e);
    }
    return false;
  }
}
