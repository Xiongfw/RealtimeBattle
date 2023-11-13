import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import DataManager from '../global/DataManager';
import { JoyStickManager } from '../ui/JoyStickManager';
import { PrefabPathEnum } from '../enum';
import { ResourceManager } from '../global/ResourceManager';
import { ActorManager } from '../entity/actor/ActorManager';
import { EntityTypeEnum } from '../common';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage!: Node;
  private ui!: Node;
  private shouldUpdate = false;
  private prefabMap = new Map<string, Prefab>();
  private actorMap = new Map<number, ActorManager>();

  onLoad() {
    this.stage = this.node.getChildByName('Stage')!;
    this.ui = this.node.getChildByName('UI')!;

    DataManager.instance.joyStick = this.ui.getComponentInChildren(JoyStickManager);

    this.stage.destroyAllChildren();
  }

  async start() {
    await this.loadRes();
    this.initMap();
    this.shouldUpdate = true;
  }

  update() {
    if (this.shouldUpdate) {
      this.render();
    }
  }

  initMap() {
    const prefab = this.prefabMap.get(EntityTypeEnum.Map);
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
          this.prefabMap.set(key, value);
        });
      waitingList.push(p);
    }
    await Promise.all(waitingList);
  }

  render() {
    this.renderActors();
  }

  renderActors() {
    for (const data of DataManager.instance.state.actors) {
      let actorManager = this.actorMap.get(data.id);
      if (!actorManager) {
        const prefab = this.prefabMap.get(data.type);
        if (!prefab) {
          return;
        }
        const node = instantiate(prefab);
        node.setParent(this.stage);

        actorManager = node.addComponent(ActorManager);
        actorManager.init(data);

        this.actorMap.set(data.id, actorManager);
      } else {
        actorManager.render(data);
      }
    }
  }
}
