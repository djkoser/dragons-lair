require('dotenv').config();
const express = require('express');
const massive = require('massive');
const app = express();
const session = require('express-session');

const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware')

const { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json());

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET
}))

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: 0 }
})
  .then(dbI => {
    app.set('db', dbI);
    app.listen(PORT, () => console.log(`DB and Server Connected on Port ${PORT}.`))
  })
  .catch(err => console.log(err));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.get('/auth/logout', authCtrl.logout);
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
