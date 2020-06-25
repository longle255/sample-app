import { Context } from 'koa';
import helmet from 'koa-helmet';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityNoCacheMiddleware implements KoaMiddlewareInterface {
  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    return helmet.noCache()(ctx, next);
  }
}

// there is a warning of: helmet deprecated helmet.noCache is deprecated and
// will be removed in helmet@4. You can use the `nocache` module instead. For
// more, see https://github.com/helmetjs/helmet/issues/215.
// node_modules/koa-helmet/lib/koa-helmet.js:20:44

// nocache can't be applied at the moment. tried and failed
