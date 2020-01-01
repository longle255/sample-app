import { Get, JsonController } from 'routing-controllers';

import { env } from '../../env';

@JsonController('/')
export class HomeController {
  @Get()
  public home(): Promise<object> {
    return new Promise((resolve, reject) => {
      return resolve({
        name: env.app.name,
        version: env.app.version,
        description: env.app.description,
      });
    });
  }
}
