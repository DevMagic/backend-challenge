const Sequelize = require('sequelize');
const database = require('../database/connection');
const User = require('./User');

const Summoner = database.define('summoner', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nickname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    AccountId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    SummonerLevel: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ProfileIconId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    SummonerId: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Summoner.belongsTo(User, {
    constraint: true,
    foreignKey: 'userId'
})

User.hasMany(Summoner, {
    foreignKey: 'userId'
})

// Summoner.sync({ force: true });

module.exports = Summoner;