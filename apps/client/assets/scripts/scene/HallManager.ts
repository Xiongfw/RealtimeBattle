import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { NetworkManager } from '../global/NetworkManager';
import { ApiModel, ApiMsgEnum } from '../common';
import { PlayerManager } from '../ui/PlayerManager';
import { RoomManager } from '../ui/RoomManager';
import { EventEnum, SceneEnum } from '../enum';
import DataManager from '../global/DataManager';
import EventManager from '../global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
  @property(Node)
  private playerContainer!: Node;
  @property(Prefab)
  private playerPrefab!: Node;
  @property(Node)
  private roomContainer!: Node;
  @property(Prefab)
  private roomPrefab!: Node;

  start() {
    this.getPlayerList();
    this.getRoomList();
    NetworkManager.instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayers, this);
    NetworkManager.instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRooms, this);

    EventManager.instance.on(EventEnum.RoomJoin, this.handleRoomJoin, this);
  }

  protected onDestroy(): void {
    NetworkManager.instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayers, this);
    NetworkManager.instance.unlistenMsg(ApiMsgEnum.MsgRoomList, this.renderRooms, this);

    EventManager.instance.off(EventEnum.RoomJoin, this.handleRoomJoin, this);
  }

  async handleRoomJoin(rid: number) {
    const { room } = await NetworkManager.instance.callApi(ApiMsgEnum.ApiRoomJoin, { rid });
    DataManager.instance.room = room;
    director.loadScene(SceneEnum.Room);
  }

  async getPlayerList() {
    const data = await NetworkManager.instance.callApi(ApiMsgEnum.ApiPlayerList, {});
    this.renderPlayers(data);
  }

  async getRoomList() {
    const data = await NetworkManager.instance.callApi(ApiMsgEnum.ApiRoomList, {});
    this.renderRooms(data);
  }

  renderRooms({ list }: ApiModel['ApiRoomList']['res']) {
    this.roomContainer.removeAllChildren();
    for (const room of list) {
      const node = instantiate(this.roomPrefab);
      node.setParent(this.roomContainer);
      const roomMgr = node.addComponent(RoomManager);
      roomMgr.init(room);
    }
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
    const { room } = await NetworkManager.instance.callApi(ApiMsgEnum.ApiRoomCreate, {});
    DataManager.instance.room = room;
    director.loadScene(SceneEnum.Room);
  }
}
