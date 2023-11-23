export enum InputTypeEnum {
  ActorMove = 'ActorMove',
  WeaponShoot = 'WeaponShoot',
  // 时间流逝
  TimePast = 'TimePast',
}

export enum EntityTypeEnum {
  Actor1 = 'Actor1',
  Map = 'Map',
  Weapon1 = 'Weapon1',
  Bullet1 = 'Bullet1',
  Bullet2 = 'Bullet2',
  Explosion = 'Explosion',
}

export enum ApiMsgEnum {
  MsgClientSync = 'MsgClientSync',
  MsgServerSync = 'MsgServerSync',
  MsgPlayerList = 'MsgPlayerList',
  MsgRoomList = 'MsgRoomList',
  // 同步房间内的信息
  MsgRoomInfo = 'MsgRoomInfo',
  ApiPlayerJoin = 'ApiPlayerJoin',
  ApiPlayerList = 'ApiPlayerList',
  ApiRoomList = 'ApiRoomList',
  ApiRoomCreate = 'ApiRoomCreate',
  ApiRoomJoin = 'ApiRoomJoin',
  ApiRoomLeave = 'ApiRoomLeave',
}