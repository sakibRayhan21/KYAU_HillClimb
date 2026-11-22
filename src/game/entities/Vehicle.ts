// ============================================================================
// শিক্ষার্থী যান বা ভেহিকল এন্টিটি (Vehicle Entity)
// মোটরসাইকেল চ্যাসিস, সামনের ও পেছনের চাকা, সাসপেনশন কনস্ট্রেইন্টস,
// ড্রাইভার (শিক্ষার্থী), সাইটেশন কামান এবং টার্বো একজস্ট শিখা পরিচালনা করে।
// পাহাড়ে ওঠা, এক্সিলারেশন, ব্রেক, শূন্যে ব্যাকফ্লিপ/ফ্রন্টফ্লিপ এবং ফুয়েল ড্রেন নিয়ন্ত্রণ করে।
// ============================================================================

import * as Phaser from 'phaser';
import { GarageUpgrades } from '../types/game';
import { FUEL_CONFIG, PHYSICS_CONFIG, WEAPON_CONFIG, TURBO_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

/**
 * গাড়ির ইনপুট ইন্টারফেস (গ্যাস, ব্রেক, ফায়ার, টার্বো)
 */
export interface VehicleInputs {
  accelerate: boolean; // গ্যাস বা ফরোয়ার্ড এক্সিলারেশন
  brake: boolean; // ব্রেক বা পেছনের রিভার্স পুশ
  fire: boolean; // বুলেট বা সাইটেশন ফায়ার
  turbo: boolean; // টার্বো বুস্ট সক্রিয়করণ
}

export class Vehicle {
  public scene: Phaser.Scene; // ফেজার সিন রেফারেন্স
  public chassis: Phaser.Physics.Matter.Sprite; // মূল চ্যাসিস বা গাড়ির বডি
  public frontWheel: Phaser.Physics.Matter.Sprite; // সামনের চাকা
  public rearWheel: Phaser.Physics.Matter.Sprite; // পেছনের ড্রাইভ চাকা
  public driver: Phaser.GameObjects.Sprite; // মোটরসাইকেলে বসা শিক্ষার্থীর স্প্রাইট
  public weaponSprite: Phaser.GameObjects.Sprite; // হ্যান্ডেলবারে যুক্ত কামান স্প্রাইট
  public turboFlame: Phaser.GameObjects.Sprite; // সাইলেন্সারের টার্বো শিখা স্প্রাইট

  public frontAxleConstraint: any; // সামনের টেলিস্কোপিক ফর্কের ম্যাটার ফিজিক্স স্প্রিং
  public rearAxleConstraint: any; // পেছনের সুইং-আর্মের ম্যাটার ফিজিক্স স্প্রিং

  // গ্যারেজের আপগ্রেড লেভেল
  public upgrades: GarageUpgrades;

  // ভেহিকল ডায়নামিক স্টেট
  public fuel: number; // বর্তমান ফুয়েল
  public maxFuel: number; // সর্বোচ্চ ফুয়েল ক্যাপাসিটি
  public ammo: number; // বর্তমান অ্যামো
  public maxAmmo: number; // সর্বোচ্চ অ্যামো ক্যাপাসিটি
  public speedKmh: number = 0; // বর্তমান গতি (কিমি/ঘণ্টা)
  public isGrounded: boolean = false; // চাকা মাটিতে আছে কিনা
  public isBrokenDown: boolean = false; // ফুয়েল শেষ বা গাড়ি উল্টে অচল হয়েছে কিনা

  // টার্বো বুস্ট স্টেট
  public turboActive: boolean = false; // টার্বো বর্তমানে চালু কিনা
  public turboTimer: number = 0; // টার্বোর অবশিষ্ট সময়
  public turboCooldown: number = 0; // পুনরায় ব্যবহারের কুলডাউন

  // ওয়েপন ফায়ার কুলডাউন
  private lastFireTime: number = 0;

  // স্ট্যাটাস ইফেক্টস (আলসেমি, সোশ্যাল মিডিয়া, ওভারথিঙ্কিং)
  public speedModifier: number = 1.0;
  public balanceDisrupted: boolean = false;
  public activeEffectName: string | null = null;
  public effectTimer: number = 0;

  // কম ফুয়েল সংকেতের বিরতি নিয়ন্ত্রণ
  private lastLowFuelBeep: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, upgrades: GarageUpgrades) {
    this.scene = scene;
    this.upgrades = upgrades;

    // আপগ্রেড অনুযায়ী ফুয়েল ট্যাংক ও গোলাবারুদের ক্যাপাসিটি নির্ধারণ
    this.maxFuel = 100 + (upgrades.fuelTank - 1) * 15.5;
    this.fuel = this.maxFuel;

    this.maxAmmo = WEAPON_CONFIG.baseMaxAmmo + (upgrades.weapon - 1) * 3;
    this.ammo = this.maxAmmo;

    const matter = scene.matter;

    // ১. মোটরসাইকেলের চাকা তৈরি (সামনের ও পেছনের চাকা)
    const wheelRadius = 18;
    const rearAxleX = -40;
    const frontAxleX = 40;
    const axleY = 11;

    const rearWheelX = x + rearAxleX;
    const frontWheelX = x + frontAxleX;
    const wheelY = y + axleY;

    // আপগ্রেড করা সাসপেনশন ও টায়ার গ্রিপ হিসাব
    const wheelFriction = PHYSICS_CONFIG.wheelFriction + (upgrades.suspension - 1) * 0.005;

    // পেছনের ড্রাইভ চাকা
    this.rearWheel = matter.add.sprite(rearWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionStatic: 1.35,
      frictionAir: 0.005,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.0035, // হালকা ও চটপটে চাকার ভর
      label: 'vehicle_wheel',
    });

    // সামনের স্টিয়ারিং চাকা
    this.frontWheel = matter.add.sprite(frontWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionStatic: 1.35,
      frictionAir: 0.005,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.0035,
      label: 'vehicle_wheel',
    });

    // ২. মোটরসাইকেলের মূল চ্যাসিস বডি তৈরি
    this.chassis = matter.add.sprite(x, y, 'vehicle_chassis', undefined, {
      shape: {
        type: 'rectangle',
        width: 96,
        height: 26,
      },
      friction: PHYSICS_CONFIG.chassisFriction,
      frictionAir: 0.012,
      density: 0.003, // পাহাড়ে দ্রুত ওঠার মতো হালকা চ্যাসিস
      restitution: 0.06,
      label: 'vehicle_chassis',
    });

    // ৩. সাসপেনশন স্প্রিং কনস্ট্রেইন্টস (চ্যাসিসের সাথে চাকা সংযোগ)
    const stiffness = 0.22 + (upgrades.suspension - 1) * 0.02;
    const damping = 0.40 + (upgrades.suspension - 1) * 0.03;

    // পেছনের সুইং-আর্ম কনস্ট্রেইন্ট
    this.rearAxleConstraint = matter.add.constraint(
      this.chassis.body as MatterJS.BodyType,
      this.rearWheel.body as MatterJS.BodyType,
      1,
      stiffness,
      {
        pointA: { x: rearAxleX, y: axleY },
        damping: damping,
      }
    );

    // সামনের টেলিস্কোপিক ফর্ক কনস্ট্রেইন্ট
    this.frontAxleConstraint = matter.add.constraint(
      this.chassis.body as MatterJS.BodyType,
      this.frontWheel.body as MatterJS.BodyType,
      1,
      stiffness,
      {
        pointA: { x: frontAxleX, y: axleY },
        damping: damping,
      }
    );

    // ৪. ভিজ্যুয়াল এটাচমেন্টস (শিক্ষার্থী চালক, কামান, টার্বো শিখা)
    this.driver = scene.add.sprite(x, y, 'driver_avatar');
    this.driver.setDepth(10);

    this.weaponSprite = scene.add.sprite(x, y, 'vehicle_weapon');
    this.weaponSprite.setOrigin(0.1, 0.5);
    this.weaponSprite.setDepth(11);

    this.turboFlame = scene.add.sprite(x, y, 'fx_turbo_flame');
    this.turboFlame.setOrigin(1.0, 0.5);
    this.turboFlame.setVisible(false);
    this.turboFlame.setDepth(9);

    // গাড়ি ও চাকার নিজেদের মধ্যে যেন সংঘর্ষ না ঘটে তার কলিশন গ্রুপ ফিল্টার
    const carCollisionGroup = matter.world.nextGroup(true);
    (this.chassis.body as any).collisionFilter.group = carCollisionGroup;
    (this.rearWheel.body as any).collisionFilter.group = carCollisionGroup;
    (this.frontWheel.body as any).collisionFilter.group = carCollisionGroup;

    // ইঞ্জিনের সাউন্ড সিন্থেসাইজার চালু
    soundService.startEngine();
  }

  /**
   * প্রতি ফ্রেমে গাড়ির পদার্থবিজ্ঞান, ফুয়েল হ্রাস ও কন্ট্রোল আপডেট করা
   */
  public update(time: number, delta: number, inputs: VehicleInputs, terrainHeightAt?: (x: number) => number): { fired: boolean } {
    let fired = false;

    // গাড়ি অচল হলে ইঞ্জিন বন্ধ রাখা
    if (this.isBrokenDown) {
      soundService.stopEngine();
      this.updateVisuals();
      return { fired: false };
    }

    // সক্রিয় স্ট্যাটাস ইফেক্টের টাইমার আপডেট (আলসেমি, সোশ্যাল মিডিয়া, ওভারথিঙ্কিং)
    if (this.effectTimer > 0) {
      this.effectTimer -= delta;
      if (this.effectTimer <= 0) {
        this.speedModifier = 1.0;
        this.balanceDisrupted = false;
        this.activeEffectName = null;
      }
    }

    // ফিজিক্স বডি রেফারেন্স
    const chassisBody = this.chassis.body as MatterJS.BodyType;
    const rearBody = this.rearWheel.body as MatterJS.BodyType;
    const frontBody = this.frontWheel.body as MatterJS.BodyType;

    if (!chassisBody || !rearBody || !frontBody) {
      this.updateVisuals();
      return { fired: false };
    }

    // মাটি স্পর্শ করে আছে কিনা নির্ভুলভাবে যাচাই করা
    if (terrainHeightAt) {
      const rearGroundY = terrainHeightAt(this.rearWheel.x);
      const frontGroundY = terrainHeightAt(this.frontWheel.x);
      const rearDist = rearGroundY - this.rearWheel.y;
      const frontDist = frontGroundY - this.frontWheel.y;
      this.isGrounded = (rearDist <= 28 && rearDist >= -20) || (frontDist <= 28 && frontDist >= -20);
    }

    // প্রতি ঘণ্টায় গতিবেগ (km/h) হিসাব
    const chassisVel = chassisBody.velocity;
    this.speedKmh = Math.round(Math.sqrt(chassisVel.x * chassisVel.x + chassisVel.y * chassisVel.y) * 3.6);

    // টার্বো বুস্ট লজিক
    if (this.turboCooldown > 0) {
      this.turboCooldown -= delta;
    }
    if (this.turboActive) {
      this.turboTimer -= delta;
      if (this.turboTimer <= 0) {
        this.turboActive = false;
        this.turboFlame.setVisible(false);
      }
    }

    if (inputs.turbo && this.turboCooldown <= 0 && !this.turboActive && this.fuel > 0) {
      this.activateTurbo();
    }

    // ইঞ্জিন শক্তি ও পাহাড়ে ওঠার টর্ক হিসাব
    const engineMult = 1.0 + (this.upgrades.engine - 1) * 0.16;
    const climbForce = PHYSICS_CONFIG.baseEngineTorque * engineMult * this.speedModifier;
    const maxWheelAngVel = 0.44 + (this.upgrades.engine - 1) * 0.025;

    // ফুয়েল খরচের হার হিসাব
    const drainMultiplier = Math.max(0.7, 1.2 - (this.upgrades.fuelTank - 1) * 0.05);
    let fuelDrain = (FUEL_CONFIG.drainRatePerSecond * (delta / 1000)) * drainMultiplier;

    if (inputs.accelerate) {
      fuelDrain *= 1.4; // এক্সিলারেট করার সময় ফুয়েল বেশি খরচ
    }
    if (this.turboActive) {
      fuelDrain *= 2.0; // টার্বো চলাকালে দ্বিগুণ ফুয়েল খরচ
    }

    this.fuel = Math.max(0, this.fuel - fuelDrain);

    // কম ফুয়েল থাকলে সতর্কতা সংকেত (Beep)
    if (this.fuel > 0 && this.fuel <= FUEL_CONFIG.lowFuelThreshold) {
      if (time - this.lastLowFuelBeep > 1200) {
        soundService.playLowFuelAlert();
        this.lastLowFuelBeep = time;
      }
    }

    // জ্বালানি শেষ হলে গাড়ি বন্ধ
    if (this.fuel <= 0) {
      this.isBrokenDown = true;
      this.fuel = 0;
      soundService.stopEngine();
      return { fired: false };
    }

    // গতির অনুপাত অনুযায়ী ইঞ্জিনের সাউন্ড পিচ পরিবর্তন
    const speedRatio = Math.min(1.0, this.speedKmh / 80);
    soundService.updateEnginePitch(speedRatio, inputs.accelerate || this.turboActive);

    const matter = this.scene.matter;

    // ওভারথিঙ্কিং ইফেক্টে ব্যালেন্স উল্টো হয়ে যাওয়া
    const tiltDirection = this.balanceDisrupted ? -1 : 1;

    // এক্সিলারেট (Gas / Forward Acceleration)
    if (inputs.accelerate) {
      rearBody.angularVelocity = Phaser.Math.Linear(rearBody.angularVelocity, maxWheelAngVel, 0.22);
      frontBody.angularVelocity = Phaser.Math.Linear(frontBody.angularVelocity, maxWheelAngVel * 0.85, 0.18);

      const angle = this.chassis.rotation;
      const fx = Math.cos(angle) * climbForce;
      const fy = Math.sin(angle) * climbForce;

      matter.body.applyForce(chassisBody, chassisBody.position, { x: fx * 0.65, y: fy * 0.65 });
      matter.body.applyForce(rearBody, rearBody.position, { x: fx * 0.35, y: fy * 0.35 });

      if (this.isGrounded) {
        // মাটিতে থাকলে সামনের চাকা আলতো উঁচু করার হুইলি টর্ক
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity - 0.005 * tiltDirection);
      } else {
        // বাতাসে থাকলে ব্যাকফ্লিপ ও ল্যান্ডিং অ্যাঙ্গেল নিয়ন্ত্রণের জন্য শূন্যে টিল্ট আপ
        const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity - airTorque * 0.12);
      }
    }

    // ব্রেক ও রিভার্স (Brake / Reverse)
    if (inputs.brake) {
      matter.body.setAngularVelocity(rearBody, rearBody.angularVelocity * 0.82);
      matter.body.setAngularVelocity(frontBody, frontBody.angularVelocity * 0.78);

      if (this.isGrounded) {
        const angle = this.chassis.rotation;
        const rx = -Math.cos(angle) * (climbForce * 0.45);
        const ry = -Math.sin(angle) * (climbForce * 0.45);
        matter.body.applyForce(chassisBody, chassisBody.position, { x: rx, y: ry });
      } else {
        // বাতাসে থাকলে ফ্রন্টফ্লিপ ও ডাউনহিল ল্যান্ডিংয়ের জন্য শূন্যে টিল্ট ডাউন
        const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity + airTorque * 0.12);
      }
    }

    // টার্বো বুস্ট পুশ বল প্রয়োগ
    if (this.turboActive) {
      const turboMult = 1.0 + (this.upgrades.turbo - 1) * 0.18;
      const angle = this.chassis.rotation;
      const boostForce = climbForce * 2.2 * turboMult;
      matter.body.applyForce(chassisBody, chassisBody.position, {
        x: Math.cos(angle) * boostForce,
        y: Math.sin(angle) * boostForce - 0.015,
      });
      this.turboFlame.setVisible(true);
    }

    // অস্ত্র থেকে গুলি ছোঁড়া (Firing Weapon)
    const fireCooldown = Math.max(120, WEAPON_CONFIG.fireCooldownMs - (this.upgrades.weapon - 1) * 12);
    if (inputs.fire && time - this.lastFireTime > fireCooldown) {
      if (this.ammo > 0) {
        this.ammo--;
        this.lastFireTime = time;
        soundService.playLaser();
        fired = true;
      }
    }

    this.updateVisuals();

    return { fired };
  }

  /**
   * টার্বো বুস্ট সক্রিয় করা
   */
  public activateTurbo(): void {
    const turboDuration = TURBO_CONFIG.durationMs + (this.upgrades.turbo - 1) * 200;
    const cooldown = Math.max(3500, TURBO_CONFIG.cooldownMs - (this.upgrades.turbo - 1) * 450);

    this.turboActive = true;
    this.turboTimer = turboDuration;
    this.turboCooldown = cooldown;
    this.turboFlame.setVisible(true);
    soundService.playTurbo();
  }

  /**
   * বাধার সাথে ধাক্কা খেলে ক্ষতি (Damage) গ্রহণ করা
   */
  public applyDamage(rawDamage: number): void {
    // আর্মার লেভেল অনুযায়ী ক্ষতি হ্রাস (১০০% থেকে ৩০% পর্যন্ত ড্রপ)
    const armorFactor = Math.max(0.3, 1.0 - (this.upgrades.armor - 1) * 0.075);
    const damage = rawDamage * armorFactor;

    this.fuel = Math.max(0, this.fuel - damage);
    soundService.playImpact();

    // ধাক্কা খাওয়ার লাল ফ্ল্যাশ ইফেক্ট
    if (this.chassis?.active) {
      this.chassis.setTint(0xff5555);
      this.scene.time.delayedCall(160, () => {
        if (this.chassis?.active) {
          this.chassis.clearTint();
        }
      });
    }

    if (this.fuel <= 0) {
      this.isBrokenDown = true;
      soundService.stopEngine();
    }
  }

  /**
   * বিশেষ স্ট্যাটাস ইফেক্ট প্রয়োগ (আলসেমি, সোশ্যাল মিডিয়া ইত্যাদি)
   */
  public applyStatusEffect(effect: string, durationMs: number = 3000): void {
    this.activeEffectName = effect;
    this.effectTimer = durationMs;

    if (effect === 'laziness') {
      this.speedModifier = 0.55; // গতি কমে ৪৫% হ্রাস
    } else if (effect === 'socialMedia') {
      this.speedModifier = 0.65; // গতি ৩৫% হ্রাস
    } else if (effect === 'overthinking') {
      this.balanceDisrupted = true; // ভারসাম্য নিয়ন্ত্রণ উল্টো
    } else if (effect === 'relationship') {
      this.speedModifier = 0.85;
    }
  }

  /**
   * ফুয়েল যোগ করা
   */
  public addFuel(amount: number): void {
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
    soundService.playFuelPickup();
  }

  /**
   * অ্যামো বা গোলাবারুদ যোগ করা
   */
  public addAmmo(amount: number): void {
    this.ammo = Math.min(this.maxAmmo, this.ammo + amount);
    soundService.playChime('assignment');
  }

  /**
   * চ্যাসিসের ঘূর্ণন ও অবস্থানের সাথে ড্রাইভার, কামান ও টার্বো শিখা সমন্বয় করা
   */
  private updateVisuals(): void {
    if (!this.chassis?.active) return;
    const x = this.chassis.x;
    const y = this.chassis.y;
    const rot = this.chassis.rotation;

    // মোটরসাইকেলের সিটে বসা শিক্ষার্থী
    if (this.driver?.active) {
      const driverOffsetX = -22 * Math.cos(rot) - (-14) * Math.sin(rot);
      const driverOffsetY = -22 * Math.sin(rot) + (-14) * Math.cos(rot);
      this.driver.setPosition(x + driverOffsetX, y + driverOffsetY);
      this.driver.setRotation(rot);
    }

    // হ্যান্ডেলবারে বসানো কামান
    if (this.weaponSprite?.active) {
      const weaponOffsetX = 24 * Math.cos(rot) - (-18) * Math.sin(rot);
      const weaponOffsetY = 24 * Math.sin(rot) + (-18) * Math.cos(rot);
      this.weaponSprite.setPosition(x + weaponOffsetX, y + weaponOffsetY);
      this.weaponSprite.setRotation(rot);
    }

    // পেছনের সাইলেন্সারে টার্বো বুস্ট শিখা
    if (this.turboFlame?.active) {
      const flameOffsetX = -60 * Math.cos(rot) - (7) * Math.sin(rot);
      const flameOffsetY = -60 * Math.sin(rot) + (7) * Math.cos(rot);
      this.turboFlame.setPosition(x + flameOffsetX, y + flameOffsetY);
      this.turboFlame.setRotation(rot + Math.PI);
    }
  }

  /**
   * যানবাহন স্প্রাইট, ফিজিক্স কনস্ট্রেইন্টস ও মেমোরি পরিষ্কার করা
   */
  public destroy(): void {
    soundService.stopEngine();

    // ক্র্যাশ রোধ করতে প্রথমে ম্যাটার ওয়ার্ল্ড থেকে কনস্ট্রেইন্টস অপসারণ
    if (this.frontAxleConstraint && this.scene?.matter?.world) {
      try {
        this.scene.matter.world.remove(this.frontAxleConstraint);
      } catch {}
      this.frontAxleConstraint = null;
    }
    if (this.rearAxleConstraint && this.scene?.matter?.world) {
      try {
        this.scene.matter.world.remove(this.rearAxleConstraint);
      } catch {}
      this.rearAxleConstraint = null;
    }

    if (this.driver?.active) this.driver.destroy();
    if (this.weaponSprite?.active) this.weaponSprite.destroy();
    if (this.turboFlame?.active) this.turboFlame.destroy();
    if (this.frontWheel?.active) this.frontWheel.destroy();
    if (this.rearWheel?.active) this.rearWheel.destroy();
    if (this.chassis?.active) this.chassis.destroy();
  }
}
