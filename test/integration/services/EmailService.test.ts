import { Container } from 'typedi';
import { EmailService } from '../../../src/api/services/EmailService';
import { createConnection, cleanAll, disconnect } from '../../lib/database';
import { configureLogger } from '../../lib/logger';
import { SendMailOptions } from 'nodemailer';
import { env } from '../../../src/env';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { JobService } from '../../../src/api/services/JobService';
import { MailerMock } from '../../mocks/MailerMock';
import { SendGrid } from '../../../src/lib/mailer';

describe('EmailService', () => {
  let jobService: JobServiceMock;
  let mailerMock: MailerMock;
  let emailService: EmailService;
  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    configureLogger();
    await createConnection();
  });

  beforeEach(() => {
    // fake services that is not required;
    Container.reset();
    jobService = new JobServiceMock();
    mailerMock = new MailerMock();
    Container.set(JobService, jobService);
    Container.set(SendGrid, mailerMock);

    emailService = Container.get<EmailService>(EmailService);
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => { await cleanAll(); await disconnect(); });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should send a raw test email', async () => {
    const option: SendMailOptions = {
      from: env.mailgun.sender,
      to: 'test@sample-api.com',
      subject: 'test raw mail',
      html: '<p> This is a <b>test</b> message</p>',
    };
    await expect(emailService.send(option)).resolves.toBeDefined();
    expect(mailerMock.sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: env.mailgun.sender,
      to: 'test@sample-api.com',
    }), expect.any(Function));
  });


  test('should queue a job for sending test email', async () => {
    const option: SendMailOptions = {
      from: env.mailgun.sender,
      to: 'hoanglong25588@gmail.com',
      subject: 'test raw mail',
      html: '<p> This is a <b>test</b> message</p>',
    };
    await emailService.queueSendingJob(option);
    expect(jobService.scheduleMock).toHaveBeenCalledWith('now', 'SendEmail', expect.any(Object));
  });
});
