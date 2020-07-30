import { Container } from 'typedi';
import { IUser } from '../../../src/api/models/User';
import { TokenTypes, IIdentityToken } from '../../../src/api/models/IdentityToken';
import { IdentityTokenService } from '../../../src/api/services/IdentityTokenService';

import { createConnection, cleanAll, disconnect } from '../../lib/database';
import { configureLogger } from '../../lib/logger';

describe('IdentityTokenService', () => {
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

  afterAll(async () => {
    await cleanAll();
    await disconnect();
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should create a new identity in the database', async () => {
    const tokenService = Container.get<IdentityTokenService>(IdentityTokenService);
    const user = {
      email: 'test@sample.com',
      firstName: 'Test',
      lastName: 'INL',
      password: '123456',
    }
    const token: IIdentityToken = await tokenService.generateToken(user as IUser, TokenTypes['refresh-token']);
    expect(token.email).toBe(user.email);
    expect(token.expires.getTime()).toBeGreaterThan(0);
  });
});
