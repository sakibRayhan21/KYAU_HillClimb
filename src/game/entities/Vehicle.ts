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

    // 1. Create Motorcycle Wheels (Front & Rear)
    const wheelRadius = 18;
    const rearAxleX = -40;
    const frontAxleX = 40;
    const axleY = 11;

    const rearWheelX = x + rearAxleX;
    const frontWheelX = x + frontAxleX;
    const wheelY = y + axleY;

    const wheelFriction = PHYSICS_CONFIG.wheelFriction + (upgrades.suspension - 1) * 0.005;

    this.rearWheel = matter.add.sprite(rearWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionStatic: 1.35,
      frictionAir: 0.005,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.0035, // Lightweight, nimble wheel mass
      label: 'vehicle_wheel',
    });

    this.frontWheel = matter.add.sprite(frontWheelX, wheelY, 'vehicle_wheel', undefined, {
      shape: { type: 'circle', radius: wheelRadius },
      friction: wheelFriction,
      frictionStatic: 1.35,
      frictionAir: 0.005,
      restitution: PHYSICS_CONFIG.wheelRestitution,
      density: 0.0035,
      label: 'vehicle_wheel',
    });

    // 2. Create Motorcycle Chassis Body
    this.chassis = matter.add.sprite(x, y, 'vehicle_chassis', undefined, {
      shape: {
        type: 'rectangle',
        width: 96,
        height: 26,
      },
      friction: PHYSICS_CONFIG.chassisFriction,
      frictionAir: 0.012,
      density: 0.003, // Nimble chassis mass (~7.5) for responsive hill climbing
      restitution: 0.06,
      label: 'vehicle_chassis',
    });

    // 3. Motorcycle Suspension Constraints (Flushed directly to swingarm & fork axles)
    const stiffness = 0.22 + (upgrades.suspension - 1) * 0.02;
    const damping = 0.40 + (upgrades.suspension - 1) * 0.03;

    // Rear swingarm constraint
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

    // Front telescopic fork constraint
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

    // 4. Visual Attachments (Student motorcyclist, Citation blaster, Turbo flame)
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

  public update(time: number, delta: number, inputs: VehicleInputs, terrainHeightAt?: (x: number) => number): { fired: boolean } {
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

    // Accurate ground contact check
    if (terrainHeightAt) {
      const rearGroundY = terrainHeightAt(this.rearWheel.x);
      const frontGroundY = terrainHeightAt(this.frontWheel.x);
      const rearDist = rearGroundY - this.rearWheel.y;
      const frontDist = frontGroundY - this.frontWheel.y;
      this.isGrounded = (rearDist <= 28 && rearDist >= -20) || (frontDist <= 28 && frontDist >= -20);
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

    // Engine Power & Torque Calculation
    const engineMult = 1.0 + (this.upgrades.engine - 1) * 0.16;
    const climbForce = PHYSICS_CONFIG.baseEngineTorque * engineMult * this.speedModifier;
    const maxWheelAngVel = 0.44 + (this.upgrades.engine - 1) * 0.025;

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
      // Rapid responsive wheel spin
      rearBody.angularVelocity = Phaser.Math.Linear(rearBody.angularVelocity, maxWheelAngVel, 0.22);
      frontBody.angularVelocity = Phaser.Math.Linear(frontBody.angularVelocity, maxWheelAngVel * 0.85, 0.18);

      // Forward drive thrust along motorcycle chassis angle
      const angle = this.chassis.rotation;
      const fx = Math.cos(angle) * climbForce;
      const fy = Math.sin(angle) * climbForce;

      // Apply hill climbing force to both chassis and drive wheel
      matter.body.applyForce(chassisBody, chassisBody.position, { x: fx * 0.65, y: fy * 0.65 });
      matter.body.applyForce(rearBody, rearBody.position, { x: fx * 0.35, y: fy * 0.35 });

      if (this.isGrounded) {
        // On ground: Gentle wheelie torque (lifts front wheel over obstacles without flipping on hills)
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity - 0.005 * tiltDirection);
      } else {
        // In air: Full stunt tilt control (pitch UP for backflips / smooth slope landing)
        const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity - airTorque * 0.12);
      }
    }

    // Brake / Reverse
    if (inputs.brake) {
      // Strong disc brake deceleration
      matter.body.setAngularVelocity(rearBody, rearBody.angularVelocity * 0.82);
      matter.body.setAngularVelocity(frontBody, frontBody.angularVelocity * 0.78);

      if (this.isGrounded) {
        // Reverse push on ground
        const angle = this.chassis.rotation;
        const rx = -Math.cos(angle) * (climbForce * 0.45);
        const ry = -Math.sin(angle) * (climbForce * 0.45);
        matter.body.applyForce(chassisBody, chassisBody.position, { x: rx, y: ry });
      } else {
        // In air: Full stunt tilt control (pitch DOWN for frontflips / downhill landing alignment)
        const airTorque = PHYSICS_CONFIG.airRotationTorque * tiltDirection;
        matter.body.setAngularVelocity(chassisBody, chassisBody.angularVelocity + airTorque * 0.12);
      }
    }

    // Turbo Boost Force (High-power leap over peaks)
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

    // Attach student driver seated on the motorcycle saddle
    if (this.driver?.active) {
      const driverOffsetX = -22 * Math.cos(rot) - (-14) * Math.sin(rot);
      const driverOffsetY = -22 * Math.sin(rot) + (-14) * Math.cos(rot);
      this.driver.setPosition(x + driverOffsetX, y + driverOffsetY);
      this.driver.setRotation(rot);
    }

    // Attach Citation Cannon to motorcycle handlebars / triple clamp
    if (this.weaponSprite?.active) {
      const weaponOffsetX = 24 * Math.cos(rot) - (-18) * Math.sin(rot);
      const weaponOffsetY = 24 * Math.sin(rot) + (-18) * Math.cos(rot);
      this.weaponSprite.setPosition(x + weaponOffsetX, y + weaponOffsetY);
      this.weaponSprite.setRotation(rot);
    }

    // Attach turbo boost flame to rear exhaust muffler tip
    if (this.turboFlame?.active) {
      const flameOffsetX = -60 * Math.cos(rot) - (7) * Math.sin(rot);
      const flameOffsetY = -60 * Math.sin(rot) + (7) * Math.cos(rot);
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
