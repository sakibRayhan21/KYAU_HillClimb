// ============================================================================
// যানবাহন আপগ্রেড কনফিগারেশন ফাইল (Vehicle Upgrades Configuration)
// গ্যারেজের ৬টি ভিন্ন যন্ত্রাংশের (ইঞ্জিন, ফুয়েল ট্যাংক, সাসপেনশন, আর্মার,
// অস্ত্র, টার্বো) প্রতিটির ১-১০ লেভেলের খরচ ও ক্ষমতার তথ্য।
// ============================================================================

import { UpgradeType, UpgradeLevelInfo } from '../types/game';

/**
 * আপগ্রেড আইটেমের কনফিগারেশন ইন্টারফেস
 */
export interface UpgradeItemConfig {
  type: UpgradeType; // আপগ্রেডের ধরন
  name: string; // আপগ্রেডের নাম
  description: string; // বিস্তারিত বিবরণ
  icon: string; // আইকন নাম (Lucide Icons)
  levels: UpgradeLevelInfo[]; // ১ থেকে ১০ লেভেলের তালিকা
}

export const UPGRADES_CONFIG: Record<UpgradeType, UpgradeItemConfig> = {
  // --------------------------------------------------------------------------
  // ১. ইঞ্জিন ও সিপিইউ আপগ্রেড (গতি ও পাহাড়ি ঢালে আরোহণের টর্ক বৃদ্ধি)
  // --------------------------------------------------------------------------
  engine: {
    type: 'engine',
    name: 'Research Engine & V8 CPU',
    description: 'Increases top vehicle speed and hill-climbing torque for steep academic slopes.',
    icon: 'Zap',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 1.0, label: 'Stock 1.2L Engine' },
      { level: 2, costCoins: 80, costPower: 30, value: 1.12, label: 'Dual Carburetor' },
      { level: 3, costCoins: 160, costPower: 60, value: 1.25, label: 'Cold Air Intake' },
      { level: 4, costCoins: 260, costPower: 100, value: 1.38, label: 'ECU Remap (C++ Optimized)' },
      { level: 5, costCoins: 400, costPower: 150, value: 1.52, label: 'Sport Camshaft' },
      { level: 6, costCoins: 600, costPower: 220, value: 1.66, label: 'Twin-Scroll Turbo' },
      { level: 7, costCoins: 850, costPower: 300, value: 1.80, label: 'Forged Pistons' },
      { level: 8, costCoins: 1200, costPower: 400, value: 1.95, label: 'Racing Exhaust' },
      { level: 9, costCoins: 1600, costPower: 520, value: 2.10, label: 'Quad-Core Supercharger' },
      { level: 10, costCoins: 2200, costPower: 700, value: 2.30, label: 'Ph.D. High-Torque Beast' },
    ],
  },

  // --------------------------------------------------------------------------
  // ২. ফুয়েল ট্যাংক আপগ্রেড (ক্যাম্পাস চা-কফির রিজার্ভার ও মাইলেজ বৃদ্ধি)
  // --------------------------------------------------------------------------
  fuelTank: {
    type: 'fuelTank',
    name: 'Chai & Coffee Fuel Reservoir',
    description: 'Expands fuel tank volume and improves mileage efficiency so you never run dry.',
    icon: 'Fuel',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 100, label: 'Standard 100L Mug' },
      { level: 2, costCoins: 70, costPower: 25, value: 115, label: 'Insulated Thermos' },
      { level: 3, costCoins: 140, costPower: 50, value: 130, label: 'Twin Canteen System' },
      { level: 4, costCoins: 230, costPower: 85, value: 145, label: 'Espresso Pressurized Tank' },
      { level: 5, costCoins: 350, costPower: 130, value: 160, label: 'Extended Jerrycan' },
      { level: 6, costCoins: 520, costPower: 190, value: 175, label: 'Aero Fuel Cell' },
      { level: 7, costCoins: 750, costPower: 260, value: 190, label: 'High-Flow Injectors' },
      { level: 8, costCoins: 1050, costPower: 350, value: 205, label: 'Synthesized Chai Tank' },
      { level: 9, costCoins: 1450, costPower: 460, value: 220, label: 'Endurance Racing Bladder' },
      { level: 10, costCoins: 2000, costPower: 600, value: 240, label: 'Infinite Campus Supply' },
    ],
  },

  // --------------------------------------------------------------------------
  // ৩. সাসপেনশন আপগ্রেড (পাহাড়ে লাফিয়ে পড়ার পর ল্যান্ডিং শক ও গ্রিপ কন্ট্রোল)
  // --------------------------------------------------------------------------
  suspension: {
    type: 'suspension',
    name: 'Adaptive Exam Suspension',
    description: 'Dampens harsh landing shocks, stabilizes vehicle tilt, and enhances tire traction on bumpy terrain.',
    icon: 'Activity',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 1.0, label: 'Rigid Steel Coils' },
      { level: 2, costCoins: 75, costPower: 25, value: 1.15, label: 'Hydraulic Dampers' },
      { level: 3, costCoins: 150, costPower: 55, value: 1.30, label: 'Reinforced Wishbones' },
      { level: 4, costCoins: 250, costPower: 90, value: 1.45, label: 'Progressive Springs' },
      { level: 5, costCoins: 380, costPower: 140, value: 1.60, label: 'Off-Road Heavy Struts' },
      { level: 6, costCoins: 560, costPower: 200, value: 1.75, label: 'Nitrogen Gas Shocks' },
      { level: 7, costCoins: 800, costPower: 280, value: 1.90, label: 'Active Anti-Roll Bars' },
      { level: 8, costCoins: 1100, costPower: 370, value: 2.05, label: 'Independent Multi-Link' },
      { level: 9, costCoins: 1500, costPower: 480, value: 2.20, label: 'Pneumatic Leveling' },
      { level: 10, costCoins: 2100, costPower: 650, value: 2.40, label: 'Hovercraft Anti-Gravity Shocks' },
    ],
  },

  // --------------------------------------------------------------------------
  // ৪. আর্মার বা ডিফেন্স শিল্ড আপগ্রেড (বাধার সাথে ধাক্কায় ক্ষতির মাত্রা কমানো)
  // --------------------------------------------------------------------------
  armor: {
    type: 'armor',
    name: 'Semester Defense Shield',
    description: 'Reduces impact shock and fuel drain damage when colliding with tough university obstacles.',
    icon: 'Shield',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 1.0, label: 'Cardboard Notes Shield' },
      { level: 2, costCoins: 85, costPower: 30, value: 0.90, label: 'Reinforced Notebook Cover' },
      { level: 3, costCoins: 170, costPower: 65, value: 0.81, label: 'Hardcover Textbook Plating' },
      { level: 4, costCoins: 280, costPower: 110, value: 0.72, label: 'Library Bumper Guard' },
      { level: 5, costCoins: 420, costPower: 165, value: 0.64, label: 'Steel Roll Cage' },
      { level: 6, costCoins: 620, costPower: 240, value: 0.56, label: 'Titanium Skid Plate' },
      { level: 7, costCoins: 900, costPower: 330, value: 0.49, label: 'Composite Kevlar Panels' },
      { level: 8, costCoins: 1250, costPower: 430, value: 0.42, label: 'Reactive Nano-Armor' },
      { level: 9, costCoins: 1700, costPower: 560, value: 0.36, label: 'Forcefield Deflector' },
      { level: 10, costCoins: 2300, costPower: 750, value: 0.30, label: 'Invincible Dean’s List Aegis' },
    ],
  },

  // --------------------------------------------------------------------------
  // ৫. সাইটেশন ব্লাস্টার কামান আপগ্রেড (দূর থেকে বাধা ধ্বংসের বুলেট শক্তি বৃদ্ধি)
  // --------------------------------------------------------------------------
  weapon: {
    type: 'weapon',
    name: 'Citation Blaster Cannon',
    description: 'Fires high-velocity academic citations and debug rays to vaporize obstacles from a distance.',
    icon: 'Crosshair',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 25, label: 'Ballpoint Pen Shooter' },
      { level: 2, costCoins: 90, costPower: 35, value: 32, label: 'Highlighter Laser' },
      { level: 3, costCoins: 180, costPower: 70, value: 40, label: 'Fast Stylus Beam' },
      { level: 4, costCoins: 300, costPower: 120, value: 48, label: 'Syntax Error Blaster' },
      { level: 5, costCoins: 450, costPower: 180, value: 57, label: 'Dual-Barrel Citation Gun' },
      { level: 6, costCoins: 680, costPower: 260, value: 66, label: 'Peer Review Plasma Rifle' },
      { level: 7, costCoins: 980, costPower: 360, value: 76, label: 'IEEE Published Railgun' },
      { level: 8, costCoins: 1350, costPower: 480, value: 87, label: 'Algorithmic Pulse Cannon' },
      { level: 9, costCoins: 1850, costPower: 620, value: 98, label: 'Quantum Debugger Cannon' },
      { level: 10, costCoins: 2500, costPower: 800, value: 112, label: 'God-Tier Thesis Obliterator' },
    ],
  },

  // --------------------------------------------------------------------------
  // ৬. টার্বো ও ক্যাফেইন বুস্ট আপগ্রেড (জরুরি মুহূর্তে রকেট গতি প্রদান)
  // --------------------------------------------------------------------------
  turbo: {
    type: 'turbo',
    name: 'Red Bull / Caffeine Turbo Boost',
    description: 'Triggers instant hyper-acceleration with blazing exhaust fire to fly over treacherous hills.',
    icon: 'Flame',
    levels: [
      { level: 1, costCoins: 0, costPower: 0, value: 1.0, label: 'Instant Black Coffee' },
      { level: 2, costCoins: 95, costPower: 35, value: 1.15, label: 'Double Espresso Shot' },
      { level: 3, costCoins: 190, costPower: 75, value: 1.30, label: 'Energy Drink Nitro' },
      { level: 4, costCoins: 310, costPower: 125, value: 1.45, label: 'High-Octane Caffeine Mix' },
      { level: 5, costCoins: 470, costPower: 190, value: 1.60, label: 'Nitrous Oxide Overdrive' },
      { level: 6, costCoins: 710, costPower: 275, value: 1.75, label: 'Twin Turbo Booster' },
      { level: 7, costCoins: 1020, costPower: 380, value: 1.90, label: 'Jet Fuel Afterburner' },
      { level: 8, costCoins: 1420, costPower: 510, value: 2.05, label: 'Plasma Thruster Nozzle' },
      { level: 9, costCoins: 1950, costPower: 660, value: 2.20, label: 'Warp Drive Injector' },
      { level: 10, costCoins: 2600, costPower: 850, value: 2.40, label: '4.00 CGPA Hyper-Drive' },
    ],
  },
};
