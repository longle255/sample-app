import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { Service } from 'typedi';

import { DocumentType } from '@typegoose/typegoose';

import { env } from '../../env';
import { Logger } from '../../lib/logger';
import { generate2FAToken, generateQR, verify2FAToken } from '../../utils/2FA';
import {
	UserChangePasswordSchema,
	UserConfirm2FASchema,
	UserDisable2FASchema,
	UserSendInvitationEmailSchema,
	UserUpdateProfileSchema,
} from '../controllers/request-schemas';
import { DefaultResponseSchema } from '../controllers/response-schemas/DefaultResponseSchema';
import { IInvitation, IUser, User } from '../models';
import { BaseService } from './BaseService';
import { EmailService } from './EmailService';
import { InvitationService } from './InvitationService';
import { defaultOption, Pagination, PaginationOptionsInterface } from './Pagination';

@Service()
export class UserService extends BaseService<IUser> {
	constructor(private invitationService: InvitationService, private emailService: EmailService) {
		super(new Logger(__filename), User);
	}

	public confirmUser(id: any): Promise<DocumentType<IUser>> {
		this.log.verbose('Set user %s as confirmed', id);
		return this.update(id, {
			$set: {
				isConfirmed: true,
			},
		});
	}

	public async changePassword(id: any, password: string): Promise<DocumentType<IUser>> {
		this.log.verbose('Change password of user %s', id);
		return this.update(id, {
			$set: {
				password: await User.hashPassword(password),
				pwChangedDate: new Date(),
			},
		});
	}

	public async changePasswordWithVerification(id: any, data: UserChangePasswordSchema): Promise<DefaultResponseSchema> {
		this.log.verbose('User trigged change password with verification %s', id);
		if (data.password !== data.passwordConfirm) {
			throw new BadRequestError('Password confirmation does not match');
		}
		const user = await this.findOne({ _id: id });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist or is not active');
		}

		if (user.twoFAEnabled && !data.twoFAToken) {
			throw new ForbiddenError('Missing two-factor authentication token');
		}

		if (user.twoFAEnabled) {
			const verify = verify2FAToken(data.twoFAToken, user.twoFASecret);
			if (!verify) {
				throw new ForbiddenError('Incorrect two-factor authentication token');
			}
		}

		const passwordMatch: boolean = await user.comparePassword(data.oldPassword);
		if (!passwordMatch) {
			throw new BadRequestError('Invalid password');
		}
		user.password = data.password;
		await user.save();
		// await this.update({ _id: id }, { $set: { password: data.password } });
		return new DefaultResponseSchema(true, `Password has been changed successfully`);
	}

	public async updateProfile(id: any, data: UserUpdateProfileSchema): Promise<DocumentType<IUser>> {
		this.log.verbose('Update profile of user %s', id);
		return this.update(id, {
			$set: data,
		});
	}

	public async enable2FA(id: any): Promise<any> {
		const user = await this.findOne({ _id: id });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist or is not active');
		}
		const secret = generate2FAToken(`${env.app.name} - ${user.email}`, env.app.name);
		const { base32, otpauth_url: qrUrl } = secret;
		const qr = await generateQR(qrUrl);
		user.twoFATempSecret = base32;
		await user.save();
		return { base32, qr };
	}

	public async confirm2FA(id: any, input: UserConfirm2FASchema): Promise<DefaultResponseSchema> {
		const user = await this.findOne({ _id: id });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist or is not active');
		}
		if (!user.twoFATempSecret) {
			throw new BadRequestError('Two-factor authentication was not setup');
		}
		const verify = verify2FAToken(input.twoFAToken, user.twoFATempSecret);
		if (!verify) {
			throw new BadRequestError('Incorrect two-factor authentication token');
		}
		user.twoFASecret = user.twoFATempSecret;
		user.twoFAEnabled = true;
		user.twoFATempSecret = undefined;
		await user.save();
		return new DefaultResponseSchema(true, `Two-factor authentication has been enabled for your account`);
	}

	public async disable2FA(id: any, input: UserDisable2FASchema): Promise<DefaultResponseSchema> {
		const user = await this.findOne({ _id: id, twoFAEnabled: true });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist, not active, or 2FA is not enabled');
		}
		const passwordMatch: boolean = await user.comparePassword(input.password);
		if (!passwordMatch) {
			throw new BadRequestError('Invalid password');
		}
		const verify = verify2FAToken(input.twoFAToken, user.twoFASecret);
		if (!verify) {
			throw new BadRequestError('Incorrect two-factor authentication token');
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
		return new DefaultResponseSchema(true, `Two-factor authentication has been disabled for your account`);
	}

	public async sendInvitationEmail(id: any, input: UserSendInvitationEmailSchema): Promise<DefaultResponseSchema> {
		const user = await this.findOne({ _id: id });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist, not active, or 2FA is not enabled');
		}
		for (const email of input.emails) {
			await this.invitationService.create({ invitedBy: id, email } as IInvitation);
		}
		const addresses = input.emails.join(',');
		this.log.verbose('Sending invitations from [%s] to addresses [%s]', user.email, addresses);
		await this.emailService.sendInvitationEmail(user, addresses);
		return new DefaultResponseSchema(true, `Invitations has been sent to your friends`);
	}

	public async getReferrals(id: any, options: PaginationOptionsInterface): Promise<Pagination<IUser>> {
		options = Object.assign({}, defaultOption, options);
		const user = await this.findOne({ _id: id });
		if (!user || !user.isActive) {
			throw new BadRequestError('User does not exist, not active, or 2FA is not enabled');
		}
		const total = user.referrals.length;
		const pageCount = Math.ceil(total / options.pageSize);
		const pageNumber = options.pageNumber;
		const data = await User.find({ email: { $in: user.referrals }, isActive: true })
			.skip(options.pageNumber * options.pageSize)
			.limit(options.pageSize)
			.lean();
		return new Pagination<any>({
			total,
			pagesCount: pageCount,
			pageNumber,
			pageSize: options.pageSize,
			data: data.map((o: any) => {
				// o._id = o._id.toString();
				delete o.password;
				return o;
			}),
		});
	}
}
