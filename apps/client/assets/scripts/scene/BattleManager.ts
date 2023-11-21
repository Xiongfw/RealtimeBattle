import { _decorator, assert, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import DataManager from '../global/DataManager';
import { JoyStickManager } from '../ui/JoyStickManager';
import { EventEnum, PrefabPathEnum, TexturePathEnum } from '../enum';
import { ResourceManager } from '../global/ResourceManager';
import { ActorManager } from '../entity/actor/ActorManager';
import { ApiMsgEnum, EntityTypeEnum, IClientInput, InputTypeEnum, MsgModel } from '../common';
import { BulletManager } from '../entity/bullet/BulletManager';
import { ObjectPoolManager } from '../global/ObjectPoolManager';
import { NetworkManager } from '../global/NetworkManager';
import EventManager from '../global/EventManager';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage!: Node;
  private ui!: Node;
  private shouldUpdate = false;

  async start() {
    DataManager.instance.stage = this.stage = this.node.getChildByName('Stage')!;
    this.stage.destroyAllChildren();

    this.ui = this.node.getChildByName('UI')!;
    DataManager.instance.joyStick = this.ui.getComponentInChildren(JoyStickManager);

    await Promise.all([this.connectServer(), this.loadRes()]);

    this.initMap();
    EventManager.instance.on(EventEnum.ClientSync, this.handleClientSync, this);

    NetworkManager.instance.listenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);
    this.shouldUpdate = true;
  }

  onDestroy() {
    EventManager.instance.off(EventEnum.ClientSync, this.handleClientSync, this);
    NetworkManager.instance.unlistenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);
  }

  update(dt: number) {
    if (this.shouldUpdate) {
      this.render();
      this.tick(dt);
    }
  }

  async connectServer() {
    if (!(await NetworkManager.instance.connect().catch(() => false))) {
      // 简单重试
      await new Promise((rs) => setTimeout(rs, 1000));
      await this.connectServer();
    }
  }

  initMap() {
    const prefab = DataManager.instance.prefabMap.get(EntityTypeEnum.Map);
    if (prefab) {
      const node = instantiate(prefab);
      node.setParent(this.stage);
    }
  }

  async loadRes() {
    const waitingList = [];
    for (const key in PrefabPathEnum) {
      const p = ResourceManager.instance
        .loadRes((PrefabPathEnum as any)[key], Prefab)
        .then((value) => {
          DataManager.instance.prefabMap.set(key, value);
        });
      waitingList.push(p);
    }

    for (const key in TexturePathEnum) {
      const p = ResourceManager.instance
        .loadDir((TexturePathEnum as any)[key], SpriteFrame)
        .then((value) => {
          DataManager.instance.textureMap.set(key, value);
        });
      waitingList.push(p);
    }

    await Promise.all(waitingList);
  }

  tick(dt: number) {
    this.tickActors(dt);

    DataManager.instance.applyInput({
      type: InputTypeEnum.TimePast,
      dt,
    });
  }

  tickActors(dt: number) {
    for (const data of DataManager.instance.state.actors) {
      let actorManager = DataManager.instance.actorMap.get(data.id);
      if (actorManager) {
        actorManager.tick(dt);
      }
    }
  }

  render() {
    this.renderActors();
    this.renderBullets();
  }

  renderBullets() {
    for (const data of DataManager.instance.state.bullets) {
      let bulletManager = DataManager.instance.bulletMap.get(data.id);
      if (!bulletManager) {
        const bullet = ObjectPoolManager.instance.get(data.type);
        if (!bullet) {
          return;
        }
        bulletManager = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
        bulletManager.init(data);

        DataManager.instance.bulletMap.set(data.id, bulletManager);
      } else {
        bulletManager.render(data);
      }
    }
  }

  renderActors() {
    for (const data of DataManager.instance.state.actors) {
      let actorManager = DataManager.instance.actorMap.get(data.id);
      if (!actorManager) {
        const prefab = DataManager.instance.prefabMap.get(data.type);
        if (!prefab) {
          return;
        }
        const node = instantiate(prefab);
        node.setParent(this.stage);

        actorManager = node.addComponent(ActorManager);
        actorManager.init(data);

        DataManager.instance.actorMap.set(data.id, actorManager);
      } else {
        actorManager.render(data);
      }
    }
  }

  handleClientSync(input: IClientInput) {
    const msg = {
      input,
      frameId: DataManager.instance.frameId++,
    };
    NetworkManager.instance.sendMsg(ApiMsgEnum.MsgClientSync, msg);
  }

  handleServerSync({ inputs }: MsgModel[ApiMsgEnum.MsgServerSync]) {
    for (const input of inputs) {
      DataManager.instance.applyInput(input);
    }
  }
}
