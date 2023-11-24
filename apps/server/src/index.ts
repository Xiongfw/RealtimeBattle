import { PlayerManager } from './biz/PlayerManager';
import { RoomManager } from './biz/RoomManager';
import { ApiMsgEnum } from './common';
import { GameServer } from './core';

const server = new GameServer({ post: 9876 });

server.on('connection', () => {
  console.log('join', server.connections.size);
});
server.on('disconnection', (connection) => {
  console.log('exit', server.connections.size);

  const { playerId } = connection.extInfo;

  if (!playerId) {
    return;
  }

  const player = PlayerManager.instance.idMapPlayer.get(playerId);
  const { id, rid } = player;
  if (rid) {
    RoomManager.instance.leaveRoom(rid, id);
    RoomManager.instance.syncRoomInfo(rid);
    RoomManager.instance.syncRooms();
  }
  PlayerManager.instance.removePlayer(player.id);
  PlayerManager.instance.syncPlayers();
  delete connection.extInfo.playerId;
});

server
  .start()
  .then(() => {
    console.log('服务启动！');
  })
  .catch((e) => {
    console.error(e);
  });

server.setApi(ApiMsgEnum.ApiRoomCreate, (connection, data) => {
  const { playerId } = connection.extInfo;
  // 已登陆
  if (!playerId) {
    throw new Error('未登录');
  }
  const newRoom = RoomManager.instance.createRoom();
  const room = RoomManager.instance.joinRoom(newRoom.id, playerId);

  PlayerManager.instance.syncPlayers();
  RoomManager.instance.syncRooms();
  return {
    room: room.toJSON(),
  };
});

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection, data) => {
  const { nickname } = data;
  const player = PlayerManager.instance.createPlayer({ nickname, connection });
  connection.extInfo.playerId = player.id;

  PlayerManager.instance.syncPlayers();

  return {
    player,
  };
});

server.setApi(ApiMsgEnum.ApiPlayerList, (connection, data) => {
  return {
    list: [...PlayerManager.instance.players],
  };
});

server.setApi(ApiMsgEnum.ApiRoomList, (connection, data) => {
  return {
    list: [...RoomManager.instance.rooms].map((i) => i.toJSON()),
  };
});

server.setApi(ApiMsgEnum.ApiRoomJoin, (connection, data) => {
  const { playerId } = connection.extInfo;
  const { rid } = data;

  const room = RoomManager.instance.joinRoom(rid, playerId);
  if (!room) {
    throw new Error('房间不存在');
  }

  PlayerManager.instance.syncPlayers();
  RoomManager.instance.syncRoomInfo(room.id);
  RoomManager.instance.syncRooms();

  return {
    room: room.toJSON(),
  };
});

server.setApi(ApiMsgEnum.ApiRoomLeave, (connection, data) => {
  const { playerId } = connection.extInfo;
  const player = PlayerManager.instance.idMapPlayer.get(playerId);
  if (!player) {
    throw new Error('玩家不存在');
  }
  if (!player.rid) {
    throw new Error('玩家不在房间内');
  }
  const { rid, id } = player;
  RoomManager.instance.leaveRoom(rid, id);

  PlayerManager.instance.syncPlayers();
  RoomManager.instance.syncRoomInfo(rid);
  RoomManager.instance.syncRooms();

  return {};
});

server.setApi(ApiMsgEnum.ApiGameStart, (connection, data) => {
  const { playerId } = connection.extInfo;
  const player = PlayerManager.instance.idMapPlayer.get(playerId);
  if (!player) {
    throw new Error('玩家不存在');
  }
  if (!player.rid) {
    throw new Error('玩家不在房间内');
  }
  const { rid, id } = player;
  RoomManager.instance.startGame(rid);

  PlayerManager.instance.syncPlayers();
  RoomManager.instance.syncRoomInfo(rid);
  RoomManager.instance.syncRooms();

  return {};
});
