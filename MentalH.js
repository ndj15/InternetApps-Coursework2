const express = require('express')
var mongoose = require('mongoose')
const path = require('path')
var app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const mentalHealth = require('./UserMentalH-model.js')
var port = 1111
var db = 'mongodb://localhost:27017/HealthyLife';

mongoose.connect(db)


//load mental health stats

//assuming the user is known
app.get('/submitMentalHealth',function(req,res){
    console.log('hello you are here')
    mentalHealth.create({
        rating: req.query.rating,
        sleepHrs:req.query.sleepRating
    })
    console.log('Upload complete')
})




app.listen(port,function(err){

    console.log('listening on port' + port)
})