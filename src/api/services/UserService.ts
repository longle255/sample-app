import * as _ from 'lodash';
import { Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';
import { Logger } from '../../lib/logger';
import { IUser, User } from '../models/User';
import { BaseService } from './BaseService';
import { UserChangePasswordSchema } from '../controllers/request-schemas/UserChangePasswordSchema';
import { DefaultResponseSchema } from '../controllers/response-schemas/DefaultResponseSchema';
import { BadRequestError } from 'routing-controllers';

@Service()
export class UserService extends BaseService<IUser> {
  constructor() {
    super(new Logger(__filename), User);
  }

  public confirmUser(id: any): Promise<DocumentType<IUser>> {
    this.log.debug('Set user %s as confirmed', id);
    return this.update(id, {
      $set: {
        isConfirmed: true,
      },
    });
  }

  public async changePassword(id: any, password: string): Promise<DocumentType<IUser>> {
    this.log.debug('Change password of user %s', id);
    return this.update(id, {
      $set: {
        password: await User.hashPassword(password),
        pwChangedDate: new Date(),
      },
    });
  }

  public async changePasswordWithVerification(id: any, data: UserChangePasswordSchema): Promise<DefaultResponseSchema> {
    this.log.debug('User trigged change password with verification %s', id);
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      if (data.password !== data.passwordConfirm) {
        return reject(new BadRequestError('Password confirmation does not match'));
      }
      const user = await this.findOne({ _id: id });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist or is not active'));
      }
      const passwordMatch: boolean = await user.comparePassword(data.oldPassword);
      if (!passwordMatch) {
        return reject(new BadRequestError('Invalid password'));
      }
      user.password = data.password;
      await user.save();
      // await this.update({ _id: id }, { $set: { password: data.password } });
      return resolve(new DefaultResponseSchema(true, `Password has been changed successfully`));
    });
  }
}
