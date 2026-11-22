// ============================================================================
// কালেক্টিবল এন্টিটি (Collectible Entity)
// পাহাড়ি রাস্তায় কুড়িয়ে পাওয়ার আইটেমসমূহ (ফুয়েল ক্যান, টিউশন কয়েন, ক্লাস টেস্ট,
// কুইজ, অ্যাসাইনমেন্ট, মিডটার্ম এবং ফাইনাল পরীক্ষা)।
// এটি গ্লো অ্যানিমেশন, বব ফ্লোটিং, সাউন্ড ও কালেকশন ইফেক্ট হ্যান্ডেল করে।
// ============================================================================

import * as Phaser from 'phaser';
import { CollectibleType } from '../types/game';
import { ACADEMIC_COLLECTIBLES_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

export class Collectible {
  public scene: Phaser.Scene; // ফেজার সিন রেফারেন্স
  public sprite: Phaser.Physics.Matter.Sprite; // কালেক্টিবলের ম্যাটার.জেএস স্প্রাইট
  public type: CollectibleType; // আইটেমের প্রকারভেদ
  public isCollected: boolean = false; // ইতিমধ্যে সংগ্রহ করা হয়েছে কিনা
  public isDestroyed: boolean = false; // ধ্বংস বা মেমোরি থেকে মুছে ফেলা হয়েছে কিনা
  private glowCircle: Phaser.GameObjects.Arc; // পেছনের উজ্জ্বল পালসিং গ্লো সার্কেল
  private glowTween?: Phaser.Tweens.Tween; // গ্লো অ্যানিমেশন টুইন
  private bobTween?: Phaser.Tweens.Tween; // বাতাসে মৃদু দোলাচলের টুইন

  constructor(scene: Phaser.Scene, x: number, y: number, type: CollectibleType) {
    this.scene = scene;
    this.type = type;

    const textureKey = `col_${type}`;
    const cfg = ACADEMIC_COLLECTIBLES_CONFIG[type];

    // পেছনের উজ্জ্বল পালসিং আভা (Glow Circle)
    this.glowCircle = scene.add.circle(x, y, cfg.radius * 1.4, cfg.color, 0.35);
    this.glowCircle.setDepth(11);

    this.glowTween = scene.tweens.add({
      targets: this.glowCircle,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ম্যাটার ফিজিক্স সেন্সর বডি (গাড়িকে ধাক্কা দেবে না, স্পর্শ করলেই ট্রিগার হবে)
    this.sprite = scene.matter.add.sprite(x, y, textureKey, undefined, {
      isSensor: true,
      isStatic: true,
      label: 'collectible',
    });
    this.sprite.setDepth(12);

    (this.sprite as any).collectibleInstance = this;

    // বাতাসে মৃদু ভাসমান অ্যানিমেশন (Floating Bob Animation)
    this.bobTween = scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // গেম অবজেক্ট ডেস্ট্রয় হলে টুইনগুলো স্বয়ংক্রিয় ক্লিনআপ করা
    this.sprite.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.cleanupTweens();
    });
    this.glowCircle.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.cleanupTweens();
    });
  }

  /**
   * অ্যানিমেশন টুইন মেমোরি থেকে নিরাপদভাবে সরানো
   */
  private cleanupTweens(): void {
    if (this.bobTween) {
      this.bobTween.stop();
      this.bobTween.remove();
      this.bobTween = undefined;
    }
    if (this.glowTween) {
      this.glowTween.stop();
      this.glowTween.remove();
      this.glowTween = undefined;
    }
    if (this.scene?.tweens) {
      if (this.sprite) {
        this.scene.tweens.killTweensOf(this.sprite);
      }
      if (this.glowCircle) {
        this.scene.tweens.killTweensOf(this.glowCircle);
      }
    }
  }

  /**
   * গাড়ি দিয়ে স্পর্শ করার পর আইটেম সংগ্রহ করা
   */
  public collect(): { type: CollectibleType; power: number; fuel: number; coin: number } {
    if (this.isCollected || this.isDestroyed) return { type: this.type, power: 0, fuel: 0, coin: 0 };
    this.isCollected = true;

    const cfg = ACADEMIC_COLLECTIBLES_CONFIG[this.type];
    const power = cfg.academicPower || 0;
    const fuel = cfg.fuelAmount || 0;
    const coin = cfg.coinAmount || 0;

    const x = this.sprite.x;
    const y = this.sprite.y;

    // সাউন্ড ইফেক্ট বাজানো
    if (this.type === 'fuel') {
      soundService.playFuelPickup();
    } else {
      soundService.playChime(this.type);
    }

    // ভেসে ওঠা পপআপ টেক্সট তৈরি
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

    // পপআপ টেক্সট উপরের দিকে ভেসে মিলিয়ে যাওয়ার অ্যানিমেশন
    this.scene.tweens.add({
      targets: popup,
      y: y - 60,
      scale: 1.2,
      alpha: 0,
      duration: 900,
      onComplete: () => popup.destroy(),
    });

    // স্পার্কল বা কণা ইফেক্ট (Particle Sparkles)
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

  /**
   * মেমোরি থেকে স্প্রাইট ও অবজেক্ট মুছে ফেলা
   */
  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.isCollected = true;

    this.cleanupTweens();

    if (this.glowCircle?.active) {
      this.glowCircle.destroy();
    }
    if (this.sprite?.active) {
      this.sprite.destroy();
    }
  }
}
