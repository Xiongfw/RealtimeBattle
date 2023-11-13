import { _decorator, Component } from 'cc';
import DataManager from '../../global/DataManager';
import { IActor, InputTypeEnum } from '../../common';
const { ccclass } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component {
  init(data: IActor) {}

  update(dt: number) {
    if (DataManager.instance.joyStick?.input.length()) {
      const { x, y } = DataManager.instance.joyStick.input;
      DataManager.instance.applyInput({
        id: 1,
        type: InputTypeEnum.ActorMove,
        direction: { x, y },
        dt: dt,
      });
    }
  }

  render(data: IActor) {
    this.node.setPosition(data.position.x, data.position.y);
  }
}
