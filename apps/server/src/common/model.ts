import { ApiMsgEnum } from './enum';
import { IClientInput } from './state';

export interface IPlayer {
  id: number;
  rid?: number;
  nickname: string;
}

export interface IRoom {
  id: number;
  players: IPlayer[];
}

export interface ApiModel {
  [ApiMsgEnum.ApiPlayerJoin]: {
    req: {
      nickname: string;
    };
    res: {
      player: IPlayer;
    };
  };
  [ApiMsgEnum.ApiPlayerList]: {
    req: {};
    res: {
      list: IPlayer[];
    };
  };
  [ApiMsgEnum.ApiRoomCreate]: {
    req: {};
    res: {
      room: IRoom;
    };
  };
  [ApiMsgEnum.ApiRoomList]: {
    req: {};
    res: {
      list: IRoom[];
    };
  };
  // 加入房间
  [ApiMsgEnum.ApiRoomJoin]: {
    req: { rid: number };
    res: {
      room: IRoom;
    };
  };
  [ApiMsgEnum.ApiRoomLeave]: {
    req: {};
    res: {};
  };
}

export interface MsgModel {
  [ApiMsgEnum.MsgClientSync]: {
    input: IClientInput;
    frameId: number;
  };
  [ApiMsgEnum.MsgServerSync]: {
    inputs: IClientInput[];
    lastFrameId: number;
  };
  [ApiMsgEnum.MsgPlayerList]: {
    list: IPlayer[];
  };
  [ApiMsgEnum.MsgRoomList]: {
    list: IRoom[];
  };
  [ApiMsgEnum.MsgRoomInfo]: {
    room: IRoom;
  };
}
