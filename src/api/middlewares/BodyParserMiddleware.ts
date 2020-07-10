import { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before', priority: 80 })
export class BodyParserMiddleware implements KoaMiddlewareInterface {
  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    return bodyParser({
      enableTypes: ['json', 'form'],
      formLimit: '10mb',
      jsonLimit: '10mb',
      onerror: (_err: Error, ctx1: Context): void => {
        ctx1.throw('body parse error', 422);
      },
    })(ctx, next);
  }
}
