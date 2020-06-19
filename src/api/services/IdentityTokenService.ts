import crypto from 'crypto';
import _ from 'lodash';
import moment from 'moment';
import { Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';
import { Logger } from '../../lib/logger';
import { env } from '../../env';
import { IdentityToken, IIdentityToken, TokenTypes } from '../models/IdentityToken';
import { IUser } from '../models/User';
import { BaseService } from './BaseService';

@Service()
export class IdentityTokenService extends BaseService<IIdentityToken> {
  constructor() {
    super(new Logger(__filename), IdentityToken);
  }

  public async generateToken(user: DocumentType<IUser>, tokenType: TokenTypes): Promise<IIdentityToken> {
    this.log.info(`Create new [${tokenType}] token for user [${user.email}]`);
    return new Promise<IIdentityToken>((resolve, reject) => {
      const { email, _id: userId } = user;
      const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
      let expires;
      if (tokenType === TokenTypes.REFRESH_TOKEN) {
        expires = moment()
          .add(30, 'days')
          .toDate();
      } else {
        expires = moment()
          .add(env.jwt.expiresIn, 'minutes')
          .toDate();
      }

      IdentityToken.create({
        token,
        user: userId,
        email,
        expires,
        type: tokenType,
      } as IIdentityToken)
        .then((result: IIdentityToken) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public invalidateToken(cond: any): Promise<void> {
    this.log.debug('invalidate all token with condition %s', cond);
    return new Promise<void>(async (resolve, reject) => {
      return IdentityToken.update(
        cond,
        {
          $set: {
            expires: new Date(),
          },
        },
        {
          multi: true,
        },
      )
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
