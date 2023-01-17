const form = document.getElementById("loginForm")
const email = document.getElementById("email")
const password = document.getElementById('password')
const errBlank = document.getElementById('blankMes')
const errEmail = document.getElementById('emailMes')
const errPass= document.getElementById('passMes')
const subBtn = document.getElementById('submitBtn')


subBtn.addEventListener('click', event =>{
    var errCount = 0
    var req = new XMLHttpRequest()
    req.open('GET','http://localhost:1111/emailCheck',false)
    req.onload = function(){
        if(req.status == 200){
            var data = JSON.parse(this.response)
            var found = false
            
            data.forEach(element => {
                if(element.email == email.value){
                    found = true;
                }
            });
            if((found == false) && (email.value.length > 0 )){
                //there is no account associated
                errEmail.innerHTML = 'There are no Accounts associated to ' + email.value
                errEmail.style.color = 'red'
                errCount+=1
            }
        }else{
            console.log('error with request')
        }
    }
    req.send()

    if(email.value == '' || password.value == ''){
        errCount += 1
        errBlank.innerHTML = 'Cannot Leave Fields Blank'
        errBlank.style.color = 'red'
        errPass.innerHTML = ''
    }else{
        errBlank.innerHTML = ''
    }
    console.log(errCount)
    
    if (errCount != 0){
        event.preventDefault()
    }


})