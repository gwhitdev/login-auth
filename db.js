const { Sequelize, DataTypes, Model } = require('sequelize');

const db = new Sequelize('sqlite:database.db', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

module.exports = db;