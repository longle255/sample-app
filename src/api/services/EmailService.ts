import EmailTemplate from 'email-templates';
import { SendMailOptions } from 'nodemailer';
import path from 'path';
import { Inject, Service } from 'typedi';

import { DocumentType } from '@typegoose/typegoose';

import { env } from '../../env';
import { Logger } from '../../lib/logger';
import { MailerInterface, SendGrid } from '../../lib/mailer';
import { Email, IEmail, IUser } from '../models';
import { BaseService } from './BaseService';
import { JobService } from './JobService';

const templatesDir = path.resolve(__dirname, '../../templates/emails');

const NO_BCC = [];
const LINK_EMAIL_CONFIRMATION = `${env.app.uri}/auth/confirm-email?token=`;
const LINK_RESET_PASSWORD = `${env.app.uri}/auth/reset-password?token=`;
const LINK_INVITATION = `${env.app.uri}/auth/signup?ref=`;

const defaultValues = {
	appName: env.app.name,
	appUri: env.app.uri,
};
@Service()
export class EmailService extends BaseService<IEmail> {
	@Inject(() => JobService)
	private jobService: JobService;

	@Inject(() => SendGrid)
	private mailerProvider: MailerInterface;

	constructor() {
		super(new Logger(__filename), Email);
	}

	public async sendTestEmail(address: string, name: string): Promise<void> {
		const subject = `[${env.app.name}] Test email from ${env.app.name}`;
		const content = {
			subject,
			host: env.app.host,
			name,
			email: address,
			data: [],
		};
		await this.renderAndQueueJob({
			template: 'default',
			locals: content,
			from: env.sendgrid.sender,
			to: address,
			subject,
		});
	}

	public async sendResetPasswordEmail(user: DocumentType<IUser>, token: string): Promise<void> {
		const subject = 'Reset password';
		const content = {
			subject,
			host: env.app.host,
			name: user.firstName,
			email: user.email,
			link: LINK_RESET_PASSWORD + token,
			data: [],
		};
		await this.renderAndQueueJob({
			template: 'reset-password',
			locals: content,
			from: env.sendgrid.sender,
			to: user.email,
			subject,
			user,
		});
	}

	public async sendRegistrationEmail(user: IUser, token: string): Promise<void> {
		const subject = `Welcome to ${env.app.name}`;
		const content = {
			subject,
			host: env.app.host,
			name: user.firstName,
			email: user.email,
			link: LINK_EMAIL_CONFIRMATION + token,
			data: [],
		};
		await this.renderAndQueueJob({
			template: 'registration',
			locals: content,
			from: env.sendgrid.sender,
			to: user.email,
			subject,
			user,
		});
	}

	public async sendInvitationEmail(user: IUser, addresses: string): Promise<void> {
		const subject = `[${env.app.name}] You have got an invitation from ${user.fullName}`;
		const content = {
			subject,
			host: env.app.host,
			name: user.fullName,
			email: user.email,
			link: LINK_INVITATION + user.referralCode,
			data: [],
		};
		await this.renderAndQueueJob({
			template: 'invitation',
			locals: content,
			from: env.sendgrid.sender,
			to: addresses,
			subject,
			user,
		});
	}

	public async renderAndQueueJob(options: any): Promise<void> {
		const emailTemplate = new EmailTemplate({
			views: {
				root: templatesDir,
				options: {
					extension: 'ejs',
				},
			},
		});
		if (env.isDevelopment && env.emailDebug) {
			emailTemplate.preview = {
				open: {
					app: 'firefox',
					wait: false,
				},
			};
		}
		const email = new Email({
			user: options.user,
			email: options.to,
			payload: options.locals,
			template: options.template,
		});
		await this.create(email);

		if (!options.locals.email) {
			options.locals.email = options.to;
		}

		const content = await emailTemplate.renderAll(options.template, Object.assign({}, options.locals, defaultValues));
		const mailOption: SendMailOptions = {
			...options,
			html: content.html,
		};

		await this.queueSendingJob(mailOption, options.recipientVars);
	}

	public queueSendingJob(mailOption: SendMailOptions, recipientVars?: any): Promise<void> {
		return new Promise((resolve, reject) => {
			let data;
			if (env.isProduction || !env.emailDebug) {
				data = {
					from: mailOption.from,
					to: mailOption.to,
					subject: mailOption.subject,
					html: mailOption.html,
				};
				let shouldBcc = true;
				if (mailOption.to.toString().indexOf(env.adminEmail) >= 0) {
					shouldBcc = false;
				} else {
					for (const s of NO_BCC) {
						if (mailOption.subject.indexOf(s) >= 0) {
							shouldBcc = false;
							break;
						}
					}
				}
				if (shouldBcc) {
					data.bcc = env.adminEmail;
				}
			} else {
				data = {
					from: mailOption.from,
					to: env.adminEmail,
					subject: mailOption.subject,
					html: mailOption.html,
				};
			}
			if (mailOption.text) {
				data.text = mailOption.text;
			}
			if (recipientVars) {
				data['recipient-variables'] = recipientVars;
			}

			try {
				this.jobService.schedule('now', 'SendEmail', data);
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	}

	public send(data: SendMailOptions): Promise<any> {
		this.log.verbose(`sending out an email with option ${data}`);
		return new Promise((resolve, reject) => {
			this.mailerProvider.getTransporter().sendMail(data, (err, info) => {
				if (err) {
					return reject(err);
				}
				return resolve(info);
			});
		});
	}
}
