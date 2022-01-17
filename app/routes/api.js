const express = require('express');
const router = express.Router();
const passport = require('passport');


const cookieParser = require('cookie-parser');

router.all('*', passport.authenticate('jwt', { session: false}));
router.get('/test-jwt', (req, res) => {
    res.json({jwt:req.cookies.jwt});
})


module.exports = router;