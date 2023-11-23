import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { NetworkManager } from '../global/NetworkManager';
import { ApiMsgEnum, MsgModel } from '../common';
import { PlayerManager } from '../ui/PlayerManager';
import DataManager from '../global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('RoomSceneManager')
export class RoomSceneManager extends Component {
  @property(Node)
  private playerContainer!: Node;
  @property(Prefab)
  private playerPrefab!: Node;

  start() {
    this.renderPlayers({
      room: DataManager.instance.room!,
    });
    NetworkManager.instance.listenMsg(ApiMsgEnum.MsgRoomInfo, this.renderPlayers, this);
  }

  protected onDestroy(): void {
    NetworkManager.instance.unlistenMsg(ApiMsgEnum.MsgRoomInfo, this.renderPlayers, this);
  }

  renderPlayers({ room: { players: list } }: MsgModel['MsgRoomInfo']) {
    this.playerContainer.removeAllChildren();
    for (const player of list) {
      const node = instantiate(this.playerPrefab);
      node.setParent(this.playerContainer);
      const playerMgr = node.addComponent(PlayerManager);
      playerMgr.init(player);
    }
  }
}
