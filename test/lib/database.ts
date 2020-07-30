import mongoose from 'mongoose';
import { env } from '../../src/env';

export const connect = (connectionOptions: any): Promise<mongoose.Connection> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(connectionOptions.uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
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
  return Model.deleteMany({});
};

export const createConnection = () => {
  return connect({
    uri: env.mongo.uri,
    debug: env.mongo.debug,
  });
};

export const disconnect = () => {
  return mongoose.connection.close()
};

export const cleanAll = async (): Promise<void> => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === 'ns not found') return

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes('a background operation is currently running')) return

      console.log(error.message)
    }
  }
}
