import Singleton from '../base/Singleton';
import { IActor, IActorMove, IState } from '../common';
import { JoyStickManager } from '../ui/JoyStickManager';

export const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  state: IState = {
    actors: [
      {
        id: 1,
        position: {
          x: 0,
          y: 0,
        },
        direction: {
          x: 1,
          y: 0,
        },
      },
    ],
  };
  joyStick: JoyStickManager | null = null;

  applyInput(input: IActorMove) {
    const {
      id,
      direction: { x, y },
      dt,
    } = input;
    const actor = this.state.actors.find((i) => i.id === id);
    if (!actor) {
      return;
    }
    actor.direction.x = x;
    actor.direction.y = y;

    actor.position.x += x * dt * ACTOR_SPEED;
    actor.position.y += y * dt * ACTOR_SPEED;
  }
}
