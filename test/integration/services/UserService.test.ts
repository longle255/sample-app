import { Container } from 'typedi';
import { User } from '../../../src/api/models/User';
import { UserService } from '../../../src/api/services/UserService';
import { createConnection, cleanAll, disconnect } from '../../lib/database';
import { configureLogger } from '../../lib/logger';
import { UserFactory } from '../../fixtures/UserFactory';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { JobService } from '../../../src/api/services/JobService';

const userFactory = new UserFactory();

describe('UserService - BaseService', () => {
  let jobService: JobServiceMock
  let userService: UserService

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    configureLogger();
    await createConnection();
    await userFactory.createUser();
    await userFactory.createMany(10);
  });

  beforeEach(() => {
    // fake services that is not required;
    Container.reset();
    jobService = new JobServiceMock();
    Container.set(JobService, jobService);

    userService = Container.get<UserService>(UserService);
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => { await cleanAll(); await disconnect(); });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should create a new user in the database', async () => {
    const user = new User();
    user.firstName = 'Instant';
    user.lastName = 'Loan';
    user.password = '123456';
    user.email = 'dev@instantloan';
    const resultCreate = await userService.create(user);
    expect(resultCreate.fullName).toBe('Instant Loan');
    expect(resultCreate.email).toBe(user.email);

    const resultFind = await userService.findOne({ _id: resultCreate._id });
    if (resultFind) {
      expect(resultFind.fullName).toBe('Instant Loan');
      expect(resultFind.email).toBe(user.email);
    } else {
      throw new Error('Could not find user');
    }
  });
});
