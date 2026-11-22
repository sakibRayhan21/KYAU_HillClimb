// ============================================================================
// গেম কনফিগারেশন ফাইল (Game Configuration)
// পদার্থবিজ্ঞান (Physics), জ্বালানি (Fuel), অস্ত্র (Weapon), টার্বো (Turbo),
// কালেক্টিবল আইটেম এবং একাডেমিক বাধার (Obstacles) বিশদ সেটিংস
// ============================================================================

import { CollectibleConfig, ObstacleConfig, ObstacleType, AcademicItemType } from '../types/game';

/**
 * পদার্থবিজ্ঞান কনফিগারেশন (Matter.js 2D Physics)
 * গাড়ি চালানো, পাহাড়ে ওঠা, চাকার গ্রিপ এবং শূন্যে ব্যালেন্সের প্যারামিটার
 */
export const PHYSICS_CONFIG = {
  gravity: 1.0, // মহাকর্ষ বলের মান
  baseEngineTorque: 0.015, // পাহাড়ে ওঠার জন্য ইঞ্জিনের মূল ফরোয়ার্ড টর্ক
  maxWheelSpeed: 15, // চাকার সর্বোচ্চ ঘূর্ণন গতি
  reverseSpeed: 14, // রিভার্স বা পেছনে যাওয়ার গতি
  brakeTorque: 0.12, // ব্রেকের কার্যক্ষমতা
  airRotationTorque: 0.055, // গাড়ি বাতাসে লাফ দেওয়ার সময় শূন্যে টিল্ট/ব্যালেন্স ঘোরানোর ক্ষমতা
  suspensionStiffness: 0.22, // সাসপেনশনের দৃঢ়তা
  suspensionDamping: 0.38, // সাসপেনশন ড্যাম্পিং (ঝাঁকুনি কমানো)
  chassisFriction: 0.02, // গাড়ির বডির ঘর্ষণ
  wheelFriction: 1.30, // খাড়া পাহাড়ে ওঠার জন্য চাকার উচ্চ গ্রিপ সম্পন্ন রাবার ঘর্ষণ
  wheelRestitution: 0.08, // চাকার স্থিতিস্থাপকতা বা বাউন্স
};

/**
 * জ্বালানি বা ফুয়েল কনফিগারেশন (Fuel Settings)
 * ক্যাপাসিটি, ড্রেন রেট এবং সতর্কতা থ্রেশহোল্ড
 */
export const FUEL_CONFIG = {
  baseCapacity: 100, // প্রারম্ভিক সর্বোচ্চ ফুয়েল ক্যাপাসিটি
  drainRatePerSecond: 1.8, // প্রতি সেকেন্ডে স্বাভাবিক ফুয়েল খরচের হার
  lowFuelThreshold: 25, // ফুয়েল কম হওয়ার লাল সতর্কতা মাত্রা
  pickupAmount: 40, // ক্যাম্পাস চা/কফি ক্যান থেকে প্রাপ্ত ফুয়েল
};

/**
 * অস্ত্র ও গোলাবারুদ কনফিগারেশন (Weapon & Ammo Settings)
 * প্রজেক্টাইল গতি, ড্যামেজ এবং একাডেমিক পাওয়ার দিয়ে অ্যামো তৈরি
 */
export const WEAPON_CONFIG = {
  baseMaxAmmo: 20, // সর্বোচ্চ ধারণক্ষমতা
  fireCooldownMs: 250, // প্রতি গুলির মধ্যবর্তী বিরতি (মিলি-সেকেন্ড)
  bulletSpeed: 22, // গুলির উড়ার গতি
  baseDamage: 25, // প্রতি বুলেটের মূল আঘাত শক্তি
  bulletLifespanMs: 1600, // গুলির আয়ুষ্কাল (মিলি-সেকেন্ড)
  ammoSynthesisCost: 15, // ১৫ একাডেমিক পাওয়ার খরচ করে অ্যামো রিফিল
  ammoSynthesisAmount: 10, // প্রতি সিন্থেসিসে প্রাপ্ত অ্যামো সংখ্যা (+১০)
};

