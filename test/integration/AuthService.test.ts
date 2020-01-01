import { Container } from 'typedi';
import { User } from '../../src/api/models/User';
import { UserService } from '../../src/api/services/UserService';
import { createConnection, cleanUp } from '../utils/database';
import { configureLogger } from '../utils/logger';
import { RegisterRequestSchema } from '../../src/api/controllers/request-schemas';
import { AuthService, ITokenInfo } from '../../src/api/services/AuthService';
import { BadRequestError } from 'routing-controllers';

const account: RegisterRequestSchema = {
  email: 'test@sample.com',
  firstName: 'Test',
  lastName: 'INL',
  password: '123456',
};

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

  test('should success register new user', async () => {
    const service = Container.get<AuthService>(AuthService);
    const result: ITokenInfo = await service.register(account);
    expect(result.access_token).toBeDefined();
    const userService = Container.get<UserService>(UserService);
    const user = await userService.findOne({ email: account.email });
    expect(user.firstName).toBe(account.firstName);
  });

  test('should failed register duplicated email', async () => {
    const newAccount: RegisterRequestSchema = {
      email: 'test@sample.com',
      firstName: 'Test',
      lastName: 'INL',
      password: '123456',
    };
    const service = Container.get<AuthService>(AuthService);
    expect(service.register(newAccount)).rejects.toEqual(new BadRequestError('Email has been used'));
  });

  test('should success register new user with correct ref code', async () => {
    const userService = Container.get<UserService>(UserService);
    let user = await userService.findOne({ email: account.email });
    const newAccount: RegisterRequestSchema = {
      email: 'test2@sample.com',
      firstName: 'Test 2',
      lastName: 'INL',
      password: '123456',
      referCode: user.referralCode,
    };
    const service = Container.get<AuthService>(AuthService);
    const result: ITokenInfo = await service.register(newAccount);
    expect(result.access_token).toBeDefined();
    const newUser = await userService.findOne({ email: newAccount.email });
    expect(newUser.referrer.toString()).toBe(user._id.toString());
    user = await userService.findOne({ email: account.email });
    expect(user.referrals.indexOf(newUser.email)).toBeGreaterThanOrEqual(0);
  });

  test('should failed register new user with incorrect ref code', async () => {
    const newAccount: RegisterRequestSchema = {
      email: 'test3@sample.com',
      firstName: 'Test 2',
      lastName: 'INL',
      password: '123456',
      referCode: 'xxxxx',
    };
    const service = Container.get<AuthService>(AuthService);
    expect(service.register(newAccount)).rejects.toEqual(new BadRequestError('Referral code is not valid'));
  });
});
