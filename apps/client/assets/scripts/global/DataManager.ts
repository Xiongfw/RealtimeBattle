import { Node, Prefab, SpriteFrame } from 'cc';
import Singleton from '../base/Singleton';
import { EntityTypeEnum, IBullet, IClientInput, IState, InputTypeEnum } from '../common';
import { JoyStickManager } from '../ui/JoyStickManager';
import { ActorManager } from '../entity/actor/ActorManager';

export const ACTOR_SPEED = 100;

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
        bulletType: EntityTypeEnum.Bullet1,
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
      }
    }
  }
}
