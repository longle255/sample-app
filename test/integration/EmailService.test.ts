import { Container } from 'typedi';
import { EmailService } from '../../src/api/services/EmailService';
import { createConnection, cleanUp } from '../utils/database';
import { configureLogger } from '../utils/logger';
import { SendMailOptions } from 'nodemailer';
import { env } from '../../src/env';

describe('EmailService', () => {
    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        configureLogger();
        await createConnection();
    });

    // beforeEach(() => {});

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async done => {});

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    // test('should send a raw test email', async () => {
    //     const emailService = Container.get<EmailService>(EmailService);
    //     const option: SendMailOptions = {
    //         from: env.mailgun.sender,
    //         to: 'hoanglong25588@gmail.com',
    //         subject: 'test raw mail',
    //         html: '<p> This is a <b>test</b> message</p>',
    //     };
    //     expect(emailService.send(option)).resolves.toBeDefined();
    // });

    test('should send a test email with default template', async () => {
        const emailService = Container.get<EmailService>(EmailService);
        await emailService.sendTestEmail('hoanglong25588@gmail.com', 'Long');
    });

    test('should queue a job for sending test email', async () => {
        const emailService = Container.get<EmailService>(EmailService);
        const option: SendMailOptions = {
            from: env.mailgun.sender,
            to: 'hoanglong25588@gmail.com',
            subject: 'test raw mail',
            html: '<p> This is a <b>test</b> message</p>',
        };
        expect(emailService.queueSendingJob(option)).resolves.toBeDefined();
    });
});
