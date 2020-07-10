import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import mongoose from 'mongoose';

import { env } from '../env';
import { Logger } from '../lib/logger';

function createConnection(connectionOptions: any): Promise<mongoose.Connection> {
  return new Promise((resolve, reject) => {
    mongoose.set('debug', connectionOptions.debug);
    mongoose
      .connect(connectionOptions.uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => resolve(mongoose.connection))
      .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
        return reject(err);
      });
  });
}

export const mongooseLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger(__filename);
  const now = Date.now();
  log.debug('Loading mongoose started');
  const connectionOptions = Object.assign(
    {},
    {
      uri: env.mongo.uri,
      debug: env.mongo.debug,
    },
  );

  const connection = await createConnection(connectionOptions);
  if (settings) {
    settings.setData('mongoose', mongoose);
    settings.onShutdown(() => connection.close());
  }
  log.verbose('Mongoose loaded, took %d ms', Date.now() - now);
};