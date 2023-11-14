import { _decorator } from 'cc';
import DataManager from '../../global/DataManager';
import { IActor, InputTypeEnum } from '../../common';
import { EntityManager } from '../../base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum } from '../../enum';
const { ccclass } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  init(data: IActor) {
    this.fsm = this.addComponent(ActorStateMachine)!;
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
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
  }
}
