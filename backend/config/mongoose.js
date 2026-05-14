/* 
  File Name: mongoose.js
  Description: MongoDB database connection configuration file.
               Sets up and initializes a connection to MongoDB using Mongoose,
               accessing the connection string from the config file.  
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import the configuration file for database connection string
let config = require('./config');

// Database setup

// Import Mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Export a function to establish a database connection when invoked
module.exports = function(){

    // Connect to MongoDB Atlas using the connection string provided in config  
    mongoose.connect(config.ATLASDB);

    // Reference to the database connection  
    let mongodb = mongoose.connection;

     // Event listener for handling connection errors
    mongodb.on('error', console.error.bind(console, 'Connection Error: '));
    
    // Event listener for successful connection
    mongodb.once('open', ()=>{
        console.log("====> Connected to MongoDB.");
    })
}