'use strict';

import express from 'express';
import router from './routes/routes.js';

const app = express();

app.use(router);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is up and listening at port: ${PORT}`)
})