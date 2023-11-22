import { IPlayer } from '../common';
import { Connection } from '../core';

export class Player implements IPlayer {
  id: number;
  // room id
  rid?: number;
  nickname: string;
  connection: Connection;

  constructor({ id, nickname, connection }: Pick<Player, 'id' | 'nickname' | 'connection'>) {
    this.id = id;
    this.nickname = nickname;
    this.connection = connection;
  }

  toJSON() {
    return {
      id: this.id,
      rid: this.rid,
      nickname: this.nickname,
    };
  }
}
