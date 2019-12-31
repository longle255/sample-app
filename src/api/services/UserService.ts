import * as _ from 'lodash';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';
import { Logger } from '../../lib/logger';
import { IUser, User } from '../models/User';
import { BaseService } from './BaseService';

@Service()
export class UserService extends BaseService<IUser> {
    constructor() {
        super(new Logger(__filename), User, 'user');
    }

    public confirmUser(id: any): Promise<InstanceType<IUser>> {
        this.log.debug('Set user %s as confirmed', id);
        return this.update(id, {
            $set: {
                isConfirmed: true,
            },
        });
    }

    public async changePassword(id: any, password: string): Promise<InstanceType<IUser>> {
        this.log.debug('Change password of user %s', id);
        return this.update(id, {
            $set: {
                password: await User.hashPassword(password),
                pwChangedDate: new Date(),
            },
        });
    }
}
