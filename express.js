const express = require('express');
var mongoose = require('mongoose');
const path = require('path')
const ejs = require('ejs')
const bcrypt = require("bcrypt")
var app1 = express();
app1.use(express.urlencoded({ extended: true }));
app1.use(express.json())//middleware that parse post request
app1.set('view engine', 'ejs')
const x = require('util')
app1.use(express.static('/'))
const cors = require('cors')
app1.use(express.static('public'))
app1.use(express.static(__dirname + '/Webpage/'))
const passport = require('passport')
const strat = require("passport-local").Strategy
app1.use(flash())
app1.use(session({
    secret:'c8afee1b3508e34 ',//secret key
    resave:false,
    saveUninitialized: false

}))
app1.use(passport.initialize)
app1.use(passport.session())

passport.serializeUser((user,done)=>{
    done(null,user.id)

})
passport.deserializeUser((user,done)=>
    {
        done(null,user)
    })
passport.use(new localStrategy(
    function(username,password,done){

    }
))
app1.use(cors({origin: 'http://127.0.0.1:5500'}))
var userEmail = undefined
const jwt = require("jsonwebtoken")
const users = require('./Users.model.js')
const dietData = require('./userDiet-model.js');
const fitness = require('./UserFitness-model.js')
const wellness = require('./UserMentalH-model.js')
const { loadavg } = require('os');
const { json } = require('express');
const { validate } = require('./userDiet-model.js');
const { resolveCaa } = require('dns');
const { rejects } = require('assert');
const { link } = require('fs');
const sanitizeHtml = require('sanitize-html');
var port = 1111;
var db = 'mongodb://localhost:27017/HealthyLife';



mongoose.connect(db)

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

app1.get('/',function(req,res)
{
    
    res.render('index')

})

app1.get('/login',function(req,res){
    
    res.render('LogIn')


})

app1.get('/signUp',function(req,res){
    res.render('SignUp')
})


