import { EventEmitter, WebSocketServer } from 'ws';
import { Connection } from './index';
import { ApiMsgEnum } from '../common';

type GameServerOptions = {
  post: number;
};

type SetApiCallback = (connection: Connection, data?: any) => any;

export class GameServer extends EventEmitter {
  private wss: WebSocketServer;
  readonly port: number;
  readonly connections = new Set<Connection>();

  apiMap = new Map<string, SetApiCallback>();

  constructor(options: GameServerOptions) {
    super();
    this.port = options.post;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.wss = new WebSocketServer({
        port: this.port,
      });
      this.wss.on('listening', () => {
        resolve(true);
      });
      this.wss.on('close', () => {
        reject(false);
      });
      this.wss.on('error', (e) => {
        reject(e);
      });
      this.wss.on('connection', (ws) => {
        const connection = new Connection(this, ws);
        this.connections.add(connection);
        this.emit('connection', connection);

        connection.on('close', () => {
          this.connections.delete(connection);
          this.emit('disconnection', connection);
        });
      });
    });
  }

  setApi(name: ApiMsgEnum, cb: SetApiCallback) {
    this.apiMap.set(name, cb);
  }
}
