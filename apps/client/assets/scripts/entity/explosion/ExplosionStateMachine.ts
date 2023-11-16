import { _decorator, Animation } from 'cc';
import StateMachine, { getInitTriggerValue } from '../../base/StateMachine';
import { EntityStateEnum, ParamsNameEnum } from '../../enum';
import State from '../../base/State';
import { EntityTypeEnum } from '../../common';

const { ccclass } = _decorator;

@ccclass('ExplosionStateMachine')
export class ExplosionStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    this.type = type;
    this.animationComponent = this.addComponent(Animation)!;

    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      this.node.destroy();
    });
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(
      EntityStateEnum.Idle,
      new State(this, `${this.type}${EntityStateEnum.Idle}`)
    );
  }
}
