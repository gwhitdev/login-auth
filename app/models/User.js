const { Model, DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../../db');
const bcrypt = require('bcrypt');

class User extends Model {


    async verifyPassword(password) {
        console.log('Password: ' + password + ' ' + 'Hash: ' + this.pwd);
        console.log('User model');
        let verified;
        await bcrypt.compare(password,this.pwd)
            .then((result) => {
                console.log('bcrypt result: ' + result);
                return verified = result;
            })
            .catch(err => console.log('bcrypt err ' + err));
        return verified;
    };

}

User.init({
        email: { type: DataTypes.STRING },
        pwd: { type: DataTypes.STRING }
    }, {
    sequelize,
    modelName: 'User'
});



module.exports = sequelize.models.User;