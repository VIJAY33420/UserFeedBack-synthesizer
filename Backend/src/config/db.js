const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectDb = () => {
    const uri = process.env.MONGO_URI || process.env['MONGO URI'];
    if (!uri) {
        console.error('MongoDB URI not found in environment (set MONGO_URI in .env)');
        return Promise.reject(new Error('Missing MongoDB URI'));
    }

    return mongoose
        .connect(uri)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB:', err.message || err);
            throw err;
        });
};

module.exports = connectDb;