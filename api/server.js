const express = require('express');
const serverless = require('serverless-http');
const errorHandler = require('../middleware/errorHandler');
const connectDb = require('../config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

let isDbConnected = false;

// Lazy-load the database connection on the first request
app.use(async (req, res, next) => {
    if (!isDbConnected) {
        await connectDb();
        isDbConnected = true;
    }
    next();
});

// Enable CORS
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));

// Middleware
app.use(express.json());
app.use("/api/contacts", require('../routes/contactRoutes'));
app.use("/api/users", require('../routes/userRoutes'));
app.use(errorHandler);

// Export as a serverless function
module.exports.handler = serverless(app);