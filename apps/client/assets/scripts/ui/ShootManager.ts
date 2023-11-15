import { _decorator, Component } from 'cc';
import EventManager from '../global/EventManager';
import { EventEnum } from '../enum';
const { ccclass } = _decorator;

@ccclass('ShootManager')
export class ShootManager extends Component {
  handleShoot() {
    EventManager.instance.emit(EventEnum.WeaponShoot);
  }
}
