var mongoose = require('mongoose');

// Schema support the definition of a collection structure
var Schema = mongoose.Schema;

// concrete collection structure
var userMentalData = new Schema({
  email:String,
  date: Number,
  rating:Number,
  sleepHrs:Number,
  social:Number,
  
});

// Creates a collection based on a specific structure
module.exports = mongoose.model('UserWellnessData', userMentalData);