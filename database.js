const mongoose = require('mongoose');

// DB config
const { MONGODB } = require('./config.js');

// Database class with method connect to connect to database 
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        // connecting to MongoDB
        mongoose
            .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('MongoDB Connected');
            })
            .catch(err => {
                console.log("Database Connection Error: " + err)
            });

    }
}

module.exports = new Database();