import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { Logger } from '../lib/logger';

export const iocLoader: MicroframeworkLoader = () => {
	const log = new Logger(__filename);
	const now = Date.now();
	log.debug('Loading routing controller started');

	/**
	 * Setup routing-controllers to use typedi container.
	 */
	routingUseContainer(Container);
	classValidatorUseContainer(Container);
	log.verbose('Routing controller loaded, took %d ms', Date.now() - now);
};
