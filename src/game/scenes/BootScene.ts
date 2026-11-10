import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    if (this.textures.exists('vehicle_chassis')) {
      this.textures.remove('vehicle_chassis');
      this.textures.remove('vehicle_wheel');
      this.textures.remove('driver_avatar');
      this.textures.remove('vehicle_weapon');
    }

    this.generateVehicleTextures();

    if (!this.textures.exists('obs_relationship')) {
      this.generateObstacleTextures();
      this.generateCollectibleTextures();
      this.generateFxTextures();
      this.generateCampusDecorTextures();
    }

    // Transition to GameScene with the requested semester
    const semNumber = this.registry.get('semesterNumber') || 1;
    this.scene.start('GameScene', { semesterNumber: semNumber });
  }

  private generateVehicleTextures(): void {
    // 1. Campus Motorcycle Chassis (Cafe Racer / Street Fighter Motorbike)
    const chassisGfx = this.make.graphics({ x: 0, y: 0 }, false);

    // Rear axle is at (30, 46) -> offset from center (70, 35) is (-40, +11)
    // Front axle is at (110, 46) -> offset from center (70, 35) is (+40, +11)

    // A. Rear Swingarm (Connects frame pivot to rear wheel axle)
    chassisGfx.lineStyle(5, 0x1e293b, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(62, 38, 30, 46));
    chassisGfx.lineStyle(2, 0x475569, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(62, 37, 30, 45));

    // Rear Sprocket & Axle Plate
    chassisGfx.fillStyle(0x334155, 1);
    chassisGfx.fillCircle(30, 46, 7);
    chassisGfx.fillStyle(0x64748b, 1);
    chassisGfx.fillCircle(30, 46, 5);
    chassisGfx.fillStyle(0xe2e8f0, 1);
    chassisGfx.fillCircle(30, 46, 2.5);

    // Drive Chain
    chassisGfx.lineStyle(1.5, 0x0f172a, 0.9);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(54, 42, 30, 46));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(54, 45, 30, 48));

    // Rear Monoshock Damper (Yellow spring coil)
    chassisGfx.lineStyle(4, 0x0f172a, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(56, 32, 46, 42));
    chassisGfx.lineStyle(2.5, 0xfacc15, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(55, 33, 47, 41));

    // B. Exhaust Pipe & Sport Muffler
    // Header pipe from cylinder front (76, 36) curving down and under engine
    chassisGfx.lineStyle(5, 0x64748b, 1);
    chassisGfx.beginPath();
    chassisGfx.moveTo(76, 34);
    chassisGfx.lineTo(76, 44);
    chassisGfx.lineTo(70, 48);
    chassisGfx.lineTo(44, 48);
    chassisGfx.strokePath();

    // Chrome Sport Muffler (tapers back to exhaust tip at x=10, y=42)
    chassisGfx.fillStyle(0x94a3b8, 1);
    chassisGfx.beginPath();
    chassisGfx.moveTo(44, 46);
    chassisGfx.lineTo(12, 40);
    chassisGfx.lineTo(10, 44);
    chassisGfx.lineTo(44, 50);
    chassisGfx.closePath();
    chassisGfx.fillPath();

    // Chrome reflection stripe
    chassisGfx.fillStyle(0xf1f5f9, 0.9);
    chassisGfx.fillRect(14, 41, 28, 2);

    // Exhaust tip hole (turbo flame connects here at offset -60, +7)
    chassisGfx.fillStyle(0x0f172a, 1);
    chassisGfx.fillCircle(11, 42, 2.5);

    // C. Engine Block (High-Torque V-Twin / Single Cylinder)
    // Crankcase
    chassisGfx.fillStyle(0x1e293b, 1);
    chassisGfx.fillRoundedRect(52, 34, 30, 15, 3);

    // Chrome clutch cover
    chassisGfx.fillStyle(0x64748b, 1);
    chassisGfx.fillCircle(63, 41, 6.5);
    chassisGfx.fillStyle(0xeab308, 1);
    chassisGfx.fillCircle(63, 41, 2.5);

    // Cylinder with cooling fins
    chassisGfx.fillStyle(0x334155, 1);
    chassisGfx.fillRect(66, 24, 15, 11);
    chassisGfx.lineStyle(1.5, 0x94a3b8, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(65, 26, 82, 26));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(65, 29, 82, 29));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(65, 32, 82, 32));

    // Air filter pod
    chassisGfx.fillStyle(0xd97706, 1);
    chassisGfx.fillRoundedRect(48, 32, 5, 8, 2);

    // D. Trellis Frame Structure
    chassisGfx.lineStyle(3.5, 0x0f172a, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(94, 18, 62, 38));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(94, 18, 76, 34));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(62, 34, 34, 24));

    // E. Fuel Tank (KYAU Emerald Green + Gold Racing Accent)
    chassisGfx.fillStyle(0x047857, 1);
    chassisGfx.beginPath();
    chassisGfx.moveTo(54, 25);
    chassisGfx.lineTo(70, 15);
    chassisGfx.lineTo(84, 16);
    chassisGfx.lineTo(94, 20);
    chassisGfx.lineTo(94, 26);
    chassisGfx.lineTo(54, 26);
    chassisGfx.closePath();
    chassisGfx.fillPath();

    // Tank highlight sheen
    chassisGfx.lineStyle(2, 0x34d399, 0.9);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(70, 16, 84, 17));

    // Gold racing stripe along tank
    chassisGfx.fillStyle(0xfbbf24, 1);
    chassisGfx.fillRect(60, 20, 30, 2.5);

    // Black rubber knee-grip pad
    chassisGfx.fillStyle(0x111827, 1);
    chassisGfx.fillRoundedRect(62, 21, 10, 4.5, 1.5);

    // Chrome filler cap
    chassisGfx.fillStyle(0xe2e8f0, 1);
    chassisGfx.fillCircle(75, 14.5, 2.5);

    // CSE Logo crest
    chassisGfx.fillStyle(0x38bdf8, 1);
    chassisGfx.fillCircle(78, 21, 2);

    // F. Seat & Tail Cowl
    // Black ribbed leather saddle
    chassisGfx.fillStyle(0x18181b, 1);
    chassisGfx.fillRoundedRect(36, 23, 19, 6, 2);
    chassisGfx.lineStyle(1, 0x3f3f46, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(41, 23, 41, 28));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(46, 23, 46, 28));
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(51, 23, 51, 28));

    // Aerodynamic tail cowl in Emerald Green
    chassisGfx.fillStyle(0x047857, 1);
    chassisGfx.beginPath();
    chassisGfx.moveTo(37, 23);
    chassisGfx.lineTo(25, 23);
    chassisGfx.lineTo(25, 26);
    chassisGfx.lineTo(37, 26);
    chassisGfx.closePath();
    chassisGfx.fillPath();

    // Red LED tail light
    chassisGfx.fillStyle(0xef4444, 1);
    chassisGfx.fillRoundedRect(22, 23, 3, 3.5, 1);

    // G. Front Telescopic Fork & Controls
    // Triple clamp
    chassisGfx.fillStyle(0x334155, 1);
    chassisGfx.fillRect(92, 17, 5, 5);

    // Fork stanchions (upper black)
    chassisGfx.lineStyle(4, 0x1e293b, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(94, 19, 102, 33));

    // Fork sliders (chrome lower reaching exactly to front axle 110, 46)
    chassisGfx.lineStyle(4, 0x94a3b8, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(102, 33, 110, 46));
    chassisGfx.lineStyle(1.5, 0xffffff, 0.8);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(102, 33, 110, 46));

    // Front axle plate & nut
    chassisGfx.fillStyle(0x334155, 1);
    chassisGfx.fillCircle(110, 46, 6);
    chassisGfx.fillStyle(0xe2e8f0, 1);
    chassisGfx.fillCircle(110, 46, 2.5);

    // Red front disc brake caliper
    chassisGfx.fillStyle(0xdc2626, 1);
    chassisGfx.fillRect(104, 39, 5, 6);

    // Front mudguard (Emerald Green)
    chassisGfx.lineStyle(3, 0x047857, 1);
    chassisGfx.beginPath();
    chassisGfx.arc(110, 46, 22, -0.75 * Math.PI, -0.35 * Math.PI, false);
    chassisGfx.strokePath();

    // Handlebars & Grips
    chassisGfx.lineStyle(3, 0x1e293b, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(93, 17, 87, 12));
    chassisGfx.fillStyle(0x0f172a, 1);
    chassisGfx.fillRect(84, 10, 4.5, 4);
    chassisGfx.lineStyle(1.5, 0xcbd5e1, 1);
    chassisGfx.strokeLineShape(new Phaser.Geom.Line(87, 13, 91, 14)); // brake lever
    chassisGfx.fillStyle(0x38bdf8, 1);
    chassisGfx.fillCircle(83, 9, 2); // bar-end mirror

    // Headlight (Sport Retro Round Xenon Headlight)
    chassisGfx.fillStyle(0x1e293b, 1);
    chassisGfx.fillCircle(99, 20, 6.5);
    chassisGfx.fillStyle(0xfef08a, 1);
    chassisGfx.fillCircle(101, 20, 5);
    chassisGfx.fillStyle(0xffffff, 0.85);
    chassisGfx.fillCircle(102, 19, 2);

    chassisGfx.generateTexture('vehicle_chassis', 140, 70);
    chassisGfx.destroy();

    // 2. High-Performance Motorcycle Wheel
    const wheelGfx = this.make.graphics({ x: 0, y: 0 }, false);
    const radius = 18;
    const diameter = radius * 2;

    // Outer tire tread rubber
    wheelGfx.fillStyle(0x111827, 1);
    wheelGfx.fillCircle(radius, radius, radius);

    // Deep motorcycle radial tread grooves
    wheelGfx.lineStyle(2, 0x030712, 1);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      const x1 = radius + Math.cos(a) * (radius - 5);
      const y1 = radius + Math.sin(a) * (radius - 5);
      const x2 = radius + Math.cos(a + 0.15) * radius;
      const y2 = radius + Math.sin(a + 0.15) * radius;
      wheelGfx.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }

    // Tire sidewall rim ring
    wheelGfx.lineStyle(1.5, 0x374151, 1);
    wheelGfx.strokeCircle(radius, radius, radius - 4);

    // Machined Alloy Rim Lip
    wheelGfx.lineStyle(2, 0x94a3b8, 1);
    wheelGfx.strokeCircle(radius, radius, 12);

    // Inner rim bed
    wheelGfx.fillStyle(0x0f172a, 1);
    wheelGfx.fillCircle(radius, radius, 11);

    // Perforated stainless steel disc brake rotor
    wheelGfx.fillStyle(0x64748b, 0.85);
    wheelGfx.fillCircle(radius, radius, 8.5);
    wheelGfx.fillStyle(0x0f172a, 1);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      wheelGfx.fillCircle(radius + Math.cos(a) * 6, radius + Math.sin(a) * 6, 1);
    }

    // 5-Spoke Split Sport Mag Wheel
    wheelGfx.lineStyle(2.5, 0xcbd5e1, 1);
    for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / 5) {
      const x2 = radius + Math.cos(a) * 11;
      const y2 = radius + Math.sin(a) * 11;
      wheelGfx.strokeLineShape(new Phaser.Geom.Line(radius, radius, x2, y2));
    }

    // Center axle hub
    wheelGfx.fillStyle(0x1e293b, 1);
    wheelGfx.fillCircle(radius, radius, 4.5);

    // Gold anodized axle nut
    wheelGfx.fillStyle(0xeab308, 1);
    wheelGfx.fillCircle(radius, radius, 2.5);

    wheelGfx.generateTexture('vehicle_wheel', diameter, diameter);
    wheelGfx.destroy();

    // 3. Driver Student Motorcyclist (Aerodynamic Riding Stance)
    const driverGfx = this.make.graphics({ x: 0, y: 0 }, false);

    // Denim riding jeans (bent leg hugging motorcycle tank)
    driverGfx.fillStyle(0x1d4ed8, 1);
    driverGfx.beginPath();
    driverGfx.moveTo(12, 34);
    driverGfx.lineTo(26, 32);
    driverGfx.lineTo(32, 42);
    driverGfx.lineTo(26, 44);
    driverGfx.lineTo(12, 40);
    driverGfx.closePath();
    driverGfx.fillPath();

    // Black riding boot on footpeg
    driverGfx.fillStyle(0x0f172a, 1);
    driverGfx.fillRoundedRect(8, 38, 10, 6, 2);

    // Royal Blue varsity jacket torso (leaning forward in racing stance)
    driverGfx.fillStyle(0x2563eb, 1);
    driverGfx.beginPath();
    driverGfx.moveTo(12, 22);
    driverGfx.lineTo(28, 18);
    driverGfx.lineTo(26, 34);
    driverGfx.lineTo(12, 34);
    driverGfx.closePath();
    driverGfx.fillPath();

    // White varsity leather sleeves & arm reaching to handlebars
    driverGfx.lineStyle(4, 0xf8fafc, 1);
    driverGfx.strokeLineShape(new Phaser.Geom.Line(24, 22, 36, 30));
    // Black riding glove gripping the throttle
    driverGfx.fillStyle(0x0f172a, 1);
    driverGfx.fillCircle(37, 31, 3);

    // Varsity jacket gold trim & collar
    driverGfx.fillStyle(0xfacc15, 1);
    driverGfx.fillRect(18, 20, 3, 14);

    // Student Head with Skin tone
    driverGfx.fillStyle(0xfcd34d, 1);
    driverGfx.fillCircle(24, 14, 11);

    // Determined smile
    driverGfx.lineStyle(2, 0xb45309, 1);
    driverGfx.beginPath();
    driverGfx.arc(26, 17, 4, 0.1 * Math.PI, 0.8 * Math.PI, false);
    driverGfx.strokePath();

    // Cool aerodynamic Biker Sunglasses / Goggles
    driverGfx.fillStyle(0x0f172a, 1);
    driverGfx.fillRect(24, 11, 10, 5);
    driverGfx.fillRect(16, 11, 7, 5);
    driverGfx.fillRect(22, 12, 3, 2);
    driverGfx.fillStyle(0x38bdf8, 1); // lens glint
    driverGfx.fillRect(26, 12, 6, 2);

    // University Graduation Cap flying back in the wind
    driverGfx.fillStyle(0x111827, 1);
    driverGfx.beginPath();
    driverGfx.moveTo(22, 1);
    driverGfx.lineTo(38, 7);
    driverGfx.lineTo(22, 12);
    driverGfx.lineTo(6, 6);
    driverGfx.closePath();
    driverGfx.fillPath();

    // Gold cap tassel trailing back behind helmet in the wind
    driverGfx.lineStyle(2, 0xeab308, 1);
    driverGfx.strokeLineShape(new Phaser.Geom.Line(22, 6, 2, 14));
    driverGfx.fillStyle(0xeab308, 1);
    driverGfx.fillCircle(2, 14, 2.5);

    driverGfx.generateTexture('driver_avatar', 44, 48);
    driverGfx.destroy();

    // 4. Citation Blaster Weapon (Handlebar-mounted compact energy cannon)
    const weaponGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Heavy mount bracket
    weaponGfx.fillStyle(0x334155, 1);
    weaponGfx.fillRoundedRect(2, 10, 14, 8, 2);
    // Twin energy barrels
    weaponGfx.fillStyle(0x0284c7, 1);
    weaponGfx.fillRect(14, 10, 22, 4);
    weaponGfx.fillRect(14, 15, 22, 4);
    // Glowing laser emitters
    weaponGfx.fillStyle(0x38bdf8, 1);
    weaponGfx.fillCircle(36, 12, 3);
    weaponGfx.fillCircle(36, 17, 3);
    // Cooling fins
    weaponGfx.fillStyle(0xe2e8f0, 1);
    weaponGfx.fillRect(18, 7, 3, 15);
    weaponGfx.fillRect(24, 7, 3, 15);

    weaponGfx.generateTexture('vehicle_weapon', 42, 24);
    weaponGfx.destroy();
  }

  private generateObstacleTextures(): void {
    // 1. Relationship Distraction (Heart with crack & text bubble)
    const relGfx = this.make.graphics({ x: 0, y: 0 }, false);
    relGfx.fillStyle(0xf43f5e, 1);
    relGfx.beginPath();
    relGfx.arc(22, 24, 16, Math.PI, 0, false);
    relGfx.arc(46, 24, 16, Math.PI, 0, false);
    relGfx.lineTo(34, 60);
    relGfx.closePath();
    relGfx.fillPath();
    // Crack line
    relGfx.lineStyle(3, 0xffffff, 0.9);
    relGfx.strokeLineShape(new Phaser.Geom.Line(34, 16, 31, 28));
    relGfx.strokeLineShape(new Phaser.Geom.Line(31, 28, 38, 40));
    relGfx.strokeLineShape(new Phaser.Geom.Line(38, 40, 34, 55));
    // Text badge
    relGfx.fillStyle(0xffffff, 0.95);
    relGfx.fillRoundedRect(4, 62, 60, 14, 4);
    relGfx.generateTexture('obs_relationship', 68, 80);
    relGfx.destroy();

    // 2. Laziness / Procrastination (Sleeping Couch / Snail)
    const lazyGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Comfy sleepy couch
    lazyGfx.fillStyle(0x64748b, 1);
    lazyGfx.fillRoundedRect(5, 25, 70, 30, 8);
    lazyGfx.fillStyle(0x475569, 1);
    lazyGfx.fillRoundedRect(2, 18, 15, 38, 4);
    lazyGfx.fillRoundedRect(63, 18, 15, 38, 4);
    // Soft Pillow
    lazyGfx.fillStyle(0xcbd5e1, 1);
    lazyGfx.fillRoundedRect(18, 22, 24, 16, 4);
    // Floating "Z Z Z"
    lazyGfx.lineStyle(2, 0x38bdf8, 1);
    lazyGfx.strokeLineShape(new Phaser.Geom.Line(48, 14, 58, 14));
    lazyGfx.strokeLineShape(new Phaser.Geom.Line(58, 14, 48, 22));
    lazyGfx.strokeLineShape(new Phaser.Geom.Line(48, 22, 58, 22));
    lazyGfx.generateTexture('obs_laziness', 80, 65);
    lazyGfx.destroy();

    // 3. Retake Stamp (F Grade Exam Script)
    const retakeGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Exam Paper
    retakeGfx.fillStyle(0xf8fafc, 1);
    retakeGfx.fillRoundedRect(8, 4, 54, 70, 4);
    retakeGfx.lineStyle(2, 0xcfd4dc, 1);
    retakeGfx.strokeRoundedRect(8, 4, 54, 70, 4);
    // Ruled lines
    retakeGfx.lineStyle(1.5, 0x94a3b8, 0.6);
    for (let y = 18; y < 65; y += 10) {
      retakeGfx.strokeLineShape(new Phaser.Geom.Line(16, y, 54, y));
    }
    // Huge Blood-Red "F" Grade Stamp
    retakeGfx.lineStyle(5, 0xdc2626, 1);
    retakeGfx.strokeCircle(35, 38, 20);
    retakeGfx.fillStyle(0xdc2626, 1);
    retakeGfx.fillRect(26, 26, 18, 5);
    retakeGfx.fillRect(26, 26, 5, 24);
    retakeGfx.fillRect(26, 36, 12, 4);
    retakeGfx.generateTexture('obs_retake', 70, 80);
    retakeGfx.destroy();

    // 4. Course Teacher Boss (Strict Professor with Red Pen & Glasses)
    const teacherGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Professor Coat
    teacherGfx.fillStyle(0x4c1d95, 1);
    teacherGfx.fillRoundedRect(12, 42, 66, 50, 8);
    // White Shirt & Necktie
    teacherGfx.fillStyle(0xffffff, 1);
    teacherGfx.fillTriangle(45, 42, 36, 62, 54, 62);
    teacherGfx.fillStyle(0xef4444, 1); // Red tie
    teacherGfx.fillTriangle(45, 44, 41, 72, 49, 72);
    // Head
    teacherGfx.fillStyle(0xfde68a, 1);
    teacherGfx.fillCircle(45, 26, 18);
    // Strict Eyebrows & Horn-rimmed glasses
    teacherGfx.fillStyle(0x1e1b4b, 1);
    teacherGfx.fillRect(32, 22, 11, 8);
    teacherGfx.fillRect(47, 22, 11, 8);
    teacherGfx.fillRect(42, 24, 6, 3);
    // Mustache
    teacherGfx.fillStyle(0x475569, 1);
    teacherGfx.fillRoundedRect(35, 34, 20, 5, 2);
    // Boss Crown / Red Pen Weapon
    teacherGfx.fillStyle(0xdc2626, 1);
    teacherGfx.fillRect(72, 15, 6, 45);
    teacherGfx.fillStyle(0xfacc15, 1);
    teacherGfx.fillTriangle(75, 10, 72, 16, 78, 16);
    teacherGfx.generateTexture('obs_courseTeacher', 90, 95);
    teacherGfx.destroy();

    // 5. Social Media (Smartphone Doomscroll)
    const socialGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Phone body
    socialGfx.fillStyle(0x0f172a, 1);
    socialGfx.fillRoundedRect(8, 4, 44, 66, 8);
    // Glowing Screen
    socialGfx.fillStyle(0x0284c7, 1);
    socialGfx.fillRoundedRect(12, 10, 36, 54, 4);
    // Notification badges (red dots with count)
    socialGfx.fillStyle(0xef4444, 1);
    socialGfx.fillCircle(46, 10, 9);
    socialGfx.fillStyle(0xffffff, 1);
    socialGfx.fillCircle(46, 10, 3);
    // Feed post cards
    socialGfx.fillStyle(0xffffff, 0.9);
    socialGfx.fillRoundedRect(16, 16, 28, 14, 2);
    socialGfx.fillStyle(0x38bdf8, 0.8);
    socialGfx.fillRoundedRect(16, 34, 28, 22, 2);
    socialGfx.generateTexture('obs_socialMedia', 62, 75);
    socialGfx.destroy();

    // 6. Overthinking (Brain Storm & Dizzy Spiral)
    const thinkGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Thunder Cloud
    thinkGfx.fillStyle(0x475569, 0.9);
    thinkGfx.fillCircle(25, 22, 14);
    thinkGfx.fillCircle(45, 18, 18);
    thinkGfx.fillCircle(62, 22, 14);
    // Lightning bolt
    thinkGfx.fillStyle(0xfacc15, 1);
    thinkGfx.beginPath();
    thinkGfx.moveTo(42, 28);
    thinkGfx.lineTo(34, 44);
    thinkGfx.lineTo(44, 44);
    thinkGfx.lineTo(38, 62);
    thinkGfx.lineTo(52, 40);
    thinkGfx.lineTo(44, 40);
    thinkGfx.closePath();
    thinkGfx.fillPath();
    // Glowing purple brain
    thinkGfx.fillStyle(0xc084fc, 0.9);
    thinkGfx.fillCircle(30, 52, 12);
    thinkGfx.fillCircle(54, 52, 12);
    thinkGfx.generateTexture('obs_overthinking', 75, 75);
    thinkGfx.destroy();

    // 7. Assignment Deadline (11:59 PM Bomb & Clock)
    const deadGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Clock face / Dynamite
    deadGfx.fillStyle(0xe11d48, 1);
    deadGfx.fillCircle(35, 38, 28);
    deadGfx.fillStyle(0x18181b, 1);
    deadGfx.fillCircle(35, 38, 24);
    // Digital time LED 11:59
    deadGfx.fillStyle(0x22c55e, 1);
    deadGfx.fillRect(20, 32, 30, 12);
    deadGfx.fillStyle(0x000000, 1);
    deadGfx.fillRect(25, 34, 3, 8);
    deadGfx.fillRect(32, 34, 3, 8);
    deadGfx.fillRect(38, 34, 3, 8);
    // Ticking spark fuse
    deadGfx.lineStyle(3, 0xf59e0b, 1);
    deadGfx.strokeLineShape(new Phaser.Geom.Line(35, 10, 44, 2));
    deadGfx.fillStyle(0xfef08a, 1);
    deadGfx.fillCircle(46, 2, 5);
    deadGfx.generateTexture('obs_assignmentDeadline', 70, 72);
    deadGfx.destroy();

    // 8. Attendance Shortage (<75% Barred Warning Notice)
    const attGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Clipboard
    attGfx.fillStyle(0x78350f, 1);
    attGfx.fillRoundedRect(8, 6, 50, 64, 4);
    attGfx.fillStyle(0xffedd5, 1);
    attGfx.fillRoundedRect(12, 14, 42, 52, 2);
    // Warning yellow hazard stripes
    attGfx.fillStyle(0xf59e0b, 1);
    attGfx.fillRect(16, 20, 34, 8);
    attGfx.fillStyle(0x000000, 1);
    attGfx.fillRect(22, 20, 4, 8);
    attGfx.fillRect(32, 20, 4, 8);
    // Red No-Entry Circle / Strikethrough
    attGfx.lineStyle(4, 0xdc2626, 1);
    attGfx.strokeCircle(33, 46, 14);
    attGfx.strokeLineShape(new Phaser.Geom.Line(23, 36, 43, 56));
    attGfx.generateTexture('obs_attendanceShortage', 66, 75);
    attGfx.destroy();
  }

  private generateCollectibleTextures(): void {
    // 1. Fuel (Campus Chai Thermos / Coffee Cup)
    const fuelGfx = this.make.graphics({ x: 0, y: 0 }, false);
    fuelGfx.fillStyle(0xef4444, 1);
    fuelGfx.fillRoundedRect(8, 10, 26, 30, 4);
    // Thermos Cap
    fuelGfx.fillStyle(0x1e293b, 1);
    fuelGfx.fillRoundedRect(12, 4, 18, 8, 2);
    // Steaming coffee vapor
    fuelGfx.lineStyle(2, 0xffedd5, 0.8);
    fuelGfx.strokeLineShape(new Phaser.Geom.Line(16, 2, 19, -2));
    fuelGfx.strokeLineShape(new Phaser.Geom.Line(24, 2, 27, -2));
    // Chai cup badge
    fuelGfx.fillStyle(0xfacc15, 1);
    fuelGfx.fillCircle(21, 24, 7);
    fuelGfx.fillStyle(0x78350f, 1);
    fuelGfx.fillCircle(21, 24, 4);
    fuelGfx.generateTexture('col_fuel', 42, 45);
    fuelGfx.destroy();

    // 2. Coin (Tuition Coin)
    const coinGfx = this.make.graphics({ x: 0, y: 0 }, false);
    coinGfx.fillStyle(0xeab308, 1);
    coinGfx.fillCircle(18, 18, 16);
    coinGfx.lineStyle(3, 0xfef08a, 1);
    coinGfx.strokeCircle(18, 18, 14);
    // University Star
    coinGfx.fillStyle(0xb45309, 1);
    coinGfx.fillCircle(18, 18, 6);
    coinGfx.generateTexture('col_coin', 36, 36);
    coinGfx.destroy();

    // 3. Class Test
    const ctGfx = this.make.graphics({ x: 0, y: 0 }, false);
    ctGfx.fillStyle(0x38bdf8, 1);
    ctGfx.fillRoundedRect(4, 4, 28, 34, 4);
    ctGfx.lineStyle(2, 0xffffff, 1);
    ctGfx.strokeRoundedRect(4, 4, 28, 34, 4);
    // Blue checkmark
    ctGfx.lineStyle(3, 0xffffff, 1);
    ctGfx.strokeLineShape(new Phaser.Geom.Line(10, 22, 16, 28));
    ctGfx.strokeLineShape(new Phaser.Geom.Line(16, 28, 26, 14));
    ctGfx.generateTexture('col_classTest', 36, 42);
    ctGfx.destroy();

    // 4. Assignment
    const asgnGfx = this.make.graphics({ x: 0, y: 0 }, false);
    asgnGfx.fillStyle(0xa855f7, 1);
    asgnGfx.fillRoundedRect(4, 4, 30, 36, 4);
    asgnGfx.fillStyle(0xf3e8ff, 1);
    asgnGfx.fillRoundedRect(8, 8, 22, 28, 2);
    // Green ribbon
    asgnGfx.fillStyle(0x10b981, 1);
    asgnGfx.fillRect(16, 4, 6, 36);
    asgnGfx.generateTexture('col_assignment', 38, 44);
    asgnGfx.destroy();

    // 5. Quiz
    const quizGfx = this.make.graphics({ x: 0, y: 0 }, false);
    quizGfx.fillStyle(0xf59e0b, 1);
    quizGfx.fillCircle(19, 19, 16);
    quizGfx.lineStyle(3, 0xfffbeb, 1);
    quizGfx.strokeCircle(19, 19, 14);
    // Question mark
    quizGfx.fillStyle(0xffffff, 1);
    quizGfx.fillCircle(19, 24, 2.5);
    quizGfx.lineStyle(3, 0xffffff, 1);
    quizGfx.beginPath();
    quizGfx.arc(19, 14, 5, -0.8 * Math.PI, 0.2 * Math.PI, false);
    quizGfx.lineTo(19, 20);
    quizGfx.strokePath();
    quizGfx.generateTexture('col_quiz', 38, 38);
    quizGfx.destroy();

    // 6. Midterm
    const midGfx = this.make.graphics({ x: 0, y: 0 }, false);
    midGfx.fillStyle(0xec4899, 1);
    midGfx.fillRoundedRect(4, 4, 34, 40, 5);
    midGfx.fillStyle(0xfdf2f8, 1);
    midGfx.fillRoundedRect(7, 7, 28, 34, 3);
    // Golden Bookmark Ribbon
    midGfx.fillStyle(0xf59e0b, 1);
    midGfx.fillRect(22, 2, 6, 20);
    midGfx.generateTexture('col_midterm', 42, 48);
    midGfx.destroy();

    // 7. Final Exam
    const finGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Golden bound book
    finGfx.fillStyle(0xeab308, 1);
    finGfx.fillRoundedRect(4, 4, 40, 46, 6);
    finGfx.lineStyle(3, 0xfef08a, 1);
    finGfx.strokeRoundedRect(4, 4, 40, 46, 6);
    // Laurel crown in gold
    finGfx.lineStyle(2, 0x78350f, 1);
    finGfx.strokeCircle(24, 26, 10);
    finGfx.fillStyle(0x78350f, 1);
    finGfx.fillCircle(24, 26, 4);
    finGfx.generateTexture('col_finalExam', 48, 54);
    finGfx.destroy();
  }

  private generateFxTextures(): void {
    // 1. Weapon Bullet / Laser Projectile
    const bulletGfx = this.make.graphics({ x: 0, y: 0 }, false);
    bulletGfx.fillStyle(0x38bdf8, 1);
    bulletGfx.fillRoundedRect(0, 2, 22, 6, 3);
    bulletGfx.fillStyle(0xffffff, 1);
    bulletGfx.fillRect(4, 3, 14, 4);
    bulletGfx.generateTexture('proj_laser', 24, 10);
    bulletGfx.destroy();

    // 2. Generic Particle Sparkle
    const sparkGfx = this.make.graphics({ x: 0, y: 0 }, false);
    sparkGfx.fillStyle(0xffffff, 1);
    sparkGfx.fillCircle(6, 6, 6);
    sparkGfx.generateTexture('fx_spark', 12, 12);
    sparkGfx.destroy();

    // 3. Smoke Puff
    const smokeGfx = this.make.graphics({ x: 0, y: 0 }, false);
    smokeGfx.fillStyle(0x94a3b8, 0.7);
    smokeGfx.fillCircle(10, 10, 10);
    smokeGfx.generateTexture('fx_smoke', 20, 20);
    smokeGfx.destroy();

    // 4. Boost / Turbo Flame Exhaust
    const flameGfx = this.make.graphics({ x: 0, y: 0 }, false);
    flameGfx.fillStyle(0x3b82f6, 1); // Blue flame core
    flameGfx.beginPath();
    flameGfx.moveTo(0, 10);
    flameGfx.lineTo(30, 2);
    flameGfx.lineTo(40, 10);
    flameGfx.lineTo(30, 18);
    flameGfx.closePath();
    flameGfx.fillPath();
    flameGfx.fillStyle(0x60a5fa, 1);
    flameGfx.fillCircle(12, 10, 6);
    flameGfx.generateTexture('fx_turbo_flame', 42, 20);
    flameGfx.destroy();

    // 5. Checkered Finish Line Banner Arch
    const finishGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Two steel flag poles
    finishGfx.fillStyle(0x334155, 1);
    finishGfx.fillRect(4, 0, 8, 180);
    finishGfx.fillRect(118, 0, 8, 180);
    // Checkered Banner
    const squareSize = 10;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 11; col++) {
        finishGfx.fillStyle((row + col) % 2 === 0 ? 0x000000 : 0xffffff, 1);
        finishGfx.fillRect(12 + col * squareSize, 20 + row * squareSize, squareSize, squareSize);
      }
    }
    // Graduation Cap on Top
    finishGfx.fillStyle(0x0f5132, 1);
    finishGfx.fillRoundedRect(25, 0, 80, 18, 4);
    finishGfx.fillStyle(0xe6a100, 1);
    finishGfx.fillRect(35, 14, 60, 4);
    finishGfx.generateTexture('finish_line_arch', 130, 180);
    finishGfx.destroy();
  }

  private generateCampusDecorTextures(): void {
    // 1. Campus Tree
    const treeGfx = this.make.graphics({ x: 0, y: 0 }, false);
    // Trunk
    treeGfx.fillStyle(0x78350f, 1);
    treeGfx.fillRect(25, 60, 14, 45);
    // Lush Foliage
    treeGfx.fillStyle(0x166534, 0.95);
    treeGfx.fillCircle(32, 40, 26);
    treeGfx.fillCircle(18, 30, 20);
    treeGfx.fillCircle(46, 30, 20);
    treeGfx.fillStyle(0x22c55e, 0.9);
    treeGfx.fillCircle(32, 25, 18);
    treeGfx.generateTexture('bg_campus_tree', 68, 110);
    treeGfx.destroy();

    // 2. KYAU University Gate / Building Silhouette
    const bldgGfx = this.make.graphics({ x: 0, y: 0 }, false);
    bldgGfx.fillStyle(0x0f5132, 0.45); // Silhouette
    bldgGfx.fillRect(10, 50, 140, 130);
    // Clock Tower / Minaret Dome
    bldgGfx.fillRect(60, 15, 40, 45);
    bldgGfx.beginPath();
    bldgGfx.arc(80, 15, 20, Math.PI, 0, false);
    bldgGfx.fillPath();
    // Clock
    bldgGfx.fillStyle(0xffffff, 0.6);
    bldgGfx.fillCircle(80, 35, 10);
    // Pillars
    bldgGfx.fillStyle(0x0b2e1f, 0.55);
    bldgGfx.fillRect(20, 80, 16, 100);
    bldgGfx.fillRect(50, 80, 16, 100);
    bldgGfx.fillRect(94, 80, 16, 100);
    bldgGfx.fillRect(124, 80, 16, 100);
    bldgGfx.generateTexture('bg_university_bldg', 160, 180);
    bldgGfx.destroy();

    // 3. Fluffy Cloud
    const cloudGfx = this.make.graphics({ x: 0, y: 0 }, false);
    cloudGfx.fillStyle(0xffffff, 0.75);
    cloudGfx.fillCircle(30, 30, 22);
    cloudGfx.fillCircle(55, 22, 26);
    cloudGfx.fillCircle(80, 28, 22);
    cloudGfx.fillRoundedRect(15, 30, 80, 20, 10);
    cloudGfx.generateTexture('bg_cloud', 110, 60);
    cloudGfx.destroy();
  }
}

