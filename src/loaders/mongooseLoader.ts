import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import mongoose from 'mongoose';

import { env } from '../env';

function createConnection(connectionOptions: any): Promise<mongoose.Connection> {
  return new Promise((resolve, reject) => {
    // mongoose.set('useNewUrlParser', true);
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useUnifiedTopology', true);
    // mongoose.set('debug', true);
    // mongoose.set('debug', connectionOptions.debug);

    mongoose
      .connect(connectionOptions.uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then(() => resolve(mongoose.connection))
      .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
        return reject(err);
      });
    // // Exit application on error
    // mongoose.connection.on('error', err => {
    //     return reject(err);
    // });

    // // when the connection is connected
    // mongoose.connection.on('connected', () => {
    //     return resolve(mongoose.connection);
    // });
  });
}

export const mongooseLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const connectionOptions = Object.assign(
    {},
    {
      uri: env.mongo.uri,
      debug: env.mongo.debug,
    },
  );

  const connection = await createConnection(connectionOptions);
  if (settings) {
    settings.setData('connection', connection);
    settings.onShutdown(() => connection.close());
  }
  settings.setData('mongoose', mongoose);
};
