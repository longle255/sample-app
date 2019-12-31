import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createKoaServer } from 'routing-controllers';
import { authorizationChecker, currentUserChecker } from '../api/services/AuthService';

import { env } from '../env';

export const koaLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        /**
         * We create a new koa server instance.
         * We could have also use useExpressServer here to attach controllers to an existing koa instance.
         */
        const koaApp = createKoaServer({
            cors: {
                origin: '*',
                allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
                allowHeaders: [
                    'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Headers',
                    'Authorization',
                    'Origin',
                    'X-Requested-With',
                    'Content-Type',
                    'x-install-id',
                ],
                exposeHeaders: ['X-Request-Id', 'Content-disposition'],
            },
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            /**
             * We can add options about how routing-controllers should configure itself.
             * Here we specify what controllers should be registered in our koa server.
             */
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors,

            /**
             * Authorization features
             */
            authorizationChecker: authorizationChecker(),
            currentUserChecker: currentUserChecker(),
        });

        // Run application to listen on given port
        const server = koaApp.listen(env.app.port);
        // Here we can set the data for other loaders
        settings.setData('koa_server', server);
        settings.setData('koa_app', koaApp);
    }
};
