const express = require('express');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pwd;
    const confirmedPwd = req.body.confirmedPwd;

    const response = {};

    if(pwd !== confirmedPwd) {
        response.message = "Password and confirmed passwords don't match";
        return res.json(response);
    }

    const databaseChecked = await User.findOne({where: {email: req.body.email}});

    if(databaseChecked instanceof User) {
        response.message = 'Email address already in use';
        return res.json(response)
    }
    else
    {
        bcrypt.hash(pwd, 10, async function(err, hash) {
            if(err) console.log('Hash Error: ' + err);
            if(hash) {
                const user = User.build({
                    email: email,
                    pwd: hash
                });

                if(user instanceof User){
                    try {
                        await user.save();
                        console.log('User created!');

                    } catch (err) {
                        console.log(err);
                    }
                    response.message = 'Successfully registered';
                    response.userId = user.id;
                    console.log(response);
                    return res.redirect('/login');
                }
            }
        });
    }
});

module.exports = router;