/* 
  File Name: users.js
  Description: Defines the schema for users in the application, including user authentication,
               password hashing, and management of user details such as roles and account info.
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import mongoose and crypto for schema and encryption
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let crypto = require('crypto');

// Define the User schema with fields for user details and authentication
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid e-mail address"] // Email validation using regex
  },
  username: {
    type: String,
    unique: true,
    required: 'Username is required', // Username is mandatory and must be unique
    trim: true
  },
  hashed_password: {
    type: String,
    required: 'Password is required',
  },
  salt: {
    type: String // Used for password hashing
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true // Creation date cannot be changed
  },
  updated: {
    type: Date,
    default: Date.now // Updated each time the user details change
  },
  admin: {
    type: Boolean,
    default: false // Default is a regular user, not an admin
  }
},
  {
    collection: "users" // Specifies the MongoDB collection name
  }
);

// Virtual field for fullName (combines firstName and lastName)
UserSchema.virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function (fullName) {
    let splitName = fullName.split(' '); 
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
  });

// Virtual field for password, which hashes the password before storing
UserSchema.virtual('password')
  .set(function (password) {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    } else {
      this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64'); // Generates random salt
      this.hashed_password = this.hashPassword(password); // Hashes the password with the salt
    }
  });

// Method to hash the password using salt and crypto
UserSchema.methods.hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64'); // Secure password hashing
}

// Method to authenticate user by comparing hashed password
UserSchema.methods.authenticate = function (password) {
  return this.hashed_password === this.hashPassword(password);
}

// Ensures virtual fields and sensitive information are handled properly when converting to JSON
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, 
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashed_password; 
    delete ret.salt; 
  }
});

// Export the User model for use in the application
module.exports = mongoose.model('User', UserSchema);
