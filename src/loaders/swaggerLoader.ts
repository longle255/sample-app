import koaSwagger from 'koa2-swagger-ui';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';

import { env } from '../env';

export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.swagger.enabled) {
        const koaApp = settings.getData('koa_app');
        const swaggerFile = require(path.join(__dirname, '..', env.swagger.file));

        // Add npm infos to the swagger doc
        swaggerFile.info = {
            title: env.app.name,
            description: env.app.description,
            version: env.app.version,
        };

        swaggerFile.servers = [
            {
                url: `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
            },
        ];

        koaApp.use(
            koaSwagger({
                title: env.app.name,
                oauthOptions: {
                    [`${env.swagger.username}`]: env.swagger.password,
                },
                routePrefix: env.swagger.route,
                swaggerOptions: swaggerFile,
                hideTopbar: false, // hide swagger top bar
                favicon16: '/favicon.ico', // default icon 16x16, set for self icon
                favicon32: '/favicon.ico', // default icon 32x32, set for self icon
            }),
        );
    }
};
