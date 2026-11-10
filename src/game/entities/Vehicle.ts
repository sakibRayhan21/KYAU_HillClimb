import * as Phaser from 'phaser';
import { GarageUpgrades } from '../types/game';
import { FUEL_CONFIG, PHYSICS_CONFIG, WEAPON_CONFIG, TURBO_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

export interface VehicleInputs {
  accelerate: boolean;
  brake: boolean;
  fire: boolean;
  turbo: boolean;
}

export class Vehicle {
  public scene: Phaser.Scene;
  public chassis: Phaser.Physics.Matter.Sprite;
  public frontWheel: Phaser.Physics.Matter.Sprite;
  public rearWheel: Phaser.Physics.Matter.Sprite;
  public driver: Phaser.GameObjects.Sprite;
  public weaponSprite: Phaser.GameObjects.Sprite;
  public turboFlame: Phaser.GameObjects.Sprite;

  public frontAxleConstraint: any;
  public rearAxleConstraint: any;

  // Upgrades
  public upgrades: GarageUpgrades;

  // Vehicle Dynamic State
  public fuel: number;
  public maxFuel: number;
  public ammo: number;
  public maxAmmo: number;
  public speedKmh: number = 0;
  public isGrounded: boolean = false;
  public isBrokenDown: boolean = false;

  // Turbo state
  public turboActive: boolean = false;
  public turboTimer: number = 0;
  public turboCooldown: number = 0;

  // Weapon fire cooldown
  private lastFireTime: number = 0;

  // Status effects
  public speedModifier: number = 1.0;
  public balanceDisrupted: boolean = false;
  public activeEffectName: string | null = null;
  public effectTimer: number = 0;

  // Audio alert throttle
  private lastLowFuelBeep: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, upgrades: GarageUpgrades) {
    this.scene = scene;
    this.upgrades = upgrades;

    // Calculate upgrade multipliers
    // Fuel tank: Level 1 = 100, Level 10 = 240
    this.maxFuel = 100 + (upgrades.fuelTank - 1) * 15.5;
    this.fuel = this.maxFuel;

    // Ammo capacity: Level 1 = 20, Level 10 = 50
    this.maxAmmo = WEAPON_CONFIG.baseMaxAmmo + (upgrades.weapon - 1) * 3;
    this.ammo = this.maxAmmo;

    const matter = scene.matter;

    // 1. Create Wheels
    const wheelRadius = 20;
    const wheelY = y + 25;
    const rearWheelX = x - 42;
    const frontWheelX = x + 44;

    const wheelFriction = PHYSICS_CONFIG.wheelFriction + (upgrades.suspension - 1) * 0.005;

    this.rearWheel = matter.add.sprite(rearWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionAir: 0.01,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.08,
      label: 'vehicle_wheel',
    });

    this.frontWheel = matter.add.sprite(frontWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionAir: 0.01,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.08,
      label: 'vehicle_wheel',
    });

    // 2. Create Chassis Body
    this.chassis = matter.add.sprite(x, y, 'vehicle_chassis', undefined, {
      shape: {
        type: 'rectangle',
        width: 140,
        height: 48,
      },
      friction: PHYSICS_CONFIG.chassisFriction,
      frictionAir: 0.02,
      density: 0.04,
      restitution: 0.1,
      label: 'vehicle_chassis',
    });

    // 3. Suspension Constraints
    const stiffness = 0.14 + (upgrades.suspension - 1) * 0.02;
    const damping = 0.35 + (upgrades.suspension - 1) * 0.03;

    // Constraints linking chassis to rear wheel
    this.rearAxleConstraint = matter.add.constraint(
      this.chassis.body as MatterJS.BodyType,
      this.rearWheel.body as MatterJS.BodyType,
      28,
      stiffness,
      {
        pointA: { x: -40, y: 18 },
        damping: damping,
      }
    );

    // Constraint linking chassis to front wheel
    this.frontAxleConstraint = matter.add.constraint(
      this.chassis.body as MatterJS.BodyType,
      this.frontWheel.body as MatterJS.BodyType,
      28,
      stiffness,
      {
        pointA: { x: 42, y: 18 },
        damping: damping,
      }
    );

    // 4. Visual Attachments (Driver avatar, Weapon cannon, Boost flame)
    this.driver = scene.add.sprite(x, y, 'driver_avatar');
    this.driver.setDepth(10);

    this.weaponSprite = scene.add.sprite(x, y, 'vehicle_weapon');
    this.weaponSprite.setOrigin(0.1, 0.5);
    this.weaponSprite.setDepth(11);

    this.turboFlame = scene.add.sprite(x, y, 'fx_turbo_flame');
    this.turboFlame.setOrigin(1.0, 0.5);
    this.turboFlame.setVisible(false);
    this.turboFlame.setDepth(9);

    // Collision setup
    const carCollisionGroup = matter.world.nextGroup(true);
    (this.chassis.body as any).collisionFilter.group = carCollisionGroup;
    (this.rearWheel.body as any).collisionFilter.group = carCollisionGroup;
    (this.frontWheel.body as any).collisionFilter.group = carCollisionGroup;

    // Start engine audio
    soundService.startEngine();
  }

  public update(time: number, delta: number, inputs: VehicleInputs): { fired: boolean } {
    let fired = false;

    if (this.isBrokenDown) {
      soundService.stopEngine();
      this.updateVisuals();
      return { fired: false };
    }

    // Handle Active Status Effects (Laziness, Social Media, Overthinking)
    if (this.effectTimer > 0) {
      this.effectTimer -= delta;
      if (this.effectTimer <= 0) {
        this.speedModifier = 1.0;
        this.balanceDisrupted = false;
        this.activeEffectName = null;
      }
    }

    // Check Grounded State & Velocities
    const chassisBody = this.chassis.body as MatterJS.BodyType;
    const rearBody = this.rearWheel.body as MatterJS.BodyType;
    const frontBody = this.frontWheel.body as MatterJS.BodyType;

    if (!chassisBody || !rearBody || !frontBody) {
      this.updateVisuals();
      return { fired: false };
    }

    const chassisVel = chassisBody.velocity;
    this.speedKmh = Math.round(Math.sqrt(chassisVel.x * chassisVel.x + chassisVel.y * chassisVel.y) * 3.6);

    // Turbo Logic
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

    // Engine Torque Calculation
    // Base engine torque + upgrade level
    const engineMult = 1.0 + (this.upgrades.engine - 1) * 0.14;
    const baseTorque = PHYSICS_CONFIG.baseEngineTorque * engineMult * this.speedModifier;
    const maxWheelAngVel = (PHYSICS_CONFIG.maxWheelSpeed + (this.upgrades.engine - 1) * 1.5) * 0.05;

    // Fuel Consumption
    const drainMultiplier = Math.max(0.7, 1.2 - (this.upgrades.fuelTank - 1) * 0.05);
    let fuelDrain = (FUEL_CONFIG.drainRatePerSecond * (delta / 1000)) * drainMultiplier;

    if (inputs.accelerate) {
      fuelDrain *= 1.4;
    }
    if (this.turboActive) {
      fuelDrain *= 2.0;
    }

    this.fuel = Math.max(0, this.fuel - fuelDrain);

    // Low fuel warning beep
    if (this.fuel > 0 && this.fuel <= FUEL_CONFIG.lowFuelThreshold) {
      if (time - this.lastLowFuelBeep > 1200) {
        soundService.playLowFuelAlert();
        this.lastLowFuelBeep = time;
      }
    }

    if (this.fuel <= 0) {
      this.isBrokenDown = true;
      this.fuel = 0;
      soundService.stopEngine();
      return { fired: false };
    }

    // Sound engine pitch
    const speedRatio = Math.min(1.0, this.speedKmh / 80);
    soundService.updateEnginePitch(speedRatio, inputs.accelerate || this.turboActive);

    // Matter Physics Controls
    const matter = this.scene.matter;

    // Overthinking effect wiggles angle / reverses tilt
    const tiltDirection = this.balanceDisrupted ? -1 : 1;

    // Accelerate (Gas)
    if (inputs.accelerate) {
      // Rotate rear and front wheels forward
      if (rearBody.angularVelocity < maxWheelAngVel) {
        matter.body.setAngularVelocity(rearBody, rearBody.angularVelocity + baseTorque * 8);
      }
      if (frontBody.angularVelocity < maxWheelAngVel) {
        matter.body.setAngularVelocity(frontBody, frontBody.angularVelocity + baseTorque * 8);
      }

      // Air balance control: Gas tilts car nose UP (counter-clockwise)
      const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
      matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity - airTorque * 0.08);

      // Forward drive force along chassis angle
      const angle = this.chassis.rotation;
      const fx = Math.cos(angle) * (baseTorque * 0.85);
      const fy = Math.sin(angle) * (baseTorque * 0.85);
      matter.body.applyForce(chassisBody, chassisBody.position, { x: fx, y: fy });
    }

    // Brake / Reverse
    if (inputs.brake) {
      // Brake torque
      matter.body.setAngularVelocity(rearBody, rearBody.angularVelocity * 0.88);
      matter.body.setAngularVelocity(frontBody, frontBody.angularVelocity * 0.88);

      // Air balance control: Brake tilts car nose DOWN (clockwise)
      const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
      matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity + airTorque * 0.08);

      // Reverse push
      const angle = this.chassis.rotation;
      const rx = -Math.cos(angle) * (baseTorque * 0.35);
      const ry = -Math.sin(angle) * (baseTorque * 0.35);
      matter.body.applyForce(chassisBody, chassisBody.position, { x: rx, y: ry });
    }

    // Turbo Boost Force
    if (this.turboActive) {
      const turboMult = 1.0 + (this.upgrades.turbo - 1) * 0.15;
      const angle = this.chassis.rotation;
      const boostForce = 0.014 * turboMult;
      matter.body.applyForce(chassisBody, chassisBody.position, {
        x: Math.cos(angle) * boostForce,
        y: Math.sin(angle) * boostForce - 0.002,
      });
      this.turboFlame.setVisible(true);
    }

    // Weapon Firing
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

  public activateTurbo(): void {
    const turboDuration = TURBO_CONFIG.durationMs + (this.upgrades.turbo - 1) * 200;
    const cooldown = Math.max(3500, TURBO_CONFIG.cooldownMs - (this.upgrades.turbo - 1) * 450);

    this.turboActive = true;
    this.turboTimer = turboDuration;
    this.turboCooldown = cooldown;
    this.turboFlame.setVisible(true);
    soundService.playTurbo();
  }

  public applyDamage(rawDamage: number): void {
    // Armor reduction: Level 1 = 1.0 (100%), Level 10 = 0.3 (30%)
    const armorFactor = Math.max(0.3, 1.0 - (this.upgrades.armor - 1) * 0.075);
    const damage = rawDamage * armorFactor;

    this.fuel = Math.max(0, this.fuel - damage);
    soundService.playImpact();

    // Flash chassis red for impact feedback
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

  public applyStatusEffect(effect: string, durationMs: number = 3000): void {
    this.activeEffectName = effect;
    this.effectTimer = durationMs;

    if (effect === 'laziness') {
      this.speedModifier = 0.55;
    } else if (effect === 'socialMedia') {
      this.speedModifier = 0.65;
    } else if (effect === 'overthinking') {
      this.balanceDisrupted = true;
    } else if (effect === 'relationship') {
      // Mild screen wobble & fuel drain
      this.speedModifier = 0.85;
    }
  }

  public addFuel(amount: number): void {
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
    soundService.playFuelPickup();
  }

  public addAmmo(amount: number): void {
    this.ammo = Math.min(this.maxAmmo, this.ammo + amount);
    soundService.playChime('assignment');
  }

  private updateVisuals(): void {
    if (!this.chassis?.active) return;
    const x = this.chassis.x;
    const y = this.chassis.y;
    const rot = this.chassis.rotation;

    // Attach driver to seat inside roll cage
    if (this.driver?.active) {
      const driverOffsetX = -5 * Math.cos(rot) - (-12) * Math.sin(rot);
      const driverOffsetY = -5 * Math.sin(rot) + (-12) * Math.cos(rot);
      this.driver.setPosition(x + driverOffsetX, y + driverOffsetY);
      this.driver.setRotation(rot);
    }

    // Attach weapon to top roll cage
    if (this.weaponSprite?.active) {
      const weaponOffsetX = 18 * Math.cos(rot) - (-28) * Math.sin(rot);
      const weaponOffsetY = 18 * Math.sin(rot) + (-28) * Math.cos(rot);
      this.weaponSprite.setPosition(x + weaponOffsetX, y + weaponOffsetY);
      this.weaponSprite.setRotation(rot);
    }

    // Attach turbo flame to rear exhaust
    if (this.turboFlame?.active) {
      const flameOffsetX = -72 * Math.cos(rot) - (6) * Math.sin(rot);
      const flameOffsetY = -72 * Math.sin(rot) + (6) * Math.cos(rot);
      this.turboFlame.setPosition(x + flameOffsetX, y + flameOffsetY);
      this.turboFlame.setRotation(rot + Math.PI);
    }
  }

  public destroy(): void {
    soundService.stopEngine();

    // Safely remove constraints from Matter world first to avoid solver crash
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
