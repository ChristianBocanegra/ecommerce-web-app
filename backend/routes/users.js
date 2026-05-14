/* 
  File Name: users.js
  Description: Defines the routes for user-related operations such as signing in, signing out,
               creating new users, editing user information.
               Includes routes for handling authentication and user management.
  Team's name: BOFC
  Group number: 04
  Date: November 9, 2024
*/

// Import necessary modules
var express = require('express');
var router = express.Router();

let usersController = require('../controllers/users'); 
let authController = require('../controllers/auth'); 

// Default route to test the users resource
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route for user sign-in
router.post('/signin', authController.signin);

// Route for user sign-out
router.post('/myuser/signout/:userID', usersController.signout);

// Route for creating a new user
router.post('/create', usersController.create);

// Route for updating user information (requires authentication)
router.put('/edit/:userID', authController.requireSignin, usersController.update);

// Route for deleting a user
router.delete('/delete/:userID', usersController.remove);

// Route for fetching user information (requires authentication)
router.get('/me', authController.requireSignin, usersController.getUserInfo);

// Route to list all non-admin users (requires admin authentication)
router.get('/Adminuser/List-non-admin-users', authController.requireSignin, usersController.listNonAdminUsers);

// Route to delete a non-admin user by ID (requires admin authentication)
router.delete('/delete/non-admin-users/:userID', authController.requireSignin, usersController.deleteNonAdminUser);

// Route to promote a user to admin by ID (requires admin authentication)
router.put('/make-admin/:userID', authController.requireSignin, usersController.promoteToAdmin);

// Export the router to be used in the main app
module.exports = router;
