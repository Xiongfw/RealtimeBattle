import { _decorator, instantiate, Node } from 'cc';
import Singleton from '../base/Singleton';
import { EntityTypeEnum } from '../common';
import DataManager from './DataManager';
const { ccclass } = _decorator;

@ccclass('ObjectPoolManager')
export class ObjectPoolManager extends Singleton {
  static get instance() {
    return super.getInstance<ObjectPoolManager>();
  }
  private objectPool?: Node;
  private map = new Map<EntityTypeEnum, Node[]>();

  get(type: EntityTypeEnum): Node | null {
    if (!this.objectPool) {
      this.objectPool = new Node('ObjectPool');
      this.objectPool.setParent(DataManager.instance.stage);
    }

    if (!this.map.has(type)) {
      this.map.set(type, []);
      const container = new Node(type + 'Pool');
      container.setParent(this.objectPool);
    }

    const nodes = this.map.get(type)!;
    if (nodes.length > 0) {
      const node = nodes.pop()!;
      node.active = true;
      return node;
    }

    const prefab = DataManager.instance.prefabMap.get(type);
    if (prefab) {
      const node = instantiate(prefab);
      node.name = type;
      node.setParent(this.objectPool.getChildByName(type + 'Pool'));
      node.active = true;
      return node;
    }

    return null;
  }

  put(node: Node): void {
    node.active = false;
    this.map.get(node.name as EntityTypeEnum)?.push(node);
  }

  clear(): void {}
}
