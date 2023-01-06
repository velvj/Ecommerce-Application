'use strict';

const Hapi = require('@hapi/hapi');
const route = require("./app/routes");
require("dotenv").config();

const knex = require('./app/config/db');
const authenticate = require('./app/middleware/authenticate')
const AuthBearer = require('hapi-auth-bearer-token');




const init = async () => {
    try {
        //server creation
        const server = Hapi.Server({
            host: process.env.HOST,
            port: process.env.PORT
        });

        //authentication
        await server.register(AuthBearer)
        await server.register(require('@hapi/inert'))

        server.auth.strategy(
            'jwt',
            'bearer-access-token',
            {
                validate: authenticate
            }
        );

        //route
        server.route(route);



        //server start
        await server.start();
        console.log("Server started on ", server.info.uri);
        knex.raw("SELECT VERSION()").then(() => {
            console.log('connection to db successfully');
        })
    }
    catch (error) {
        console.log(error);
    }
}



process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();