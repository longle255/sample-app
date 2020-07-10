import { Container, Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import Socket from '../../lib/websocket';

@Service({ global: true }) // singleton
export class WsService {
	private socket: Socket;

	constructor(@Logger(__filename) private log: LoggerInterface) {
		this.socket = Container.get(Socket);
	}

	public async addNewFeed(feed: any): Promise<void> {
		this.log.debug('adding new feed');
		this.socket.broadcast(Socket.ROOM_NEW_FEEDS, [feed]);
	}
}
