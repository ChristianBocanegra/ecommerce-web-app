/* 
  File Name: config.js
  Description: Database configuration file for the backend application.
               This file exports the MongoDB Atlas connection string and a secret key for secure operations, 
               allowing the application to connect to the remote database and manage authentication.   
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/


// Configuration file exporting connection details for MongoDB Atlas and a secret key.

// Connection string to MongoDB Atlas. This URL includes credentials and path 
// for connecting to the remote MongoDB database.
require('dotenv').config();

module.exports = {
  "ATLASDB": process.env.ATLASDB,
  "SECRETKEY": process.env.SECRETKEY
};