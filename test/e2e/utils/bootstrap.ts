import { Application } from 'express';
import * as http from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Connection } from 'typeorm/connection/Connection';

import { eventDispatchLoader } from '../../../src/loaders/eventDispatchLoader';
import { koaLoader } from '../../../src/loaders/koaLoader';
import { iocLoader } from '../../../src/loaders/iocLoader';
import { winstonLoader } from '../../../src/loaders/winstonLoader';
import { mongooseLoader } from '../../../src/loaders/mongooseLoader';

export interface BootstrapSettings {
  app: Application;
  server: http.Server;
  connection: Connection;
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [winstonLoader, iocLoader, eventDispatchLoader, mongooseLoader, koaLoader],
  });

  return {
    app: framework.settings.getData('koa_app') as Application,
    server: framework.settings.getData('koa_server') as http.Server,
    connection: framework.settings.getData('connection') as Connection,
  } as BootstrapSettings;
};
