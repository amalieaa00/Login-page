// Initializing url and the HTTPRequest object.
const url = "http://localhost:5000/logininfo";
const conn = new XMLHttpRequest();
// retrieves the buttons from the HTML-documents and adds the appropriate eventListeners.
var sub = document.getElementById("submit");
sub.addEventListener("click",submit);
var log_on = document.getElementById("log_on")
var lib = document.getElementById("login");
var reg = document.getElementById("register");
reg.addEventListener("click", register);
lib.addEventListener("click", login);


var lg_elements = document.getElementsByClassName("lg");
function login() {
    for (var i =0;i<lg_elements.length;i++){
        lg_elements[i].style.display="block";
    }
    lib.style.display="none";
    reg.style.display = "none";
    
}

var registrer = document.getElementsByClassName("registrer");
function register() {
    for (var i =0; i<registrer.length;i++){
        registrer[i].style.display="block";
    }
    lib.style.display = "none";
    reg.style.display = "none";

}   

function submit() {
    for(var i =0;i<registrer.length;i++){
        registrer[i].style.display="block";
    }
    // gets values from input form.
    let username = document.getElementById("c_username").value;
    let firstname = document.getElementById("fs").value;
    let lastname = document.getElementById("ls").value;
    let pwd = document.getElementById("reg_pwd").value;

    // data to be sent to server.
    var data = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        pwd: pwd
    };   
    // sends data to python-server.       
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        //Gets results from the Server
        // puts the result into the HTML-document.
        r = document.getElementById("svar");
        r.value="";
        r.innerHTML=result.res2;
    })
    .catch(error => {
        console.error('Error sending request:', error);
    });  
} 
function logOn(){
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;
    for (var i=0;i<lg_elements.length;i++){
        lg_elements[i].style.display="none";
    }
        
    var data2 = {
        user: u,
        pw:p
        
    };          
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data2)
    })
    .then(response => response.json())
    .then(result => {
        let ans = document.getElementById("svar");
        ans.innerHTML= result.result;
    })
    .catch(error => {
        console.error('Error sending request:', error);
    });  

}
log_on.addEventListener("click",logOn);
