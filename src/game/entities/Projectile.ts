import * as Phaser from 'phaser';
import { WEAPON_CONFIG } from '../config/gameConfig';
import { Obstacle } from './Obstacle';

export class Projectile {
  public scene: Phaser.Scene;
  public sprite: Phaser.Physics.Matter.Sprite;
  public damage: number;
  public isDead: boolean = false;
  private lifeTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, angleRad: number, damage: number) {
    this.scene = scene;
    this.damage = damage;

    const speed = WEAPON_CONFIG.bulletSpeed;
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

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

    // Apply linear velocity
    scene.matter.body.setVelocity(this.sprite.body as MatterJS.BodyType, { x: vx, y: vy });

    // Auto-destroy after lifespan
    this.lifeTimer = scene.time.delayedCall(WEAPON_CONFIG.bulletLifespanMs, () => {
      this.destroy();
    });
  }

  public hitObstacle(obstacle: Obstacle): { destroyed: boolean; score: number; coins: number } {
    if (this.isDead) return { destroyed: false, score: 0, coins: 0 };
    this.isDead = true;

    // Impact spark
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

    const res = obstacle.takeDamage(this.damage);
    this.destroy();
    return res;
  }

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

