import { SaveData, GarageUpgrades, GameSettings, GameStats, TranscriptRecord } from '../types/game';

const STORAGE_KEY = 'university_survival_save_v1';

export const DEFAULT_UPGRADES: GarageUpgrades = {
  engine: 1,
  fuelTank: 1,
  suspension: 1,
  armor: 1,
  weapon: 1,
  turbo: 1,
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundVolume: 0.7,
  musicVolume: 0.4,
  soundEnabled: true,
  particlesEnabled: true,
  touchControls: false,
};

export const DEFAULT_STATS: GameStats = {
  totalRuns: 0,
  totalDistance: 0,
  totalObstaclesDestroyed: 0,
  totalCoinsEarned: 0,
  totalAcademicPower: 0,
  graduated: false,
};

export const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  currentSemester: 1,
  unlockedSemesters: 1,
  coins: 50, // Initial pocket money
  academicPower: 20, // Initial study stamina
  ammo: 20,
  upgrades: { ...DEFAULT_UPGRADES },
  transcript: [],
  cgpa: 4.0,
  totalCredits: 0,
  settings: { ...DEFAULT_SETTINGS },
  stats: { ...DEFAULT_STATS },
};

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public static load(): SaveData {
    if (!this.isBrowser()) return { ...DEFAULT_SAVE_DATA };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.save(DEFAULT_SAVE_DATA);
        return { ...DEFAULT_SAVE_DATA };
      }

      const parsed = JSON.parse(raw) as Partial<SaveData>;
      // Merge with defaults to guarantee safety across updates
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

  public static save(data: SaveData): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
    }
  }

  public static reset(): SaveData {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY);
    }
    const fresh = { ...DEFAULT_SAVE_DATA };
    this.save(fresh);
    return fresh;
  }

  public static update(fn: (data: SaveData) => SaveData): SaveData {
    const current = this.load();
    const updated = fn(current);
    this.save(updated);
    return updated;
  }

  public static exportJSON(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

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

