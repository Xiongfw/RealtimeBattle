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
        this.emit(name, data);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
