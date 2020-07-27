import Mail from 'nodemailer/lib/mailer';

import { MailerInterface } from '../../src/lib/mailer';

export class MailerMock implements MailerInterface {
  public sendMailMock = jest.fn();
  private mailer: any = {
    sendMail: this.sendMail.bind(this)
  };

  private sendMail(mailOptions: Mail.Options, callback: (err: Error | null, info: any) => void): void {
    this.sendMailMock(mailOptions, callback);
    return callback(null, {});
  }
  public getTransporter(): Mail {
    return this.mailer;
  }
}
