import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { NetworkManager } from '../global/NetworkManager';
import { ApiModel, ApiMsgEnum } from '../common';
import { PlayerManager } from '../ui/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
  @property(Node)
  private playerContainer!: Node;
  @property(Prefab)
  private playerPrefab!: Node;

  start() {
    this.getPlayerList();
    NetworkManager.instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayers, this);
  }

  protected onDestroy(): void {
    NetworkManager.instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayers, this);
  }

  async getPlayerList() {
    const data = await NetworkManager.instance.callApi(ApiMsgEnum.ApiPlayerList, {});
    this.renderPlayers(data);
  }

  renderPlayers({ list }: ApiModel['ApiPlayerList']['res']) {
    this.playerContainer.removeAllChildren();
    for (const player of list) {
      const node = instantiate(this.playerPrefab);
      node.setParent(this.playerContainer);
      const playerMgr = node.addComponent(PlayerManager);
      playerMgr.init(player);
    }
  }

  async handleCreateRoom() {
    const data = await NetworkManager.instance.callApi(ApiMsgEnum.ApiRoomCreate, {});
  }
}
