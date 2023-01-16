
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const users = require('./Users.model.js')
mongoose.connect('mongodb://localhost:27017/HealthyLife')
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session')

passport.serializeUser((user,done)=>{
    done(null,user.id)

})
passport.deserializeUser(async (id,done)=>{
    try{
        const user = await users.findOne({id:id})
        if(user){
            done(null,user)
            
        }
    }catch{
        done(err,null)
    }
})

passport.use(new LocalStrategy(
    {usernameField:'email'},
    async (username,password,done)=>{
        const user = await users.findOne({email:username})
        if (user == null){ // user[0].length === 0 
            done(null,false)
        }else{
            try{
                if(await bcrypt.compare(password,user.password)){//success
                    return done(null,user)
                    //sanitiza this password
    
                }else{//password doesnt match
                    console.log('password doesnt match')
                    return done(null,false)
    
                }
            }
            catch(e){
                return done(e,false)
                
            }
        }

        }
    

))

