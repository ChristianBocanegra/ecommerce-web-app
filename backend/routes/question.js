/* 
  File Name: questions.js
  Description: Defines the routes for handling questions related to ads.
               Includes routes for creating questions, listing questions for authenticated users,
               fetching specific questions by ID, and answering questions.
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import necessary modules
var express = require('express');
var router = express.Router();

let questionsController = require('../controllers/questions');
let authController = require('../controllers/auth');

// Default route to test the questions resource
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route for creating a question related to a specific ad (by adID)
router.post('/create/:adID', questionsController.create);

// Route for listing questions for an authenticated user
router.get('/list', authController.requireSignin, questionsController.list);

// Route for listing questions for an Ad
router.get('/list/:adID', questionsController.listByAdID);


// Route for retrieving a specific question by its ID
router.get('/get/:questionID', authController.requireSignin, questionsController.questionByID);

// Route for answering a specific question (only by authenticated ad owner)
router.put('/answer/:questionID', authController.requireSignin, questionsController.answer);

// Export the router to be used in the main app
module.exports = router;
