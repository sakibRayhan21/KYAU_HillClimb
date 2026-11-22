// ============================================================================
// গেম কোর টাইপ ও ইন্টারফেস (Game Core Types & Interfaces)
// যানবাহন আপগ্রেড, বাধা (Obstacle), কালেক্টিবল, সেমিস্টার, সিজিপিএ,
// সেভ ডেটা এবং এইচইউডি (HUD) স্টেট সংক্রান্ত সমস্ত টাইপ ডেফিনেশন
// ============================================================================

/** আপগ্রেডের প্রকারভেদ (ইঞ্জিন, ফুয়েল ট্যাংক, সাসপেনশন, আর্মার, অস্ত্র, টার্বো) */
export type UpgradeType = 'engine' | 'fuelTank' | 'suspension' | 'armor' | 'weapon' | 'turbo';

/**
 * আপগ্রেড লেভেলের তথ্য ইন্টারফেস
 */
export interface UpgradeLevelInfo {
  level: number; // আপগ্রেড লেভেল (১ থেকে ১০)
  costCoins: number; // কয়েন খরচ
  costPower: number; // একাডেমিক পাওয়ার খরচ
  value: number; // পারফরম্যান্স গুণক বা পরম মান
  label: string; // প্রদর্শনের জন্য লেবেল
}

/**
 * গ্যারেজের যানবাহন আপগ্রেড স্ট্যাটাস
 */
export interface GarageUpgrades {
  engine: number;      // ১ - ১০: সর্বোচ্চ গতি এবং টর্ক
  fuelTank: number;    // ১ - ১০: জ্বালানি ধারণক্ষমতা এবং দক্ষতা
  suspension: number;  // ১ - ১০: ধাক্কা শোষণ এবং পাহাড়ি গ্রিপ
  armor: number;       // ১ - ১০: বাধা থেকে ক্ষতি কমানোর ক্ষমতা
  weapon: number;      // ১ - ১০: অস্ত্র আঘাত ক্ষমতা এবং গুলির গতি
  turbo: number;       // ১ - ১০: টার্বো বুস্ট শক্তি ও স্থায়িত্ব
}

/**
 * একাডেমিক জীবনের বিভিন্ন বাধা (Obstacles)
 */
export type ObstacleType = 
  | 'relationship'        // প্রেম-ভালোবাসার জটিলতা
  | 'laziness'            // আলসেমি ও দীর্ঘসূত্রতা
  | 'retake'              // কোর্সের রিটেক ঝুঁকি
  | 'courseTeacher'       // কঠোর কোর্স শিক্ষক
  | 'socialMedia'         // সোশ্যাল মিডিয়ার আসক্তি
  | 'overthinking'        // মানসিক দুশ্চিন্তা
  | 'assignmentDeadline'  // অ্যাসাইনমেন্ট ডেডলাইন চাপ
  | 'attendanceShortage'; // উপস্থিতির ঘাটতি

/**
 * বাধার কনফিগারেশন ইন্টারফেস
 */
export interface ObstacleConfig {
  type: ObstacleType; // বাধার ধরণ
  name: string; // বাধার নাম
  subtitle: string; // সাবটাইটেল বা বিবরণ
  maxHp: number; // বাধার সর্বোচ্চ স্বাস্থ্য (HP)
  damage: number; // গাড়িতে লাগলে ফুয়েল হ্রাস বা আঘাতের পরিমাণ
  speedPenalty?: number; // গতির গতিহ্রাসের পরিমাণ বা সময়
  distraction?: boolean; // মনোযোগ নষ্টকারী বাধা কিনা
  balanceDisruption?: boolean; // গাড়ির ব্যালেন্স নষ্টকারী বাধা কিনা
  scoreReward: number; // ধ্বংস করলে প্রাপ্ত স্কোর
  coinsReward: number; // ধ্বংস করলে প্রাপ্ত কয়েন
  width: number; // প্রস্থ (পিক্সেল)
  height: number; // উচ্চতা (পিক্সেল)
  color: number; // প্রধান রঙ
  accentColor: number; // অ্যাকসেন্ট রঙ
  boss?: boolean; // এটি সেমিস্টার ফাইনাল বস কিনা
}

/** একাডেমিক আইটেম ও কালেক্টিবল টাইপ */
export type AcademicItemType = 'classTest' | 'assignment' | 'quiz' | 'midterm' | 'finalExam';
export type CollectibleType = 'fuel' | 'coin' | AcademicItemType;

