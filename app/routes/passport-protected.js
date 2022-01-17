const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("../providers/auth/jwt");

router.get('/success', (req, res) => {
    res.json({
        message: req.session.message
    });
})

router.post('/register', passport.authenticate('register',{ failureRedirect: '/register'}),(req, res) => {
    res.json({message:req.session.message,
        body: req.body,
        user: req.user,
        redirect: '/profile'
    });
})
router.get('/failed', (req, res) => {
    res.json({
        message: req.session.message
    });
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/login'}),(req, res) => {
    const successToken = jwt.createToken(req.user);
    return res.cookie("jwt",successToken, {
        httpOnly: true,
        secure: true
    }).json({message: 'Authorised', redirect:'/profile'});
});


router.post('/data', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        message: 'Authorised',
        user: req.user
    });
})


module.exports = router;