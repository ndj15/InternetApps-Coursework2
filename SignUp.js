const form = document.getElementById('signUpForm')
const email = document.getElementById('email')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('passConfirm')
const heading = document.getElementById('heading')
const passConfirmLabel = document.getElementById('passConfirmLabel')



function passCheck(){
    console.log(password.innerHTML.length)

    if(password.value.length< 4){
        //if password length has to be more than xyz

        console.log('Your length of password is' + password.value.length)
    }else{

        console.log('fine')
    }


}

function passMatch(){
    if(password.value != passwordCheck.value){
        console.log("Passwords do not match")
        passConfirmLabel.innerHTML = "Confirm Password PASSWORD DO NOT MATCH"
    }
    else{
        passConfirmLabel.innerHTML = "Confirm Password PASSWORD MATCH"

    }



}

