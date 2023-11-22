import Singleton from '../base/Singleton';
import { ApiMsgEnum } from '../common';
import { Connection } from '../core';
import { Player } from './Player';

export class PlayerManager extends Singleton {
  static get instance() {
    return super.getInstance<PlayerManager>();
  }
  private nextPlayerId = 1;
  readonly players = new Set<Player>();
  readonly idMapPlayer = new Map<number, Player>();

  createPlayer({ nickname, connection }: { nickname: string; connection: Connection }) {
    const player = new Player({ id: this.nextPlayerId++, nickname, connection });

    this.players.add(player);
    this.idMapPlayer.set(player.id, player);

    return player;
  }

  removePlayer(pid: number) {
    const player = this.idMapPlayer.get(pid);
    if (player) {
      this.idMapPlayer.delete(pid);
      this.players.delete(player);
    }
  }

  syncPlayers() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgPlayerList, {
        list: [...this.players],
      });
    }
  }
}
