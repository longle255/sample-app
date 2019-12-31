import { Context } from 'koa';
import compress from 'koa-compress';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Z_SYNC_FLUSH } from 'zlib';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements KoaMiddlewareInterface {
    public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        return compress({
            filter: content_type => {
                return /text/i.test(content_type);
            },
            threshold: 1,
            flush: Z_SYNC_FLUSH,
        })(ctx, next);
    }
}
