const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0';

mongoose.connect(url,function(error){
    if (error){
        console.log("error");
    }else{
        console.log('success');
        var Schema = mongoose.Schema;

        var DBSchema = new Schema({
            name:String,
            age:Number,
        })
        module.exports = mongoose.model('Schema1', DBSchema)
    }
    db



})