import { Container } from 'typedi';
import { AuthService, ITokenInfo } from '../../../src/api/services/AuthService';
import { UserService } from '../../../src/api/services/UserService';
import { IUser, IdentityToken, User } from '../../../src/api/models';
import { createConnection, cleanAll, disconnect } from '../../lib/database';
import { configureLogger } from '../../lib/logger';
import { RegisterRequestSchema } from '../../../src/api/controllers/request-schemas';
import { JobService } from '../../../src/api/services/JobService';
import { JobServiceMock } from '../../mocks/JobServiceMock';
import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { DefaultResponseSchema } from '../../../src/api/controllers/response-schemas/DefaultResponseSchema';

const account: RegisterRequestSchema = {
  email: 'test@sample.com',
  firstName: 'Test',
  lastName: 'INL',
  password: '123456',
};

describe('AuthService', () => {
  let authService: AuthService;
  let jobService: JobServiceMock
  let userService: UserService
  let user: IUser;
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
    Container.set(JobService, jobService);

    authService = Container.get<AuthService>(AuthService);
    userService = Container.get<UserService>(UserService);
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => {
    await cleanAll();
    await disconnect();
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should success register new user', async () => {
    const result: IUser = await authService.register(account);
    expect(result.email).toBeDefined();
    expect(jobService.scheduleMock).toHaveBeenCalledWith('now', 'SendEmail', expect.any(Object));

    const userService = Container.get<UserService>(UserService);
    user = await userService.findOne({ email: account.email });
    expect(user.firstName).toBe(account.firstName);
  });

  test('should failed register duplicated email', async () => {
    const newAccount: RegisterRequestSchema = {
      email: 'test@sample.com',
      firstName: 'Test',
      lastName: 'INL',
      password: '123456',
    };
    await expect(authService.register(newAccount)).rejects.toEqual(new BadRequestError('Email has been used'));
  });

  test('should confirm user email, and invalidate token', async () => {
    const { token } = await IdentityToken.findOne({ email: account.email, type: 'email-confirmation' });
    const ret = await authService.confirmEmail({ token });
    expect(ret).toEqual(new DefaultResponseSchema(true));
    await expect(authService.confirmEmail({ token })).rejects.toEqual(new BadRequestError('Token is invalid'));
  });

  test('should success register new user with correct ref code', async () => {
    let user = await userService.findOne({ email: account.email });
    const newAccount: RegisterRequestSchema = {
      email: 'test2@sample.com',
      firstName: 'Test 2',
      lastName: 'INL',
      password: '123456',
      referCode: user.referralCode,
    };
    const result: IUser = await authService.register(newAccount);
    expect(result.email).toBeDefined();
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
    await expect(authService.register(newAccount)).rejects.toEqual(new BadRequestError('Referral code is not valid'));
  });

  test('should generate an JWT for user', async () => {
    const token: ITokenInfo = await authService.generateAuthToken(user);
    expect(token.profile.email).toEqual(user.email);
  });

  test('should log user in correctly', async () => {
    await expect(authService.login({ email: 'notexist', password: '12345', twoFAToken: null })).rejects
      .toEqual(new BadRequestError('Email and password combination is not valid'));

    await expect(authService.login({ email: account.email, password: '12345', twoFAToken: null })).rejects
      .toEqual(new BadRequestError('Email and password combination is not valid'));

    await User.updateOne({ email: account.email }, { isActive: false });
    await expect(authService.login({ email: account.email, password: account.password, twoFAToken: null })).rejects
      .toEqual(new ForbiddenError('Your account is locked'));

    await User.updateOne({ email: account.email }, { isActive: true, isConfirmed: false });
    await expect(authService.login({ email: account.email, password: account.password, twoFAToken: null })).rejects
      .toEqual(new ForbiddenError('Please confirm your email address by clicking the confirmation link in your email'));

    await User.updateOne({ email: account.email }, { isConfirmed: true, twoFAEnabled: true });
    await expect(authService.login({ email: account.email, password: account.password, twoFAToken: null })).rejects
      .toEqual(new ForbiddenError('Missing two-factor authentication token'));

    // don't know how to test 2FA function. skip for now

    await User.updateOne({ email: account.email }, { isConfirmed: true, twoFAEnabled: false });
    const token = await authService.login({ email: account.email, password: account.password, twoFAToken: null });
    expect(token).toBeDefined();
    expect(token.profile.email).toEqual(account.email);
  });
});
