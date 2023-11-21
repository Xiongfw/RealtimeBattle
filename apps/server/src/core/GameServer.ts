import { EventEmitter, WebSocketServer } from 'ws';
import { Connection } from './index';
import { ApiModel } from '../common';

type GameServerOptions = {
  post: number;
};

// type SetApiCallback = ;

export class GameServer extends EventEmitter {
  private wss: WebSocketServer;
  readonly port: number;
  readonly connections = new Set<Connection>();

  apiMap = new Map<string, Function>();

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

  setApi<T extends keyof ApiModel>(
    name: T,
    cb: (connection: Connection, data: ApiModel[T]['req']) => ApiModel[T]['res']
  ) {
    this.apiMap.set(name, cb);
  }
}
