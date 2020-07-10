import nodemailer, { Transporter } from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import Mail from 'nodemailer/lib/mailer';
import { Service } from 'typedi';

import { env } from '../../env';
import { MailerInterface } from './';

@Service({ global: true })
export class Mailgun implements MailerInterface {
  private mailgunAuth;
  private mailer: Transporter;

  constructor() {
    this.mailgunAuth = {
      auth: {
        api_key: env.mailgun.apiKey,
        domain: env.mailgun.domain,
      },
    };
    this.mailer = nodemailer.createTransport(mg(this.mailgunAuth));
  }

  public getTransporter(): Mail {
    return this.mailer;
  }
}
