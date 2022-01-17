function login(req, res, next) {
    req.login(req.user, function(err) {
        if(err) { return next(err);}
        console.log('USER: ');
        console.log(req.user);
        return next();
    })
}

module.exports = login;