app1.post('/signUp/createUser', function(req,res){
//email check
    users.findOne({email:cleanInput(req.body.email)}, async function(error,data){
        if(error){
            console.log('error - cannot find')
        }
        else{
            if(data == null){ // if there is no entry with email in database
                if(cleanInput(req.body.password) == cleanInput(req.body.passwordCheck)){
                    console.log('passwords match')
                    try{
                        securePass = await bcrypt.hash(cleanInput(cleanInput(req.body.password)),10)
                        databaseInsert(cleanInput(req.body.email), cleanInput(req.body.fName),cleanInput(req.body.lName), securePass);
                    }catch{

                        res.status(201).send("ERR hashing")
                    }
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


app1.get('/emailCheck',function(req,res){
    users.find({},function(err,data){
        if(err){

            console.log(err)
        }else{
            res.send(data)

        }
    })
})

app1.get('/user/getWellnessData',function(req,res){
    var date = new Date()
        wellness.findOne({email:userEmail,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })})


 app1.get('/user/wellness',isAuth,function(req,res){ 
        fetch('http://localhost:1111/user/getWellnessData')
        .then((data)=>{
            return data.text()
    
        }).then((text)=>{
            if(text.length > 1){//if there is a value
        
                return JSON.parse(text)
            }
            else{
               
                return false
            }
            
        }).then((data)=>{
    
            if(data != false){// if there is data
                if(data.rating < 5){//rating less that 5
                    if(data.sleepHrs < 6){// less than 5 and less than 6 hrs sleep
                        res.render('wellness.ejs',{
                            rating: data.rating,
                            sleepHrs:data.sleepHrs ,
                            social:data.social,
                            link1:"https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/",
                            link2:"https://www.healthshots.com/preventive-care/self-care/what-will-happen-if-you-sleep-for-less-than-6-hours/",
                        
                            
                        })
                    }else{// less than 5 rating but more than 6 hrs sleep
                        res.render('wellness.ejs',{
                            rating: data.rating,
                            sleepHrs:data.sleepHrs ,
                            social:data.social,
                            link1:"https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/",
                            link2:"https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html",
                        
                            
                        })
                    }
                }
                else{ // rating more than 5
                    if(data.sleepHrs < 30){// good rating but bad sleep
                        res.render('wellness.ejs',{
                            rating: data.rating,
                            sleepHrs:data.sleepHrs ,
                            social:data.social,
                            link1:"https://www.healthline.com/health/how-to-be-happy",
                            link2:"https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html",
                        
                            
                        })
                    
                    }else{ // good rating and good sleep
                        res.render('wellness.ejs',{
                            rating: data.rating,
                            sleepHrs:data.sleepHrs ,
                            social:data.social,
                            link1:"https://www.healthline.com/health/how-to-be-happy",
                            link2:"https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html",
                        
                            
                        })
                    }
        
        
                }
            }
            
            else{
                res.render('wellness.ejs',{
                    rating: "Not Submitted for today",
                    sleepHrs:"Not Submitted for today",
                    social:"Not Submitted for today",
                    link1:"",
                    link2:"",
                
                    
                })
            }})
        .catch(err=>{
    
        console.log(err)
    
    })
    
    })

app1.post('/user/wellness/submitWellnessData',function(req,res){
    var date = new Date()
    fetch('http://localhost:1111/user/getWellnessData')
    .then((response)=>{ // database empty?
        return response.text()
    }).then((data)=>{// if entry exists
         if(data.length > 1){
            return data
        }else{
            return false

        }
        
    }).then((text)=>{ // if there is an entry for today 
        if(text != false){
            console.log(JSON.parse(text))
            return true
        }else{
            
            return false
        }
        
    }).then((data)=>{
        if(data != true){
            var values = []
            values[0] = cleanInput(req.body.rating)
            values[1] = cleanInput(req.body.sleep)
            values[2] = cleanInput(req.body.social)
            return values
            
        }else{
            return false

        }
        
         // turn into useable numbers from json
          }).then((data)=>{
            console.log(data)
            if (data != false){
               wellness.create({
                email:userEmail,
                date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                rating: data[0],
                sleepHrs: data[1],
                social: data[2]
    
                        })
                res.redirect('http://localhost:1111/user/wellness')
            }
            else{

                res.render('submitted.ejs',{
                    previousPage: 'http://localhost:1111/user/wellness'

                })

            }
    }).catch((err)=>{

        console.log(err)
    })
})

app1.get('/user/getFitnessData',function(req,res){
    var date = new Date()
        fitness.findOne({email:userEmail,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })})


 app1.get('/user/fitness',isAuth,function(req,res){
        fetch('http://localhost:1111/user/getFitnessData')
        .then((data)=>{
            return data.text()
    
        }).then((text)=>{
            if(text.length > 1){//if there is a value
             
                return JSON.parse(text)
            }
            else{
               
                return false
            }
            
        }).then((data)=>{
    
        if(data != false){// if there is data
            console.log(data)
            if(data.steps < 5000){//steps less than 5000
                if(data.exercise < 30){// less than 5000 steps and less than 30 mins exercise
                    res.render('fitness.ejs',{
                        steps: data.steps,
                        calories:data.caloriesBurned ,
                        active:data.exercise,
                        link1:"https://www.ageuk.org.uk/northern-ireland/information-advice/health-wellbeing/fitness/walking-tips-advice/#:~:text=Simple%20tips%20for%20successful%20walking%20exercise%201%201.,outdoors%20...%206%206.%20Wear%20thin%20layers%20",
                        link2:"https://www.nhs.uk/live-well/exercise/",
                    
                        
                    })
                }else{// less than 5000 but does good amount of exercise
                    res.render('fitness.ejs',{
                        steps: data.steps,
                        calories:data.caloriesBurned ,
                        active:data.exercise,
                        link1:"https://www.bbc.co.uk/programmes/articles/51SPhn5FKSYRnQNswfnWsN2/8-reasons-why-we-should-all-walk-more#:~:text=Six%20tips%20for%20how%20to%20walk%20more%20during,around%20when%20you%E2%80%99re%20on%20the%20call.%20More%20items",
                        link2:"https://www.nia.nih.gov/health/staying-motivated-exercise-tips-older-adults",
                    
                        
                    })
                }
            }
            else{ // steps more than 5000
                if(data.exercise < 30){//more than 5000 but no many active minutes
                    res.render('fitness.ejs',{
                        steps: data.steps,
                        calories:data.caloriesBurned ,
                        active:data.exercise,
                        link1:"https://www.healthline.com/health/how-to-walk#:~:text=Tips%20for%20walking%20properly%201%20Keep%20your%20head,...%206%20Step%20from%20heel%20to%20toe%20",
                        link2:"https://darebee.com/fitness/how-to-exercise-more.html#:~:text=What%20should%20we%20do%20to%20exercise%20more%3F%201,you%20need%20to%20go%20flat-out%20in%20intensity.%20",
                    
                        
                    })
                
                }else{ // more than 5000 steps and active individual
                    res.render('fitness.ejs',{
                        steps: data.steps,
                        calories:data.caloriesBurned ,
                        active:data.exercise,
                        link1:"https://www.healthline.com/health/how-to-walk#:~:text=Tips%20for%20walking%20properly%201%20Keep%20your%20head,...%206%20Step%20from%20heel%20to%20toe%20",
                        link2:"https://www.nia.nih.gov/health/staying-motivated-exercise-tips-older-adults",
                    
                        
                    })


                }
    
    
            }
        }
        
        else{
            res.render('fitness.ejs',{
                    steps: "Not Submitted Today",
                    calories:"Not Submitted Today" ,
                    active:"Not Submitted Today",
                    link1:'',
                    link2:'',
                    
                })
        }})
    
    
    
    
    
    .catch(err=>{
    
        console.log(err)
    
    })
    
    })

app1.post('/user/fitness/submitFitnessData',function(req,res){
    var date = new Date()
    fetch('http://localhost:1111/user/getFitnessData')
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
            console.log(JSON.parse(text))
            return true
        }else{
            
            return false
        }
        
    }).then((data)=>{
        if(data != true){
            var values = []
            values[0] = cleanInput(req.body.stepCount)
            values[1] = cleanInput(req.body.calBurned)
            values[2] = cleanInput(req.body.exercise)
            return values
            
        }else{
            return false

        }
        
         // turn into useable numbers from json
          }).then((data)=>{
            console.log(data)
            if (data != false){
               fitness.create({
                email:userEmail,
                date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                steps: req.body.stepCount,
                caloriesBurned: req.body.calBurned,
                exercise: req.body.exercise
    
                        })

                    
                res.redirect('http://localhost:1111/user/fitness')
            }
            else{

                res.render('submitted.ejs',{
                    previousPage: 'http://localhost:1111/user/fitness'

                })

            }
    }).catch((err)=>{

        console.log(err)
    })
})


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



app1.get('/user/diet',isAuth,function(req,res){
    console.log(userEmail)
    fetch('http://localhost:1111/user/getDietData')
    .then((data)=>{
        return data.text()

    }).then((text)=>{
        if(text.length > 1){//if there is a value
            return JSON.parse(text)
        }
        else{

            return false
        }
        
    }).then((data)=>{

        if(data != false){// if there is data
            console.log(data)
            if(data.calIntake < 1500){//under cals
                if(data.alcConsumed < 30){// less cals and drinkning moderately
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:"https://www.healthline.com/nutrition/1500-calorie-diet",
                        link2:"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation",
                    
                        
                    })
                }else{// less cals and drinking a lot
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:"https://www.healthline.com/nutrition/1500-calorie-diet",
                        link2:"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm",
                    })
                }
            }
            else if(data.calIntake < 2500 && data.calIntake > 1500){ // eating the right amount of calories 
                if(data.alcConsumed < 3){//over eating but long term drinking
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:"https://www.who.int/initiatives/behealthy/healthy-diet",
                        link2:"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation",
                    
                        
                    })
                
                }else{ // over eating and over drinking
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:'https://www.who.int/initiatives/behealthy/healthy-diet',
                        link2:"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm",
                    
                        
                    })


                }
            
    
                
            }else{//more than 2500 calories
                if(data.alcConsumed < 3){//over eating but drinking in moderation
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:"https://www.livestrong.com/article/478687-the-effects-of-too-many-calories/",
                        link2:"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation",
  
                    })
                
                }else{ // over eating and over drinking
                    res.render('diet.ejs',{
                        numOfMeals: data.mealNo,
                        calInt:data.calIntake,
                        alcCon:data.alcConsumed,
                        link1:'https://www.livestrong.com/article/478687-the-effects-of-too-many-calories/',
                        link2:"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm",
                    
                        
                    })


                }

            }
        }
        
        else{
            res.render('diet.ejs',{
                numOfMeals: "Not Submitted for today",
                calInt:"Not Submitted for today",
                alcCon:"Not Submitted for today",
                link1:"",
                link2:"",
                    
                })
        }})
    
    
    
    
    
    .catch(err=>{

    console.log(err)

})

})



