import { Transporter } from 'nodemailer';

export * from './Mailgun';
export * from './SendGrid';
export interface MailerInterface {
  getTransporter(): Transporter;
}
