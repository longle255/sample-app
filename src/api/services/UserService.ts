import * as _ from 'lodash';
import { Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';
import { Logger } from '../../lib/logger';
import { IInvitation, IUser, User } from '../models';
import { BaseService } from './BaseService';
import { DefaultResponseSchema } from '../controllers/response-schemas/DefaultResponseSchema';
import { PaginationOptionsInterface, Pagination, defaultOption } from './Pagination';
import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { env } from '../../env';
import { verify2FAToken, generate2FAToken, generateQR } from '../../utils/2FA';
import { InvitationService } from './InvitationService';
import { EmailService } from './EmailService';
import {
  UserChangePasswordSchema,
  UserConfirm2FASchema,
  UserDisable2FASchema,
  UserUpdateProfileSchema,
  UserSendInvitationEmailSchema,
} from '../controllers/request-schemas';

@Service()
export class UserService extends BaseService<IUser> {
  constructor(private invitationService: InvitationService, private emailService: EmailService) {
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

      if (user.twoFAEnabled && !data.twoFAToken) {
        return reject(new ForbiddenError('Missing two-factor authentication token'));
      }

      if (user.twoFAEnabled) {
        const verify = verify2FAToken(data.twoFAToken, user.twoFASecret);
        if (!verify) {
          return reject(new ForbiddenError('Incorrect two-factor authentication token'));
        }
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

  public async updateProfile(id: any, data: UserUpdateProfileSchema): Promise<DocumentType<IUser>> {
    this.log.debug('Update profile of user %s', id);
    return new Promise<DocumentType<IUser>>(async (resolve, reject) => {
      const user = await this.update(id, {
        $set: data,
      });
      return resolve(user);
    });
  }

  public async enable2FA(id: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const user = await this.findOne({ _id: id });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist or is not active'));
      }
      const secret = generate2FAToken(`${env.app.name} - ${user.email}`, env.app.name);
      const { base32, otpauth_url: qrUrl } = secret;
      const qr = await generateQR(qrUrl);
      user.twoFATempSecret = base32;
      await user.save();
      return resolve({ base32, qr });
    });
  }

  public async confirm2FA(id: any, input: UserConfirm2FASchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const user = await this.findOne({ _id: id });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist or is not active'));
      }
      if (!user.twoFATempSecret) {
        return reject(new BadRequestError('Two-factor authentication was not setup'));
      }
      const verify = verify2FAToken(input.twoFAToken, user.twoFATempSecret);
      if (!verify) {
        return reject(new BadRequestError('Incorrect two-factor authentication token'));
      }
      user.twoFASecret = user.twoFATempSecret;
      user.twoFAEnabled = true;
      user.twoFATempSecret = undefined;
      await user.save();
      return resolve(new DefaultResponseSchema(true, `Two-factor authentication has been enabled for your account`));
    });
  }

  public async disable2FA(id: any, input: UserDisable2FASchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const user = await this.findOne({ _id: id, twoFAEnabled: true });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist, not active, or 2FA is not enabled'));
      }
      const passwordMatch: boolean = await user.comparePassword(input.password);
      if (!passwordMatch) {
        return reject(new BadRequestError('Invalid password'));
      }
      const verify = verify2FAToken(input.twoFAToken, user.twoFASecret);
      if (!verify) {
        return reject(new BadRequestError('Incorrect two-factor authentication token'));
      }
      await this.update(
        {
          _id: id,
          twoFAEnabled: true,
        },
        {
          $unset: {
            twoFASecret: '',
            twoFATempSecret: '',
          },
          $set: {
            twoFAEnabled: false,
          },
        },
      );
      return resolve(new DefaultResponseSchema(true, `Two-factor authentication has been disabled for your account`));
    });
  }

  public async sendInvitationEmail(id: any, input: UserSendInvitationEmailSchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const user = await this.findOne({ _id: id });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist, not active, or 2FA is not enabled'));
      }
      for (const email of input.emails) {
        await this.invitationService.create({ invitedBy: id, email } as IInvitation);
      }
      const addresses = input.emails.join(',');
      this.log.debug('Sending invitations from [%s] to addresses [%s]', user.email, addresses);
      await this.emailService.sendInvitationEmail(user, addresses);
      return resolve(new DefaultResponseSchema(true, `Invitations has been sent to your friends`));
    });
  }

  public async getReferrals(id: any, options: PaginationOptionsInterface): Promise<Pagination<IUser>> {
    return new Promise<Pagination<IUser>>(async (resolve, reject) => {
      options = Object.assign({}, defaultOption, options);
      const user = await this.findOne({ _id: id });
      if (!user || !user.isActive) {
        return reject(new BadRequestError('User does not exist, not active, or 2FA is not enabled'));
      }
      const total = user.referrals.length;
      const pageCount = Math.ceil(total / options.pageSize);
      const pageNumber = options.pageNumber;
      const data = await User.find({ email: { $in: user.referrals }, isActive: true })
        .skip(options.pageNumber * options.pageSize)
        .limit(options.pageSize)
        .lean();
      return resolve(
        new Pagination<any>({
          total,
          pagesCount: pageCount,
          pageNumber,
          pageSize: options.pageSize,
          data: data.map((o: any) => {
            // o._id = o._id.toString();
            delete o.password;
            return o;
          }),
        }),
      );
    });
  }
}
