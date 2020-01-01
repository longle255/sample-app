import { Context } from 'koa';
import * as helmet from 'koa-helmet';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityHstsMiddleware implements KoaMiddlewareInterface {
  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    return helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
    })(ctx, next);
  }
}
