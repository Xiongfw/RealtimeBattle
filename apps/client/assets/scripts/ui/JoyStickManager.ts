import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass } = _decorator;

@ccclass('JoyStickManager')
export class JoyStickManager extends Component {
  private body!: Node;
  private stick!: Node;
  private defaultPos!: Vec3;
  private radius = 0;

  input: Vec2 = Vec2.ZERO;

  onLoad(): void {
    this.body = this.node.getChildByName('Body')!;
    this.stick = this.body.getChildByName('Stick')!;

    this.defaultPos = this.body.getPosition();
    this.radius = this.body.getComponent(UITransform)!.contentSize.width / 2;

    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchStart(event: EventTouch) {
    const touchPos = event.getUILocation();
    this.body.setPosition(touchPos.x, touchPos.y);
  }

  onTouchMove(event: EventTouch) {
    const touchPos = event.getUILocation();
    const stickPos = new Vec3(touchPos.x - this.body.position.x, touchPos.y - this.body.position.y);
    // 限制 stick 不能出圈
    if (stickPos.length() > this.radius) {
      stickPos.multiplyScalar(this.radius / stickPos.length());
    }
    this.stick.setPosition(stickPos);

    // 向量 归一化（拿方向）
    const cloneStickPos = stickPos.clone();
    this.input = new Vec2(cloneStickPos.normalize().x, cloneStickPos.normalize().y);
  }

  onTouchEnd() {
    this.body.setPosition(this.defaultPos);
    this.stick.setPosition(0, 0, 0);
    this.input = Vec2.ZERO;
  }
}
