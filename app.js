const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const apiUrl = './api/v0/router';

app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static('public'));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error
    })
});

// Account
app.use(`/account`, require(`${apiUrl}/account`));
// Account
app.use(`/bill`, require(`${apiUrl}/bill`));
// Account
app.use(`/brand`, require(`${apiUrl}/brand`));
// Account
app.use(`/cart`, require(`${apiUrl}/cart`));
// Account
app.use(`/feedback`, require(`${apiUrl}/feedback`));
// Account
app.use(`/image`, require(`${apiUrl}/image`));
// Account
app.use(`/import`, require(`${apiUrl}/import`));
// Account
app.use(`/product`, require(`${apiUrl}/product`));

module.exports = app;