import request from 'supertest';
import { Container } from 'typedi';
import { JobService } from '../../../src/api/services/JobService';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { bootstrapApp, BootstrapSettings } from '../utils/bootstrap';
import { cleanAll } from '../../lib/database';

describe('/api', () => {
  let jobService: JobServiceMock
  let settings: BootstrapSettings;
  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    // fake services that is not required;
    Container.reset();
    jobService = new JobServiceMock();
    Container.set(JobService, jobService);

    settings = await bootstrapApp();
  });


  afterAll(async () => {
    await cleanAll();
    await settings.shutdown();
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------
  test('GET: / should contain response time header', async () => {
    const response = await request(settings.app.callback())
      .get('/api/v1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.header['x-response-time']).toBeDefined();
  });

  test('GET: / should contain request id header', async () => {
    const response = await request(settings.app.callback())
      .get('/api/v1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.header['x-request-id']).toBeDefined();
  });

  test('GET: /api/users should return forbidden', async () => {
    const response = await request(settings.app.callback())
      .get('/api/v1/users')
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.statusCode).toBe(403);
  });
});
