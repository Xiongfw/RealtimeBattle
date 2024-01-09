import {
  ApiMsgEnum,
  EntityTypeEnum,
  IActor,
  IClientInput,
  InputTypeEnum,
  MsgModel,
} from '../common';
import { Connection } from '../core';
import { Player } from './Player';
import { PlayerManager } from './PlayerManager';
import { RoomManager } from './RoomManager';

export class Room {
  readonly id: number;
  readonly players = new Set<Player>();
  private pendingInputs: IClientInput[] = [];
  private lastTime: number;

  private timerList: NodeJS.Timeout[] = [];

  constructor(rid: number) {
    this.id = rid;
  }

  join(uid: number) {
    const player = PlayerManager.instance.idMapPlayer.get(uid);
    if (player) {
      player.rid = this.id;
      this.players.add(player);
    }
  }

  leave(uid: number) {
    const player = PlayerManager.instance.idMapPlayer.get(uid);
    if (player) {
      player.rid = undefined;
      this.players.delete(player);
      if (this.players.size === 0) {
        RoomManager.instance.removeRoom(this.id);
      }
    }
  }

  close() {
    for (const player of this.players) {
      player.connection.unlistenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this);
    }
    this.timerList.forEach((i) => clearInterval(i));
    this.players.clear();
  }

  sync() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgRoomInfo, {
        room: this.toJSON(),
      });
    }
  }

  start() {
    const actors: IActor[] = [...this.players].map((p, i) => {
      return {
        id: p.id,
        nickname: p.nickname,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet1,
        hp: 100,
        position: {
          x: -150 + i * 300,
          y: -150 + i * 300,
        },
        direction: {
          x: -1,
          y: 0,
        },
      };
    });

    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgGameStart, { actors });
      player.connection.listenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this);
    }

    // 操作同步, 人的反应时间是50~100ms 10-20FPS
    const timer1 = setInterval(() => {
      this.sendServerMsg();
    }, 100);

    // delta 同步 (客户端渲染时间同步)
    const timer2 = setInterval(() => {
      this.timePast();
    }, 16);

    this.timerList.push(timer1, timer2);
  }

  getClientMsg(connection: Connection, { input, frameId }: MsgModel['MsgClientSync']) {
    this.pendingInputs.push(input);
  }

  sendServerMsg() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgServerSync, {
        inputs: this.pendingInputs,
        lastFrameId: 0,
      });
    }
    this.pendingInputs.length = 0;
  }

  timePast() {
    const now = process.uptime();
    // 增量时间
    const dt = now - (this.lastTime ?? now);
    this.lastTime = now;

    this.pendingInputs.push({ type: InputTypeEnum.TimePast, dt });
  }

  toJSON() {
    return {
      id: this.id,
      players: [...this.players],
    };
  }
}
