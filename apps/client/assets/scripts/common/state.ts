import { EntityTypeEnum, InputTypeEnum } from './index';

export interface IVec2 {
  x: number;
  y: number;
}

export interface IActor {
  id: number;
  position: IVec2;
  direction: IVec2;
  type: EntityTypeEnum;
  weaponType: EntityTypeEnum;
}

export interface IState {
  actors: Array<IActor>;
}

export interface IActorMove {
  id: number;
  type: InputTypeEnum.ActorMove;
  direction: IVec2;
  // from update deltaTime
  dt: number;
}
