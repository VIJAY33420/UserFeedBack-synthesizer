require('dotenv').config();
const app = require('./app');
const connectDb = require('./config/db');

// Connect to Database
connectDb().then(() => {
    // Start Server only after DB connection is successful
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database, server not started:', err.message);
    process.exit(1);
});