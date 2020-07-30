import crypto from 'crypto';
import moment from 'moment';
import { Service } from 'typedi';

import { DocumentType } from '@typegoose/typegoose';

import { env } from '../../env';
import { Logger } from '../../lib/logger';
import { IdentityToken, IIdentityToken, IUser, TokenTypes } from '../models';
import { BaseService } from './BaseService';

@Service()
export class IdentityTokenService extends BaseService<IIdentityToken> {
  constructor() {
    super(new Logger(__filename), IdentityToken);
  }

  public async generateToken(user: IUser | DocumentType<IUser>, tokenType: TokenTypes): Promise<IIdentityToken> {
    this.log.info(`Create new [${tokenType}] token for user [${user.email}]`);
    const { email, _id: userId } = user;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    let expires;
    if (tokenType === TokenTypes.REFRESH_TOKEN) {
      expires = moment().add(30, 'days').toDate();
    } else {
      expires = moment().add(env.jwt.expiresIn, 'minutes').toDate();
    }

    return IdentityToken.create({
      token,
      user: userId,
      email,
      expires,
      type: tokenType,
    } as any);
  }

  public async invalidateToken(cond: any): Promise<IIdentityToken> {
    this.log.verbose('invalidate all token with condition %s', cond);
    return IdentityToken.updateMany(cond, { $set: { expires: new Date() } });
  }
}
