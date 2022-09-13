const express = require('express');
const cors = require('cors');

const app = express();

require('./helpers/apiDocs')(app);

//! Permet de récupérer les erreurs, à décommenter

// process.on('unhandledRejection', (err) => {
//     throw err;
// });

// process.on('uncaughtException', (err) => {
//     console.log(err);
//     process.exit(0);
// });

// const swaggerUi = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');
const router = require('./routers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors('*'));
app.use(router);
module.exports = app;
