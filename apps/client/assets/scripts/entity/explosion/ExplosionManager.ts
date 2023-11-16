import { IVec2, _decorator } from 'cc';
import { EntityTypeEnum } from '../../common';
import { EntityManager } from '../../base/EntityManager';
import { EntityStateEnum } from '../../enum';
import { ExplosionStateMachine } from './ExplosionStateMachine';
const { ccclass } = _decorator;

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager {
  type!: EntityTypeEnum;

  init(type: EntityTypeEnum, { x, y }: IVec2) {
    this.type = type;

    this.fsm = this.addComponent(ExplosionStateMachine)!;
    this.fsm.init(type);

    this.node.setPosition(x, y);

    this.state = EntityStateEnum.Idle;
  }
}
