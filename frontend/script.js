const start=document.getElementById("start");
const loginForm= document.getElementById("logIn-form");
const logInMsg=document.getElementById('success');
const regForm= document.getElementById("register-form");
async function sendData(values, url) {
    //sending http-request.
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("successful");
            return data;
        } else {
            console.log("Failed");
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

function logInForm(){
    //displaying login form.
    loginForm.style.display="block";
    //Retrieving and hiding all elements belonging to the 'start' class.
    start.style.display='none';
    
}
function registerForm(){
    start.style.display="none";
    regForm.style.display='block';
}
async function logIn(event){
    event.preventDefault();
    //Retrieving email and password submitted by the user.
    
    let username = document.getElementById('un').value;
    let password = document.getElementById('pwd').value;
    let vals ={email:username,password:password};
    //sending to the server
    const response = await sendData(vals,'http://localhost:5000/logIn');
    loginForm.style.display='none';
    if (response){
        logInMsg.innerHTML='Welcome, '+response[0].name+'!'; 
    }else{
        logInMsg.innerHTML='Log in failed';
    }
    logInMsg.style.display='block';

}
async function register(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pwd = document.getElementById('pass').value;
    const rPwd = document.getElementById('rpass').value;
    
    const values = {name: name, email: email, password: pwd, rPass: rPwd};
    regForm.style.display = 'none';
    const res = await sendData(values, 'http://localhost:5000/register');
    
    if (res) {
        logInMsg.innerHTML = 'You have registered, ' +name;
    } else {
        logInMsg.innerHTML = 'Registration failed';
    }
    logInMsg.style.display = 'block';
}
