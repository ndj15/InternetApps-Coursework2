require('dotenv').config()
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
app1.use('/html',express.static(__dirname + '/Webpage'))
app1.use(cors({origin: 'http://127.0.0.1:5500'}))
const users = require('./Users.model.js')
const dietData = require('./userDiet-model.js');
const fitness = require('./UserFitness-model.js')
const wellness = require('./UserMentalH-model.js')
const { loadavg, devNull } = require('os');
const { json } = require('express');
const { validate } = require('./userDiet-model.js');
const { resolveCaa } = require('dns');
const { rejects } = require('assert');
const { link } = require('fs');
const sanitizeHtml = require('sanitize-html');


var port = 1111;
var db = 'mongodb://localhost:27017/HealthyLife';

mongoose.connect(db)


//passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const initPass = require('./passport-conf')
const flash = require('express-flash')
const session = require('express-session')
const local = require('./passport-conf');
const methodOverride = require('method-override');
app1.use(methodOverride('_method'))
const { error } = require('console');
app1.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app1.get('/emailCheck',function(req,res){
    users.find({},function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)

        }
    })
})



app1.use(passport.initialize())
app1.use(passport.session())


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

function cleanInput(userInput){
    var cleanText = sanitizeHtml(userInput,{
        allowedTags:[],
        allowedAttributes:{}
    })
    return cleanText
}

function isAuth(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }


}
app1.get('/',function(req,res){
    res.redirect('http://localhost:1111/html/index.html')

})

