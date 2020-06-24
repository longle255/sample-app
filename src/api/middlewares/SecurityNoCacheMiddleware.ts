import { Context } from 'koa';
import nocache from 'nocache';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityNoCacheMiddleware implements KoaMiddlewareInterface {
  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    return (nocache as any)()(ctx.req, ctx.res, next);
  }
}
