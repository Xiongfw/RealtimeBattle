import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc';
import { sortSpriteFrame } from '../utils';
import StateMachine from './StateMachine';
import DataManager from '../global/DataManager';

/***
 * unit:milisecond
 */
export const ANIMATION_SPEED = 1 / 10;

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State {
  private animationClip: AnimationClip;

  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode = AnimationClip.WrapMode.Normal,
    private force: boolean = false
  ) {
    //生成动画轨道属性
    const track = new animation.ObjectTrack();
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    const spriteFrames = DataManager.instance.textureMap.get(this.path) || [];
    const keyFrames: [number, SpriteFrame][] = sortSpriteFrame(spriteFrames).map((item, index) => [
      ANIMATION_SPEED * index,
      item,
    ]);
    track.channel.curve.assignSorted(keyFrames);
    this.animationClip = new AnimationClip(this.path);
    this.animationClip.addTrack(track);
    this.animationClip.wrapMode = this.wrapMode;
    this.animationClip.duration = keyFrames.length * ANIMATION_SPEED;
  }

  run() {
    if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name && !this.force) {
      return;
    }
    this.fsm.animationComponent.defaultClip = this.animationClip;
    this.fsm.animationComponent.play();
  }
}
