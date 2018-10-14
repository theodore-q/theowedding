// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

// const pgString = 'postgres://tiyvislrffgqjs:bb78427f4a706e3d5de753ee7fbf4f17d6d99541ef48e8ef011b5e634d7d4a40@ec2-54-217-235-137.eu-west-1.compute.amazonaws.com:5432/d9gigl0qepdhe9?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'

// var pg = require('knex')({
//     client: 'pg',
//     connection: pgString,
//     searchPath: ['knex', 'public'],
//   });

// pg('save_the_date_responses').insert({name: 'Slaughterhouse Five'}).then((res)=>{
//     console.log(res)
// }).catch((yo)=>{
//     console.log(yo)
// })
// open mongoose connection
//mongoose.connect();

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
