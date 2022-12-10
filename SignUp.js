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
const errPassLen = document.getElementById('passLen')
const errMatch = document.getElementById('passMatch')







form.addEventListener('submit',event=>{

    event.preventDefault()
    var errCount = 0

    if(email.value =='' || password.value ==''| password.value==''){
        
        errBlank.innerHTML ='Cannot Leave Email, Password or Confirm Password Blank'
        errBlank.style.color ='red'
        errCount+=1

    }else{
        errBlank.innerHTML =''
        
        
    }

    if(!email.value.match((/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))){
        errFormat.innerHTML = 'Incorrect email format'
        errFormat.style.color = 'red'
        errCount +=1


    }else{
        errFormat.innerHTML = ''
        var req = new XMLHttpRequest()

        req.open('GET','http://localhost:9999/emailCheck', true)

        req.onload = function(){
            if(req.status == 200){// if communication was successfull
                var existingEmail = JSON.parse(this.response)

                existingEmail.forEach(element => {
                    console.log(element.email)
                    console.log(email.value)
                    if(element.email === email.value){
                    //email already exists
                    console.log('yes')
                    console.log('here')
                    var emailExistErr = document.createElement('p')
                    emailExistErr.innerHTML = 'Email already exists. please Log In' + email.value
                    emailExistErr.style.color = 'red'
                    
                    document.getElementById('errorList').appendChild(emailExistErr)

                    errCount=+1


                }else{
                     console.log('no !')

                }

                });
                
            }else{
                console.log('failed')

            }
        }

        req.send()

    }

    if(password.value.length <= 7){
        errPassLen.innerHTML = 'Password needs to be longer than 6 characters'
        errPassLen.style.color ='red'
        errCount+=1
         


    }else{
        errPassLen.innerHTML = ''
        
        
    }if(password.value != passwordCheck.value){
        errMatch.innerHTML = 'Password fields do not match'
        errMatch.style.color ='red'
        errCount+=1


    }else{
        errMatch.innerHTML =''
        //clear all messages and post
    }

   /* if(errCount> 0 ){

        event.preventDefault()
    }

*/
})

