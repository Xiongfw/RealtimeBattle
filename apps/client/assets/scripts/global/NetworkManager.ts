import Singleton from '../base/Singleton';
import { ApiModel, MsgModel } from '../common';

interface IItem {
  cb: Function;
  ctx?: unknown;
}

export class NetworkManager extends Singleton {
  static get instance() {
    return super.getInstance<NetworkManager>();
  }
  private ws!: WebSocket;
  private post = 9876;
  private map: Map<string, Array<IItem>> = new Map();

  isConnected = false;

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }
      this.ws = new WebSocket(`ws://192.168.71.2:${this.post}`);
      this.ws.onopen = () => {
        this.isConnected = true;
        resolve(true);
      };
      this.ws.onclose = () => {
        this.isConnected = false;
        reject(false);
      };
      this.ws.onerror = (e) => {
        console.error(e);
        this.isConnected = false;
        reject(false);
      };
      this.ws.onmessage = (e) => {
        try {
          const json = JSON.parse(e.data);
          const { name, data } = json;
          if (this.map.has(name)) {
            this.map.get(name)!.forEach(({ cb, ctx }) => {
              cb.call(ctx, data);
            });
          }
        } catch (e) {
          console.error(e);
        }
      };
    });
  }

  callApi<T extends keyof ApiModel>(name: T, data: ApiModel[T]['req']) {
    return new Promise<ApiModel[T]['res']>((resolve, reject) => {
      try {
        // 设置超时返回
        const timer = setTimeout(() => {
          reject(new Error('Timeout!'));
          this.unlistenMsg(name as any, cb);
        }, 5000);

        const cb = (res: any) => {
          resolve(res);
          this.unlistenMsg(name as any, cb);
          clearTimeout(timer);
        };

        this.listenMsg(name as any, cb);
        this.sendMsg(name as any, data);
      } catch (error) {
        reject(error);
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
