import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import { getHostname, getOsEnv, getOsEnvOptional, getOsPaths, normalizePort, toBool, toNumber } from './lib/env';

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
	emailDebug: toBool(getOsEnv('EMAIL_DEBUG')),
	adminEmail: getOsEnv('APP_ADMIN_EMAIL'),
	isWorker: toBool(getOsEnv('JOB_WORKER')),
	app: {
		name: getOsEnv('APP_NAME'),
		version: (pkg as any).version,
		description: (pkg as any).description,
		host: getOsEnv('APP_HOST'),
		uri: getOsEnv('APP_URI'),
		cdnUri: getOsEnv('CDN_URI'),
		schema: getOsEnv('APP_SCHEMA'),
		routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
		port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
		banner: toBool(getOsEnv('APP_BANNER')),
		dirs: {
			controllers: getOsPaths('CONTROLLERS'),
			middlewares: getOsPaths('MIDDLEWARES'),
			interceptors: getOsPaths('INTERCEPTORS'),
			subscribers: getOsPaths('SUBSCRIBERS'),
			postgresModels: getOsPaths('POSTGRES_ENTITIES'),
			postgresMigrations: getOsPaths('POSTGRES_MIGRATIONS'),
			postgresSubscribers: getOsPaths('POSTGRES_SUBSCRIBERS'),
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
	redis: {
		host: getOsEnv('REDIS_HOST'),
		port: toNumber(getOsEnv('REDIS_PORT')),
	},
	postgres: {
		host: getOsEnv('POSTGRES_HOST'),
		port: toNumber(getOsEnv('POSTGRES_PORT')),
		username: getOsEnv('POSTGRES_USERNAME'),
		password: getOsEnv('POSTGRES_PASSWORD'),
		database: getOsEnv('POSTGRES_DATABASE'),
		synchronize: toBool(getOsEnv('POSTGRES_SYNCHRONIZE')),
		logging: toBool(getOsEnv('POSTGRES_LOGGING')),
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
	sendgrid: {
		apiKey: getOsEnv('SENDGRID_API_KEY'),
		sender: getOsEnv('SENDGRID_SENDER_EMAIL'),
	},
	agenda: {
		name: getHostname(),
		collectionName: getOsEnv('AGENDA_COLLECTION_NAME'),
		maxConcurrency: toNumber(getOsEnv('AGENDA_MAX_CONCURRENCY')),
	},
	recaptcha: {
		siteKey: getOsEnv('RECAPTCHA_KEY'),
		secretKey: getOsEnv('RECAPTCHA_SECRET'),
		enabled: toBool(getOsEnv('RECAPTCHA_ENABLED')),
	},
	cardanoConfig: {
		graphqlUrl: getOsEnv('ADA_EXPLORER_GRAPHQL_URL'),
	},
	cryptoCompare: {
		apiKey: getOsEnv('CRYPTO_COMPARE_API_KEY'),
	},
	cardano: {
		host: getOsEnv('CARDANO_HOST'),
		sshUser: getOsEnv('CARDANO_SSH_USER'),
		sshKey: getOsEnv('CARDANO_SSH_KEY'),
		vrfPrefix: getOsEnv('CARDANO_VRF_PREFIX'),
		cliPath: getOsEnv('CARDANO_CLI_PATH'),
		walletPath: getOsEnv('CARDANO_WALLET_PATH'),
		socketPath: getOsEnv('CARDANO_SOCKET_PATH'),
	},
	config: {
		cache: {
			tickerCacheTTL: 60 * 5,
			historyCacheTTL: 60 * 60,
			statsCacheTTL: 60 * 60 * 24,
			mnStatsCacheTTL: 60 * 60 * 12,
			cardanoStakeDistributionTTL: 60 * 5,
			cardanoVrfCalculationTTL: 60 * 60 * 24 * 30,
			stakePoolListTTL: 60 * 5,
		},
		liveFeed: {
			poolUpdateToNotify: ['pledge', 'fixedCost', 'margin', 'metaData'],
		},
	},
};
