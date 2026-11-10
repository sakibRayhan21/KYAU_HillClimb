import { CollectibleConfig, ObstacleConfig, ObstacleType, AcademicItemType } from '../types/game';

export const PHYSICS_CONFIG = {
  gravity: 1.0, // Matter.js world gravity
  baseEngineTorque: 0.015, // Powerful hill-climbing forward driving thrust
  maxWheelSpeed: 15, // High top speed for hills and jumps
  reverseSpeed: 14,
  brakeTorque: 0.12,
  airRotationTorque: 0.055, // In-air tilt balance
  suspensionStiffness: 0.22,
  suspensionDamping: 0.38,
  chassisFriction: 0.02,
  wheelFriction: 1.30, // High-grip rubber for steep hill climbing
  wheelRestitution: 0.08,
};

export const FUEL_CONFIG = {
  baseCapacity: 100,
  drainRatePerSecond: 1.8, // decreases smoothly over time
  lowFuelThreshold: 25,
  pickupAmount: 40,
};

export const WEAPON_CONFIG = {
  baseMaxAmmo: 20,
  fireCooldownMs: 250,
  bulletSpeed: 22,
  baseDamage: 25,
  bulletLifespanMs: 1600,
  ammoSynthesisCost: 15, // Spend 15 Academic Power for +10 Ammo
  ammoSynthesisAmount: 10,
};

export const TURBO_CONFIG = {
  durationMs: 10,
  cooldownMs: 80,
  boostForceMultiplier: 2.2,
};

export const ACADEMIC_COLLECTIBLES_CONFIG: Record<AcademicItemType | 'fuel' | 'coin', CollectibleConfig> = {
  classTest: {
    type: 'classTest',
    name: 'Class Test',
    academicPower: 10,
    color: 0x38bdf8, // light blue
    radius: 18,
  },
  assignment: {
    type: 'assignment',
    name: 'Assignment',
    academicPower: 15,
    color: 0xa855f7, // purple
    radius: 18,
  },
  quiz: {
    type: 'quiz',
    name: 'Quiz',
    academicPower: 10,
    color: 0xf59e0b, // amber
    radius: 18,
  },
  midterm: {
    type: 'midterm',
    name: 'Midterm Exam',
    academicPower: 25,
    color: 0xec4899, // pink
    radius: 22,
  },
  finalExam: {
    type: 'finalExam',
    name: 'Final Exam',
    academicPower: 50,
    color: 0xeab308, // gold
    radius: 26,
  },
  fuel: {
    type: 'fuel',
    name: 'Campus Chai & Coffee (Fuel)',
    academicPower: 0,
    fuelAmount: 40,
    color: 0xef4444, // vibrant red canister
    radius: 20,
  },
  coin: {
    type: 'coin',
    name: 'Tuition Coin',
    academicPower: 0,
    coinAmount: 15,
    color: 0xfacc15, // shiny yellow gold
    radius: 16,
  },
};

export const OBSTACLES_CONFIG: Record<ObstacleType, ObstacleConfig> = {
  relationship: {
    type: 'relationship',
    name: 'Relationship Distraction',
    subtitle: 'Text: "We need to talk..." ❤️💔',
    maxHp: 35,
    damage: 18, // Fuel drain
    distraction: true, // wobbles screen with heart fog
    scoreReward: 50,
    coinsReward: 20,
    width: 60,
    height: 70,
    color: 0xf43f5e,
    accentColor: 0xfb7185,
  },
  laziness: {
    type: 'laziness',
    name: 'Procrastination & Laziness',
    subtitle: '"Just 5 more minutes in bed..." 🦥🛌',
    maxHp: 40,
    damage: 20,
    speedPenalty: 0.55, // cuts speed by 45% for 3 seconds
    scoreReward: 60,
    coinsReward: 25,
    width: 75,
    height: 65,
    color: 0x64748b,
    accentColor: 0x94a3b8,
  },
  retake: {
    type: 'retake',
    name: 'Semester Retake Stamp',
    subtitle: 'Grade: F — High Danger! ❌📄',
    maxHp: 80, // High durability
    damage: 38, // High fuel damage
    scoreReward: 120,
    coinsReward: 45,
    width: 70,
    height: 75,
    color: 0xdc2626,
    accentColor: 0x991b1b,
  },
  courseTeacher: {
    type: 'courseTeacher',
    name: 'Fierce Course Teacher',
    subtitle: 'Boss: "Attendance is mandatory! Explain line 42!" 👨‍🏫👓',
    maxHp: 160, // Boss durability
    damage: 42,
    scoreReward: 300,
    coinsReward: 100,
    width: 90,
    height: 95,
    color: 0x7c3aed,
    accentColor: 0x4c1d95,
    boss: true,
  },
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
  overthinking: {
    type: 'overthinking',
    name: 'Midnight Overthinking',
    subtitle: '"What if I fail? What if I get no job?!" 🌀🧠',
    maxHp: 50,
    damage: 22,
    balanceDisruption: true, // Disrupts control balance
    scoreReward: 80,
    coinsReward: 30,
    width: 70,
    height: 70,
    color: 0x9333ea,
    accentColor: 0xc084fc,
  },
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

