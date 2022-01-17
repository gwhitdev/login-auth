const express = require('express');
const app = express();
const PORT = 3000;
const passport = require('passport');
const view = require('./app/providers/views/view');
const bodyParser = require('body-parser');
const jwt = require('./app/providers/auth/jwt');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { Sequelize } = require('sequelize');
const session = require('express-session');

const User = require('./app/models/User');
const db = require('./db');
const cookieParser = require('cookie-parser');
require('./app/providers/auth/auth');

const isLoggedIn = require('./app/middleware/is-logged-in');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

view.parentDir = __dirname;

const apiRouter = require('./app/routes/api');
const testRouter = require('./app/routes/testing');
const passportProtectedRoutes = require('./app/routes/passport-protected');
const customAuth = require('./app/routes/custom-auth');

app.use('/api', apiRouter);
app.use('/test', testRouter);
app.use('/passport-protected', passportProtectedRoutes);
app.use('/custom-auth', customAuth);

app.get('/', (req, res) => {
    res.sendFile(view.html('index'));
});

app.get('/login', (req, res) => {
    res.sendFile(view.html('login'));
})
app.get('/test-db', async (req, res) => {
    try {

        await db.authenticate();
        console.log('Success');
        res.json({message: 'success'});
    } catch (err) {
        console.log(err);
        res.json({message: 'Could not connect to DB'});
    }

})

app.get('/users', async (req, res) => {
    let users = {};
    let response = {};
    try {
        await db.sync();
        users = await User.findAll({
            attributes: ['id','email']
        });
        response.message = 'success';
        response.users = users;
    } catch (err) {
        console.log(err);
        response.message = 'error';
    }
    res.json(response);
})


app.get('/register', (req, res) => {
    res.sendFile(view.html('register'));
})

app.get('/logout', (req, res) => {
    req.logout();
    req.session.message = 'logged out';
    res.cookie('jwt','',{
        httpOnly: true,
        secure: true
    }).redirect('/');
})


app.get('/data', (req, res) => {
    res.sendFile(view.html('data'));
})

app.get('/profile', isLoggedIn, (req, res) => {
    console.log('Is the user logged in?');
    console.log(req.user ? 'Logged in' : 'not logged in');
    res.sendFile(view.html('profile'));
})

app.get('/test-cookie', passport.authenticate('jwt',{session:false}), (req, res) => {
    res.json({
        message: "authorised",
        jwtCookie: req.cookies.jwt
    });
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`));