
const form = document.getElementById('signUpForm')
const email = document.getElementById('email')
const emailLabel = document.getElementById('emailLabel')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('passConfirm')
const heading = document.getElementById('heading')
const subBtn = document.getElementById('submitBtn')
const errormess  = document.getElementById('error')
errormess.style.color = 'red'
var error = 0

/*



*/ 
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

function passMatch(){

    if(password.value != passwordCheck.value){
        console.log("Passwords do not match")

        passConfirmLabel.innerHTML = "Confirm Password PASSWORDS DO NOT MATCH"
        passConfirmLabel.style.color= 'red'
    }
    else{
        passConfirmLabel.innerHTML = "Confirm Password "
        passConfirmLabel.style.color = 'green'

    }



}

function valEmail(email){
    var charCheck = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return charCheck.test(email)


}




form.addEventListener('submit',function(event){
    event.preventDefault()

    /*if(email.value =='' || password.value ==''| password.value==''){
        event.preventDefault()
        div.appendChild(blankErr)


    }if(password.value.length <= 7){
        msg+= 'password length has to be 7 or more characters\n'
         


    }if(!(valEmail(email.value))){

        msg += 'incorrect Email Form\n'
        emailLabel.style.color = 'red'


    }else{

        errormess.innerHTML = ''
    }


*/

})//add function for clicking on button for submit