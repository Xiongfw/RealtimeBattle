import { ApiMsgEnum } from './enum';
import { IClientInput } from './state';

export interface ApiModel {
  [ApiMsgEnum.ApiPlayerJoin]: {
    req: {
      nickname: string;
    };
    res: {
      player: {
        id: number;
        rid?: number;
        nickname: string;
      };
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
}
