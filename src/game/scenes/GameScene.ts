import * as Phaser from 'phaser';
import { Vehicle, VehicleInputs } from '../entities/Vehicle';
import { Obstacle } from '../entities/Obstacle';
import { Collectible } from '../entities/Collectible';
import { Projectile } from '../entities/Projectile';
import { SemesterInfo, SemesterRunResult, CollectibleType, ObstacleType } from '../types/game';
import { SEMESTERS_CONFIG } from '../config/semestersConfig';
import { StorageService } from '../services/storageService';
import { gameEvents } from '../services/eventBus';
import { soundService } from '../services/soundService';
import { calculateSemesterRunGrades } from '../services/cgpaService';
import { WEAPON_CONFIG } from '../config/gameConfig';

export class GameScene extends Phaser.Scene {
  public semester: SemesterInfo;
  public vehicle!: Vehicle;
  public obstacles: Obstacle[] = [];
  public collectibles: Collectible[] = [];
  public projectiles: Projectile[] = [];

  // Terrain
  private terrainGraphics!: Phaser.GameObjects.Graphics;
  private terrainPoints: { x: number; y: number }[] = [];
  private terrainBodies: any[] = [];
  private finishLineSensor: any;
  private finishLineArch!: Phaser.GameObjects.Sprite;

  // Event & collision listeners for cleanup
  private boundEvents: Array<{ event: string; fn: (...args: any[]) => void }> = [];
  private collisionHandler: any = null;

  // Background parallax layers
  private bgClouds: Phaser.GameObjects.TileSprite[] = [];
  private bgBldgs: Phaser.GameObjects.TileSprite[] = [];
  private bgTrees: Phaser.GameObjects.TileSprite[] = [];

  // Input states
  private inputs: VehicleInputs = {
    accelerate: false,
    brake: false,
    fire: false,
    turbo: false,
  };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;

  // Game run metrics
  public isRunActive: boolean = false;
  public isPaused: boolean = false;
  public levelCompleted: boolean = false;
  public gameOver: boolean = false;
  private gameOverTimer: number = 0;

  public distanceCoveredMeters: number = 0;
  public coinsEarnedThisRun: number = 0;
  public academicPowerEarnedThisRun: number = 0;
  public obstaclesDestroyedThisRun: number = 0;
  public obstaclesHitThisRun: number = 0;
  public academicItemsCollected: Record<string, number> = {};

  // HUD sync throttling
  private lastHudSyncTime: number = 0;

  constructor() {
    super({ key: 'GameScene' });
    this.semester = SEMESTERS_CONFIG[0];
  }

  init(data: { semesterNumber?: number }): void {
    const save = StorageService.load();
    const semNum = data?.semesterNumber || save.currentSemester || 1;
    this.semester = SEMESTERS_CONFIG.find((s) => s.number === semNum) || SEMESTERS_CONFIG[0];
  }

  create(): void {
    this.isRunActive = true;
    this.isPaused = false;
    this.levelCompleted = false;
    this.gameOver = false;
    this.gameOverTimer = 0;
    this.distanceCoveredMeters = 0;
    this.coinsEarnedThisRun = 0;
    this.academicPowerEarnedThisRun = 0;
    this.obstaclesDestroyedThisRun = 0;
    this.obstaclesHitThisRun = 0;
    this.academicItemsCollected = {};

    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];

    // Setup World & Physics boundaries
    const totalWorldWidth = this.semester.targetDistance * 10 + 2000;
    const worldHeight = 1600;
    this.matter.world.setBounds(0, -600, totalWorldWidth, worldHeight + 600, 100, true, true, false, true);

    // Create Background & Parallax
    this.createBackgrounds(totalWorldWidth);

    // Generate Hill Climb Terrain
    this.generateTerrain(totalWorldWidth);

    // Create Vehicle with Player Upgrades
    const save = StorageService.load();
    const startX = 250;
    const startY = this.getTerrainHeightAt(startX) - 80;
    this.vehicle = new Vehicle(this, startX, startY, save.upgrades);

    // Spawn Finish Line
    this.createFinishLine();

    // Spawn Obstacles & Collectibles along track
    this.populateLevel();

    // Setup Camera
    this.cameras.main.startFollow(this.vehicle.chassis, true, 0.1, 0.08);
    this.cameras.main.setBounds(0, -400, totalWorldWidth, worldHeight + 400);
    this.cameras.main.setZoom(0.95);

