// ============================================================================
// প্রজেক্টাইল বা বুলেট এন্টিটি (Projectile / Bullet Entity)
// গাড়ির সাইটেশন ব্লাস্টার কামান থেকে নিক্ষিপ্ত লেজার রশ্মি ও বুলেট।
// এটি গতিবেগ, দিক-অ্যাঙ্গেল, হিট ডিটেকশন ও বাধা ধ্বংসের লজিক পরিচালনা করে।
// ============================================================================

import * as Phaser from 'phaser';
import { WEAPON_CONFIG } from '../config/gameConfig';
import { Obstacle } from './Obstacle';

export class Projectile {
  public scene: Phaser.Scene; // ফেজার সিন রেফারেন্স
  public sprite: Phaser.Physics.Matter.Sprite; // বুলেটের ম্যাটার ফিজিক্স স্প্রাইট
  public damage: number; // বুলেটের আঘাত শক্তি
  public isDead: boolean = false; // বুলেটটি ধ্বংস বা লক্ষ্যভেদ করেছে কিনা
  private lifeTimer: Phaser.Time.TimerEvent; // নির্দিষ্ট সময় পর বুলেট স্বয়ংক্রিয়ভাবে মুছে যাওয়ার টাইমার

  constructor(scene: Phaser.Scene, x: number, y: number, angleRad: number, damage: number) {
    this.scene = scene;
    this.damage = damage;

    const speed = WEAPON_CONFIG.bulletSpeed;
    // কোণ অনুযায়ী x ও y অক্ষের ভেলোসিটি হিসাব
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

    // ম্যাটার ফিজিক্সে সেন্সর হিসেবে বুলেট যুক্ত করা
    this.sprite = scene.matter.add.sprite(x, y, 'proj_laser', undefined, {
      shape: { type: 'rectangle', width: 22, height: 8 },
      isSensor: true,
      label: 'projectile',
      frictionAir: 0,
    });
    this.sprite.setRotation(angleRad);
    this.sprite.setDepth(14);

    (this.sprite as any).projectileInstance = this;

    this.sprite.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.scene?.tweens && this.sprite) {
        this.scene.tweens.killTweensOf(this.sprite);
      }
    });

    // রৈখিক গতিবেগ প্রদান
    scene.matter.body.setVelocity(this.sprite.body as MatterJS.BodyType, { x: vx, y: vy });

    // আয়ুষ্কাল শেষ হলে নিজে থেকেই ধ্বংস হওয়া
    this.lifeTimer = scene.time.delayedCall(WEAPON_CONFIG.bulletLifespanMs, () => {
      this.destroy();
    });
  }

  /**
   * বাধার সাথে বুলেটের সংঘর্ষ হলে ক্ষতিসাধন ও স্পার্ক তৈরি
   */
  public hitObstacle(obstacle: Obstacle): { destroyed: boolean; score: number; coins: number } {
    if (this.isDead) return { destroyed: false, score: 0, coins: 0 };
    this.isDead = true;

    // আঘাতের বিন্দুতে স্পার্কল কণা তৈরি
    const x = this.sprite.x;
    const y = this.sprite.y;
    for (let i = 0; i < 4; i++) {
      const spark = this.scene.add.sprite(x, y, 'fx_spark');
      spark.setTint(0x38bdf8);
      spark.setDepth(18);
      const a = Math.random() * Math.PI * 2;
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(a) * 20,
        y: y + Math.sin(a) * 20,
        alpha: 0,
        duration: 250,
        onComplete: () => spark.destroy(),
      });
    }

    // বাধাকে আঘাত দিয়ে বুলেট ধ্বংস করা
    const res = obstacle.takeDamage(this.damage);
    this.destroy();
    return res;
  }

  /**
   * মেমোরি ও স্ক্রিন থেকে বুলেট নিরাপদভাবে মুছে ফেলা
   */
  public destroy(): void {
    if (this.isDead && !this.sprite?.active) return;
    this.isDead = true;
    if (this.lifeTimer) {
      this.lifeTimer.remove();
    }
    if (this.scene?.tweens && this.sprite) {
      this.scene.tweens.killTweensOf(this.sprite);
    }
    if (this.sprite?.active) {
      this.sprite.destroy();
    }
  }
}