app1.get('/login',function(req,res){
    res.redirect('http://localhost:1111/html/LogIn.html')

})
app1.get('/signUp',function(req,res){
    res.redirect("http://localhost:1111/html/SignUp.html")
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
                        res.redirect('/user/diet')
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

 app1.get('/user/wellness',isAuth,function(req,res){ 
    var date = new Date()
    wellness.findOne({email:req.user.email,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},(err,data)=>{
        if(err){
            res.send(err)
        }else{
            if(data != null){
                if(data.rating < 5){//rating less that 5
                    if(data.sleepHrs < 6){// less than 5 and less than 6 hrs sleep
                        renderWellness(res,data.rating,data.sleepHrs,data.social,'https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/','https://www.healthshots.com/preventive-care/self-care/what-will-happen-if-you-sleep-for-less-than-6-hours/')
                    }else{// less than 5 rating but more than 6 hrs sleep
                        renderWellness(res,data.rating,data.sleepHrs,data.social,'https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/','https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html')
                    }
                    
                }else{ // rating more than 5
                    if(data.sleepHrs < 30){// good rating but bad sleep
                        renderWellness(res,data.rating,data.sleepHrs,data.social,'https://www.healthline.com/health/how-to-be-happy','https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html')
                    }else{ // good rating and good sleep
                        renderWellness(res,data.rating,data.sleepHrs,data.social,'https://www.healthline.com/health/how-to-be-happy','https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html')
                    }
                }

            }else{
                renderWellness(res,"Not Submitted for today","Not Submitted for today","Not Submitted for today","","")
            }
        }
    })
})
    
app1.post('/user/wellness/submitWellnessData',isAuth,function(req,res){
    var date = new Date()
    wellness.findOne({
        email:req.user.email,
        date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()
    },(err,data)=>{
        if(err){
            res.send(err)
        }else{
            if(data!=null){
                res.render('submitted.ejs',{
                    previousPage:'http://localhost:1111/user/wellness'
                })
            }else{
                wellness.create({
                    email:req.user.email,
                    date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                    rating:cleanInput(req.body.rating),
                    sleepHrs:cleanInput(req.body.sleep),
                    social:cleanInput(req.body.social),
                })
                res.redirect('/user/wellness')
            }
        }
    })
})

 app1.get('/user/fitness',isAuth,function(req,res){
    var date = new Date()
    fitness.findOne({email:req.user.email,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},(err,data)=>{
        if(err){
            console.log('error' + err)

        }else{
            if(data != null){
                if(data.steps <= 5000){//steps less than 5000
                    if(data.exercise < 30){// less than 5000 steps and less than 30 mins exercise
                       
                        renderFitness(res,data.steps,data.caloriesBurned,data.exercise,"https://www.ageuk.org.uk/northern-ireland/information-advice/health-wellbeing/fitness/walking-tips-advice/#:~:text=Simple%20tips%20for%20successful%20walking%20exercise%201%201.,outdoors%20...%206%206.%20Wear%20thin%20layers%20",'https://www.nhs.uk/live-well/exercise/')
                    }else{// less than 5000 but does good amount of exercise
                        
                        renderFitness(res,data.steps,data.caloriesBurned,data.exercise,'https://www.bbc.co.uk/programmes/articles/51SPhn5FKSYRnQNswfnWsN2/8-reasons-why-we-should-all-walk-more#:~:text=Six%20tips%20for%20how%20to%20walk%20more%20during,around%20when%20you%E2%80%99re%20on%20the%20call.%20More%20items','https://www.nia.nih.gov/health/staying-motivated-exercise-tips-older-adults')
                    }
                }
            else if(data.steps > 5000){ // steps more than 5000
                    if(data.exercise < 30){//more than 5000 but no many active minutes
                        renderFitness(res,data.steps,data.caloriesBurned,data.exercise,'https://www.healthline.com/health/how-to-walk#:~:text=Tips%20for%20walking%20properly%201%20Keep%20your%20head,...%206%20Step%20from%20heel%20to%20toe%20','https://darebee.com/fitness/how-to-exercise-more.html#:~:text=What%20should%20we%20do%20to%20exercise%20more%3F%201,you%20need%20to%20go%20flat-out%20in%20intensity.%20')
                    }else{ // more than 5000 steps and active individual
                        renderFitness(res,data.steps,data.caloriesBurned,data.exercise,'https://www.healthline.com/health/how-to-walk#:~:text=Tips%20for%20walking%20properly%201%20Keep%20your%20head,...%206%20Step%20from%20heel%20to%20toe%20','https://www.nia.nih.gov/health/staying-motivated-exercise-tips-older-adults')
                    }
            }
        }else{
                renderFitness(res,"Not Submitted Today","Not Submitted Today","Not Submitted Today",'','')
            }
        }
    })
})
app1.post('/user/fitness/submitFitnessData',isAuth,function(req,res){
    var date = new Date()
    fitness.findOne({
        email:req.user.email,
        date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()
    },(err,data)=>{
        if(err){
            res.send(err)
        }else{
            if(data!=null){
                res.render('submitted.ejs',{
                    previousPage:'http://localhost:1111/user/fitness'
                })
            }else{
                fitness.create({
                    email:req.user.email,
                    date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                    steps:cleanInput(req.body.stepCount),
                    caloriesBurned:cleanInput(req.body.calBurned),
                    exercise:cleanInput(req.body.exercise),
                })
                res.redirect('/user/fitness')
            }
        }
    })
})
        
function renderDiet(response,mealNo,calories,alcohol,link1,link2,){
    response.render('diet.ejs',{
        numOfMeals:mealNo,
        calInt:calories,
        alcCon: alcohol,
        link1:link1,
        link2:link2
    })
}

function renderFitness(response,steps,calBurned,exercise,link1,link2,){
    response.render('fitness.ejs',{
        steps: steps,
        calories:calBurned,
        active:exercise,
        link1:link1,
        link2:link2,
    })
}

function renderWellness(response,rate,sleep,social,link1,link2,){
    response.render('wellness.ejs',{
        rating: rate,
        sleepHrs:sleep,
        social:social,
        link1:link1,
        link2:link2,
    })
}

app1.get('/user/diet',isAuth, function(req,res){
var date = new Date()
dietData.findOne({email:req.user.email,date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()},(err,data)=>{
    if(err){
        res.send(err)
    }else{
        if(data!= null){
            if(data.calIntake < 1500){//calories under 1500
                if(data.alcConsumed < 3){// under eating but drinking in moderation
                    renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.healthline.com/nutrition/1500-calorie-diet',"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation")
                }else{// under eating and drinking a lot
                    renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.healthline.com/nutrition/1500-calorie-diet',"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm")
                }
            }else if(data.calIntake < 2500 && data.calIntake > 1500){ // eating the right amount of calories 
                if(data.alcConsumed < 3){//eating right and low drinking
                    renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.who.int/initiatives/behealthy/healthy-diet',"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation")
                
                }else{//eating right but overdrinking
                    renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.who.int/initiatives/behealthy/healthy-diet',"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm")
                }
                
            }
            else{//more than 2500 calories
                    if(data.alcConsumed < 3){//over eating but drinking in moderation
                        renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.livestrong.com/article/478687-the-effects-of-too-many-calories/',"https://health.gov/myhealthfinder/health-conditions/heart-health/drink-alcohol-only-moderation")
                    }else{ // over eating and over drinking
                        renderDiet(res,data.mealNo,data.calIntake,data.alcConsumed,'https://www.livestrong.com/article/478687-the-effects-of-too-many-calories/',"https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm")
                    }
    
                }

        }else{
            renderDiet(res,"Not Submitted for today","Not Submitted for today","Not Submitted for today",'',"")    
        }
        }
    })})

app1.post('/user/diet/submitDietData',(req,res)=>{
    var date = new Date()
    dietData.findOne({
        email:req.user.email,
        date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString()
    },(err,data)=>{
        if(err){
            res.send(err)
        }else{
            if(data!=null){
                res.render('submitted.ejs',{
                    previousPage:'http://localhost:1111/user/diet'
                })
            }else{
                dietData.create({
                    email:req.user.email,
                    date:date.getFullYear().toString() + date.getDate().toString() + (date.getMonth()+1).toString(),
                    mealNo:cleanInput(req.body.mealNo),
                    calIntake:cleanInput(req.body.calInt),
                    alcConsumed:cleanInput(req.body.alcCon),
                })
                res.redirect('/user/diet')
            }
        }
    })
})

app1.post('/login',passport.authenticate('local',
{
        successRedirect:'/user/diet',
        failureRedirect:'/login',
        //use flash for message
        

}))


app1.get('/logout',function(req,res){
    req.logOut(err=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/')
         

    })


app1.listen(port,function(err){
    if(err){console.log(err)}
    else{
    console.log("Server listening on port " + port)
    }
})


