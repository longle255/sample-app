import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import { getOsEnv, getOsEnvOptional, getOsPaths, normalizePort, toBool, toNumber, getHostname } from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    adminEmail: getOsEnv('APP_ADMIN_EMAIL'),
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        uri: getOsEnv('APP_URI'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        dirs: {
            controllers: getOsPaths('CONTROLLERS'),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
            subscribers: getOsPaths('SUBSCRIBERS'),
        },
    },
    jwt: {
        secret: getOsEnv('JWT_SECRET'),
        expiresIn: toNumber(getOsEnv('JWT_EXPIRES_IN')),
        signOptions: {
            algorithm: 'HS256',
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    mongo: {
        uri: getOsEnv('MONGO_URI'),
        debug: toBool(getOsEnv('MONGOOSE_DEBUG')),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        file: getOsEnv('SWAGGER_FILE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    mailgun: {
        apiKey: getOsEnv('MAILGUN_API_KEY'),
        domain: getOsEnv('MAILGUN_DOMAIN'),
        sender: getOsEnv('MAILGUN_SENDER_EMAIL'),
    },
    agenda: {
        name: getHostname(),
        collectionName: getOsEnv('AGENDA_COLLECTION_NAME'),
        maxConcurrency: toNumber(getOsEnv('AGENDA_MAX_CONCURRENCY')),
        db: {
            address: getOsEnv('MONGO_URI'),
            collection: getOsEnv('AGENDA_COLLECTION_NAME'),
            options: {
                useNewUrlParser: true,
            },
        },
    },
    recaptcha: {
        siteKey: getOsEnv('RECAPTCHA_KEY'),
        secretKey: getOsEnv('RECAPTCHA_SECRET'),
    },
};
