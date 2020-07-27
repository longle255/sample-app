import { createMockContext } from '@shopify/jest-koa-mocks';
import { Container } from 'typedi';
import { AuthService, UserService, IdentityTokenService, EmailService } from '../../../src/api/services';
import { Context } from 'koa';
import { LogMock } from '../../mocks/LogMock';
import { UserServiceMock, IdentityTokenServiceMock, EmailServiceMock } from '../../mocks';

describe('AuthService', () => {
  let authService: AuthService;
  let log: LogMock;

  beforeEach(() => {
    // fake services that is not required;
    Container.set(UserService, new UserServiceMock());
    Container.set(IdentityTokenService, new IdentityTokenServiceMock());
    Container.set(EmailService, new EmailServiceMock());

    log = new LogMock();
    authService = new AuthService(log);

  })

  test('Should extract no auth header from request', async () => {
    const ctx: Context = createMockContext({
      url: '/',
      requestBody: {},
    } as any);
    const authHeader = authService.getAuthorizationHeader(ctx);
    expect(authHeader).toBeUndefined();
  });

  test('Should extract auth header from request', async () => {
    const ctx: Context = createMockContext({
      url: '/',
      headers: {
        authorization: 'Bearer ABC'
      },
      requestBody: {},
    } as any);
    const authHeader = authService.getAuthorizationHeader(ctx);
    expect(authHeader).toBe('ABC');
  });

  test('Should not parse auth token', async () => {
    const ctx: Context = createMockContext({
      url: '/',
      headers: {},
      requestBody: {},
    } as any);
    const authHeader = authService.getAuthorizationHeader(ctx);
    const parsed = authService.parseFromAuthorizationHeader(authHeader);
    expect(parsed).toBeUndefined();
    expect(log.infoMock).toHaveBeenCalledWith('No credentials provided by the client', []);
  });

  test('Should parse auth token', async () => {
    const ctx: Context = createMockContext({
      url: '/',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY3OTQ1ODYsImlhdCI6MTU5NDk5NDU4Niwic3ViIjoiNWVmNGEwZTViYjA1NjIwZGUzNDQ3YzE2In0.sZH6uVQdLR6gbdN9E0ztxuBsq1qWCcR8AcLFzoB2RFg'
      },
      requestBody: {},
    } as any);
    const authHeader = authService.getAuthorizationHeader(ctx);
    const parsed = authService.parseFromAuthorizationHeader(authHeader);
    expect(parsed).toBeDefined();
    expect((parsed as any).sub).toBe('5ef4a0e5bb05620de3447c16');
  });
});
