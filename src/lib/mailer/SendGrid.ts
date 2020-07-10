import nodemailer, { Transporter } from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid';
import Mail from 'nodemailer/lib/mailer';
import { Service } from 'typedi';

import { env } from '../../env';
import { MailerInterface } from './';

@Service({ global: true })
export class SendGrid implements MailerInterface {
  private sendgridAuth: { apiKey: string };
  private mailer: Transporter;

  constructor() {
    this.sendgridAuth = {
      apiKey: env.sendgrid.apiKey,
    };
    this.mailer = nodemailer.createTransport(sendgrid(this.sendgridAuth));
  }

  public getTransporter(): Mail {
    return this.mailer;
  }
}
