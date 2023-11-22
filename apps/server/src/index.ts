import { PlayerManager } from './biz/PlayerManager';
import { ApiMsgEnum } from './common';
import { GameServer } from './core';

const server = new GameServer({ post: 9876 });

server.on('connection', () => {
  console.log('join', server.connections.size);
});
server.on('disconnection', () => {
  console.log('exit', server.connections.size);
});

server
  .start()
  .then(() => {
    console.log('服务启动！');
  })
  .catch((e) => {
    console.error(e);
  });

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection, data) => {
  const { nickname } = data;
  const player = PlayerManager.instance.createPlayer({ nickname, connection });

  PlayerManager.instance.syncPlayers();

  player.connection.on('close', () => {
    PlayerManager.instance.removePlayer(player.id);
    PlayerManager.instance.syncPlayers();
  });

  return {
    player,
  };
});

server.setApi(ApiMsgEnum.ApiPlayerList, (connection, data) => {
  return {
    list: [...PlayerManager.instance.players],
  };
});
