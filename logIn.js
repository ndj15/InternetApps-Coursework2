const form = document.getElementById('loginForm')
const email = document.getElementById("email")
const password = document.getElementById('password')
const errBlank = document.getElementById('blankMes')
const errEmail = document.getElementById('emailMes')
const errPass= document.getElementById('passMes')


form.addEventListener('submit', event=>{
    var errCount = 0

    var req = new XMLHttpRequest()

    req.open('GET','http://localhost:9999/emailCheck',false)

    req.onload = function(){
        if(req.status == 200){
            var data = JSON.parse(this.response)
            userData = undefined
            var found = false
            

            data.forEach(element => {
                if(element.email == email.value){
                    userData = element
                    found = true;


                }
            });
            
            if(found ==true){//if email is found
                 if(userData.password != password.value){
                    errPass.innerHTML = 'Incorrect Password'
                    errPass.style.color = 'red'
                    errCount +=1


                }else {
                    errPass.innerHTML = ''
                }


            }else if((found == false) && (email.value.length > 0 )){
                //there is no account associated to + email.value
                errEmail.innerHTML = 'There are no Accounts associated to ' + email.value
                errEmail.style.color = 'red'
                errCount+=1

            }


        }else{
            console.log("connection Failed with Server")


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

    if (errCount!= 0){

        event.preventDefault()

    }
})