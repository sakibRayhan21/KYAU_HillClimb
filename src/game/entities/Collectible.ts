import * as Phaser from 'phaser';
import { CollectibleType } from '../types/game';
import { ACADEMIC_COLLECTIBLES_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

export class Collectible {
  public scene: Phaser.Scene;
  public sprite: Phaser.Physics.Matter.Sprite;
  public type: CollectibleType;
  public isCollected: boolean = false;
  private glowCircle: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, type: CollectibleType) {
    this.scene = scene;
    this.type = type;

    const textureKey = `col_${type}`;
    const cfg = ACADEMIC_COLLECTIBLES_CONFIG[type];

    // Background pulsing glow
    this.glowCircle = scene.add.circle(x, y, cfg.radius * 1.4, cfg.color, 0.35);
    this.glowCircle.setDepth(11);

    scene.tweens.add({
      targets: this.glowCircle,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Sensor body in Matter physics (does not physically bump the car, triggers on overlap)
    this.sprite = scene.matter.add.sprite(x, y, textureKey, undefined, {
      isSensor: true,
      isStatic: true,
      label: 'collectible',
    });
    this.sprite.setDepth(12);

    (this.sprite as any).collectibleInstance = this;

    // Gentle floating bob
    scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public collect(): { type: CollectibleType; power: number; fuel: number; coin: number } {
    if (this.isCollected) return { type: this.type, power: 0, fuel: 0, coin: 0 };
    this.isCollected = true;

    const cfg = ACADEMIC_COLLECTIBLES_CONFIG[this.type];
    const power = cfg.academicPower || 0;
    const fuel = cfg.fuelAmount || 0;
    const coin = cfg.coinAmount || 0;

    const x = this.sprite.x;
    const y = this.sprite.y;

    // Audio & Feedback
    if (this.type === 'fuel') {
      soundService.playFuelPickup();
    } else {
      soundService.playChime(this.type);
    }

    // Popup text
    let label = `+${power} AP`;
    let color = '#38bdf8';
    if (this.type === 'fuel') {
      label = `+${fuel} FUEL ☕`;
      color = '#ef4444';
    } else if (this.type === 'coin') {
      label = `+${coin} COIN 🪙`;
      color = '#facc15';
    } else if (this.type === 'finalExam') {
      label = `+${power} FINAL EXAM! 🎓`;
      color = '#eab308';
    } else if (this.type === 'midterm') {
      label = `+${power} MIDTERM! 📚`;
      color = '#ec4899';
    }

    const popup = this.scene.add.text(x, y - 15, label, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3,
    });
    popup.setOrigin(0.5);
    popup.setDepth(25);

    this.scene.tweens.add({
      targets: popup,
      y: y - 60,
      scale: 1.2,
      alpha: 0,
      duration: 900,
      onComplete: () => popup.destroy(),
    });

    // Sparkles
    for (let i = 0; i < 6; i++) {
      const spark = this.scene.add.sprite(x, y, 'fx_spark');
      spark.setTint(cfg.color);
      spark.setDepth(20);

      const a = (i / 6) * Math.PI * 2;
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(a) * 35,
        y: y + Math.sin(a) * 35,
        scale: 0.1,
        alpha: 0,
        duration: 400,
        onComplete: () => spark.destroy(),
      });
    }

    this.destroy();

    return { type: this.type, power, fuel, coin };
  }

  public destroy(): void {
    this.isCollected = true;
    this.glowCircle.destroy();
    if (this.sprite.active) {
      this.sprite.destroy();
    }
  }
}

