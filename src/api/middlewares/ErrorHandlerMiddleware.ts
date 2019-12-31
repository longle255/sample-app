import { Context } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

import { UNKNOWN_ENDPOINT } from '../../constants/error';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';

@Middleware({ type: 'before', priority: 80 })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {
    public isProduction = env.isProduction;

    constructor(@Logger(__filename) private log: LoggerInterface) {}

    public async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            await next();
            // Respond 404 Not Found for unhandled request
            if (!ctx.body && (!ctx.status || ctx.status === 404)) {
                ctx.status = 404;
                ctx.body = {
                    statusCode: ctx.status,
                    message: UNKNOWN_ENDPOINT.message,
                };
            }
        } catch (error) {
            ctx.status = error.httpCode || error.statusCode || error.status || 500;
            ctx.body = {
                statusCode: ctx.status,
                message: error.message, // UNKNOWN_ERROR.message
                errors: error.errors,
                trace: this.isProduction ? undefined : error.trace || error.stack,
            };

            if (this.isProduction) {
                this.log.error(error.name, error.message);
            } else {
                this.log.error(error.stack);
            }
        }
    }
}
