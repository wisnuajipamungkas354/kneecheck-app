'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 80,
        host: 'https://knee-check-app.uw.r.appspot.com'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Haii, Selamat Datang di KneeChek!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();