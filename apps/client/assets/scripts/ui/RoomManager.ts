import { _decorator, Component, Label } from 'cc';
import { IRoom } from '../common';
const { ccclass } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
  private label!: Label;

  init({ id, players }: IRoom) {
    this.label = this.getComponent(Label)!;
    this.label.string = `房间id:${id} 玩家数量:${players.length}`;
  }
}
