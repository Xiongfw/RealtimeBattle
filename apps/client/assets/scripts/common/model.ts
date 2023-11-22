import { ApiMsgEnum } from './enum';
import { IClientInput } from './state';

export interface IPlayer {
  id: number;
  rid?: number;
  nickname: string;
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
}
