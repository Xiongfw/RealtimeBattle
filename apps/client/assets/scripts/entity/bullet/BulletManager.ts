import { _decorator, Component, toDegree, Vec2 } from 'cc';
import { IBullet } from '../../common';
const { ccclass } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
  init(data: IBullet) {}

  render(data: IBullet) {
    const { position, direction } = data;
    this.node.setPosition(position.x, position.y);
    const rad = new Vec2(1, 0).signAngle(new Vec2(direction.x, direction.y));
    this.node.setRotationFromEuler(0, 0, toDegree(rad));
  }
}
