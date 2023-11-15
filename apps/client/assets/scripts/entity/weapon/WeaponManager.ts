import { Node, UITransform, Vec2, _decorator } from 'cc';
import { IActor, InputTypeEnum } from '../../common';
import { EntityManager } from '../../base/EntityManager';
import { EntityStateEnum, EventEnum } from '../../enum';
import { WeaponStateMachine } from './WeaponStateMachine';
import EventManager from '../../global/EventManager';
import DataManager from '../../global/DataManager';
const { ccclass } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
  private body!: Node;
  private anchor!: Node;
  private point!: Node;
  private owner: number = -1;

  init(data: IActor) {
    this.owner = data.id;
    this.body = this.node.getChildByName('Body')!;
    this.anchor = this.body.getChildByName('Anchor')!;
    this.point = this.anchor.getChildByName('Point')!;

    this.fsm = this.body.addComponent(WeaponStateMachine)!;
    this.fsm.init(data.weaponType);

    this.state = EntityStateEnum.Idle;

    EventManager.instance.on(EventEnum.WeaponShoot, this.handleWeaponShoot, this);
  }

  onDestroy() {
    super.onDestroy?.();
    EventManager.instance.off(EventEnum.WeaponShoot, this.handleWeaponShoot, this);
  }

  handleWeaponShoot() {
    const pointWorldPos = this.point.getWorldPosition();
    const pointStagePos = DataManager.instance.stage
      .getComponent(UITransform)!
      .convertToNodeSpaceAR(pointWorldPos);
    const anchorWorldPos = this.anchor.getWorldPosition();
    const direction = new Vec2(
      pointWorldPos.x - anchorWorldPos.x,
      pointWorldPos.y - anchorWorldPos.y
    ).normalize();

    DataManager.instance.applyInput({
      owner: this.owner,
      type: InputTypeEnum.WeaponShoot,
      position: pointStagePos,
      direction,
    });
  }
}
