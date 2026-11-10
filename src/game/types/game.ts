export type UpgradeType = 'engine' | 'fuelTank' | 'suspension' | 'armor' | 'weapon' | 'turbo';

export interface UpgradeLevelInfo {
  level: number;
  costCoins: number;
  costPower: number;
  value: number; // Value multiplier or absolute stat
  label: string;
}

export interface GarageUpgrades {
  engine: number;      // 1 - 10: Top speed & torque
  fuelTank: number;    // 1 - 10: Tank capacity & burn efficiency
  suspension: number;  // 1 - 10: Shock absorption & grip
  armor: number;       // 1 - 10: Damage reduction from obstacles
  weapon: number;      // 1 - 10: Weapon damage & fire rate
  turbo: number;       // 1 - 10: Boost power & duration
}

export type ObstacleType = 
  | 'relationship'
  | 'laziness'
  | 'retake'
  | 'courseTeacher'
  | 'socialMedia'
  | 'overthinking'
  | 'assignmentDeadline'
  | 'attendanceShortage';

export interface ObstacleConfig {
  type: ObstacleType;
  name: string;
  subtitle: string;
  maxHp: number;
  damage: number; // fuel drain or impact
  speedPenalty?: number; // duration or factor
  distraction?: boolean;
  balanceDisruption?: boolean;
  scoreReward: number;
  coinsReward: number;
  width: number;
  height: number;
  color: number;
  accentColor: number;
  boss?: boolean;
}

export type AcademicItemType = 'classTest' | 'assignment' | 'quiz' | 'midterm' | 'finalExam';
export type CollectibleType = 'fuel' | 'coin' | AcademicItemType;

export interface CollectibleConfig {
  type: CollectibleType;
  name: string;
  academicPower: number;
  fuelAmount?: number;
  coinAmount?: number;
  color: number;
  radius: number;
}

export interface CourseGrade {
  code: string;
  title: string;
  credits: number;
  grade: string;
  gpa: number;
  score: number;
}

export interface SemesterInfo {
  id: number;
  number: number;
  title: string;
  tagline: string;
  description: string;
  targetDistance: number; // in meters (e.g., 800m - 2000m)
  theme: {
    skyColor: number;
    skyBottomColor: number;
    hillPrimary: number;
    hillSecondary: number;
    accentColor: string;
    bgElements: 'campus' | 'library' | 'coding_lab' | 'exam_hall' | 'project_fair' | 'research_center' | 'corporate' | 'convocation';
  };
  courses: { code: string; title: string; credits: number }[];
  obstaclePool: { type: ObstacleType; weight: number }[];
  spawnIntervalMeters: number;
  hillSteepness: number;
  hillRoughness: number;
}

export interface SemesterRunResult {
  semesterNumber: number;
  completed: boolean;
  distanceCovered: number;
  targetDistance: number;
  fuelLeft: number;
  academicPowerEarned: number;
  coinsEarned: number;
  obstaclesDestroyed: number;
  obstaclesHit: number;
  academicItemsCollected: Record<string, number>;
  semesterGPA: number;
  semesterGrade: string;
  courseGrades: CourseGrade[];
  creditsEarned: number;
}

export interface TranscriptRecord {
  semesterNumber: number;
  semesterTitle: string;
  gpa: number;
  grade: string;
  credits: number;
  courses: CourseGrade[];
  completedAt: string;
}

export interface GameSettings {
  soundVolume: number;
  musicVolume: number;
  soundEnabled: boolean;
  particlesEnabled: boolean;
  touchControls: boolean;
}

export interface GameStats {
  totalRuns: number;
  totalDistance: number;
  totalObstaclesDestroyed: number;
  totalCoinsEarned: number;
  totalAcademicPower: number;
  graduated: boolean;
}

export interface SaveData {
  version: number;
  currentSemester: number;
  unlockedSemesters: number;
  coins: number;
  academicPower: number;
  ammo: number;
  upgrades: GarageUpgrades;
  transcript: TranscriptRecord[];
  cgpa: number;
  totalCredits: number;
  settings: GameSettings;
  stats: GameStats;
}

export interface GameHUDState {
  distance: number;
  targetDistance: number;
  speed: number;
  fuel: number;
  maxFuel: number;
  fuelPercentage: number;
  coins: number;
  academicPower: number;
  ammo: number;
  maxAmmo: number;
  semesterNumber: number;
  cgpa: number;
  currentEffect: string | null;
  effectTimer: number;
  isPaused: boolean;
  turboReady: boolean;
  turboCooldown: number;
  turboActive: boolean;
}

export type GameEventCallback = (event: string, data?: any) => void;