/**
 * টার্বো বুস্ট কনফিগারেশন (Turbo Boost Settings)
 */
export const TURBO_CONFIG = {
  durationMs: 10, // টার্বো বুস্টের স্থায়িত্ব
  cooldownMs: 80, // পুনরায় টার্বো ব্যবহারের কুলডাউন সময়
  boostForceMultiplier: 2.2, // বুস্টের সময় গতির গুণক
};

/**
 * একাডেমিক কালেক্টিবল কনফিগারেশন (Academic Collectibles & Pickups)
 * ক্লাস টেস্ট, অ্যাসাইনমেন্ট, কুইজ, মিডটার্ম, ফাইনাল, ফুয়েল ও কয়েনের প্রোপার্টি
 */
export const ACADEMIC_COLLECTIBLES_CONFIG: Record<AcademicItemType | 'fuel' | 'coin', CollectibleConfig> = {
  classTest: {
    type: 'classTest',
    name: 'Class Test', // ক্লাস টেস্ট
    academicPower: 10, // ১০ একাডেমিক পাওয়ার
    color: 0x38bdf8, // হালকা নীল
    radius: 18,
  },
  assignment: {
    type: 'assignment',
    name: 'Assignment', // অ্যাসাইনমেন্ট
    academicPower: 15, // ১৫ একাডেমিক পাওয়ার
    color: 0xa855f7, // বেগুনি রঙ
    radius: 18,
  },
  quiz: {
    type: 'quiz',
    name: 'Quiz', // কুইজ
    academicPower: 10, // ১০ একাডেমিক পাওয়ার
    color: 0xf59e0b, // অ্যাম্বার হলুদ
    radius: 18,
  },
  midterm: {
    type: 'midterm',
    name: 'Midterm Exam', // মিডটার্ম পরীক্ষা
    academicPower: 25, // ২৫ একাডেমিক পাওয়ার
    color: 0xec4899, // গোলাপি রঙ
    radius: 22,
  },
  finalExam: {
    type: 'finalExam',
    name: 'Final Exam', // ফাইনাল সেমিস্টার পরীক্ষা
    academicPower: 50, // ৫০ একাডেমিক পাওয়ার
    color: 0xeab308, // সোনালি হলুদ রঙ
    radius: 26,
  },
  fuel: {
    type: 'fuel',
    name: 'Campus Chai & Coffee (Fuel)', // ক্যাম্পাসের চা ও কফি (জ্বালানি রিফিল)
    academicPower: 0,
    fuelAmount: 40, // +৪০ জ্বালানি
    color: 0xef4444, // লাল ক্যান
    radius: 20,
  },
  coin: {
    type: 'coin',
    name: 'Tuition Coin', // টিউশন ফি কয়েন
    academicPower: 0,
    coinAmount: 15, // +১৫ কয়েন
    color: 0xfacc15, // চকচকে সোনালি কয়েন
    radius: 16,
  },
};

/**
 * একাডেমিক বাধার কনফিগারেশন (University Obstacles Configuration)
 * সিএসই ও বিশ্ববিদ্যালয় জীবনের বিভিন্ন প্রতিকূলতা ও চ্যালেঞ্জ
 */
