const express = require('express');
var mongoose = require('mongoose');
const path = require('path')
const ejs = require('ejs')
var app1 = express();
app1.use(express.urlencoded({ extended: true }));
app1.use(express.json())//middleware that parse post request
app1.set('view engine', 'ejs')
const x = require('util')
app1.use(express.static('/'))


var userEmail = "test@t.com"

const users = require('./Users.model.js')
const dietData = require('./userDiet-model.js');
const fitness = require('./UserFitness-model.js')
const wellness = require('./UserMentalH-model.js')
const { loadavg } = require('os');
const { json } = require('express');
const { validate } = require('./userDiet-model.js');
const { resolveCaa } = require('dns');
const { rejects } = require('assert');

var port = 9999;


var db = 'mongodb://localhost:27017/HealthyLife';

mongoose.connect(db);


function databaseInsert(formEmail,formFname,formLname,formPassword){
    console.log(formEmail)
    console.log('attempting insertion')
    users.create({
        email: formEmail,
        fName: formFname,
        lName: formLname,
        password: formPassword
    })
    console.log('complete')
}


app1.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'))


})

app1.get('/logIn',function(req,res){
    res.sendFile(path.join(__dirname,'LogIn.html'))
})

app1.get('/signUp',function(req,res){
    res.sendFile(path.join(__dirname,'Sign up.html'))
})




app1.post('/signUp/createUser',function(req,res){
//email check
    users.findOne({email:req.body.email},function(error,data){
        if(error){
            console.log('error - cannot find')
        }
        else{
            if(data == null){ // if there is no entry with email in database
                if(req.body.password == req.body.passwordCheck){
                    console.log('passwords passed authentication check')
                    databaseInsert(req.body.email, req.body.fName,req.body.lName, req.body.password);
                    res.sendFile(path.join(__dirname, 'signUpSuccess.html'))
                }
                
                else{
                    console.log('ERROR,passwords do not match')
                    // reload webpage for retry with message
                }  
            } 

            else{

                res.send('email already exists in database')
            }

        }
    }) 
})

app1.get('/user/fitness',function(req,res){
    res.sendFile(path.join(__dirname, 'fitness.html.html'))


})

app1.get('/user/wellness',function(req,res){
    res.sendFile(path.join(__dirname, 'MentalHealth.html'))


})
app1.get('user/wellness/submitWellnessData',function(req,res){
    wellness.create({
        //email:// NEED TO FIND WAY TO INSERT EMAIL
         //: req.query.mealQuant,
         //:req.query.calories,
         //:req.query.units
     })


})

app1.get('/users/getFitness',function(req,res){
    fitness.findOne({email:userEmail},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })
})



/*
app1.get('/user/fitness',function(req,res){
    fetch('http://localhost:9999/users/getFitness')
    .then((data)=>{
        return data.json()
    }).then((object) =>{

        const steps = parseInt(JSON.stringify(object.steps)) // turn into useable numbers from json
        const caloriesBurned = parseInt(JSON.stringify(object.caloriesBurned))
        const numberOfExecises = parseInt(JSON.stringify(object.numberOfExecises))
        const durationOfExercise = parseInt(JSON.stringify(object.durationOfExercise))
        var values = []
        values[0] = steps
        values[1] = caloriesBurned
        values[2] = numberOfExecises
        values[3] = durationOfExercise
        return values
}).then((d)=>{
        console.log(d)
        res.render('fitness.ejs',{
            numOfMeals: d[0],
            calInt:d[1],
            alcCon:d[2],
        })
    return
    
}).catch(err=>{

    console.log(err)

})

})
*/

//return entry in table with email and today's date
app1.get('/user/getDietData',function(req,res){
    var date = new Date()
        dietData.findOne({email:userEmail,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })})



app1.get('/user/diet',function(req,res){
    fetch('http://localhost:9999/user/getDietData')
    .then((data)=>{
        return data.text()

    }).then((text)=>{
        if(text.length > 1){
            return JSON.parse(text)
        }
        else{

            return 'false'
        }
        
    }).then((data)=>{
        if(data != 'false'){
            res.render('diet.ejs',{
                numOfMeals: data.mealNo,
                calInt: data.calIntake,
                alcCon:data.alcConsumed
            })
            return
        }else{
            res.render('diet.ejs',{
                numOfMeals: "Not Submitted Today",
                calInt:"Not Submitted Today" ,
                alcCon:"Not Submitted Today",
            })
        }
    
})

.catch(err=>{

    console.log(err)

})

})

app1.get('/databaseStatus',function(req,res){
     




})

app1.post('/user/diet/submitDietData',function(req,res){
    var date = new Date()
    fetch('http://localhost:9999/user/getDietData')
    .then((response)=>{ // database empty?
        return response.text()
    }).then((data)=>{// if entry exists
        console.log('data:' + data)
         if(data.length > 1){
            return data
        }else{
            return false

        }
        
    }).then((text)=>{ // if there is an entry for today 
        if(text != false){
            console.log('entry for today already exists or you have not made your first entry')
            console.log(JSON.parse(text))
            return true
        }else{
            
            return 
        }
        
    }).then((data)=>{
        if(data != true){
            var values = []
            values[0] = req.body.mealNo
            values[1] = req.body.calInt
            values[2] = req.body.alcCon
            return values
            
        }else{
            return false

        }
        
         // turn into useable numbers from json
          }).then((data)=>{
            if (data != false){
               dietData.create({
                email:userEmail,
                date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                mealNo: data[0],
                calIntake: data[1],
                alcConsumed: data[2]
    
                        })

                    
                res.redirect('http://localhost:9999/user/diet')}
            else{

                res.send('already submitted')

            }
    }).catch((err)=>{

        console.log(err)
    })
})

        
        





app1.post('/logIn/request',function(req,res){

 users.findOne({email:req.body.email},function(error,data){
            if(error){
                res.send(error)
            }
            else{
                if(data==null){
                    res.send('cannot find account associated to ' + req.body.email)
                }
                else{
                    users.findOne({email:req.body.email, password: req.body.password},function(error,data){
                        if(error){
                            res.send(error)
                        }
                        else{
                            
                            if(data == null){
                            res.send("incorrect password, try again")
                            }
                            else {

                                res.sendFile(path.join(__dirname,'YourHealth.html'))
                             

                                    /*res.render('YourHealth',{
                                    numOfMeals: dData.mealNo,
                                    calInt: dData.calIntake,
                                    alcCon: dData.alcConsumed,

                                        */


                                }
                        }
                    })
                }
            }



})
})

app1.post('user/mentalHealth/submitMentalHealth',function(req,res){
    console.log('hello you are here')
    mentalHealth.create({
        rating: req.query.rating,
        sleepHrs:req.query.sleepRating
    })
    console.log('Upload complete')

})
/*
app1.post('/user/fitness/submitFitness',function(req,res){



})
*/



app1.get('/users/getFitnessData',function(req,res){
    dietData.findOne({email:"test@t.com"},function(err,data){
        if(err){
            console.log(err)
        }else{
            //res.send(data)
        }
    })
})

    
app1.listen(port,function(err){
    if(err){console.log(err)}
    else{
    console.log("Server listening on port " + port)
    }
})


