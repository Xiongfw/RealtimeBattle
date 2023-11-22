import { _decorator, Component, director, EditBox, Scene } from 'cc';
import { ApiMsgEnum } from '../common';
import { NetworkManager } from '../global/NetworkManager';
import DataManager from '../global/DataManager';
import { SceneEnum } from '../enum';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
  @property(EditBox)
  private nickname!: EditBox;

  start() {
    director.preloadScene(SceneEnum.Hall);
    director.preloadScene(SceneEnum.Battle);
    NetworkManager.instance.connect();
  }

  async handleClick() {
    if (!NetworkManager.instance.isConnected) {
      console.log('未连接');
      return;
    }
    if (!this.nickname.string) {
      console.log('请输入昵称');
      return;
    }
    const data = await NetworkManager.instance.callApi(ApiMsgEnum.ApiPlayerJoin, {
      nickname: this.nickname.string,
    });
    DataManager.instance.myPlayerId = data.player.id;
    director.loadScene(SceneEnum.Hall);
  }
}
