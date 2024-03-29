export enum EventEnum {
  WeaponShoot = 'WeaponShoot',
  ExplosionBorn = 'ExplosionBorn',
  ClientSync = 'ClientSync',
  RoomJoin = 'RoomJoin',
}

export enum PrefabPathEnum {
  Actor1 = 'prefab/Actor',
  Map = 'prefab/Map',
  Weapon1 = 'prefab/Weapon1',
  Bullet1 = 'prefab/Bullet1',
  Bullet2 = 'prefab/Bullet2',
  Explosion = 'prefab/Explosion',
}

export enum TexturePathEnum {
  Actor1Idle = 'texture/actor/actor1/idle',
  Actor1Run = 'texture/actor/actor1/run',
  Weapon1Idle = 'texture/weapon/weapon1/idle',
  Weapon1Attack = 'texture/weapon/weapon1/attack',
  ExplosionIdle = 'texture/explosion',
}

export enum FsmParamTypeEnum {
  Trigger = 'Trigger',
  Number = 'Number',
}

export enum ParamsNameEnum {
  Idle = 'Idle',
  Run = 'Run',
  Attack = 'Attack',
}

export enum EntityStateEnum {
  Idle = 'Idle',
  Run = 'Run',
  Attack = 'Attack',
}

export enum SceneEnum {
  Login = 'Login',
  Battle = 'Battle',
  Hall = 'Hall',
  Room = 'Room',
}