/**
 * রাস্তায় কুড়িয়ে পাওয়ার মতো আইটেম কনফিগারেশন
 */
export interface CollectibleConfig {
  type: CollectibleType; // আইটেমের প্রকার
  name: string; // আইটেমের নাম
  academicPower: number; // অর্জিত একাডেমিক শক্তি
  fuelAmount?: number; // ফুয়েল ড্রপ হলে প্রাপ্ত জ্বালানির পরিমাণ
  coinAmount?: number; // কয়েন ড্রপ হলে প্রাপ্ত কয়েনের পরিমাণ
  color: number; // ডিসপ্লে রঙ
  radius: number; // ব্যাসার্ধ
}

/**
 * প্রতিটি কোর্সের গ্রেড ও জিপিএ তথ্য
 */
export interface CourseGrade {
  code: string; // কোর্স কোড (যেমন: CSE 111)
  title: string; // কোর্সের নাম
  credits: number; // ক্রেডিট আওয়ার
  grade: string; // লেটার গ্রেড (যেমন: A+, A, B)
  gpa: number; // পয়েন্ট (৪.০০ স্কেলে)
  score: number; // প্রাপ্ত নম্বর (০ - ১০০)
}

/**
 * প্রতিটি সেমিস্টারের বিস্তারিত কনফিগারেশন
 */
export interface SemesterInfo {
  id: number; // সেমিস্টার আইডি
  number: number; // সেমিস্টার নম্বর (১ - ৮)
  title: string; // সেমিস্টারের নাম
  tagline: string; // ট্যাগলাইন
  description: string; // বর্ণনা
  targetDistance: number; // সেমিস্টার পাস করার লক্ষ্য দূরত্ব (মিটারে)
  theme: {
    skyColor: number; // আকাশের উপরের রঙ
    skyBottomColor: number; // আকাশের নিচের রঙ
    hillPrimary: number; // পাহাড়ের মূল রঙ
    hillSecondary: number; // পাহাড়ের গৌণ রঙ
    accentColor: string; // থিম অ্যাকসেন্ট রঙ
    bgElements: 'campus' | 'library' | 'coding_lab' | 'exam_hall' | 'project_fair' | 'research_center' | 'corporate' | 'convocation';
  };
  courses: { code: string; title: string; credits: number }[]; // সেমিস্টারের কোর্স তালিকা
  obstaclePool: { type: ObstacleType; weight: number }[]; // আসার মতো সম্ভাব্য বাধার তালিকা
  spawnIntervalMeters: number; // বাধার স্পন দূরত্ব
  hillSteepness: number; // পাহাড়ের ঢাল বা খাড়া হওয়ার মাত্রা
  hillRoughness: number; // পাহাড়ের এবড়োখেবড়ো ভাব
}

/**
 * সেমিস্টার রান শেষ করার ফলাফল
 */
export interface SemesterRunResult {
  semesterNumber: number; // সেমিস্টার নম্বর
  completed: boolean; // সেমিস্টার পাস হয়েছে কিনা
  distanceCovered: number; // অতিক্রান্ত দূরত্ব
  targetDistance: number; // লক্ষ্য দূরত্ব
  fuelLeft: number; // অবশিষ্ট ফুয়েল
  academicPowerEarned: number; // অর্জিত একাডেমিক পাওয়ার
  coinsEarned: number; // সংগৃহীত কয়েন
  obstaclesDestroyed: number; // ধ্বংস করা বাধার সংখ্যা
  obstaclesHit: number; // ধাক্কা খাওয়া বাধার সংখ্যা
  academicItemsCollected: Record<string, number>; // সংগৃহীত একাডেমিক আইটেমের হিসাব
  semesterGPA: number; // এই সেমিস্টারের জিপিএ
  semesterGrade: string; // লেটার গ্রেড
  courseGrades: CourseGrade[]; // কোর্সভিত্তিক ফলাফল
  creditsEarned: number; // অর্জিত ক্রেডিট
}

/**
 * ট্রান্সক্রিপ্ট রেকর্ড
 */
export interface TranscriptRecord {
  semesterNumber: number; // সেমিস্টার নম্বর
  semesterTitle: string; // সেমিস্টার নাম
  gpa: number; // সেমিস্টার জিপিএ
  grade: string; // লেটার গ্রেড
  credits: number; // ক্রেডিট
  courses: CourseGrade[]; // কোর্স ডিটেইলস
  completedAt: string; // সম্পন্ন করার তারিখ
}

