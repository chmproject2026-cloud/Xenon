const authRoute = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoute = require('./routes/movies');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data [cite: 12]
app.use('/api/auth', authRoute);
app.use('/api/movies', movieRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas Cloud!"))
    .catch((err) => console.log("Cloud Connection Error: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});