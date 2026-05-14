/* 
  File Name: ads.js
  Description: Defines routes for handling advertisement-related operations such as listing, 
              retrieving, creating, updating, disabling, and deleting ads. Routes link HTTP 
              requests to specific controller functions, enabling CRUD operations in the app.   
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/


// Import Express to define routes
var express = require('express');

// Create a router instance
var router = express.Router();


// Import controllers 
const adsController = require('../controllers/ads');
const authController = require('../controllers/auth');

//App funcionalities related to ads

// List all active ads (requires login)
router.get('/myUser/list/:category', authController.requireSignin, adsController.listByOwner);


// List all active ads (publicly accessible)
router.get('/list/:category', adsController.list);

// List all  ads (Admin)
router.get('/myAdminUser/list/:category', authController.requireSignin, adsController.listByAdmin);

// Create a new ad (requires login)
router.post('/myUser/create', authController.requireSignin, adsController.create);

// Update an ad (requires login)
router.put('/myUser/edit/:id', authController.requireSignin, adsController.update);

// Disable an ad (requires login)
router.put('/myUser/disable/:id', authController.requireSignin, adsController.disable);

// Get the information of an ad (requires login)
router.get('/myUser/get/:id', authController.requireSignin, adsController.getAdByOwner);

// Get the information of an ad (publicly accessible)
router.get('/get/:id', adsController.getAd);

// Get the information of an ad (Admin)
router.get('/myAdminUser/get/:id', authController.requireSignin, adsController.getAdByAdmin);


// Route to delete a user by ID (Admin)
router.delete('/myAdminUser/delete/:id', authController.requireSignin, adsController.remove);

// Export the router for use in the app
module.exports = router;