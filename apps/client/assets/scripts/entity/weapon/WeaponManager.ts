import { Node, _decorator } from 'cc';
import { IActor } from '../../common';
import { EntityManager } from '../../base/EntityManager';
import { EntityStateEnum } from '../../enum';
import { WeaponStateMachine } from './WeaponStateMachine';
const { ccclass } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
  private body!: Node;
  private anchor!: Node;
  private point!: Node;

  init(data: IActor) {
    this.body = this.node.getChildByName('Body')!;
    this.anchor = this.body.getChildByName('Anchor')!;
    this.point = this.anchor.getChildByName('Point')!;

    this.fsm = this.body.addComponent(WeaponStateMachine)!;
    this.fsm.init(data.weaponType);

    this.state = EntityStateEnum.Idle;
  }
}
