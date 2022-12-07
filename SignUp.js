const form = document.getElementById('signUpForm')
const email = document.getElementById('email')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('passConfirm')
const heading = document.getElementById('heading')
const subBtn = document.getElementById('submitBtn')
const error  = document.getElementById('error')


function passCheck(){
    console.log(password.innerHTML.length)
    if(password.value == ''){
        var msg = 'Field Cannot be Left Blank'
        msg.style.color ='blue'
        passwordError.innerHTML = msg.style.color
    }

    if(password.value.length < 4){
        //if password length has to be more than xyz
        console.log('Your length of password is' + password.value.length)
    }


}

function passMatch(){
    if(passwordCheck.value == ''){
///cannot leave blank


    }

    if(password.value != passwordCheck.value){
        console.log("Passwords do not match")

        passConfirmLabel.innerHTML = "Confirm Password PASSWORD DO NOT MATCH"
        passConfirmLabel.style.color= 'red'
    }
    else{
        passConfirmLabel.innerHTML = "Confirm Password "
        passConfirmLabel.style.color = 'green'

    }



}

function emailCheck(){
    if(email.value ==''){
        //cannot leave blank
    }


}





form.addEventListener('submit',function(event){
    event.preventDefault();
    //email check

    var emailChar = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/

    if(emailChar.text(email.value)){//if true
        console.log('okay email')


        


    }   else{

        console.log('bad email')
    }
    //password check

    // password match check






})//add function for clicking on button for submit