const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const usersRoute = require('./routes/users.routes');

dotenv.config();

const app = express();

const port = process.env.PORT || 6200;

app.use(
    cors({
        origin: "*",
        methods: "GET, POST, PUT, DELETE",
        credentials: true
    }));

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1', usersRoute);

app.listen({ port }, async() => {
    console.log(`Server up on http://localhost:${port}`);
    await require('./configDB/dbConfig');
});