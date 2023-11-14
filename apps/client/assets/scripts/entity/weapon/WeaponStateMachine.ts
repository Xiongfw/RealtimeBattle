import { _decorator, Animation, AnimationClip } from 'cc';
import StateMachine, { getInitTriggerValue } from '../../base/StateMachine';
import { EntityStateEnum, ParamsNameEnum } from '../../enum';
import State from '../../base/State';
import { EntityTypeEnum } from '../../common';

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
    // this.ani.on(Animation.EventType.FINISHED, () => {
    //   const name = this.ani.defaultClip?.name;
    //   const whiteList = ['attack'];
    //   if (whiteList.some((v) => name?.includes(v))) {
    //     this.setParams(PARAMS_NAME_NUM.IDLE, true);
    //   }
    // });
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitTriggerValue());
    this.params.set(ParamsNameEnum.Attack, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(
      EntityStateEnum.Idle,
      new State(this, `${this.type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Loop)
    );
    this.stateMachines.set(
      EntityStateEnum.Attack,
      new State(this, `${this.type}${EntityStateEnum.Attack}`, AnimationClip.WrapMode.Loop)
    );
  }
}
