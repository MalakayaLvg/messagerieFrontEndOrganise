const content = document.querySelector('.content')

let token = ""

function run(){
    if (!token) {
        loginForm()
    } else {
        fetchMessages()
    }
}

function loginForm ()
{
    let loginTemplate = `<div class="form-control">
                                    <h2>Login</h2>
                                    <input type="text" id="usernameLogin" placeholder="username">
                                    <input type="text" id="passwordLogin" placeholder="password">
                                    <button class="buttonLogin">Log in</button>
                                </div>`
    content.innerHTML = loginTemplate
    const buttonLogin = document.querySelector(".buttonLogin")
    buttonLogin.addEventListener("click",()=>{
        console.log("click")
        fetchLogin().then(data=>{
            console.log(data)
            fetchMessages(data)
        })

    })
}

async function fetchLogin()
{
    const username = document.querySelector('#usernameLogin')
    const password = document.querySelector('#passwordLogin')

    let paramsBody = {
        username:username.value,
        password:password.value
    }

    const params = {
        method : "POST",
        headers : {"content-type":"application/json"},
        body : JSON.stringify(paramsBody)

    }


    return await fetch("https://b1messenger.imatrythis.tk/login",params)
        .then(response=>response.json())
        .then(data=>{
            token = data.token
            console.log(token)
            return token
        })
}

async function fetchMessages (token){
    let params = {
        headers: {"Content-type":"application/json",
            "authorization":`Bearer ${token}`},
        method: "GET",

    }
    await fetch("https://b1messenger.imatrythis.tk/api/messages",params)
        .then(response=>response.json())
        .then(data=>{
            console.log("fetchmessage")
            renderMessages(data)
            sendMessageTemplate()
        })
}

function renderMessages (tableauMessage)
{
        let template = ""
    tableauMessage.forEach((message)=>{
        template += `
        <div class="row">
        <p>Auteur: ${message.author.username} message: ${message.content}</p>
        <hr>
        </div>
        `
    })
    content.innerHTML = template
}

function fetchSendMessage (){
    sendMessageTemplate()
    const inputSendMessage = document.querySelector("#inputSendMessage")
    const buttonSendMessage = document.querySelector(".buttonSendMessage")

    const params = {
        method: "POST",
        headers: {"content-type": "application/json", "authorization": token},
        body: {"content":inputSendMessage.value}
    }


    fetch("https://b1messenger.imatrythis.tk/api/messages/new",params)
        .then(response => response.json())
        .then(data=>{

        })




}

function sendMessageTemplate (){
    let sendMessageTemplate = `
    <div class="container">
        <input type="text" id="inputSendMessage">
        <button class="buttonSendMessage">Send message</button>
    </div>`

    content.innerHTML += sendMessageTemplate
    const buttonSendMessage = document.querySelector(".buttonSendMessage")
    const inputSendMessage = document.querySelector("#inputSendMessage")

    buttonSendMessage.addEventListener("click",()=>{
        sendMessage(inputSendMessage.value)
    })
}


// loginForm()
// fetchLogin()
// fetchMessages()

async function sendMessage (message){
    let body = {content: message}
    let params = {
        method: "POST",
        headers: {"Content-type":"application/json","Authorization":`Bearer ${token}`},
        body: JSON.stringify(body)
    }
    await fetch("https://b1messenger.imatrythis.tk/api/messages/new",params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
        })
}
// const buttonTest = document.querySelector(".buttonTest")
// buttonTest.addEventListener("click",()=>{
//     testSendMessage()
// })






