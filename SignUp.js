const em = document.getElementById('emailLabel')
const form = document.getElementById('signUpForm')
const email = document.getElementById('email')
const emailLabel = document.getElementById('emailLabel')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('passConfirm')
const heading = document.getElementById('heading')
const subBtn = document.getElementById('submitBtn')
const errBlank = document.getElementById('blank')
const errFormat = document.getElementById('emailFormat')
const errPassLen = document.getElementById('passLength')
const errMatch = document.getElementById('passMatch')




form.addEventListener('submit',e=>{

    e.preventDefault()


})

function passCheck(){
    console.log(password.innerHTML.length)
    if(password.value == ''){
        errormess.innerHTML = 'Password field cannot be left blank'
    }

    if(password.value != passwordCheck.value){
        passConfirmLabel.innerHTML ="Confirm Password PASSWORDS NOT MATCH"
        passConfirmLabel.style.color ="red"

    }else{
        passConfirmLabel.innerHTML ="Confirm password"
        passConfirmLabel.style.color ='green'



    }

}

form.addEventListener('submit',event=>{
    event.preventDefault()
    if(email.value =='' || password.value ==''| password.value==''){
        
        errBlank.innerHTML ='Cannot Leave Email, Password or Confirm Password Blank'
        errBlank.style.color ='red'

    }if(!(valEmail(email.value))){
        //to be completed
       


    }if(password.value.length <= 7){
        errPassLen.innerHTML = 'Password needs to be longer than 6 characters'
        errPassLen.style.color ='red'
         


    }if(password.value != passCheck.value){
        errMatch.innerHTML = 'Passwords does not match'
        errMatch.style.color ='red'


    }else{

        //clear all messages and post
    }

})

