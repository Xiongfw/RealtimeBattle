import { _decorator, Component, Label } from 'cc';
import { IPlayer } from '../common';
const { ccclass } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  private label!: Label;

  init(data: IPlayer) {
    this.label = this.getComponent(Label)!;
    this.label.string = data.nickname;
  }
}
