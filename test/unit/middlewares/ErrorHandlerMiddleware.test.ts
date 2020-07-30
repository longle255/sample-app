import { Context } from 'koa';
import { HttpError } from 'routing-controllers';
import { createMockContext } from '@shopify/jest-koa-mocks';

import { ErrorHandlerMiddleware } from '../../../src/api/middlewares/ErrorHandlerMiddleware';
import { LogMock } from '../../mocks/LogMock';

describe('ErrorHandlerMiddleware', () => {
  let log: LogMock;
  let middleware: ErrorHandlerMiddleware;
  let err: HttpError;
  let ctx: Context;

  beforeEach(() => {
    log = new LogMock();
    middleware = new ErrorHandlerMiddleware(log);
    err = new HttpError(400, 'Test Error');
    ctx = createMockContext({ state: { key: 'value' } });
  });

  test('Should not print stack out in production', async () => {
    middleware.isProduction = true;
    await middleware.use(ctx, () => { throw err; });
    expect(ctx.response.status).toBe(400);
    expect(log.errorMock).toHaveBeenCalledWith(err.name, [err.message]);
  });

  test('Should print stack out in development', async () => {
    await middleware.use(ctx, () => { throw err; });
    expect(ctx.response.status).toBe(400);
    expect(log.errorMock).toHaveBeenCalled();
  });

  test('Should give 404 response', async () => {
    middleware.isProduction = true;
    await middleware.use(ctx, () => null);
    expect(ctx.response.status).toBe(404);
    expect(log.errorMock).not.toHaveBeenCalled();
  });
});
