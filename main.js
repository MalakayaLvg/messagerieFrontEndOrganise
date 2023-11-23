// Doc API : https://b1messenger.imatrythis.tk/

const content = document.querySelector('.content')

let token = ""


// ** RUN **

function run(){
    if (!token) {
        loginForm()
    } else {
        fetchMessage().then(data=>{
            messageRender(data)
        })

        }

}

// ** LOGIN **

function loginForm(){
    console.log("1. loginForm")
    // 1. Creation de la Template
    let loginTemplate = `<div class="form-control">
                                     <h2>Login</h2>
                                     <input type="text" id="usernameLogin" placeholder="username">
                                     <input type="text" id="passwordLogin" placeholder="password">
                                     <button class="btn btn-primary buttonLogin">Log in</button>
                                 </div>`
    render(loginTemplate)


    const buttonLogin = document.querySelector(".buttonLogin")
    // 2. Fetch login sur boutonLogin pour récuperer le token
    buttonLogin.addEventListener("click",()=>{
        console.log("click boutonLogin")
        fetchLogin().then(data=>{
            console.log("data fetchLogin:")
            console.log(data)
            run()
        })
    })
}

async function fetchLogin(){
    console.log("1.1 fetchLogin")
    const usernameLogin = document.querySelector("#usernameLogin")
    const passwordLogin = document.querySelector("#passwordLogin")
    let body = {
        username:usernameLogin.value,
        password:passwordLogin.value
    }
    let params = {
        method: "POST",
        headers : {"content-type":"application/json"},
        body: JSON.stringify(body)
    }
    return await fetch("https://b1messenger.imatrythis.com/login",params)
        .then(response=>response.json())
        .then(data=>{
            token = data.token
            return token
        })
}

//-------------------------------------------------------------------

// ** RENDER MESSAGE **

async function fetchMessage (){
    console.log("2. Render Fetch Message")
    console.log(token)
    let params = {
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
        method: "GET"
    }
    return await fetch("https://b1messenger.imatrythis.com/api/messages",params)
        .then(response=>response.json())
        .then(data=>{
            console.log("response fetch message:")
            console.log(data)
            return data
        })
}

function messageRender(messages) {
    // 2.2 messageRender
    let messageContent = ""
    messages.forEach((message) => {
        messageContent += `
        <div class="row" id=message${message.id}>
            <p>${message.author.username} : ${message.content}</p>
            <div class="py-2">
                <button class="btn btn-danger buttonDelete" id=${message.id}>Delete</button>
                <button class="btn btn-warning buttonEdit" id=${message.id}>Edit</button>
                <button class="btn btn-secondary buttonResponse" id=${message.id}>Response</button>
            </div>
            <hr>
        </div>`
    })
    console.log("2.2 MessageRender")

    let pageContent = refreshTemplate() + messageContent + sendMessageForm()
    render(pageContent)


    // 3. Send Message
    console.log("3. Send Message")
    const buttonSendMessage = document.querySelector('.buttonSendMessage')
    const inputSendMessage = document.querySelector("#inputSendMessage")
    buttonSendMessage.addEventListener("click", () => {
        console.log("3.1 fetchSendMessage")
        fetchSendMessage(inputSendMessage.value).then(data => {
            console.log("responseFetchMessage:")
            console.log(data)
            run()
        })
    })


    //4. Refresh
    console.log("4. Refresh")
    const refreshButton = document.querySelector("#buttonRefresh")
    refreshButton.addEventListener("click", () => {
        console.log("click refreshButton")
        run()
    })

    //5. Delete
    console.log("5. Delete Message")
    const buttonsDelete = document.querySelectorAll(".buttonDelete")
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            console.log(`click button delete ${button.id}`)
            fetchDeleteMessage(button.id).then((data) => {
                console.log(data)
                console.log(`message id${button.id} delete`)
                run()
            })
        })
    })


    //6. Edit
    console.log("6. Edit Message")
    const buttonsEdit = document.querySelectorAll(".buttonEdit")
    buttonsEdit.forEach((button) => {
        button.addEventListener("click", () => {
            console.log(`click button Edit ${button.id}`)
            let messageDiv = document.querySelector(`#message${button.id}`)
            console.log(messageDiv)

            messageDiv.innerHTML += `
            <div class="input-group">
                <input type="text" id="inputEditMessage" placeholder="type new message">
                <button class="btn btn-primary" id="buttonEditMessage">Confirmer</button>
            </div>
            `
            const buttonConfirmEdit = document.querySelector("#buttonEditMessage")
            const inputConfirmEdit = document.querySelector("#inputEditMessage")
            buttonConfirmEdit.addEventListener("click",()=>{
                console.log("click confirm edit")
                fetchEditMessage(button.id,inputConfirmEdit.value).then((data)=>{
                    console.log("message successfully edited")
                    run()
                })
            })

        })
    })


    //7. Response
    console.log("7. Response")









}

// ** SEND MESSAGE **

function sendMessageForm(){
    let template = `
    <div class="input-group my-4">
        <input type="text" id="inputSendMessage" >
        <button class="btn btn-warning buttonSendMessage" id="">Envoyer</button>
    </div>
    `
    return template
}

