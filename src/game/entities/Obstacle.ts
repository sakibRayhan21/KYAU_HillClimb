import * as Phaser from 'phaser';
import { ObstacleConfig, ObstacleType } from '../types/game';
import { OBSTACLES_CONFIG } from '../config/gameConfig';
import { soundService } from '../services/soundService';

export class Obstacle {
  public scene: Phaser.Scene;
  public sprite: Phaser.Physics.Matter.Sprite;
  public config: ObstacleConfig;
  public type: ObstacleType;
  public currentHp: number;
  public maxHp: number;
  public isDestroyed: boolean = false;

  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text;
  private animTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ObstacleType) {
    this.scene = scene;
    this.type = type;
    this.config = OBSTACLES_CONFIG[type];
    this.maxHp = this.config.maxHp;
    this.currentHp = this.maxHp;

    const textureKey = `obs_${type}`;

    // Matter physics body for obstacle
    this.sprite = scene.matter.add.sprite(x, y, textureKey, undefined, {
      shape: {
        type: 'rectangle',
        width: this.config.width,
        height: this.config.height,
      },
      density: this.config.boss ? 0.2 : 0.05,
      friction: 0.8,
      restitution: 0.2,
      label: 'obstacle',
    });

    (this.sprite as any).obstacleInstance = this;

    // Overhead HP Bar
    const barWidth = this.config.boss ? 80 : 50;
    const barHeight = this.config.boss ? 8 : 5;
    const barYOffset = this.config.height / 2 + 15;

    this.hpBarBg = scene.add.rectangle(x, y - barYOffset, barWidth, barHeight, 0x1e293b);
    this.hpBarBg.setDepth(15);

    this.hpBarFill = scene.add.rectangle(x, y - barYOffset, barWidth, barHeight, this.config.boss ? 0xef4444 : 0x22c55e);
    this.hpBarFill.setDepth(16);

    // Label
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

    // Subtle bobbing / breathing animation
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

  public takeDamage(damage: number): { destroyed: boolean; score: number; coins: number } {
    if (this.isDestroyed) return { destroyed: false, score: 0, coins: 0 };

    this.currentHp -= damage;
    this.updateHpBar();

    // Flash hit effect
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (!this.isDestroyed && this.sprite.active) {
        this.sprite.clearTint();
      }
    });

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

  private updateHpBar(): void {
    const ratio = Math.max(0, this.currentHp / this.maxHp);
    const barWidth = this.config.boss ? 80 : 50;
    this.hpBarFill.width = barWidth * ratio;

    if (ratio < 0.3) {
      this.hpBarFill.setFillStyle(0xdc2626); // Red
    } else if (ratio < 0.6) {
      this.hpBarFill.setFillStyle(0xf59e0b); // Amber
    }
  }

  public update(): void {
    if (this.isDestroyed || !this.sprite.active) return;

    const x = this.sprite.x;
    const y = this.sprite.y;
    const barYOffset = this.config.height / 2 + 15;

    this.hpBarBg.setPosition(x, y - barYOffset);
    this.hpBarFill.setPosition(x - (this.hpBarBg.width - this.hpBarFill.width) / 2, y - barYOffset);
    this.nameText.setPosition(x, y - barYOffset - 4);
  }

  private explode(): void {
    this.isDestroyed = true;
    soundService.playExplosion(this.config.boss);

    const x = this.sprite.x;
    const y = this.sprite.y;

    // Floating destruction text
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

    // Particle explosion
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

