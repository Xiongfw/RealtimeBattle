import { WebSocket, EventEmitter } from 'ws';
import { GameServer } from './GameServer';

export class Connection extends EventEmitter {
  constructor(private server: GameServer, private ws: WebSocket) {
    super();
    this.ws.on('close', () => {
      this.emit('close');
    });
    this.ws.on('message', (rawData) => {
      try {
        const json = JSON.parse(rawData.toString());
        const { name, data } = json;
        // 区分是 api 请求 还是 msg 消息
        if (this.server.apiMap.has(name)) {
          const cb = this.server.apiMap.get(name);
          const res = cb(this, data);
          this.sendMsg(name, res);
        } else {
          this.emit(name, data);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  sendMsg(name: string, data?: any) {
    const msg = {
      name,
      data,
    };
    this.ws.send(JSON.stringify(msg));
  }
}
