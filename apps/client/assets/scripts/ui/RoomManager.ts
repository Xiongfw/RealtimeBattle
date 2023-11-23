import { _decorator, Component, Label, Node } from 'cc';
import { IRoom } from '../common';
import EventManager from '../global/EventManager';
import { EventEnum } from '../enum';
const { ccclass } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
  id!: number;

  init({ id, players }: IRoom) {
    this.id = id;
    const label = this.getComponent(Label)!;
    label.string = `房间id:${id} 玩家数量:${players.length}`;

    this.node.on(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  protected onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  handleClick() {
    EventManager.instance.emit(EventEnum.RoomJoin, this.id);
  }
}
