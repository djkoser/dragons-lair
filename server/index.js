require('dotenv').config(); 
const express = require('express');
const massive = require('massive');
const app = express(); 
const session = require('express-session');

const authCtrl = require('./controllers/authController'); 

const { PORT, CONNECTION_STRING, SESSION_SECRET} = process.env; 

app.use(express.json());

app.use(session({
  resave:true,
  saveUninitialized:false,
  secret:SESSION_SECRET,
  cookie:{maxAge:1000*60*60*24}
}))

massive({
  connectionString: CONNECTION_STRING, 
  ssl: {rejectUnauthorized:0}
})
.then(dbI=> {
  app.set('db',dbI);
  app.listen(PORT, () => console.log(`DB and Server Connected on Port ${PORT}.`))
})
.catch(err=> console.log(err)); 

app.post('/auth/register', authCtrl.register); 
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout); 

