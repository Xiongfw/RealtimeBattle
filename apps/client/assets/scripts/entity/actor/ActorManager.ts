import { _decorator, instantiate, toDegree, toRadian } from 'cc';
import DataManager from '../../global/DataManager';
import { EntityTypeEnum, IActor, InputTypeEnum } from '../../common';
import { EntityManager } from '../../base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum } from '../../enum';
import { WeaponManager } from '../weapon/WeaponManager';
const { ccclass } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  private weapon!: WeaponManager;
  bulletType!: EntityTypeEnum;

  init(data: IActor) {
    this.bulletType = data.bulletType;

    this.fsm = this.addComponent(ActorStateMachine)!;
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;

    const prefab = DataManager.instance.prefabMap.get(EntityTypeEnum.Weapon1);
    if (prefab) {
      const weapon = instantiate(prefab);
      weapon.setParent(this.node);
      const weaponMgr = weapon.addComponent(WeaponManager);
      weaponMgr.init(data);

      this.weapon = weaponMgr;
    }
  }

  tick(dt: number) {
    if (DataManager.instance.joyStick?.input.length()) {
      const { x, y } = DataManager.instance.joyStick.input;
      DataManager.instance.applyInput({
        id: 1,
        type: InputTypeEnum.ActorMove,
        direction: { x, y },
        dt: dt,
      });
      this.state = EntityStateEnum.Run;
    } else {
      this.state = EntityStateEnum.Idle;
    }
  }

  render(data: IActor) {
    const { direction, position } = data;
    this.node.setPosition(position.x, position.y);
    this.node.setScale(direction.x < 0 ? -1 : 1, 1, 1);

    // 斜边
    const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    // sin& = y / side
    const rad = Math.asin(direction.y / side);

    this.weapon.node.setRotationFromEuler(0, 0, toDegree(rad));
  }
}
