const passport = require("passport");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');

passport.serializeUser(function(user, done) {
    console.log('serializing...');
    //console.log(user)
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    console.log('deserializing...');
    console.log(id);
    await User.findByPk(id)
        .then((user) => done(null,user))
        .catch(err => done(err));
});

passport.use('register',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd',
        passReqToCallback: true
    },
    async function(req, username, password, done) {
        if(req.body.pwd !== req.body.confirmedPwd) {
            console.log("passwords dont match");
            req.session.message = "Passwords don't match";
            return done(null, false);
        }
        await User.findOne({where: {email: username}})
            .then(async user => {
                if(user) {
                    console.log('user already exists');
                    req.session.message = 'User already exists';
                    done(null,false);
                }
                if(!user) {
                    console.log('Hashing...');
                        bcrypt.hash(password, 10, async function(err, hash) {
                            if(err) console.log('Hash Error: ' + err);
                            const newUser = User.build({
                                email: username,
                                pwd: hash
                            });
                            if(newUser instanceof User) {
                                try {
                                    await newUser.save();
                                } catch (err) {
                                    console.log('Error saving new user ' + err);
                                    return (done(err));
                                }
                            }
                            console.log('User registered');
                            req.session.message = 'User registered';
                            return done(null, newUser);
                        })};
            })
            .catch(err => done(err));
    }
));

passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd',
        passReqToCallback: true
    },
    async function(req, username, password, done) {
        await User.findOne({ where: { email: username }, attributes: [ 'email', 'id', 'pwd']})
            .then(async (user, err) => {
                if (err) {
                    console.log('err 1 : ' + err);
                    req.session.message = 'Error' + err;
                    return done(err);
                }
                if (!user) {
                    console.log('User not found');
                    req.session.message = 'User not found';
                    return done(null, false, {message: 'User not found'});
                }
                if (! await user.verifyPassword(password)) {
                    console.log('Could not verify password ' + password);
                    req.session.message = 'Details not recognised!';
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch(err => console.log('error: ' + err));
    }
));

const JwtStrategy = require('passport-jwt').Strategy;
const opts = {}

function extractCookie(req) {
    if (req && req.cookies && req.cookies.jwt) {
        return req.cookies.jwt;
    }
};

opts.jwtFromRequest = extractCookie //ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'test-portfolio.net';
opts.audience = 'test-portfolio.net';

module.exports = passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {

    await User.findOne({ where: {id: jwt_payload.sub}})
        .then(user => {
            if(!user) return done(null, false, {message: 'no user provided'});
            return done(null, user);
        }).catch(err => {
            console.log(err);
            return done(err,false);
        });
}));


module.exports = passport;