import { _decorator, Component, Label } from 'cc';
import { IPlayer } from '../common';
import DataManager from '../global/DataManager';
const { ccclass } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  private label!: Label;

  init({ id, nickname }: IPlayer) {
    this.label = this.getComponent(Label)!;
    this.label.string = nickname + (DataManager.instance.myPlayerId === id ? ' (我)' : '');
  }
}
