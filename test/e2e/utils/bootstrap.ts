import { Application } from 'express';
import * as http from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { createHttpTerminator } from 'http-terminator';
import { eventDispatchLoader } from '../../../src/loaders/eventDispatchLoader';
import { koaLoader } from '../../../src/loaders/koaLoader';
import { redisLoader } from '../../../src/loaders/redisLoader';
import { iocLoader } from '../../../src/loaders/iocLoader';
import { winstonLoader } from '../../../src/loaders/winstonLoader';
import { mongooseLoader } from '../../../src/loaders/mongooseLoader';
import { Mongoose } from 'mongoose';
import { RedisClient } from 'redis';
import { promisify } from "util";

export interface BootstrapSettings {
  app: Application;
  server: http.Server;
  mongoose: Mongoose;
  redis: RedisClient;
  shutdown: () => Promise<void>
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [winstonLoader, iocLoader, eventDispatchLoader, mongooseLoader, redisLoader, koaLoader],
  });

  const app = framework.settings.getData('koa_app') as Application;
  const server = framework.settings.getData('koa_server') as http.Server;
  const mongoose = framework.settings.getData('mongoose') as Mongoose;
  const redis = framework.settings.getData('redisClient') as RedisClient;
  const httpTerminator = createHttpTerminator({ server });
  const shutdown = async (): Promise<void> => {
    await httpTerminator.terminate();
    await mongoose.connection.close();
    const quit = promisify(redis.quit)
    await quit();
  }

  return {
    app,
    server,
    mongoose,
    redis,
    shutdown
  } as BootstrapSettings;
};
