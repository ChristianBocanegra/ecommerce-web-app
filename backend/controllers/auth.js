/* 
  File Name: auth.js
  Description: Provides user authentication functionalities, including sign-in and JWT token generation.
               Also handles middleware for validating JWT tokens on protected routes.
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import necessary modules for user authentication and token generation
let User = require('../models/users'); 
let config = require('../config/config'); 
let jwt = require('jsonwebtoken'); 
let { expressjwt } = require('express-jwt'); 

// Function to handle user sign-in process
module.exports.signin = async function(req, res, next) {
    try {
        // Find the user in the database by email
        let user = await User.findOne({"email": req.body.email});
        if(!user) // If no user is found, throw an error
            throw new Error('User not found.');
        
        // Check if the provided password matches the stored password
        if(!user.authenticate(req.body.password))
            throw new Error("Email and/or password don't match.");

        // Create the payload for the JWT, including the user ID and username
        let payload = {
            id: user._id, 
            username: user.username,
            admin: user.admin // Include the admin field
        };  

        // Generate a signed token with the payload, using the secret key and specific algorithm
        let token = jwt.sign(payload, config.SECRETKEY, {
            algorithm: 'HS512', 
            expiresIn: "20min" 
        });

        // Send the token as a response if authentication is successful
        res.json({
            success: true,
            token: token
        });
    } catch (error) {
        console.log(error); 
        next(error); 
    }
}

// Middleware to verify JWT for protected routes
module.exports.requireSignin = expressjwt({
    secret: config.SECRETKEY, 
    algorithms: ['HS512'], 
    userProperty: 'auth' 
});