import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { Logger } from '../lib/logger';

export const iocLoader: MicroframeworkLoader = () => {
	const log = new Logger(__filename);
  log.debug('Loading routing controller started');
  log.getWinston().profile('loading ioc');


	/**
	 * Setup routing-controllers to use typedi container.
	 */
	routingUseContainer(Container);
  classValidatorUseContainer(Container);
  log.getWinston().profile('loading ioc');

};
