import { Context } from 'koa';
import helmet from 'koa-helmet';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityNoCacheMiddleware implements KoaMiddlewareInterface {

    public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        return helmet.noCache()(ctx, next);
    }

}
