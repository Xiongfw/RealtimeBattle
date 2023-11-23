import Singleton from '../base/Singleton';
import { ApiMsgEnum } from '../common';
import { PlayerManager } from './PlayerManager';
import { Room } from './Room';

export class RoomManager extends Singleton {
  static get instance() {
    return super.getInstance<RoomManager>();
  }
  private nextRoomId = 1;
  readonly rooms = new Set<Room>();
  readonly idMapRoom = new Map<number, Room>();

  createRoom() {
    const room = new Room(this.nextRoomId++);

    this.rooms.add(room);
    this.idMapRoom.set(room.id, room);

    return room;
  }

  removeRoom(pid: number) {
    const room = this.idMapRoom.get(pid);
    if (room) {
      this.idMapRoom.delete(pid);
      this.rooms.delete(room);
      room.close();
    }
  }

  /**
   * 加入房间
   * @param rid room id
   * @param uid player id
   */
  joinRoom(rid: number, uid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.join(uid);
      return room;
    }
  }

  leaveRoom(rid: number, uid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.leave(uid);
    }
  }

  syncRoomInfo(rid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.sync();
    }
  }

  syncRooms() {
    for (const player of PlayerManager.instance.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgRoomList, {
        list: [...this.rooms].map((i) => i.toJSON()),
      });
    }
  }
}
