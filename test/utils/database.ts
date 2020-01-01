import mongoose from 'mongoose';
import { env } from '../../src/env';

export const connect = (connectionOptions: any): Promise<mongoose.Connection> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(connectionOptions.uri, {
      keepAlive: true,
      useNewUrlParser: true,
    });
    // Exit application on error
    mongoose.connection.on('error', err => {
      return reject(err);
    });

    // when the connection is connected
    mongoose.connection.on('connected', () => {
      return resolve(mongoose.connection);
    });

    mongoose.set('debug', connectionOptions.debug);
  });
};

export const cleanUp = (Model: any): Promise<void> => {
  // console.log(Model);
  return Model.remove({});
};

export const createConnection = () => {
  return connect({
    uri: env.mongo.uri,
    debug: env.mongo.debug,
  });
};