    // Setup Controls
    this.setupKeyboard();
    this.setupExternalEvents();

    // Setup Physics Collision Callbacks
    this.setupCollisions();

    // Start background music
    if (save.settings.soundEnabled) {
      soundService.startBGM();
    }
  }

  private createBackgrounds(worldWidth: number): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Sky Background Gradient
    const skyGfx = this.add.graphics();
    skyGfx.fillGradientStyle(
      this.semester.theme.skyColor,
      this.semester.theme.skyColor,
      this.semester.theme.skyBottomColor,
      this.semester.theme.skyBottomColor,
      1
    );
    skyGfx.fillRect(0, -400, worldWidth, 2000);
    skyGfx.setDepth(-10);

    // Far Background: Clouds
    for (let i = 0; i < 18; i++) {
      const cloudX = Math.random() * worldWidth;
      const cloudY = -150 + Math.random() * 250;
      const cloud = this.add.sprite(cloudX, cloudY, 'bg_cloud');
      cloud.setAlpha(0.65);
      cloud.setScale(0.8 + Math.random() * 0.7);
      cloud.setDepth(-8);
    }

    // Mid Background: University Buildings & Clock Towers
    for (let x = 300; x < worldWidth; x += 650 + Math.random() * 300) {
      const bldgY = this.getTerrainHeightAt(x) - 40;
      const bldg = this.add.sprite(x, bldgY, 'bg_university_bldg');
      bldg.setAlpha(0.5);
      bldg.setScale(1.1);
      bldg.setDepth(-6);
    }

    // Foreground / Midground: Lush Campus Trees along hills
    for (let x = 150; x < worldWidth; x += 120 + Math.random() * 180) {
      const treeY = this.getTerrainHeightAt(x) - 25;
      const tree = this.add.sprite(x, treeY, 'bg_campus_tree');
      tree.setScale(0.85 + Math.random() * 0.4);
      tree.setDepth(2);
    }
  }

  private getTerrainHeightAt(x: number): number {
    const baseY = 800;
    const steepness = this.semester.hillSteepness;
    const roughness = this.semester.hillRoughness;

    // Smooth undulating sine waves for realistic hill climbing
    const y1 = Math.sin(x * 0.003) * roughness;
    const y2 = Math.cos(x * 0.007) * (roughness * 0.6);
    const y3 = Math.sin(x * 0.015) * (roughness * 0.25);
    const slope = -Math.sin(x * steepness * 0.5) * 120;

    return baseY + y1 + y2 + y3 + slope;
  }

  private generateTerrain(worldWidth: number): void {
    this.terrainPoints = [];
    this.terrainBodies = [];
    const step = 38; // Smooth meters-to-pixel segment step

    for (let x = 0; x <= worldWidth; x += step) {
      const y = this.getTerrainHeightAt(x);
      this.terrainPoints.push({ x, y });
    }

    // Create Matter Physics Segment Bodies along the spline
    const matter = this.matter;
    const thickness = 50;

    for (let i = 0; i < this.terrainPoints.length - 1; i++) {
      const p1 = this.terrainPoints[i];
      const p2 = this.terrainPoints[i + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Shift collision box center along its perpendicular downward normal
      // so top surface lies precisely along the terrain line (p1 -> p2) with zero step bumps
      const normalX = -Math.sin(angle);
      const normalY = Math.cos(angle);
      const cx = midX + normalX * (thickness / 2);
      const cy = midY + normalY * (thickness / 2);

      const segment = matter.add.rectangle(cx, cy, length + 4, thickness, {
        isStatic: true,
        friction: 1.15,
        frictionStatic: 1.35,
        restitution: 0.02,
        label: 'ground',
        chamfer: { radius: 2 },
      });
      matter.body.setAngle(segment, angle);
      this.terrainBodies.push(segment);
    }

    // Visual Terrain Rendering
    this.terrainGraphics = this.add.graphics();
    this.terrainGraphics.setDepth(3);

    // Deep soil / mountain body
    this.terrainGraphics.fillStyle(this.semester.theme.hillSecondary, 1);
    this.terrainGraphics.beginPath();
    this.terrainGraphics.moveTo(this.terrainPoints[0].x, this.terrainPoints[0].y);

    for (let i = 1; i < this.terrainPoints.length; i++) {
      this.terrainGraphics.lineTo(this.terrainPoints[i].x, this.terrainPoints[i].y);
    }

    const last = this.terrainPoints[this.terrainPoints.length - 1];
    this.terrainGraphics.lineTo(last.x, 2200);
    this.terrainGraphics.lineTo(0, 2200);
    this.terrainGraphics.closePath();
    this.terrainGraphics.fillPath();

    // Top Surface Crust (Green grass or road surface)
    this.terrainGraphics.lineStyle(14, this.semester.theme.hillPrimary, 1);
    this.terrainGraphics.beginPath();
    this.terrainGraphics.moveTo(this.terrainPoints[0].x, this.terrainPoints[0].y);
    for (let i = 1; i < this.terrainPoints.length; i++) {
      this.terrainGraphics.lineTo(this.terrainPoints[i].x, this.terrainPoints[i].y);
    }
    this.terrainGraphics.strokePath();

    // Fine highlight line
    this.terrainGraphics.lineStyle(3, 0xfef08a, 0.4);
    this.terrainGraphics.beginPath();
    this.terrainGraphics.moveTo(this.terrainPoints[0].x, this.terrainPoints[0].y - 6);
    for (let i = 1; i < this.terrainPoints.length; i++) {
      this.terrainGraphics.lineTo(this.terrainPoints[i].x, this.terrainPoints[i].y - 6);
    }
    this.terrainGraphics.strokePath();
  }

  private createFinishLine(): void {
    const finishX = this.semester.targetDistance * 10;
    const finishY = this.getTerrainHeightAt(finishX);

    this.finishLineArch = this.add.sprite(finishX, finishY - 90, 'finish_line_arch');
    this.finishLineArch.setDepth(5);

    // Sensor body for finish line detection
    this.finishLineSensor = this.matter.add.rectangle(finishX, finishY - 100, 40, 220, {
      isSensor: true,
      isStatic: true,
      label: 'finish_line',
    });
  }

  private populateLevel(): void {
    const endX = this.semester.targetDistance * 10;
    let nextObstacleX = 600; // First obstacle appears after initial gentle run
    let nextFuelX = 750;
    let nextItemX = 400;

    // 1. Spawning Collectibles
    while (nextItemX < endX - 100) {
      const itemY = this.getTerrainHeightAt(nextItemX) - 35;
      // Cycle through academic items and coins
      const rand = Math.random();
      let type: CollectibleType = 'coin';
      if (rand < 0.28) {
        type = 'coin';
      } else if (rand < 0.50) {
        type = 'classTest';
      } else if (rand < 0.72) {
        type = 'quiz';
      } else if (rand < 0.88) {
        type = 'assignment';
      } else if (rand < 0.96) {
        type = 'midterm';
      } else {
        type = 'finalExam';
      }

      const col = new Collectible(this, nextItemX, itemY, type);
      this.collectibles.push(col);

      nextItemX += 130 + Math.random() * 110;
    }

    // 2. Spawning Fuel Cans (Chai / Coffee Thermos)
    while (nextFuelX < endX) {
      const fuelY = this.getTerrainHeightAt(nextFuelX) - 30;
      const fuelCol = new Collectible(this, nextFuelX, fuelY, 'fuel');
      this.collectibles.push(fuelCol);

      nextFuelX += 380 + Math.random() * 150;
    }

    // 3. Spawning University Obstacles
    const pool = this.semester.obstaclePool;
    const totalWeight = pool.reduce((acc, cur) => acc + cur.weight, 0);

    while (nextObstacleX < endX - 150) {
      let r = Math.random() * totalWeight;
      let selectedType: ObstacleType = pool[0].type;
      for (const item of pool) {
        if (r < item.weight) {
          selectedType = item.type;
          break;
        }
        r -= item.weight;
      }

      const obsY = this.getTerrainHeightAt(nextObstacleX) - 45;
      const obs = new Obstacle(this, nextObstacleX, obsY, selectedType);
      this.obstacles.push(obs);

      nextObstacleX += this.semester.spawnIntervalMeters * 10 + Math.random() * 80;
    }

    // Always spawn the Course Teacher or Retake obstacle as the Semester Midpoint & Climax challenge!
    if (this.semester.number >= 4) {
      const climaxX = endX * 0.75;
      const climaxY = this.getTerrainHeightAt(climaxX) - 50;
      const boss = new Obstacle(this, climaxX, climaxY, this.semester.number >= 6 ? 'courseTeacher' : 'retake');
      this.obstacles.push(boss);
    }
  }

  private setupKeyboard(): void {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.keyEsc.on('down', () => {
      this.togglePause();
    });
  }

  private setupExternalEvents(): void {
    const bind = (event: string, fn: (...args: any[]) => void) => {
      this.boundEvents.push({ event, fn });
      gameEvents.on(event, fn);
    };

    bind('INPUT_GAS_DOWN', () => {
      this.inputs.accelerate = true;
    });
    bind('INPUT_GAS_UP', () => {
      this.inputs.accelerate = false;
    });
    bind('INPUT_BRAKE_DOWN', () => {
      this.inputs.brake = true;
    });
    bind('INPUT_BRAKE_UP', () => {
      this.inputs.brake = false;
    });
    bind('INPUT_FIRE', () => {
      this.inputs.fire = true;
      if (this.time) {
        this.time.delayedCall(120, () => {
          this.inputs.fire = false;
        });
      }
    });
    bind('INPUT_TURBO', () => {
      this.inputs.turbo = true;
      if (this.time) {
        this.time.delayedCall(120, () => {
          this.inputs.turbo = false;
        });
      }
    });
    bind('PAUSE_GAME', () => {
      this.pauseGame();
    });
    bind('RESUME_GAME', () => {
      this.resumeGame();
    });
    bind('SYNTHESIZE_AMMO', () => {
      this.synthesizeAmmo();
    });
    bind('RESTART_SEMESTER', () => {
      if (this.scene?.isActive('GameScene')) {
        this.scene.restart({ semesterNumber: this.semester.number });
      }
    });
  }

  private synthesizeAmmo(): void {
    const save = StorageService.load();
    if (save.academicPower >= WEAPON_CONFIG.ammoSynthesisCost) {
      StorageService.update((s) => ({
        ...s,
        academicPower: s.academicPower - WEAPON_CONFIG.ammoSynthesisCost,
      }));
      this.vehicle.addAmmo(WEAPON_CONFIG.ammoSynthesisAmount);
      soundService.playChime('assignment');
      this.syncHud(true);
    }
  }

  private setupCollisions(): void {
    this.collisionHandler = (event: any) => {
      const pairs = event.pairs;
      if (!pairs) return;

      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        if (!bodyA || !bodyB) continue;

        // 1. Vehicle vs Finish Line
        if (
          (bodyA === this.finishLineSensor && this.isVehicleBody(bodyB)) ||
          (bodyB === this.finishLineSensor && this.isVehicleBody(bodyA))
        ) {
          this.handleFinishLineCrossed();
        }

        // 2. Vehicle vs Collectible
        let colBody = bodyA.label === 'collectible' ? bodyA : bodyB.label === 'collectible' ? bodyB : null;
        let carBody = this.isVehicleBody(bodyA) ? bodyA : this.isVehicleBody(bodyB) ? bodyB : null;

        if (colBody && carBody) {
          const colInstance: Collectible = colBody.gameObject?.collectibleInstance;
          if (colInstance && !colInstance.isCollected) {
            const reward = colInstance.collect();
            if (reward.power > 0) {
              this.academicPowerEarnedThisRun += reward.power;
              this.academicItemsCollected[reward.type] = (this.academicItemsCollected[reward.type] || 0) + 1;
            }
            if (reward.coin > 0) {
              this.coinsEarnedThisRun += reward.coin;
            }
            if (reward.fuel > 0) {
              this.vehicle.addFuel(reward.fuel);
            }
            this.syncHud(true);
          }
        }

        // 3. Vehicle Chassis vs Obstacle
        let obsBody = bodyA.label === 'obstacle' ? bodyA : bodyB.label === 'obstacle' ? bodyB : null;
        let vehicleChassis = bodyA.label === 'vehicle_chassis' ? bodyA : bodyB.label === 'vehicle_chassis' ? bodyB : null;

        if (obsBody && vehicleChassis) {
          const obsInstance: Obstacle = obsBody.gameObject?.obstacleInstance;
          if (obsInstance && !obsInstance.isDestroyed) {
            this.obstaclesHitThisRun++;
            this.vehicle.applyDamage(obsInstance.config.damage);
            this.vehicle.applyStatusEffect(obsInstance.type, 3000);

            // Obstacle takes recoil damage from the heavy vehicle
            obsInstance.takeDamage(20);

            // Camera shake
            this.cameras.main.shake(180, 0.012);
            this.syncHud(true);
          }
        }

        // 4. Projectile vs Obstacle
        let projBody = bodyA.label === 'projectile' ? bodyA : bodyB.label === 'projectile' ? bodyB : null;
        if (projBody && obsBody) {
          const projInstance: Projectile = projBody.gameObject?.projectileInstance;
          const obsInstance: Obstacle = obsBody.gameObject?.obstacleInstance;

          if (projInstance && !projInstance.isDead && obsInstance && !obsInstance.isDestroyed) {
            const res = projInstance.hitObstacle(obsInstance);
            if (res.destroyed) {
              this.obstaclesDestroyedThisRun++;
              this.coinsEarnedThisRun += res.coins;
              this.academicPowerEarnedThisRun += Math.round(res.score * 0.4);
            }
            this.syncHud(true);
          }
        }
      }
    };
    this.matter.world.on('collisionstart', this.collisionHandler);
  }

  private isVehicleBody(body: any): boolean {
    return (
      body.label === 'vehicle_chassis' ||
      body.label === 'vehicle_wheel'
    );
  }

  private fireWeapon(): void {
    const angle = this.vehicle.chassis.rotation;
    const spawnDistance = 60;
    const spawnX = this.vehicle.chassis.x + Math.cos(angle) * spawnDistance;
    const spawnY = this.vehicle.chassis.y + Math.sin(angle) * spawnDistance - 15;

    // Damage boosted by weapon upgrade
    const damage = WEAPON_CONFIG.baseDamage + (this.vehicle.upgrades.weapon - 1) * 9.5;
    const proj = new Projectile(this, spawnX, spawnY, angle, damage);
    this.projectiles.push(proj);
  }

  private handleFinishLineCrossed(): void {
    if (this.levelCompleted || this.gameOver) return;
    this.levelCompleted = true;
    this.isRunActive = false;
    soundService.stopEngine();
    soundService.playFanfare();

    // Distance completed
    this.distanceCoveredMeters = this.semester.targetDistance;

    // Grade and GPA Calculation
    const resultGrades = calculateSemesterRunGrades(this.semester, {
      completed: true,
      distanceRatio: 1.0,
      academicPowerEarned: this.academicPowerEarnedThisRun,
      academicItemsCollected: this.academicItemsCollected,
      obstaclesHit: this.obstaclesHitThisRun,
      obstaclesDestroyed: this.obstaclesDestroyedThisRun,
    });

    const runResult: SemesterRunResult = {
      semesterNumber: this.semester.number,
      completed: true,
      distanceCovered: this.distanceCoveredMeters,
      targetDistance: this.semester.targetDistance,
      fuelLeft: Math.round(this.vehicle.fuel),
      academicPowerEarned: this.academicPowerEarnedThisRun,
      coinsEarned: this.coinsEarnedThisRun,
      obstaclesDestroyed: this.obstaclesDestroyedThisRun,
      obstaclesHit: this.obstaclesHitThisRun,
      academicItemsCollected: this.academicItemsCollected,
      semesterGPA: resultGrades.semesterGPA,
      semesterGrade: resultGrades.semesterGrade,
      courseGrades: resultGrades.courseGrades,
      creditsEarned: resultGrades.creditsEarned,
    };

    // Save progress to LocalStorage
    StorageService.update((save) => {
      const nextSem = Math.min(8, this.semester.number + 1);
      const unlocked = Math.max(save.unlockedSemesters, nextSem);

      // Add to transcript
      const existingIdx = save.transcript.findIndex((t) => t.semesterNumber === this.semester.number);
      const newRecord = {
        semesterNumber: this.semester.number,
        semesterTitle: this.semester.title,
        gpa: resultGrades.semesterGPA,
        grade: resultGrades.semesterGrade,
        credits: resultGrades.creditsEarned,
        courses: resultGrades.courseGrades,
        completedAt: new Date().toLocaleDateString(),
      };

      const updatedTranscript = [...save.transcript];
      if (existingIdx >= 0) {
        // Keep highest GPA
        if (resultGrades.semesterGPA >= updatedTranscript[existingIdx].gpa) {
          updatedTranscript[existingIdx] = newRecord;
        }
      } else {
        updatedTranscript.push(newRecord);
      }

      // Check graduation status (all 8 semesters completed)
      const graduated = updatedTranscript.length >= 8;

      return {
        ...save,
        unlockedSemesters: unlocked,
        currentSemester: nextSem,
        coins: save.coins + this.coinsEarnedThisRun,
        academicPower: save.academicPower + this.academicPowerEarnedThisRun,
        transcript: updatedTranscript,
        stats: {
          ...save.stats,
          totalRuns: save.stats.totalRuns + 1,
          totalDistance: save.stats.totalDistance + this.distanceCoveredMeters,
          totalObstaclesDestroyed: save.stats.totalObstaclesDestroyed + this.obstaclesDestroyedThisRun,
          totalCoinsEarned: save.stats.totalCoinsEarned + this.coinsEarnedThisRun,
          totalAcademicPower: save.stats.totalAcademicPower + this.academicPowerEarnedThisRun,
          graduated,
        },
      };
    });

    // Notify React UI
    gameEvents.emit('SEMESTER_COMPLETED', runResult);
  }

  private handleGameOver(): void {
    if (this.gameOver || this.levelCompleted) return;
    this.gameOver = true;
    this.isRunActive = false;
    soundService.stopEngine();
    soundService.playGameOver();

    // Partial GPA calculation for attempt
    const distanceRatio = Math.min(1.0, this.distanceCoveredMeters / this.semester.targetDistance);
    const resultGrades = calculateSemesterRunGrades(this.semester, {
      completed: false,
      distanceRatio,
      academicPowerEarned: this.academicPowerEarnedThisRun,
      academicItemsCollected: this.academicItemsCollected,
      obstaclesHit: this.obstaclesHitThisRun,
      obstaclesDestroyed: this.obstaclesDestroyedThisRun,
    });

    const runResult: SemesterRunResult = {
      semesterNumber: this.semester.number,
      completed: false,
      distanceCovered: this.distanceCoveredMeters,
      targetDistance: this.semester.targetDistance,
      fuelLeft: 0,
      academicPowerEarned: this.academicPowerEarnedThisRun,
      coinsEarned: this.coinsEarnedThisRun,
      obstaclesDestroyed: this.obstaclesDestroyedThisRun,
      obstaclesHit: this.obstaclesHitThisRun,
      academicItemsCollected: this.academicItemsCollected,
      semesterGPA: resultGrades.semesterGPA,
      semesterGrade: resultGrades.semesterGrade,
      courseGrades: resultGrades.courseGrades,
      creditsEarned: 0,
    };

    // Save earned currency even on fail
    StorageService.update((save) => ({
      ...save,
      coins: save.coins + this.coinsEarnedThisRun,
      academicPower: save.academicPower + this.academicPowerEarnedThisRun,
      stats: {
        ...save.stats,
        totalRuns: save.stats.totalRuns + 1,
        totalDistance: save.stats.totalDistance + this.distanceCoveredMeters,
        totalObstaclesDestroyed: save.stats.totalObstaclesDestroyed + this.obstaclesDestroyedThisRun,
        totalCoinsEarned: save.stats.totalCoinsEarned + this.coinsEarnedThisRun,
        totalAcademicPower: save.stats.totalAcademicPower + this.academicPowerEarnedThisRun,
      },
    }));

    gameEvents.emit('GAME_OVER', runResult);
  }

  public pauseGame(): void {
    this.isPaused = true;
    this.matter.world.pause();
    soundService.stopEngine();
    gameEvents.emit('GAME_PAUSED');
  }

  public resumeGame(): void {
    this.isPaused = false;
    this.matter.world.resume();
    soundService.startEngine();
    gameEvents.emit('GAME_RESUMED');
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return;

    // Gather keyboard inputs safely with optional chaining
    const kbAccel = Boolean(
      this.cursors?.right?.isDown ||
      this.keyD?.isDown ||
      this.cursors?.up?.isDown ||
      this.keyW?.isDown
    );
    const kbBrake = Boolean(
      this.cursors?.left?.isDown ||
      this.keyA?.isDown ||
      this.cursors?.down?.isDown ||
      this.keyS?.isDown
    );
    const kbFire = Boolean(this.keySpace?.isDown);
    const kbTurbo = Boolean(this.keyShift?.isDown);

    const mergedInputs: VehicleInputs = {
      accelerate: kbAccel || this.inputs.accelerate,
      brake: kbBrake || this.inputs.brake,
      fire: kbFire || this.inputs.fire,
      turbo: kbTurbo || this.inputs.turbo,
    };

    // Update Vehicle
    if (this.vehicle) {
      const { fired } = this.vehicle.update(time, delta, mergedInputs, (x) => this.getTerrainHeightAt(x));
      if (fired) {
        this.fireWeapon();
      }

      // Track distance
      const curMeters = Math.max(0, Math.round(this.vehicle.chassis.x / 10));
      if (curMeters > this.distanceCoveredMeters) {
        this.distanceCoveredMeters = curMeters;
      }

      // Check if vehicle has broken down (out of fuel)
      if (this.vehicle.isBrokenDown && !this.gameOver && !this.levelCompleted) {
        this.gameOverTimer += delta;
        // Wait 2.2 seconds for car to roll to halt
        if (this.gameOverTimer > 2200) {
          this.handleGameOver();
        }
      }
    }

    // Update Obstacles (HP bar positioning)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      if (obs.isDestroyed) {
        this.obstacles.splice(i, 1);
      } else {
        obs.update();
      }
    }

    // Clean up collected items
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      if (this.collectibles[i].isCollected) {
        this.collectibles.splice(i, 1);
      }
    }

    // Clean up dead projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      if (this.projectiles[i].isDead) {
        this.projectiles.splice(i, 1);
      }
    }

    // Sync HUD with React UI (throttled to 60ms for buttery smooth performance)
    if (time - this.lastHudSyncTime > 60) {
      this.syncHud();
      this.lastHudSyncTime = time;
    }
  }

  private syncHud(force: boolean = false): void {
    if (!this.vehicle) return;

    const save = StorageService.load();
    const fuelPct = Math.round((this.vehicle.fuel / this.vehicle.maxFuel) * 100);

    const hudState = {
      distance: this.distanceCoveredMeters,
      targetDistance: this.semester.targetDistance,
      speed: this.vehicle.speedKmh,
      fuel: Math.round(this.vehicle.fuel),
      maxFuel: Math.round(this.vehicle.maxFuel),
      fuelPercentage: fuelPct,
      coins: save.coins + this.coinsEarnedThisRun,
      academicPower: save.academicPower + this.academicPowerEarnedThisRun,
      ammo: this.vehicle.ammo,
      maxAmmo: this.vehicle.maxAmmo,
      semesterNumber: this.semester.number,
      cgpa: save.cgpa,
      currentEffect: this.vehicle.activeEffectName,
      effectTimer: Math.ceil(this.vehicle.effectTimer / 1000),
      isPaused: this.isPaused,
      turboReady: this.vehicle.turboCooldown <= 0,
      turboCooldown: Math.ceil(this.vehicle.turboCooldown / 1000),
      turboActive: this.vehicle.turboActive,
    };

    gameEvents.emit('HUD_UPDATE', hudState);
  }

  shutdown(): void {
    // Unbind external gameEvents
    this.boundEvents.forEach(({ event, fn }) => {
      gameEvents.off(event, fn);
    });
    this.boundEvents = [];

    // Remove collision listener from Matter world
    if (this.collisionHandler && this.matter?.world) {
      try {
        this.matter.world.off('collisionstart', this.collisionHandler);
      } catch {}
      this.collisionHandler = null;
    }

    // Remove finish line sensor body
    if (this.finishLineSensor && this.matter?.world) {
      try {
        this.matter.world.remove(this.finishLineSensor);
      } catch {}
      this.finishLineSensor = null;
    }

    // Remove all static ground segments from Matter world
    if (this.terrainBodies && this.matter?.world) {
      this.terrainBodies.forEach((b) => {
        try {
          this.matter.world.remove(b);
        } catch {}
      });
      this.terrainBodies = [];
    }

    // Kill all active tweens before cleaning up scene entities
    if (this.tweens) {
      this.tweens.killAll();
    }

    soundService.stopEngine();
    soundService.stopBGM();
    if (this.vehicle) {
      this.vehicle.destroy();
    }
    this.obstacles.forEach((o) => o.destroy());
    this.collectibles.forEach((c) => c.destroy());
    this.projectiles.forEach((p) => p.destroy());
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];
  }
}
