const form = document.getElementById('loginForm')
const email = cleanInput(document.getElementById("email").value)
const password = cleanInput(document.getElementById('password').value)
const errBlank = document.getElementById('blankMes')
const errEmail = document.getElementById('emailMes')
const errPass= document.getElementById('passMes')
const sanitize = require("sanitize-html")




    function cleanInput(userInput){
        var cleanText = sanitizeHtml(userInput,{
            allowedTags:[],
            allowedAttributes:{}
        })
    
        return cleanText
    }



form.addEventListener('submit', event=>{
    var errCount = 0

    var req = new XMLHttpRequest()

    req.open('GET','http://localhost:1111/emailCheck',false)

    req.onload = function(){
        if(req.status == 200){
            var data = JSON.parse(this.response)
            userData = undefined
            var found = false
            

            data.forEach(element => {
                if(element.email == email){
                    userData = element
                    found = true;


                }
            });
            
            if((found == false) && (email.length > 0 )){
                //there is no account associated
                errEmail.innerHTML = 'There are no Accounts associated to ' + email
                errEmail.style.color = 'red'
                errCount+=1

            }
                 

        }else{
            console.log("connection Failed with Server")


        }

    }

    req.send()

    if(email == '' || password == ''){
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