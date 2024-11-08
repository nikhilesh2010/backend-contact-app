const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const timeout = require('connect-timeout');

const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDb();

// Enable CORS for all routes
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

// Set a timeout of 10 seconds
app.use(timeout('10s'));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

app.use(express.json());
app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));
app.use(errorHandler);

// Gracefully close the database connection on app termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Database connection closed due to app termination');
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;