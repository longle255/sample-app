import { Container } from 'typedi';
import { User } from '../../src/api/models/User';
import { UserService } from '../../src/api/services/UserService';
import { createConnection, cleanUp } from '../utils/database';
import { configureLogger } from '../utils/logger';

describe('UserService', () => {
  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    configureLogger();
    await createConnection();
    await cleanUp(User);
  });

  beforeEach(() => {});

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(() => {});

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should create a new user in the database', async done => {
    const user = new User();
    user.firstName = 'Instant';
    user.lastName = 'Loan';
    user.password = '123456';
    user.email = 'dev@instantloan';
    const service = Container.get<UserService>(UserService);
    const resultCreate = await service.create(user);
    expect(resultCreate.fullName).toBe('Instant Loan');
    expect(resultCreate.email).toBe(user.email);

    const resultFind = await service.findOne({ _id: resultCreate._id });
    if (resultFind) {
      expect(resultFind.fullName).toBe('Instant Loan');
      expect(resultFind.email).toBe(user.email);
    } else {
      fail('Could not find user');
    }
    done();
  });
});
