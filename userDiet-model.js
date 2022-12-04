var mongoose = require('mongoose');

// Schema support the definition of a collection structure
var Schema = mongoose.Schema;

// concrete collection structure
var userDietData = new Schema({
  email: String,
  date: Number,
  mealNo:Number,
  calIntake:Number,
  alcConsumed:Number
  
});

// Creates a collection based on a specific structure
module.exports = mongoose.model('UserDietData', userDietData);