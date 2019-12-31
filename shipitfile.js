require('dotenv').config();
const PM2_APP_NAME = 'inl-api';

module.exports = shipit => {
    // Load shipit-deploy tasks
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);
    shipit.initConfig({
        default: {
            // workspace: '/root/apps/instantloan-api',
            deployTo: '/root/apps/instantloan-api',
            repositoryUrl: 'https://github.com/longle255/instantloan-api',
            key: '~/.ssh/id_rsa_instantloan_deploy',
            ignores: ['.git', 'node_modules', '.vscode'],
            shallowClone: true,
            shared: {
                dirs: ['node_modules', '.env'],
                overwrite: true,
            },
        },
        develop: {
            servers: 'root@51.15.52.137',
            branch: 'develop',
        },
    });

    shipit.blTask('app:stop', async () => {
        try {
            await shipit.remote(`pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`);
            shipit.log('Stopped app process');
        } catch (error) {
            shipit.log('No previous process to restart. Continuing.');
        }
    });
    // before publishing, execute following tasks
    shipit.on('updated', () => {
        shipit.start(['installDependencies', 'app:stop', 'app:build']);
    });

    shipit.blTask('installDependencies', async () => {
        await shipit.remote(`cd ${shipit.releasePath} && yarn install`);

        shipit.log('Installed npm dependecies');
    });

    // When symlink changes, restart the app
    shipit.on('published', () => {
        shipit.start('app:start');
    });

    shipit.blTask('app:build', async () => {
        await shipit.remote(`cd ${shipit.releasePath} && ` + ` yarn start build`);
        shipit.log('Built app dist');
    });

    shipit.blTask('app:start', async () => {
        await shipit.remote(`cd ${shipit.currentPath} && ` + ` NODE_ENV=production pm2 start dist/app.js --name "${PM2_APP_NAME}"`);
        shipit.log('Started app process');
    });
};
