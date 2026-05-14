/* 
  File Name: express.js
  Description: Main Express application setup and configuration file.
               Configures middleware, routes, and error handling for the backend server.   
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import essential modules for server setup
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


// Route handlers for different sections of the application
var indexRouter = require('../routes/index'); // main application
var usersRouter = require('../routes/users'); // user-related endpoints
var adRouter = require('../routes/ads'); //ads-related endpoints
var questionsRouter = require('../routes/question'); //questions-related endpoints

var app = express(); // Initialize the Express application

// Enables cors.
app.use(cors());
app.options('*', cors());

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route configurations
app.use('/', indexRouter); // Root path route configuration
app.use('/users', usersRouter); // User routes under '/users'
app.use('/ads',adRouter); // Ads routes under '/ads'
app.use('/questions', questionsRouter); // Questions routes under '/questions'

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // Send the error message
  res.status(err.status || 500);
  res.json({ 
    success: false,
    message: err.message
   });
});

// Export the app instance for use in other parts of the application
module.exports = app;