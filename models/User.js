const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdat: { 
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
    },
    updatedat: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
    },
},
{
    tableName: 'users',
    timestamps: true, 
    createdAt: 'createdat', 
    updatedAt: 'updatedat',
}
);

module.exports = User;
