import { EventDispatcher } from 'event-dispatch';
import SocketIO from 'koa-socket-2';
import { Service } from 'typedi';

import { events } from '../../api/subscribers/events';
import { Logger } from '../logger';

@Service({ global: true })
export default class Socket {
  public static ROOM_NEW_FEEDS = 'ROOM_NEW_FEEDS';

  private io: SocketIO;
  private log = new Logger(__filename);

  private sockets = [];

  private eventDispatcher: EventDispatcher;

  constructor() {
    this.io = new SocketIO();
    this.eventDispatcher = new EventDispatcher();
  }

  public attach(app: any): void {
    this.io.attach(app);

    this.io.on('message', (_ctx: any, data: any) => {
      this.log.debug('client sent data to message endpoint', data);
    });

    this.io.on('connection', socket => {
      socket.join(Socket.ROOM_NEW_FEEDS);
      this.log.debug('New client connected id=', socket.id);
      this.eventDispatcher.dispatch(events.socket.connected, socket);
      this.sockets[socket.id] = socket;
      socket.on('disconnect', () => {
        this.log.debug('Client disconnected id=', socket.id);
        delete this.sockets[socket.id];
      });
    });
  }

  public broadcast(room: string, data: any): void {
    this.log.silly(`Broadcast to room [${room}] with data`, data);
    // to(room): send to all connection in that room
    // emit(room, data)=> room is the flag for the message
    this.io.to(room).emit(room, data);
  }

  public send(socket: any, flag: any, data: any): void {
    this.log.silly(`Send to socket[${socket.id}] with data`, data);
    socket.emit(flag, data);
  }
}
