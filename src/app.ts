import 'reflect-metadata';

// tslint:disable-next-line:no-var-requires
import { Promise } from 'bluebird';
import { bootstrapMicroframework } from 'microframework-w3tec';

import { banner } from './lib/banner';
import { Logger } from './lib/logger';
import { agendaLoader } from './loaders/agendaLoader';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { iocLoader } from './loaders/iocLoader';
import { koaLoader } from './loaders/koaLoader';
import { mongooseLoader } from './loaders/mongooseLoader';
import { publicLoader } from './loaders/publicLoader';
import { redisLoader } from './loaders/redisLoader';
import { winstonLoader } from './loaders/winstonLoader';

Promise.config({
  longStackTraces: true,
  cancellation: true,
  // monitoring: true,
  warnings: true,
});

global.Promise = Promise as any;

/**
 * KOA TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is koa. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);

bootstrapMicroframework({
  config: {
    showBootstrapTime: true,
  },
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    winstonLoader,
    iocLoader,
    eventDispatchLoader,
    redisLoader,
    mongooseLoader,
    agendaLoader,
    koaLoader,
    publicLoader,
  ],
})
  .then(() => banner(log))
  .catch(error => log.error('Application is crashed: ' + error.toString() + error.stack));
