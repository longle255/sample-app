import { Context } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import uuid from 'uuid';

@Middleware({ type: 'before', priority: 100 })
export class RequestIdMiddleware implements KoaMiddlewareInterface {
    public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        const options = {
            header: 'X-Request-Id',
            clientRequestHeader: 'X-Client-Request-Id',
        };

        const clientId = ctx.get(options.header);

        if (clientId) {
            ctx.state.clientRequestId = clientId;
            ctx.set(options.clientRequestHeader, ctx.state.clientRequestId);
        }

        const requestId = uuid.v4();

        ctx.state.requestId = requestId;
        ctx.set(options.header, requestId);

        return next();
    }
}
