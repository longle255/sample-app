import request from 'supertest';
import { Container } from 'typedi';
import { JobService } from '../../../src/api/services/JobService';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { env } from '../../../src/env';
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

  test('GET: /api/v1 should return the api-version', async () => {
    const response = await request(settings.server)
      .get('/api/v1')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.version).toBe(env.app.version);
  });
});
