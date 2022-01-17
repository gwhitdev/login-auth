const jwt = require("jsonwebtoken");

module.exports = {

    _genToken: function(user) {
        return jwt.sign({
            iss: 'test-portfolio.net',
            aud: 'test-portfolio.net',
            sub: user.id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        }, 'secret');
    },
    createToken: function(user) {
        return this._genToken(user);
    },
}



