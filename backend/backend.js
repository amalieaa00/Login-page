require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const app = express();

app.use(bodyParser.json());
app.use(cors({
    //Letting through requests from local files.
    origin: (origin, callback) => {
        if (!origin || origin === 'null') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
//function that creates a database connection
function dbCon() {
    const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "Sideprojects"
    });

    con.connect(err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Database connected');
    });
    return con;
}

const conn = dbCon();


function getUser(un, pwd, res) {
    //Checks if the user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    conn.query(query, [un], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            //checking if the subbitted password = the incrypted one saved in the database.
            bcrypt.compare(pwd, data[0].password, (err, compare) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                //checks if the user has given the correct password
                if (compare) {
                   console.log(data);
                    return res.json(data);
                } else {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    });
}
async function register(name, email, pwd, rpwd, res) {
    //checking if the passwords allign
    if (pwd != rpwd) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    //adding user info to database and incrypting the password.
    let q = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const encryptedPassword = await bcrypt.hash(pwd, saltRounds);
    //Adding values seperatly from the query due to sequrity. 
    let values = [name, email, encryptedPassword];
    conn.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
}
//initializing the locations that the login and registration info is sent to
app.post('/logIn', (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    return getUser(email, pwd, res);
});

app.post('/register', (req, res) => {
    const {name, email, password, rPass} = req.body;  // Correct destructuring
    return register(name, email, password, rPass, res);
});