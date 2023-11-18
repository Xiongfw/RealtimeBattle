import { Node, Prefab, SpriteFrame, view } from 'cc';
import Singleton from '../base/Singleton';
import { EntityTypeEnum, IBullet, IClientInput, IState, InputTypeEnum } from '../common';
import { JoyStickManager } from '../ui/JoyStickManager';
import { ActorManager } from '../entity/actor/ActorManager';
import { BulletManager } from '../entity/bullet/BulletManager';
import EventManager from './EventManager';
import { EventEnum } from '../enum';

// 人物移动速度
const ACTOR_SPEED = 100;
// 子弹飞行速度
const BULLET_SPEED = 600;

const ACTOR_RADIUS = 50;
const BULLET_RADIUS = 10;

// 子弹伤害
const BULLET_DAMAGE = 5;

const SCREEN_WIDTH = view.getVisibleSize().width;
const SCREEN_HEIGHT = view.getVisibleSize().height;

export default class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet2,
        hp: 100,
        position: {
          x: -150,
          y: -150,
        },
        direction: {
          x: 1,
          y: 0,
        },
      },
      {
        id: 2,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet1,
        hp: 100,
        position: {
          x: 150,
          y: 150,
        },
        direction: {
          x: -1,
          y: 0,
        },
      },
    ],
    bullets: [],
    nextBulletId: 0,
  };
  stage!: Node;
  joyStick: JoyStickManager | null = null;
  textureMap = new Map<string, SpriteFrame[]>();
  prefabMap = new Map<string, Prefab>();
  actorMap = new Map<number, ActorManager>();
  bulletMap = new Map<number, BulletManager>();
  myPlayerId = 1;
  // 标识每一个 input
  frameId = 1;

  applyInput(input: IClientInput) {
    switch (input.type) {
      case InputTypeEnum.ActorMove: {
        const {
          id,
          direction: { x, y },
          dt,
        } = input;
        const actor = this.state.actors.find((i) => i.id === id);
        if (!actor) {
          return;
        }
        actor.direction.x = x;
        actor.direction.y = y;

        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
        break;
      }
      case InputTypeEnum.WeaponShoot: {
        const { owner, direction, position } = input;
        const bullet: IBullet = {
          id: this.state.nextBulletId++,
          owner,
          direction,
          position,
          type: this.actorMap.get(owner)!.bulletType,
        };
        this.state.bullets.push(bullet);
        break;
      }
      case InputTypeEnum.TimePast: {
        const { dt } = input;
        const { bullets, actors } = this.state;

        for (let i = 0; i < bullets.length; i++) {
          const bullet = bullets[i];

          for (let j = 0; j < actors.length; j++) {
            const actor = actors[j];
            // 斜边长度是否小于 人物和子弹的半径
            if (
              (actor.position.x - bullet.position.x) ** 2 +
                (actor.position.y - bullet.position.y) ** 2 <
              (ACTOR_RADIUS + BULLET_RADIUS) ** 2
            ) {
              actor.hp -= BULLET_DAMAGE;
              EventManager.instance.emit(EventEnum.ExplosionBorn, bullet.id, {
                x: (actor.position.x + bullet.position.x) / 2,
                y: (actor.position.y + bullet.position.y) / 2,
              });
              bullets.splice(i, 1);
              break;
            }
          }

          if (
            Math.abs(bullet.position.x) > SCREEN_WIDTH / 2 ||
            Math.abs(bullet.position.y) > SCREEN_HEIGHT / 2
          ) {
            EventManager.instance.emit(EventEnum.ExplosionBorn, bullet.id, {
              x: bullet.position.x,
              y: bullet.position.y,
            });
            bullets.splice(i, 1);
          }
        }

        for (const bullet of bullets) {
          bullet.position.x += bullet.direction.x * dt * BULLET_SPEED;
          bullet.position.y += bullet.direction.y * dt * BULLET_SPEED;
        }
      }
    }
  }
}
