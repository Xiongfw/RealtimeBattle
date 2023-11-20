import { Connection } from '../core';

export class Player {
  id: number;
  // room id
  rid: number;
  nickname: string;
  connection: Connection;

  constructor({ id, nickname, connection }: Pick<Player, 'id' | 'nickname' | 'connection'>) {
    this.id = id;
    this.nickname = nickname;
    this.connection = connection;
  }

  /**
   * 视图层数据
   */
  private toJSON() {
    return {
      id: this.id,
      nickname: this.nickname,
      rid: this.rid,
    };
  }
}
