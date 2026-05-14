/* 
  File Name: question.js
  Description: Defines the schema for storing questions related to ads in the database,
               including user details, the question itself, and answer fields.
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import mongoose for schema and model creation
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Question with fields for user info, question, answer, and related ad
const QuestionSchema = new Schema({
    firstName: {
        type: String,
        required: 'first name is required',
        trim: true // Ensures there are no leading or trailing spaces
    },
    lastName: {
        type: String,
        required: 'last name is required',
        trim: true
    },
    question: {
        type: String,
        required: 'question is required'
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"], // Regex for email validation
        required: 'Email is required'
    },
    phoneNumber: {
        type: Number,
        required: 'phone number is required',
        trim: true
    },
    answer: {
        type: String,
        default: null // Answer field is optional and can be added later
    },
    createdDate: {
        type: Date,
        default: Date.now, // Automatically sets the current date
        immutable: true // Prevents modification after creation
    },
    answerDate: {
        type: Date,
        default: null // Answer date will be added when the question is answered
    },
    adID: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ad' // Refers to the related ad for the question
    },
    ownerAdID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Refers to the owner of the ad
    }
}, {
    collection: "questions" // Specifies the MongoDB collection name
});

// Virtual property to get and set the full name of the user asking the question
QuestionSchema.virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName; 
  })
  .set(function (fullName) {
    let splitName = fullName.split(' '); 
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
  });

  // Ensure virtual fields are serialised.
  QuestionSchema.set('toJSON', { // toObject works the same
    virtuals: true, // include built-in virtual `id`
    versionKey: false, //   remove `__v`
    transform: function (doc, ret) { delete ret._id } // remove `_id`
  });

// Export the Question model for use in other parts of the application
module.exports = mongoose.model('Question', QuestionSchema);
