import { ApiMsgEnum } from './common';
import { GameServer } from './core';

const server = new GameServer({ post: 9876 });

server
  .start()
  .then(() => {
    console.log('服务启动！');
  })
  .catch((e) => {
    console.error(e);
  });

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection, data) => {
  return '这是服务器返回的数据';
});
