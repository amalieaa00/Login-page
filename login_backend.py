""" 
Server that stors login and registration info in a postgreSQL database
All passwords and sensitive info is removed.
"""
import psycopg2
import bcrypt
from flask import Flask, request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Class which handles login/registration.
class LoginBE:
    def __init__(self, c):
        self.c = c
        self.conn = c.create_conn()
    # Function that takes registration info as input and creates a new row in the "users" table.
    def register(self, un, fs, ls, pwd):
        args = (un,fs,ls,pwd)
        #Returns if the input is invalid.
        for arg in args:
            if arg is None:
                return
        try:
            # Inserts user info into the database.
            q = "INSERT INTO users (username, password, firstname, lastname) VALUES (%s, %s, %s, %s);"
            with self.conn.cursor() as cur:
                hp = self.c.hash_password(pwd)
                cur.execute(q, (un,hp, fs, ls))
                self.conn.commit()
                return "Welcom! You successfully created an account!"
        except psycopg2.Error as e:
            print(e)
        
    def login(self, un, pwd):
        if un is None or pwd is None:
            return None
        
        svar = ""
        try:
            # checks of the plaintext password is the same as the one stored in the users table.
            same = self.__compare_pwd(un,pwd)
            if not same:
                svar = "feil brukernavn eller passord"
                return svar
            q = "SELECT * FROM users WHERE username like %s;"
            with self.conn.cursor() as cur:
                cur.execute(q, (un,))
                results = cur.fetchone()
                # if results is not none -> correct login info has been provided.
                if results:
                    svar ="Welcome! " + results[2]              
                else:
                    svar="Feil brukernavn eller passord"
                
                return svar
        except psycopg2.Error as e:
            print(e)
    # helping method to decide if the provided login info is correct.
    def __compare_pwd(self,username,plainpwd):
        plainpwd = plainpwd.encode("utf-8")
        cur = self.conn.cursor()
        # retrieves the hashed password from the DB.
        q = "Select password from users where username like %s;"
        cur.execute(q,(username,))
        
        all = cur.fetchone()
        if all is  None:
            return False
        # if the user exists.
        # Variable containing hashed password.
        # checks weather they are the same.
        hpwd = all[0] 
        return bcrypt.checkpw(plainpwd,hpwd.encode("utf-8"))

# Class which handles the database connection, including password hashing.
class DatabaseConn:
    def create_conn(self):
        try:
            url = "postgresql://localhost:5432/dbname"
            username = "exampleUser"
            pwd = "Password"
            conn = psycopg2.connect(url, user=username, password=pwd)
            return conn
        except psycopg2.Error as e:
            print(e)
    def hash_password(self,pwd):
        salt = bcrypt.gensalt(rounds=12)
        pwd=pwd.encode("utf-8")
        hashet = bcrypt.hashpw(pwd,salt).decode("utf-8")
        return hashet

# Creates response for frontend
print("oppretter app")
login = LoginBE(DatabaseConn())
@app.route("/logininfo", methods=["POST"])
def insert_response():
    data = request.json
    username = data.get("username")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    pwd = data.get("pwd")
    reg =login.register(username, firstname, lastname, pwd)
    user=data.get("user")
    pw = data.get("pw")
    svar = login.login(user,pw)
    return jsonify({"result": svar,"res2":reg})

if __name__ == "__main__":
    print("starter nå kjøringen")
    
    app.run(debug=True)
    print("Er nå på slutten")