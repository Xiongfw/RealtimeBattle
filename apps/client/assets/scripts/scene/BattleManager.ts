import { _decorator, Component, Node } from 'cc';
import DataManager from '../global/DataManager';
import { JoyStickManager } from '../ui/JoyStickManager';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage!: Node;
  private ui!: Node;

  onLoad() {
    this.stage = this.node.getChildByName('Stage')!;
    this.ui = this.node.getChildByName('UI')!;

    DataManager.instance.joyStick = this.ui.getComponentInChildren(JoyStickManager);
  }
}
