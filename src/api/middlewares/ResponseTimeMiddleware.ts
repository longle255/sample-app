import { Context } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before', priority: 90 })
export class ResponseTimeMiddleware implements KoaMiddlewareInterface {
    public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        const start = Date.now();
        return next().then(() => {
            const delta = Math.ceil(Date.now() - start);
            ctx.set('X-Response-Time', delta + 'ms');
        });
    }
}
