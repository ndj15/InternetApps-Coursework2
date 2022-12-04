var mongoose = require('mongoose');

// Schema support the definition of a collection structure
var Schema = mongoose.Schema;

// concrete collection structure
var UsersSchema = new Schema({
  email: String,
  fName: String,
  lName: String,
  password: String
});

// Creates a collection based on a specific structure
module.exports = mongoose.model('Users', UsersSchema);