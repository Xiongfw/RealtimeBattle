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
        position: {
          x: 0,
          y: 0,
        },
        direction: {
          x: 1,
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
        const { bullets } = this.state;

        for (let i = 0; i < bullets.length; i++) {
          const bullet = bullets[i];
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
