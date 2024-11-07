const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');  // Import the cors package

const app = express();

connectDb();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());  // Allows all origins by default, you can configure it as needed

app.use(express.json());
app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;