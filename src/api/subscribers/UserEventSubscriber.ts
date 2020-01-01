import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { IUser, User } from '../models/User';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class UserEventSubscriber {
  @On(events[User.modelName].created)
  public onUserCreate(user: IUser): void {
    log.info('User ' + user.toString() + ' created!');
  }
}
