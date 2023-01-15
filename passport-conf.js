
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const users = require('./Users.model.js')
mongoose.connect('mongodb://localhost:27017/HealthyLife')
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session')
/*
function init(passport, getByEmail,getByID){
    const authUser = async(email,password,done)=>{
        const user = getByEmail(email)
        console.log(user)
        console.log(user)
        if (user == null){//no users found
            console.log('no user with email')
            return done(null,false)
            //return error message
        }
        try{
            console.log(password+'pass')
            console.log(user.password+'user ob')
            if(await bcrypt.compare(password,user.password)){//success
                return done(null,user)
                //sanitiza this password

            }else{//password doesnt match
                console.log('password doesnt match')
                return done(null,false)

            }
        }
        catch(e){
            return done(e)

        }
    }

    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    },authUser))

    passport.serializeUser((user,done)=>{
        return done(null,user.id)

    })
    passport.deserializeUser((id,done)=>{
        return done(null,getById(id))
        
    })
}

module.exports = init
*/


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