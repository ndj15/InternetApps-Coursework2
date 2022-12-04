const express = require('express')
var mongoose = require('mongoose')
const path = require('path')
var app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

var users = require('./Users.model.js')
var loginPort = 5522
var db = 'mongodb://localhost:27017/HealthyLife';

mongoose.connect(db)


app.post('/YourHealth',function(req,res){
    
    users.findOne({email:req.body.email},function(error,data){
        if(error){
            res.send(error)
        }else{
            if(data==null){
                res.send('cannot find account associated to ' + req.body.email)
            }else{
                users.findOne({email:req.body.email, password: req.body.password},function(error,data){
                    if(error){
                        res.send(error)
                    }else{
                        if(data == null){
                        res.send("incorrect password, try again")
                        }else{
                            console.log(data)
                            res.sendFile((path.join(__dirname, 'YourHealth.html')))
                            

                        }
                    }

                })
            }
        }
    })
})




app.listen(loginPort,function(err){

    console.log('listening on port' + loginPort)
})