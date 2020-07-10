import { Get, JsonController } from 'routing-controllers';
import { Container } from 'typedi';

import { env } from '../../env';
import { CacheService } from '../services';

@JsonController('/')
export class HomeController {
	@Get()
	public async home(): Promise<object> {
		const cache: CacheService = Container.get(CacheService);
		const test = await cache.get('test');
		cache.set('test', new Date());
		return {
			name: env.app.name,
			version: env.app.version,
			description: env.app.description,
			test,
		};
	}
}
