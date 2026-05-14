/* 
  File Name: ads.js
  Description: Defines the Mongoose schema and model for advertisement entries, specifying the structure, 
               validation, and data types for ads in the MongoDB database.   
  Team's name: BOFC 
  Group number: 04
  Date: November 9, 2024
*/

// Import Mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Alias for Mongoose schema creation
const Schema = mongoose.Schema;

// Define schema for ads entries, specifying each field, its data type and validations.
const AdSchema = new Schema({
  title: { 
    type: String, 
    required: 'Title is required', 
    trim: true 
  },
  description: { 
    type: String, 
    required: 'Description is required', 
    trim: true 
  },
  category: { 
    type: String, 
    required: 'Category is required' 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    immutable: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: 'Price is required', 
    min: [0, 'Price must be a positive number'] 
  },
  status: { 
    type: String, 
    enum: ['active', 'disabled', 'expired'], 
    default: 'active', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: 'Start date is required'
    // ,
    // validate: { 
    //   validator: function (value) { return value > Date.now(); }, 
    //   message: 'Start date must be later than the current date.' 
    // }
  },
  endDate: { 
    type: Date, 
    required: 'End date is required',
    validate: { 
      validator: function (value) { return value > this.startDate; }, 
      message: 'End date must be later than start date.' 
    }
  },
  created: { 
    type: Date, 
    default: Date.now, 
    immutable: true 
  },
  updated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'ads'
});

// Ensure virtual fields are serialised.
AdSchema.set('toJSON', { // toObject works the same
  virtuals: true, // include built-in virtual `id`
  versionKey: false, //   remove `__v`
  transform: function (doc, ret) { delete ret._id } // remove `_id`
});

// Ensure status is updated based on current date and endDate
AdSchema.pre('save', function (next) {
  const now = Date.now();
  if (this.endDate < now) {
    this.status = 'expired';
  } else if (this.status === 'expired' && this.endDate >= now) {
    this.status = 'active'; // Revert status if the endDate is adjusted to the future
  }
  this.updated = new Date(); // Update `updated` timestamp
  next();
});

// Export the Ads model based on the defined schema
module.exports = mongoose.model('Ad', AdSchema);

