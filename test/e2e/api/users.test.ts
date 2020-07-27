import request from 'supertest';
import { Container } from 'typedi';
import { JobService } from '../../../src/api/services/JobService';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { IUser } from '../../../src/api/models';
import { bootstrapApp, BootstrapSettings } from '../utils/bootstrap';
import { UserFactory } from '../../fixtures/UserFactory';
import { cleanAll } from '../../lib/database';

import { AuthService } from '../../../src/api/services';

const userFactory = new UserFactory();

describe('/api/v1/users', () => {

  let user: IUser;
  let userAuthToken: string;

  let admin: IUser;
  let adminAuthToken: string;
  let jobService: JobServiceMock
  let settings: BootstrapSettings;
  let authService: AuthService;

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    // fake services that is not required;
    Container.reset();
    jobService = new JobServiceMock();
    Container.set(JobService, jobService);

    settings = await bootstrapApp();
    authService = Container.get<AuthService>(AuthService);

    user = await userFactory.createUser();
    let token = await authService.generateAuthToken(user);
    userAuthToken = `${token.token_type} ${token.access_token}`;

    admin = await userFactory.createAdmin();
    token = await authService.generateAuthToken(admin);
    adminAuthToken = `${token.token_type} ${token.access_token}`;
    await userFactory.createMany(10);
  });

  afterAll(async () => {
    await cleanAll();
    await settings.shutdown();
  });


  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('GET: /api/v1/users/profile should return current user profile', async () => {
    let response = await request(settings.server)
      .get('/api/v1/users/profile')
      .set('Authorization', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.email).toBe(user.email);

    response = await request(settings.server)
      .get('/api/v1/users/profile')
      .set('Authorization', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.email).toBe(admin.email);
  });

  test('GET: /api/v1/users should not be accessible for user', async () => {
    const response = await request(settings.server)
      .get(`/api/v1/users`)
      .set('Authorization', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(403);
    expect(response.body.statusCode).toBe(403);
  });

  test('GET: /api/v1/users should be accessible for user', async () => {
    const response = await request(settings.server)
      .get(`/api/v1/users`)
      .set('Authorization', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.total).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(1);
  });

});
