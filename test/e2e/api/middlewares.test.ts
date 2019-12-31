import request from 'supertest';

import { bootstrapApp, BootstrapSettings } from '../utils/bootstrap';

describe('/api', () => {
    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    let settings: BootstrapSettings;
    beforeAll(async () => (settings = await bootstrapApp()));

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------
    test('GET: / should contain response time header', async done => {
        const response = await request(settings.server)
            .get('/api')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.header['x-response-time']).toBeDefined();
        done();
    });

    test('GET: / should contain request id header', async done => {
        const response = await request(settings.server)
            .get('/api')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.header['x-request-id']).toBeDefined();
        done();
    });

    test('GET: /api/users should return forbidden', async done => {
        const response = await request(settings.server)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body.statusCode).toBe(403);
        done();
    });
});
