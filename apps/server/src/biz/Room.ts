import { ApiMsgEnum, IPlayer, IRoom } from '../common';
import { Player } from './Player';
import { PlayerManager } from './PlayerManager';
import { RoomManager } from './RoomManager';

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
    this.players.clear();
  }

  sync() {
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
