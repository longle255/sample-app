import glob from 'glob';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';
import { Logger } from '../lib/logger';

/**
 * eventDispatchLoader
 * ------------------------------
 * This loads all the created subscribers into the project, so we do not have to
 * import them manually
 */
export const eventDispatchLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger(__filename);
  log.debug('Loading event dispatcher started');
  log.getWinston().profile('loading event dispatcher');
  if (settings) {
    const patterns = env.app.dirs.subscribers;
    patterns.forEach(pattern => {
      glob(pattern, (_err: any, files: string[]) => {
        for (const file of files) {
          require(file);
        }
      });
    });
  }
  log.getWinston().profile('loading event dispatcher');
};