app1.post('/user/diet/submitDietData',function(req,res){
    var date = new Date()
    fetch('http://localhost:1111/user/getDietData')
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
            values[0] = cleanInput(req.body.mealNo)
            values[1] = cleanInput(req.body.calInt)
            values[2] = cleanInput(req.body.alcCon)
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

                    
                res.redirect('http://localhost:1111/user/diet')
            }
            else{

                res.render('submitted.ejs',{
                    previousPage: 'http://localhost:1111/user/diet'

                })

            }
    }).catch((err)=>{

        console.log(err)
    })
})

app1.post('/logIn/request', function(req,res){

 users.findOne({email:cleanInput(req.body.email)}, async function(error,data){
            if(error){
                res.send(error)
            }
            else{
                if(data==null){
                    res.send('cannot find account associated to ' + req.body.email)
                }
                else{//finding email and password combination
                    try{
                        if(await bcrypt.compare(cleanInput(req.body.password), cleanInput(data.password))){
                            //successfull login
                            userEmail = cleanInput(req.body.email)
                            
                            
                            res.redirect('http://localhost:1111/user/diet')

                        }else{
                            res.send("incorrect Password, Please try again")

                        }

                    }catch{
                        res.status(500).send("ERROR")
                    }
                    
                }
            }
})
})

app1.post('/login/request', function(req,res){

    passport.use(new localStrategy((username, password)))
        {
            users.findOne({email:username},async (err,data)=>{
                if(err){
                    res.send(err)
                }
                if(!data){
                    res.send("cannot find account associated to" + req.body.email)
                }
                else{
                    try{
                        if(await bcrypt.compare(req.body.password, data.password)){
                            return data
                        }
                        else
                        {
                            res.send("incorrect password, please try again")
                        }
                    }catch{
                        res.status(500).send("ERROR IN BCRYPT")
                    }

                }


            })
        }


})

function isAuth(req,res){
    if(req.isAuthenticated()){
        return
    }else{
        res.redirect('/login')
    }

}

function cleanInput(userInput){
    var cleanText = sanitizeHtml(userInput,{
        allowedTags:[],
        allowedAttributes:{}
    })

    return cleanText
}

app1.get('/logOut',(req,res)=>{
    req.logout()
    req.redirect('/')

})
app1.listen(port,function(err){
    if(err){console.log(err)}
    else{
    console.log("Server listening on port " + port)
    }
})


