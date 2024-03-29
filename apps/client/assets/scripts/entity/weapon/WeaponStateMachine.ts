import { _decorator, Animation, AnimationClip } from 'cc';
import StateMachine, { getInitTriggerValue } from '../../base/StateMachine';
import { EntityStateEnum, ParamsNameEnum } from '../../enum';
import State from '../../base/State';
import { EntityTypeEnum } from '../../common';
import { WeaponManager } from './WeaponManager';

const { ccclass } = _decorator;

@ccclass('WeaponStateMachine')
export class WeaponStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    this.type = type;
    this.animationComponent = this.addComponent(Animation)!;

    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip?.name;
      if (name?.toLowerCase().includes('attack')) {
        this.node.getParent()!.getComponent(WeaponManager)!.state = EntityStateEnum.Idle;
      }
    });
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitTriggerValue());
    this.params.set(ParamsNameEnum.Attack, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(
      EntityStateEnum.Idle,
      new State(this, `${this.type}${EntityStateEnum.Idle}`)
    );
    this.stateMachines.set(
      EntityStateEnum.Attack,
      new State(this, `${this.type}${EntityStateEnum.Attack}`, AnimationClip.WrapMode.Normal, true)
    );
  }
}
