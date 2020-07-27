import { Context } from 'koa';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { CaptchaMock } from '../../mocks/CaptchaMock';

import { CaptchaMiddleware } from '../../../src/api/middlewares/CaptchaMiddleware';


describe('CaptchaMiddleware', () => {
  let middleware: CaptchaMiddleware;
  const recaptchaObj = new CaptchaMock();

  beforeEach(() => {
    middleware = new CaptchaMiddleware();
  });

  test('Should not require captcha in development', async () => {
    const ctx: Context = createMockContext({
      requestBody: {}
    } as any);
    const next = await middleware.use(ctx, () => Promise.resolve(true));
    expect(next).toBe(true);
  });

  test('Should require captcha in production', async () => {
    middleware.isProduction = true;
    const ctx: Context = createMockContext({
      url: '/',
      requestBody: {
        data: 'values'
      },
    } as any);
    await expect(middleware.use(ctx, () => Promise.resolve(true))).rejects.toThrow('Please solve the captcha');
  });

  test('Should validate correct captcha in production', async () => {
    middleware.isProduction = true;
    middleware.recaptchaObj = recaptchaObj;
    const ctx = createMockContext({
      url: '/login',
      requestBody: {
        captcha: 'correct'
      },
    } as any);
    const next = await middleware.use(ctx, () => Promise.resolve(true));
    expect(recaptchaObj.validateRequestMock).toHaveBeenCalledWith(ctx.request, ctx.request.headers.host);
    expect(next).toBe(true);
  });

  test('Should prevent incorrect captcha in production', async () => {
    middleware.isProduction = true;
    middleware.recaptchaObj = recaptchaObj;
    const ctx = createMockContext({
      url: '/login',
      requestBody: {
        captcha: 'incorrect'
      },
    } as any);
    await expect(middleware.use(ctx, () => Promise.resolve(true))).rejects.toThrow('Please solve the captcha');
    expect(recaptchaObj.translateErrorsMock).toHaveBeenCalled();
  });


});
