const express = require('express')
var mongoose = require('mongoose')
const path = require('path')
var app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const mentalHealth = require('./UserFitness-model.js')
var port = 2222
var db = 'mongodb://localhost:27017/HealthyLife';

mongoose.connect(db)


//load mental health stats

//assuming the user is known
app.get('/submitFitnessData',function(req,res){
    console.log('hello you are here')
    mentalHealth.create({
        steps: req.query.stepCount,
        caloriesBurned:req.query.calBurned,
        numberOfExecises:req.query.exercise,
        durationOfExercise:req.query.duration,
    })
    console.log('Upload complete')
})




app.listen(port,function(err){

    console.log('listening on port' + port)
})