async function fetchSendMessage(textMessage){
    let paramsBody = {"content": textMessage}
    let params = {
        method: "POST",
        headers : {"content-type":"application/json","authorization":`Bearer ${token}` },
        body : JSON.stringify(paramsBody)
    }
    return await fetch("https://b1messenger.imatrythis.com/api/messages/new",params)
        .then(response=>response.json())
        .then(data=>{
            return data
        })
}


// ** REFRESH

function refreshTemplate(){
    let template = `
    <div class="my-3 p-1">
        <button class="btn btn-success" id="buttonRefresh">REFRESH</button>
    </div>
    `
    return template

}

// ** DELETE **

async function fetchDeleteMessage(messageId)
{
    let params ={
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
        method : "DELETE"
    }
    return await fetch(`https://b1messenger.imatrythis.com/api/messages/delete/${messageId}`,params)
        .then(response=>response.json())
        .then(data=>{
            return data
        })
}


// ** EDIT **

async function fetchEditMessage(messageId,messageContent){
    let paramsBody = {"content": messageContent }
    let params = {
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
        method: "PUT",
        body : JSON.stringify(paramsBody)
    }
    return await fetch(`https://b1messenger.imatrythis.com/api/messages/${messageId}/edit`,params)
        .then(response=>response.json())
        .then(data=>{
            return data
        })
}



//  ** RENDER

function render(contentToRender){
    content.innerHTML = ""
    content.innerHTML = contentToRender
}







// function loginForm ()
// {
//     let loginTemplate = `<div class="form-control">
//                                     <h2>Login</h2>
//                                     <input type="text" id="usernameLogin" placeholder="username">
//                                     <input type="text" id="passwordLogin" placeholder="password">
//                                     <button class="buttonLogin">Log in</button>
//                                 </div>`
//     content.innerHTML = loginTemplate
//     const buttonLogin = document.querySelector(".buttonLogin")
//     buttonLogin.addEventListener("click",()=>{
//         console.log("click")
//         fetchLogin().then(data=>{
//             console.log(data)
//             fetchMessages(data)
//         })
//
//     })
// }
//
// async function fetchLogin()
// {
//     const username = document.querySelector('#usernameLogin')
//     const password = document.querySelector('#passwordLogin')
//
//     let paramsBody = {
//         username:username.value,
//         password:password.value
//     }
//
//     const params = {
//         method : "POST",
//         headers : {"content-type":"application/json"},
//         body : JSON.stringify(paramsBody)
//
//     }
//
//
//     return await fetch("https://b1messenger.imatrythis.tk/login",params)
//         .then(response=>response.json())
//         .then(data=>{
//             token = data.token
//             console.log(token)
//             return token
//         })
// }
//
// async function fetchMessages (token)
// {
//     let params = {
//         headers: {"Content-type":"application/json",
//             "authorization":`Bearer ${token}`},
//         method: "GET",
//
//     }
//     await fetch("https://b1messenger.imatrythis.tk/api/messages",params)
//         .then(response=>response.json())
//         .then(data=>{
//             console.log("fetchmessage")
//             renderMessages(data)
//             sendMessageTemplate()
//         })
// }
//
// function renderMessages (tableauMessage)
// {
//         let template = ""
//     tableauMessage.forEach((message)=>{
//         template += `
//         <div class="row">
//         <p>Auteur: ${message.author.username} message: ${message.content}</p>
//         <hr>
//         </div>
//         `
//     })
//     content.innerHTML = template
// }
//
// function fetchSendMessage (){
//     sendMessageTemplate()
//     const inputSendMessage = document.querySelector("#inputSendMessage")
//     const buttonSendMessage = document.querySelector(".buttonSendMessage")
//
//     const params = {
//         method: "POST",
//         headers: {"content-type": "application/json", "authorization": token},
//         body: {"content":inputSendMessage.value}
//     }
//
//
//     fetch("https://b1messenger.imatrythis.tk/api/messages/new",params)
//         .then(response => response.json())
//         .then(data=>{
//
//         })
//
//
//
//
// }
//
// function sendMessageTemplate ()
// {
//     let sendMessageTemplate = `
//     <div class="container">
//         <input type="text" id="inputSendMessage">
//         <button class="buttonSendMessage">Send message</button>
//     </div>`
//
//     content.innerHTML += sendMessageTemplate
//     const buttonSendMessage = document.querySelector(".buttonSendMessage")
//     const inputSendMessage = document.querySelector("#inputSendMessage")
//
//     buttonSendMessage.addEventListener("click",()=>{
//         sendMessage(inputSendMessage.value)
//     })
// }
//
//
// // loginForm()
// // fetchLogin()
// // fetchMessages()
//
// async function sendMessage (message)
// {
//     let body = {content: message}
//     let params = {
//         method: "POST",
//         headers: {"Content-type":"application/json","Authorization":`Bearer ${token}`},
//         body: JSON.stringify(body)
//     }
//     await fetch("https://b1messenger.imatrythis.tk/api/messages/new",params)
//         .then(response=>response.json())
//         .then(data=>{
//             console.log(data)
//             run()
//         })
// }
// const buttonTest = document.querySelector(".buttonTest")
// buttonTest.addEventListener("click",()=>{
//     run()
// })

run()






