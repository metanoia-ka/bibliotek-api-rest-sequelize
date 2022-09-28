const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')

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

app.listen({ port }, async() => {
    console.log(`Server up on http://localhost:${port}`);
    await require('./configDB/dbConfig');
});