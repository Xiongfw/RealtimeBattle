import { _decorator, Component, toDegree, Vec2 } from 'cc';
import { EntityTypeEnum, IBullet, IVec2 } from '../../common';
import DataManager from '../../global/DataManager';
import EventManager from '../../global/EventManager';
import { EventEnum } from '../../enum';
import { ExplosionManager } from '../explosion/ExplosionManager';
import { ObjectPoolManager } from '../../global/ObjectPoolManager';
const { ccclass } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
  type!: EntityTypeEnum;
  id!: number;

  init(data: IBullet) {
    this.node.active = false;

    this.id = data.id;
    this.type = data.type;

    EventManager.instance.on(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
  }

  onDestroy() {
    EventManager.instance.off(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
  }

  handleExplosionBorn(id: number, { x, y }: IVec2) {
    if (this.id !== id) {
      return;
    }
    const explosion = ObjectPoolManager.instance.get(EntityTypeEnum.Explosion);
    if (explosion) {
      const explosionMgr =
        explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager);
      explosionMgr.init(EntityTypeEnum.Explosion, { x, y });

      DataManager.instance.bulletMap.delete(this.id);
      EventManager.instance.off(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
      ObjectPoolManager.instance.put(this.node);
    }
  }

  render(data: IBullet) {
    if (this.node.active === false) {
      this.node.active = true;
    }
    const { position, direction } = data;
    this.node.setPosition(position.x, position.y);
    const rad = new Vec2(1, 0).signAngle(new Vec2(direction.x, direction.y));
    this.node.setRotationFromEuler(0, 0, toDegree(rad));
  }
}
