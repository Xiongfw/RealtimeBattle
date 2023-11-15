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
  bulletType: EntityTypeEnum;
}

export interface IBullet {
  id: number;
  owner: number;
  position: IVec2;
  direction: IVec2;
  type: EntityTypeEnum;
}

export interface IState {
  actors: Array<IActor>;
  bullets: Array<IBullet>;
  nextBulletId: number;
}

export type IClientInput = IActorMove | IWeaponShoot | ITimePast;

export interface IActorMove {
  id: number;
  type: InputTypeEnum.ActorMove;
  direction: IVec2;
  // from update deltaTime
  dt: number;
}

export interface IWeaponShoot {
  // 拥有者 id
  owner: number;
  type: InputTypeEnum.WeaponShoot;
  position: IVec2;
  direction: IVec2;
}

export interface ITimePast {
  type: InputTypeEnum.TimePast;
  // from update deltaTime
  dt: number;
}
