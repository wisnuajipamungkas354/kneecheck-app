'use strict';

import express from 'express';
import router from './routes/routes.js';
import bodyParser from 'body-parser';
import loadModel from './services/loadModel.js';

const app = express();
// const model = await loadModel();
// app.model = model;
// console.log('model loaded!');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is up and listening at port: ${PORT}`)
})