export const OBSTACLES_CONFIG: Record<ObstacleType, ObstacleConfig> = {
  // প্রেম ও সম্পর্কের জটিলতা
  relationship: {
    type: 'relationship',
    name: 'Relationship Distraction',
    subtitle: 'Text: "We need to talk..." ❤️💔',
    maxHp: 35,
    damage: 18, // ফুয়েল ড্রেন
    distraction: true, // স্ক্রিন কিছুটা ঝাপসা করে দেয়
    scoreReward: 50,
    coinsReward: 20,
    width: 60,
    height: 70,
    color: 0xf43f5e,
    accentColor: 0xfb7185,
  },
  // আলসেমি ও অলস সময় কাটানো
  laziness: {
    type: 'laziness',
    name: 'Procrastination & Laziness',
    subtitle: '"Just 5 more minutes in bed..." 🦥🛌',
    maxHp: 40,
    damage: 20,
    speedPenalty: 0.55, // ৩ সেকেন্ডের জন্য গাড়ির গতি ৪৫% কমিয়ে দেয়
    scoreReward: 60,
    coinsReward: 25,
    width: 75,
    height: 65,
    color: 0x64748b,
    accentColor: 0x94a3b8,
  },
  // সেমিস্টার রিটেক ভীতি
  retake: {
    type: 'retake',
    name: 'Semester Retake Stamp',
    subtitle: 'Grade: F — High Danger! ❌📄',
    maxHp: 80, // উচ্চ প্রতিরোধ ক্ষমতা
    damage: 38, // মারাত্মক ফুয়েল ক্ষতি
    scoreReward: 120,
    coinsReward: 45,
    width: 70,
    height: 75,
    color: 0xdc2626,
    accentColor: 0x991b1b,
  },
  // কঠোর কোর্স শিক্ষক (বস)
  courseTeacher: {
    type: 'courseTeacher',
    name: 'Fierce Course Teacher',
    subtitle: 'Boss: "Attendance is mandatory! Explain line 42!" 👨‍🏫👓',
    maxHp: 160, // বস পর্যায়ের সর্বোচ্চ স্বাস্থ্য (HP)
    damage: 42,
    scoreReward: 300,
    coinsReward: 100,
    width: 90,
    height: 95,
    color: 0x7c3aed,
    accentColor: 0x4c1d95,
    boss: true,
  },
  // সোশ্যাল মিডিয়া আসক্তি
  socialMedia: {
    type: 'socialMedia',
    name: 'Social Media Doomscroll',
    subtitle: 'Reels, Memes & Notifications! 📱🔔',
    maxHp: 35,
    damage: 15,
    speedPenalty: 0.65,
    distraction: true,
    scoreReward: 45,
    coinsReward: 20,
    width: 60,
    height: 65,
    color: 0x0284c7,
    accentColor: 0x38bdf8,
  },
  // রাত জেগে ওভারথিঙ্কিং
  overthinking: {
    type: 'overthinking',
    name: 'Midnight Overthinking',
    subtitle: '"What if I fail? What if I get no job?!" 🌀🧠',
    maxHp: 50,
    damage: 22,
    balanceDisruption: true, // গাড়ির ভারসাম্য বিঘ্নিত করে
    scoreReward: 80,
    coinsReward: 30,
    width: 70,
    height: 70,
    color: 0x9333ea,
    accentColor: 0xc084fc,
  },
  // রাত ১১:৫৯ অ্যাসাইনমেন্ট ডেডলাইন
  assignmentDeadline: {
    type: 'assignmentDeadline',
    name: '11:59 PM Assignment Deadline',
    subtitle: 'Tick tock! 1 minute before portal closes! ⏰💣',
    maxHp: 45,
    damage: 25,
    scoreReward: 90,
    coinsReward: 35,
    width: 65,
    height: 65,
    color: 0xe11d48,
    accentColor: 0xf43f5e,
  },
  // ক্লাসে উপস্থিতির ঘাটতি (শর্টেজ)
  attendanceShortage: {
    type: 'attendanceShortage',
    name: 'Attendance Shortage (<75%)',
    subtitle: 'Notice: Barred from Exam! 🚫📋',
    maxHp: 55,
    damage: 28,
    scoreReward: 100,
    coinsReward: 40,
    width: 65,
    height: 70,
    color: 0xb45309,
    accentColor: 0xf59e0b,
  },
};
