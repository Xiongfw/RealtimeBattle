import { WebSocketServer } from 'ws';
import { ApiMsgEnum } from './common';

const wss = new WebSocketServer(
  {
    port: 9876,
  },
  () => {
    console.log('服务启动！');
  }
);
const inputs: any[] = [];

wss.on('connection', (socket) => {
  socket.on('message', (rawData) => {
    const str = rawData.toString();
    try {
      const msg = JSON.parse(str);
      const { name, data } = msg;
      const { frameId, input } = data;
      inputs.push(input);
    } catch (error) {
      console.error(error);
    }
  });

  setInterval(() => {
    const msg = {
      name: ApiMsgEnum.MsgServerSync,
      data: {
        inputs,
      },
    };
    socket.send(JSON.stringify(msg));
    // 清空 inputs
    inputs.length = 0;
  }, 100);
});
