import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import mongoose from 'mongoose';
import { env } from '../../../src/env';

function createConnection(connectionOptions: any): Promise<mongoose.Connection> {
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

        mongoose.set('useCreateIndex', true);
        mongoose.set('debug', connectionOptions.debug);
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
};
