/* 
  File Name: index.js
  Description: Defines the default route for the home page of the application.
               Responds with a JSON object containing the title 'Express'.
  Team's name: BOFC
  Group number: 04
  Date: November 9, 2024
*/

// Import necessary modules
var express = require('express');
var router = express.Router();

// Route for home page
router.get('/', function(req, res, next) {
  res.json({ ProjectTitle: 'Sell used product site',
           GroupName: 'BOFC'
           });
});

// Export the router to be used in the main app
module.exports = router;

