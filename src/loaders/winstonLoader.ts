import { MicroframeworkLoader } from 'microframework-w3tec';
import { configure } from 'winston';

import { consoleTransport } from '../lib/logger';

export const winstonLoader: MicroframeworkLoader = async () => {
  configure({
    transports: [
      consoleTransport
    ],
  });
};
