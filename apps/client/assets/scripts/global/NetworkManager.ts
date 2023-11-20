import Singleton from '../base/Singleton';

interface IItem {
  cb: Function;
  ctx?: unknown;
}

type CallApiRet = {
  success: Boolean;
  data?: any;
  error?: unknown;
};

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

  callApi(name: string, data?: any) {
    return new Promise<CallApiRet>((resolve) => {
      try {
        // 设置超时返回
        const timer = setTimeout(() => {
          resolve({ success: false, error: new Error('Timeout!') });
          this.unlistenMsg(name, cb);
        }, 5000);

        const cb = (res: any) => {
          resolve({ success: true, data: res });
          this.unlistenMsg(name, cb);
          clearTimeout(timer);
        };

        this.listenMsg(name, cb);
        this.sendMsg(name, data);
      } catch (error) {
        resolve({ success: false, error });
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

  listenMsg(name: string, cb: Function, ctx?: unknown) {
    if (this.map.has(name)) {
      this.map.get(name)!.push({ cb, ctx });
    } else {
      this.map.set(name, [{ cb, ctx }]);
    }
  }

  unlistenMsg(name: string, cb: Function, ctx?: unknown) {
    if (this.map.has(name)) {
      const index = this.map.get(name)!.findIndex((i) => cb === i.cb && i.ctx === ctx);
      index > -1 && this.map.get(name)!.splice(index, 1);
    }
  }
}
