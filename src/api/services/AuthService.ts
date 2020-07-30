import axios from 'axios';
import jwt, { SignOptions } from 'jsonwebtoken';
import Koa from 'koa';
import _ from 'lodash';
import moment from 'moment';
import { Action, BadRequestError, ForbiddenError } from 'routing-controllers';
import { Container, Service, Inject } from 'typedi';

import { DocumentType } from '@typegoose/typegoose';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { verify2FAToken } from '../../utils/2FA';
import {
	ConfirmEmailRequestSchema,
	EmailRequestSchema,
	LoginRequestSchema,
	RegisterRequestSchema,
	ResetPasswordRequestSchema,
} from '../controllers/request-schemas';
import { DefaultResponseSchema } from '../controllers/response-schemas/DefaultResponseSchema';
import { IIdentityToken, TokenTypes } from '../models/IdentityToken';
import { IUser, ROLES_ALL, User } from '../models/User';
import { EmailService } from './EmailService';
import { IdentityTokenService } from './IdentityTokenService';
import { UserService } from './UserService';
import { RefreshTokenRequestSchema } from '../controllers/request-schemas/RefreshTokenRequestSchema';

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
  refresh_token: string;
	expires_in: number | string;
	profile: IUserProfile;
}

@Service()
export class AuthService {
	@Inject(() => UserService)
	private userService: UserService;
	@Inject(() => IdentityTokenService)
	private identityTokenService: IdentityTokenService;
	@Inject(() => EmailService)
	private emailService: EmailService;

	constructor(@Logger(__filename) private log: LoggerInterface) {}

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

