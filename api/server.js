const express = require('express');
const serverless = require('serverless-http');
const errorHandler = require('../middleware/errorHandler');
const connectDb = require('../config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

connectDb();

app.use(cors());
app.use(express.json());
app.use("/api/contacts", require('../routes/contactRoutes'));
app.use("/api/users", require('../routes/userRoutes'));
app.use(errorHandler);

// Export the serverless function
module.exports = app;
module.exports.handler = serverless(app);