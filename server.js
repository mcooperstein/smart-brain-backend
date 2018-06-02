const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

db.select('*').from('users').then(data => console.log(data));

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
  // res.send('this is working');
  res.send('it is working');
})

app.post('/signin', (req,res) => {
  signin.handleSignin(req,res,db,bcrypt)
});

app.get('/rank', (req,res) => {profile.getProfileRank(req,res,db)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});

app.get('/profile/:id', (req,res) => {profile.getProfile(req,res,db)});

app.put('/image', (req,res) => {image.handleImageCount(req,res,db)});

app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)});

app.post('/demographics', (req,res) => {image.demographicApiCall(req,res)});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`)
})
