import { Context } from 'koa';
import morgan from 'koa-morgan';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';
import { Logger } from '../../lib/logger';

@Middleware({ type: 'before' })
export class LogMiddleware implements KoaMiddlewareInterface {
  private log = new Logger(__filename);

  public use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    return morgan(env.log.output, {
      stream: {
        write: this.log.info.bind(this.log),
      },
    })(ctx, next);
  }
}
