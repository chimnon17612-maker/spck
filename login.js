let btnRegister = document.getElementById('register-btn')
btnRegister.onclick = function(){
    let usernameInput = document.getElementById('reg-username')
    let passwordInput = document.getElementById('reg-password')

    let username = usernameInput.value
    let password = passwordInput.value

    if(username == ''){
        alert('Nhập username')
    }
    else if(password == ''){
        alert('Nhập password')
    }

    else{
         let user = {
            username: username,
            password: password
        }

        console.log(user)
        localStorage.setItem('register_information', JSON.stringify(user))
        alert('Đăng kí thành công')
    }
}

function toggleToRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function toggleToLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}


let btnLogin = document.getElementById('login-btn')
btnLogin.onclick = function(){
    let usernameInput = document.getElementById('login-username')
    let passwordInput = document.getElementById('login-password')

    let username = usernameInput.value
    let password = passwordInput.value

    let user = localStorage.getItem('register_information')

    let userObject = JSON.parse(user)
    
    if(username != userObject.username){
        alert('Sai username')
    }
    else if(password != userObject.password){
        alert('Sai password')
    }
    else{
        // alert('Đăng nhập thành công')
        window.location.href='./home.html'
    }
}