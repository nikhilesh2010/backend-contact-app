const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();

const app = express();

connectDb();
const port = process.env.PORT || 5000;

// app.get('/api/contacts', (req, res) => {
//     // res.send('Get all conacts');
//     // res.json({message: 'Get all conacts'});
//     res.status(200).json({message: 'Get all conacts'});
// });

app.use(express.json());
app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});