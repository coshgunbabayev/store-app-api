import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { v2 as cloudinary } from 'cloudinary';

import connection from './database/connection.js';

import userRoute from './routes/userRoute.js';

dotenv.config();

connection();

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server listening on ${port}`);
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method', {
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));

app.use('/api/user', userRoute);