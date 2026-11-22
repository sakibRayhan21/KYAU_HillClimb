// ============================================================================
// বাধা বা অবস্ট্যাকল এন্টিটি (Obstacle Entity)
// বিশ্ববিদ্যালয়ে শিক্ষার্থীদের চলার পথের প্রতিকূলতা (আলসেমি, প্রেম, রিটেক,
// রাত ১১:৫৯ ডেডলাইন, উপস্থিতি সংকট, ওভারথিঙ্কিং ও বস কোর্স শিক্ষক)।
// এটি ফিজিক্স বডি, ওভারহেড এইচপি বার, ড্যামেজ নেওয়া এবং বিস্ফোরণ ইফেক্ট পরিচালনা করে।
// ============================================================================

import * as Phaser from 'phaser';
import { ObstacleConfig, ObstacleType } from '../types/game';
import { OBSTACLES_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

export class Obstacle {
  public scene: Phaser.Scene; // ফেজার সিন রেফারেন্স
  public sprite: Phaser.Physics.Matter.Sprite; // বাধার ফিজিক্স স্প্রাইট
  public config: ObstacleConfig; // বাধার কনফিগারেশন
  public type: ObstacleType; // বাধার প্রকারভেদ
  public currentHp: number; // বর্তমান স্বাস্থ্য (HP)
  public maxHp: number; // সর্বোচ্চ স্বাস্থ্য
  public isDestroyed: boolean = false; // ধ্বংস হয়েছে কিনা

  private hpBarBg: Phaser.GameObjects.Rectangle; // এইচপি বারের ব্যাকগ্রাউন্ড
  private hpBarFill: Phaser.GameObjects.Rectangle; // বর্তমান এইচপি নির্দেশক বার
  private nameText: Phaser.GameObjects.Text; // বাধার নামের লেবেল টেক্সট
  private animTween?: Phaser.Tweens.Tween; // বাধার মৃদু দোলাচলের অ্যানিমেশন

  constructor(scene: Phaser.Scene, x: number, y: number, type: ObstacleType) {
    this.scene = scene;
    this.type = type;
    this.config = OBSTACLES_CONFIG[type];
    this.maxHp = this.config.maxHp;
    this.currentHp = this.maxHp;

    const textureKey = `obs_${type}`;

    // ম্যাটার ফিজিক্স রিজিড বডি তৈরি
    this.sprite = scene.matter.add.sprite(x, y, textureKey, undefined, {
      shape: {
        type: 'rectangle',
        width: this.config.width,
        height: this.config.height,
      },
      density: this.config.boss ? 0.2 : 0.05, // বস অবস্ট্যাকলের ঘনত্ব বেশি
      friction: 0.8,
      restitution: 0.2,
      label: 'obstacle',
    });

    (this.sprite as any).obstacleInstance = this;

    // মাথার ওপর এইচপি বার (Overhead HP Bar)
    const barWidth = this.config.boss ? 80 : 50;
    const barHeight = this.config.boss ? 8 : 5;
    const barYOffset = this.config.height / 2 + 15;

    this.hpBarBg = scene.add.rectangle(x, y - barYOffset, barWidth, barHeight, 0x1e293b);
    this.hpBarBg.setDepth(15);

    this.hpBarFill = scene.add.rectangle(x, y - barYOffset, barWidth, barHeight, this.config.boss ? 0xef4444 : 0x22c55e);
    this.hpBarFill.setDepth(16);

    // বাধার নাম প্রদর্শনকারী টেক্সট
    this.nameText = scene.add.text(x, y - barYOffset - 12, this.config.name, {
      fontFamily: 'Inter, sans-serif',
      fontSize: this.config.boss ? '12px' : '10px',
      color: this.config.boss ? '#f87171' : '#ffffff',
      fontStyle: this.config.boss ? 'bold' : 'normal',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.nameText.setOrigin(0.5, 1);
    this.nameText.setDepth(16);

    // মৃদু স্পন্দন/শ্বাস-প্রশ্বাসের মতো অ্যানিমেশন (Breathing Tween)
    this.animTween = scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.05,
      scaleY: 0.95,
      duration: 600 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.sprite.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.cleanupTweens();
    });
  }

  /**
   * অ্যানিমেশন টুইন নিরাপদভাবে অপসারণ
   */
  private cleanupTweens(): void {
    if (this.animTween) {
      this.animTween.stop();
      this.animTween.remove();
      this.animTween = undefined;
    }
    if (this.scene?.tweens && this.sprite) {
      this.scene.tweens.killTweensOf(this.sprite);
    }
  }

  /**
   * গুলির আঘাতে ক্ষতি (Damage) পাওয়ার মেথড
   */
  public takeDamage(damage: number): { destroyed: boolean; score: number; coins: number } {
    if (this.isDestroyed) return { destroyed: false, score: 0, coins: 0 };

    this.currentHp -= damage;
    this.updateHpBar();

    // আঘাত লাগলে সাদা ফ্ল্যাশ ইফেক্ট
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (!this.isDestroyed && this.sprite.active) {
        this.sprite.clearTint();
      }
    });

    // স্বাস্থ্য শূন্য হলে বাধা ধ্বংস ও বিস্ফোরণ
    if (this.currentHp <= 0) {
      this.explode();
      return {
        destroyed: true,
        score: this.config.scoreReward,
        coins: this.config.coinsReward,
      };
    }

    return { destroyed: false, score: 0, coins: 0 };
  }

  /**
   * এইচপি বার আপডেট ও রঙের রূপান্তর (সবুজ -> হলুদ -> লাল)
   */
  private updateHpBar(): void {
    const ratio = Math.max(0, this.currentHp / this.maxHp);
    const barWidth = this.config.boss ? 80 : 50;
    this.hpBarFill.width = barWidth * ratio;

    if (ratio < 0.3) {
      this.hpBarFill.setFillStyle(0xdc2626); // ৩০% এর নিচে লাল রঙ
    } else if (ratio < 0.6) {
      this.hpBarFill.setFillStyle(0xf59e0b); // ৬০% এর নিচে হলুদ রঙ
    }
  }

  /**
   * ফ্রেম আপডেটে এইচপি বার ও টেক্সট বাধার সাথে একই অবস্থানে রাখা
   */
  public update(): void {
    if (this.isDestroyed || !this.sprite.active) return;

    const x = this.sprite.x;
    const y = this.sprite.y;
    const barYOffset = this.config.height / 2 + 15;

    this.hpBarBg.setPosition(x, y - barYOffset);
    this.hpBarFill.setPosition(x - (this.hpBarBg.width - this.hpBarFill.width) / 2, y - barYOffset);
    this.nameText.setPosition(x, y - barYOffset - 4);
  }

  /**
   * বাধা ধ্বংসের সময় বিস্ফোরণ অ্যানিমেশন ও পুরস্কার টেক্সট ডিসপ্লে
   */
  private explode(): void {
    this.isDestroyed = true;
    soundService.playExplosion(this.config.boss);

    const x = this.sprite.x;
    const y = this.sprite.y;

    // প্রাপ্ত এক্সপি ও কয়েন পুরষ্কারের ভাসমান টেক্সট
    const rewardText = this.scene.add.text(x, y - 20, `+${this.config.scoreReward} XP\n+${this.config.coinsReward} COINS`, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      color: '#facc15',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    });
    rewardText.setOrigin(0.5);
    rewardText.setDepth(20);

    this.scene.tweens.add({
      targets: rewardText,
      y: y - 70,
      alpha: 0,
      duration: 1200,
      onComplete: () => rewardText.destroy(),
    });

    // কণা বিস্ফোরণ ইফেক্ট (Particle explosion)
    for (let i = 0; i < (this.config.boss ? 24 : 12); i++) {
      const spark = this.scene.add.sprite(x, y, 'fx_spark');
      spark.setTint(this.config.color);
      spark.setDepth(18);

      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.scene.tweens.add({
        targets: spark,
        x: x + vx * 0.8,
        y: y + vy * 0.8,
        scale: 0.2,
        alpha: 0,
        duration: 500 + Math.random() * 300,
        onComplete: () => spark.destroy(),
      });
    }

    this.destroy();
  }

  /**
   * মেমোরি থেকে বাধার স্প্রাইট ও এলিমেন্টসমূহ ধ্বংস করা
   */
  public destroy(): void {
    if (this.isDestroyed && !this.sprite?.active) return;
    this.isDestroyed = true;

    this.cleanupTweens();

    if (this.hpBarBg?.active) this.hpBarBg.destroy();
    if (this.hpBarFill?.active) this.hpBarFill.destroy();
    if (this.nameText?.active) this.nameText.destroy();
    if (this.sprite?.active) {
      this.sprite.destroy();
    }
  }
}
