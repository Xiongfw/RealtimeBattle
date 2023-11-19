import { WebSocketServer } from 'ws';
import { Connection } from './index';
import { ApiMsgEnum } from '../common';

type GameServerOptions = {
  post: number;
};

type SetApiCallback = (connection: Connection, data?: any) => any;

export class GameServer {
  private port: number;
  private wss: WebSocketServer;
  private connections = new Set<Connection>();

  apiMap = new Map<string, SetApiCallback>();

  constructor(options: GameServerOptions) {
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
        console.log('join', this.connections.size);

        connection.on('close', () => {
          this.connections.delete(connection);
          console.log('close', this.connections.size);
        });
      });
    });
  }

  setApi(name: ApiMsgEnum, cb: SetApiCallback) {
    this.apiMap.set(name, cb);
  }
}
