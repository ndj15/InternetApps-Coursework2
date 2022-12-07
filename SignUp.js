const form = document.getElementById('signUpForm')
const email = document.getElementById('email')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('passConfirm')

password.innerHTML = 33

function passCheck(){
if(password.innerHTML.length < 9){


    console.log('i need longer')
}else{

    console.log('fine')
}


}