	// eslint-disable-next-line @typescript-eslint/ban-types
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
		const exists = await this.userService.find({ email: account.email });
		const activeUsers = exists.filter((u) => u.isActive);
		if (activeUsers.length) {
			throw new BadRequestError('Email has been used');
		}
		let referrer: DocumentType<IUser>;
		if (account.referCode) {
			referrer = await this.userService.findOne({ referralCode: account.referCode });
			if (!referrer) {
				throw new BadRequestError('Referral code is not valid');
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
		return user.toJSON();
	}

	public async login(credential: LoginRequestSchema): Promise<ITokenInfo> {
		const user: DocumentType<IUser> = await this.userService.findOne({ email: credential.email });

		if (!user) {
			throw new BadRequestError('Email and password combination is not valid');
		}

		const pwMatched = await user.comparePassword(credential.password);

		if (!pwMatched) {
			throw new BadRequestError('Email and password combination is not valid');
		}

		if (!user.isActive) {
			throw new ForbiddenError('Your account is locked');
		}

		if (!user.isConfirmed) {
			throw new ForbiddenError('Please confirm your email address by clicking the confirmation link in your email');
		}

		if (user.twoFAEnabled && !credential.twoFAToken) {
			throw new ForbiddenError('Missing two-factor authentication token');
		}

		if (user.twoFAEnabled) {
			const verify = verify2FAToken(credential.twoFAToken, user.twoFASecret);
			if (!verify) {
				throw new ForbiddenError('Incorrect two-factor authentication token');
			}
		}

		const token = this.generateAuthToken(user);
		return token;
	}

	public async refreshToken(token: RefreshTokenRequestSchema): Promise<ITokenInfo> {
		const user: DocumentType<IUser> = await this.userService.findOne({ email: token.email });

		if (!user) {
			throw new BadRequestError('Email is not valid');
		}

		if (!user.isActive) {
			throw new BadRequestError('Your account is locked');
		}

		if (!user.isConfirmed) {
			throw new BadRequestError('Please confirm your email address by clicking the confirmation link in your email');
		}

		const refreshObject = await this.identityTokenService.findOneAndRemove({
			email: token.email,
			token: token.token,
			type: TokenTypes.REFRESH_TOKEN,
			expires: {
				$gt: new Date(),
			},
		});

		if (!refreshObject || refreshObject.email !== user.email) {
			throw new BadRequestError('Token is not valid');
		}

		const newToken = this.generateAuthToken(user);
		return newToken;
	}

	public async confirmEmail(data: ConfirmEmailRequestSchema): Promise<DefaultResponseSchema> {
		const token: IIdentityToken = await this.identityTokenService.findOne({
			token: data.token,
			type: TokenTypes.EMAIL_CONFIRMATION,
			expires: {
				$gt: new Date(),
			},
		});
		if (!token) {
			throw new BadRequestError('Token is invalid');
		}
		await this.userService.confirmUser(token.user);
		await this.identityTokenService.invalidateToken({
			email: token.email,
			type: TokenTypes.EMAIL_CONFIRMATION,
		});
		return new DefaultResponseSchema(true);
	}

	public async resendConfirmEmail(data: EmailRequestSchema): Promise<DefaultResponseSchema> {
		const user: DocumentType<IUser> = await this.userService.findOne({ email: data.email });
		if (!user) {
			return new DefaultResponseSchema(
				true,
				`An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`,
			);
		}
		await this.generateConfirmTokenAndEmail(user);
		return new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`);
	}

	public async forgotPassword(data: EmailRequestSchema): Promise<DefaultResponseSchema> {
		const user: DocumentType<IUser> = await this.userService.findOne({ email: data.email });
		if (!user) {
			return new DefaultResponseSchema(
				true,
				`An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`,
			);
		}
		const token = await this.identityTokenService.generateToken(user, TokenTypes.RESET_PASSWORD);
		this.emailService.sendResetPasswordEmail(user, token.token);
		return new DefaultResponseSchema(true, `An email has been sent to ${data.email}. Please check your inbox or spam folder for next step`);
	}
	public async resetPassword(data: ResetPasswordRequestSchema): Promise<IUser> {
		const token: IIdentityToken = await this.identityTokenService.findOne({
			token: data.token,
			type: TokenTypes.RESET_PASSWORD,
			expires: {
				$gt: new Date(),
			},
		});
		if (!token) {
			throw new BadRequestError('Token is invalid');
		}
		const user: DocumentType<IUser> = await this.userService.changePassword(token.user, data.password);
		await this.identityTokenService.invalidateToken({
			email: token.email,
			type: TokenTypes.RESET_PASSWORD,
		});
		return user;
	}

	public async generateConfirmTokenAndEmail(user: DocumentType<IUser>): Promise<void> {
		const token = await this.identityTokenService.generateToken(user, TokenTypes.EMAIL_CONFIRMATION);
		await this.emailService.sendRegistrationEmail(user, token.token);
		return;
	}

	public async generateAuthToken(user: IUser | DocumentType<IUser>): Promise<ITokenInfo> {
		const payload = {
			exp: moment().add(env.jwt.expiresIn, 'minutes').unix(),
			iat: moment().unix(),
			sub: user._id,
		};
		const access_token = jwt.sign(payload, env.jwt.secret, env.jwt.signOptions as SignOptions);
		const refresh_token = await this.identityTokenService.generateToken(user, TokenTypes.REFRESH_TOKEN);
		const tokenData: ITokenInfo = {
			token_type: 'Bearer',
			access_token,
      refresh_token: refresh_token.token,
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
		return tokenData;
	}

	public async fetchFacebookData(access_token: string): Promise<any> {
		const fields = 'id, name, email, picture';
		const url = 'https://graph.facebook.com/me';
		const params = { access_token, fields };
		try {
			const response = await axios.get(url, { params });
			const { id, name, email, picture } = response.data;
			const nameToken = name.split(' ');
			return {
				service: 'facebook',
				avatarUrl: picture.data.url,
				serviceUserId: id,
				firstName: nameToken[0],
				lastName: nameToken.length > 1 ? nameToken[1] : nameToken[0],
				email,
			};
		} catch (err) {
			this.log.error(`Failed to fetch Facebook profile of token ${access_token}. Error: `, err.stack);
			return undefined;
		}
	}
}

export function authorizationChecker(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
	const authService: AuthService = Container.get(AuthService);
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
