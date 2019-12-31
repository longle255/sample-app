import favicon from 'koa-favicon';
import serve from 'koa-static';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';

export const publicLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const koaApp = settings.getData('koa_app');
        koaApp
            // Serve static filles like images from the public folder
            .use(serve(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))

            // A favicon is a visual cue that client software, like browsers, use to identify a site
            .use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    }
};
