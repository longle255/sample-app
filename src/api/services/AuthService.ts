import jwt from 'jsonwebtoken';
import Koa from 'koa';
import _ from 'lodash';
import moment from 'moment';
import { Action, BadRequestError } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  ConfirmEmailRequestSchema,
  EmailRequestSchema,
  ResetPasswordRequestSchema,
} from '../controllers/request-schemas';
import { TokenTypes, IIdentityToken } from '../models/IdentityToken';
import { IUser, User, ROLES_ALL } from '../models/User';
import { IdentityTokenService } from './IdentityTokenService';
import { UserService } from './UserService';
import { EmailService } from './EmailService';
import { DefaultResponseSchema } from '../controllers/response-schemas/DefaultResponseSchema';

export interface IAuthOption {
  secret: string;
  debug: boolean;
  tokenKey?: string;
}

interface IUserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
  id: string;
}

export interface ITokenInfo {
  token_type: string;
  access_token: string;
  expires_in: number | string;
  profile: IUserProfile;
}

@Service()
export class AuthService {
  constructor(
    @Logger(__filename) private log: LoggerInterface,
    private userService: UserService,
    private identityTokenService: IdentityTokenService,
    private emailService: EmailService,
  ) {}

  public getAuthorizationHeader(ctx: Koa.Context): string {
    if (!ctx.header || !ctx.header.authorization) {
      return undefined;
    }
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        return _.trim(credentials);
      }
    }
    return undefined;
  }

  public parseFromAuthorizationHeader(authToken: string): object | string {
    if (!authToken) {
      this.log.info('No credentials provided by the client');
      return undefined;
    }
    try {
      if (!env.jwt.secret) {
        throw new Error('Secret not provided');
      }
      const decodedToken = jwt.verify(authToken, env.jwt.secret);
      return decodedToken;
    } catch (e) {
      const msg = 'Invalid token - ' + e.message;
      this.log.warn(msg);
      return undefined;
    }
  }

  public async verifyUser(parsedToken: any, roles: string[]): Promise<DocumentType<IUser>> {
    const user = await User.findOne({ _id: parsedToken.sub, isActive: true });
    if (!user) {
      return undefined;
    }
    if (!roles.length || roles.indexOf(user.role) !== -1) {
      return user;
    }
    return undefined;
  }

  public async register(account: RegisterRequestSchema): Promise<IUser> {
    return new Promise<IUser>(async (resolve, reject) => {
      const exists = await this.userService.find({ email: account.email });
      const activeUsers = exists.filter(u => u.isActive);
      if (activeUsers.length) {
        return reject(new BadRequestError('Email has been used'));
      }
      let referrer: DocumentType<IUser>;
      if (account.referCode) {
        referrer = await this.userService.findOne({ referralCode: account.referCode });
        if (!referrer) {
          return reject(new BadRequestError('Referral code is not valid'));
        }
      }
      const user: DocumentType<IUser> = await this.userService.create(
        new User({
          ...account,
          referrer,
        }),
      );
      if (referrer) {
        await this.userService.update(referrer._id, {
          $push: {
            referrals: account.email,
          },
        });
      }
      await this.generateConfirmTokenAndEmail(user);
      return resolve(user.toJSON());
    });
  }

  public async login(credential: LoginRequestSchema): Promise<ITokenInfo> {
    return new Promise<ITokenInfo>(async (resolve, reject) => {
      const user: DocumentType<IUser> = await this.userService.findOne({ email: credential.email });

      if (!user) {
        return reject(new BadRequestError('Email and password combination is not valid'));
      }

      if (!user.isActive) {
        return reject(new BadRequestError('Your account is locked'));
      }

      if (!user.isConfirmed) {
        return reject(new BadRequestError('Please confirm your email address by clicking the confirmation link in your email'));
      }

      const pwMatched = await user.comparePassword(credential.password);

      if (!pwMatched) {
        return reject(new BadRequestError('Email and password combination is not valid'));
      }

      const token = this.generateAuthToken(user);
      return resolve(token);
    });
  }

  public async confirmEmail(data: ConfirmEmailRequestSchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const token: IIdentityToken = await this.identityTokenService.findOne({
        token: data.token,
        type: TokenTypes.EMAIL_CONFIRMATION,
        expires: {
          $gt: new Date(),
        },
      });
      if (!token) {
        return reject(new BadRequestError('Token is invalid'));
      }
      await this.userService.confirmUser(token.user);
      await this.identityTokenService.invalidateToken({
        email: token.email,
        type: TokenTypes.EMAIL_CONFIRMATION,
      });
      resolve(new DefaultResponseSchema(true));
    });
  }

  public async resendConfirmEmail(data: EmailRequestSchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const user: DocumentType<IUser> = await this.userService.findOne({ email: data.email });
      if (!user) {
        return resolve(
          new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`),
        );
      }
      await this.generateConfirmTokenAndEmail(user);
      return resolve(
        new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`),
      );
    });
  }

  public async forgotPassword(data: EmailRequestSchema): Promise<DefaultResponseSchema> {
    return new Promise<DefaultResponseSchema>(async (resolve, reject) => {
      const user: DocumentType<IUser> = await this.userService.findOne({ email: data.email });
      if (!user) {
        return resolve(
          new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`),
        );
      }
      const token = await this.identityTokenService.generateToken(user, TokenTypes.RESET_PASSWORD);
      this.emailService.sendResetPasswordEmail(user, token.token);
      return resolve(
        new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`),
      );
    });
  }
  public async resetPassword(data: ResetPasswordRequestSchema): Promise<IUser> {
    return new Promise<IUser>(async (resolve, reject) => {
      const token: IIdentityToken = await this.identityTokenService.findOne({
        token: data.token,
        type: TokenTypes.RESET_PASSWORD,
        expires: {
          $gt: new Date(),
        },
      });
      if (!token) {
        return reject(new BadRequestError('Token is invalid'));
      }
      const user: DocumentType<IUser> = await this.userService.changePassword(token.user, data.password);
      await this.identityTokenService.invalidateToken({
        email: token.email,
        type: TokenTypes.RESET_PASSWORD,
      });
      return resolve(user);
    });
  }

  private async generateConfirmTokenAndEmail(user: DocumentType<IUser>): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const token = await this.identityTokenService.generateToken(user, TokenTypes.EMAIL_CONFIRMATION);
      this.emailService.sendRegistrationEmail(user, token.token);
      resolve();
    });
  }

  private async generateAuthToken(user: DocumentType<IUser>): Promise<ITokenInfo> {
    return new Promise<ITokenInfo>(async (resolve, reject) => {
      const payload = {
        exp: moment()
          .add(env.jwt.expiresIn, 'minutes')
          .unix(),
        iat: moment().unix(),
        sub: user._id,
      };
      const access_token = jwt.sign(payload, env.jwt.secret, env.jwt.signOptions);
      await this.identityTokenService.generateToken(user, TokenTypes.REFRESH_TOKEN);
      const tokenData: ITokenInfo = {
        token_type: 'Bearer',
        access_token,
        expires_in: env.jwt.expiresIn,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          id: user._id.toString(),
        },
      };
      resolve(tokenData);
    });
  }
}

export function authorizationChecker(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  const authService = Container.get<AuthService>(AuthService);
  return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const token = authService.getAuthorizationHeader(action.request);

    if (token === undefined || !token.length) {
      return false;
    }

    const parsedToken = await authService.parseFromAuthorizationHeader(token);
    if (!parsedToken) {
      return false;
    }
    if (!roles || !roles.length) {
      roles = ROLES_ALL;
    }
    const user = await authService.verifyUser(parsedToken, roles);

    if (!user) {
      return false;
    }
    action.context.state.user = user;
    return true;
  };
}

export function currentUserChecker(): (action: Action) => Promise<IUser | undefined> {
  return async function innerCurrentUserChecker(action: Action): Promise<IUser | undefined> {
    return action.context.state.user;
  };
}
