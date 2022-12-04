var mongoose = require('mongoose');

// Schema support the definition of a collection structure
var Schema = mongoose.Schema;

// concrete collection structure
var userFitnessData = new Schema({
  email:String,
  date: Number,
  steps:Number,
  caloriesBurned:Number,
  numberOfExecises: Number,
  durationOfExercise:Number
});

// Creates a collection based on a specific structure
module.exports = mongoose.model('UserFitnessData', userFitnessData);