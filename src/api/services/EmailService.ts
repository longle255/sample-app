import createHttpError from 'http-errors';
import _ from 'lodash';
import Container, { Service } from 'typedi';
import { Logger } from '../../lib/logger';
import { env } from '../../env';
import path from 'path';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import { JobService } from './JobService';
import EmailTemplate from 'email-templates';
import { IUser } from '../models/User';
import { Email, IEmail } from '../models/Email';
import { InstanceType } from 'typegoose';
import { BaseService } from './BaseService';

const templatesDir = path.resolve(__dirname, '../../templates/emails');

const mailgunAuth = {
    auth: {
        api_key: env.mailgun.apiKey,
        domain: env.mailgun.domain,
    },
};
const NO_BCC = [];
const LINK_EMAIL_CONFIRMATION = `${env.app.uri}/account/confirm-email?token=`;
const LINK_RESET_PASSWORD = `${env.app.uri}/account/reset-password?token=`;
@Service()
export class EmailService extends BaseService<IEmail> {
    constructor(
        private mailer: Transporter = nodemailer.createTransport(mg(mailgunAuth)),
        private jobService: JobService = Container.get<JobService>(JobService),
    ) {
        super(new Logger(__filename), Email);
    }

    public find(cond?: object): Promise<Array<InstanceType<IEmail>>> {
        this.log.debug('Find all emails');
        return new Promise<Array<InstanceType<IEmail>>>(async (resolve, reject) => {
            try {
                const result = await Email.find(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public findOne(cond: object): Promise<InstanceType<IEmail> | undefined> {
        this.log.debug('Find one email');
        return new Promise<InstanceType<IEmail>>(async (resolve, reject) => {
            try {
                const result = await Email.findOne(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async create(email: IEmail): Promise<InstanceType<IEmail>> {
        this.log.debug('Create a new email => ', email.toString());
        return new Promise<InstanceType<IEmail>>(async (resolve, reject) => {
            try {
                const result = await Email.create(email);
                resolve(result);
            } catch (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    return reject(createHttpError(409, 'Duplicate key'));
                }
                reject(err);
            }
        });
    }

    public update(id: any, body: any): Promise<InstanceType<IEmail>> {
        this.log.debug('Update a email');
        return new Promise<InstanceType<IEmail>>(async (resolve, reject) => {
            const updateData = _.omit(body, ['id']);
            return Email.findOneAndUpdate({ _id: id }, updateData, { new: true, select: {} })
                .then((result: InstanceType<IEmail>) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public async delete(id: any): Promise<void> {
        this.log.debug('Delete a email');
        return new Promise<void>(async (resolve, reject) => {
            return Email.findByIdAndRemove({ _id: id })
                .then((result: IEmail) => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public async sendTestEmail(address: string, name: string): Promise<void> {
        const subject = `[${env.app.name}] Test email from Instant Loan`;
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
            from: env.mailgun.sender,
            to: address,
            subject,
        });
    }

    public async sendResetPasswordEmail(user: InstanceType<IUser>, token: string): Promise<void> {
        const subject = `Reset password`;
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
            from: env.mailgun.sender,
            to: user.email,
            subject,
            user,
        });
    }

    public async sendRegistrationEmail(user: IUser, token: string): Promise<void> {
        const subject = `Welcome to Instant Loan`;
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
            from: env.mailgun.sender,
            to: user.email,
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
        const content = await emailTemplate.renderAll(options.template, options.locals);
        const mailOption: SendMailOptions = {
            ...options,
            html: content.html,
        };

        await this.queueSendingJob(mailOption, options.recipientVars);
    }

    public queueSendingJob(mailOption: SendMailOptions, recipientVars?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            let data;
            if (env.isProduction) {
                data = {
                    from: mailOption.from,
                    to: mailOption.to,
                    subject: mailOption.subject,
                    html: mailOption.html,
                };
                let shouldBcc = true;
                for (const s of NO_BCC) {
                    if (mailOption.subject.indexOf(s) >= 0) {
                        shouldBcc = false;
                        break;
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
        this.log.debug(`sending out an email with option ${data}`);
        return new Promise((resolve, reject) => {
            this.mailer.sendMail(data, (err, info) => {
                if (err) {
                    return reject(err);
                }
                return resolve(info);
            });
        });
    }
}
