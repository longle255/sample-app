import { Context } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { RequestLog } from '../models/RequestLog';

const sanitizedKeys = (object: any) => {
  if (!object) {
    return {};
  }
  let replacedObject = {};
  const newObject = Object.assign({}, object);
  const keys = Object.keys(newObject);
  replacedObject = keys.reduce((r, k) => {
    r[k.replace(/./g, '---')] = r[k];
    return r;
  }, {});
  return replacedObject;
};

@Middleware({ type: 'before' })
export class RequestLoggerMiddleware implements KoaMiddlewareInterface {
  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    const start = Date.now();
    const ip =
      ctx.request.headers['x-forwarded-for'] ||
      ctx.request.headers['x-real-ip'] ||
      ctx.request.ips[ctx.request.ips.length - 1] ||
      ctx.request.ip ||
      '';
    const { method, path, body, query, headers } = ctx.request;
    return next().then(async () => {
      const delta = Math.ceil(Date.now() - start);
      ctx.set('X-Response-Time', delta + 'ms');

      // Mask password
      if (body && body.password) {
        body.password = 'SN-xxxxxxx';
      }
      const newQuery = sanitizedKeys(query);
      await RequestLog.create({
        user: ctx.state.user ? ctx.state.user._id : undefined,
        path,
        method,
        ip,
        body,
        headers,
        query: newQuery,
        resCode: ctx.res.statusCode,
        resBody: ctx.res.statusMessage,
        resTime: delta,
      });
    });
  }
}
