import { WebSocket, EventEmitter } from 'ws';
import { GameServer } from './GameServer';
import { MsgModel } from '../common';

interface IItem {
  cb: Function;
  ctx?: unknown;
}

export class Connection extends EventEmitter {
  private map: Map<string, Array<IItem>> = new Map();
  extInfo: Record<string, any> = {};

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
          if (this.map.has(name)) {
            this.map.get(name)!.forEach(({ cb, ctx }) => {
              cb.apply(ctx, data);
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  sendMsg<T extends keyof MsgModel>(name: T, data: MsgModel[T]) {
    const msg = {
      name,
      data,
    };
    this.ws.send(JSON.stringify(msg));
  }

  listenMsg<T extends keyof MsgModel>(name: T, cb: (data: MsgModel[T]) => void, ctx?: unknown) {
    if (this.map.has(name)) {
      this.map.get(name)!.push({ cb, ctx });
    } else {
      this.map.set(name, [{ cb, ctx }]);
    }
  }

  unlistenMsg<T extends keyof MsgModel>(name: T, cb: (data: MsgModel[T]) => void, ctx?: unknown) {
    if (this.map.has(name)) {
      const index = this.map.get(name)!.findIndex((i) => cb === i.cb && i.ctx === ctx);
      index > -1 && this.map.get(name)!.splice(index, 1);
    }
  }
}