/**
 * গেমের সাউন্ড ও ডিসপ্লে সেটিংস
 */
export interface GameSettings {
  soundVolume: number; // সাউন্ড ইফেক্ট ভলিউম (০ - ১)
  musicVolume: number; // ব্যাকগ্রাউন্ড মিউজিক ভলিউম (০ - ১)
  soundEnabled: boolean; // শব্দ চালু/বন্ধ
  particlesEnabled: boolean; // কণা বা পার্টিকল ইফেক্ট চালু/বন্ধ
  touchControls: boolean; // অন-স্ক্রিন টাচ কন্ট্রোল সক্রিয় কিনা
}

/**
 * প্লেয়ারের সামগ্রিক গেম পরিসংখ্যান
 */
export interface GameStats {
  totalRuns: number; // মোট কতবার খেলা হয়েছে
  totalDistance: number; // মোট অতিক্রান্ত দূরত্ব
  totalObstaclesDestroyed: number; // মোট ধ্বংস করা বাধা
  totalCoinsEarned: number; // মোট অর্জিত কয়েন
  totalAcademicPower: number; // মোট অর্জিত একাডেমিক পাওয়ার
  graduated: boolean; // গ্রাজুয়েশন সম্পন্ন হয়েছে কিনা
}

/**
 * লোকাল স্টোরেজে সংরক্ষিত প্লেয়ারের পূর্ণাঙ্গ গেম সেভ ডেটা
 */
export interface SaveData {
  version: number; // সেভ ডেটা সংস্করণ
  currentSemester: number; // বর্তমান সেমিস্টার
  unlockedSemesters: number; // আনলক হওয়া সর্বোচ্চ সেমিস্টার
  coins: number; // মোট কয়েন ব্যালেন্স
  academicPower: number; // মোট একাডেমিক পাওয়ার ব্যালেন্স
  ammo: number; // বর্তমান গোলাবারুদ/অ্যামো সংখ্যা
  upgrades: GarageUpgrades; // গাড়ির আপগ্রেড লেভেল
  transcript: TranscriptRecord[]; // একাডেমিক ট্রান্সক্রিপ্ট
  cgpa: number; // মোট অর্জিত সিজিপিএ (CGPA)
  totalCredits: number; // মোট অর্জিত ক্রেডিট সংখ্যা
  settings: GameSettings; // গেমের সেটিংস
  stats: GameStats; // গেম পরিসংখ্যান
}

/**
 * ইন-গেম স্ক্রিন ডিসপ্লে (HUD) এর রিয়েল-টাইম স্টেট
 */
export interface GameHUDState {
  distance: number; // বর্তমান দূরত্ব
  targetDistance: number; // টার্গেট দূরত্ব
  speed: number; // বর্তমান গতি (কিমি/ঘণ্টা)
  fuel: number; // বর্তমান ফুয়েল
  maxFuel: number; // সর্বোচ্চ ফুয়েল ক্যাপাসিটি
  fuelPercentage: number; // ফুয়েলের শতকরা পরিমাণ
  coins: number; // এই রানে সংগৃহীত কয়েন
  academicPower: number; // সংগৃহীত একাডেমিক পাওয়ার
  ammo: number; // বর্তমান অ্যামো
  maxAmmo: number; // সর্বোচ্চ অ্যামো ক্যাপাসিটি
  semesterNumber: number; // চলমান সেমিস্টার নম্বর
  cgpa: number; // সামগ্রিক সিজিপিএ
  currentEffect: string | null; // বর্তমানে সক্রিয় স্ট্যাটাস বা বাফ/ডিবাফ
  effectTimer: number; // ইফেক্ট শেষ হওয়ার সময়
  isPaused: boolean; // গেম পজ করা আছে কিনা
  turboReady: boolean; // টার্বো বুস্ট প্রস্তুত কিনা
  turboCooldown: number; // টার্বো পুনরায় প্রস্তুত হওয়ার অবশিষ্ট সময়
  turboActive: boolean; // বর্তমানে টার্বো চালু আছে কিনা
}

/** গেম ইভেন্ট হ্যান্ডলার কলব্যাক ফাংশন টাইপ */
export type GameEventCallback = (event: string, data?: any) => void;
