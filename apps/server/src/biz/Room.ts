import { ApiMsgEnum, IPlayer, IRoom } from '../common';
import { Player } from './Player';
import { PlayerManager } from './PlayerManager';

export class Room {
  id: number;
  players = new Set<Player>();

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

  syncRoomInfo() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgRoomInfo, {
        room: this.toJSON(),
      });
    }
  }

  toJSON() {
    return {
      id: this.id,
      players: [...this.players],
    };
  }
}
