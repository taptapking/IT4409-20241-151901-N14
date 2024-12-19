// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Account = require('./Account');
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ensures every order has an associated account
        references: {
            model: Account,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING(16),
        allowNull: true
    }
}, {
    tableName: 'Order',
    timestamps: false
});

Order.belongsTo(Account, { foreignKey: 'accountId' });
Account.hasMany(Order, { foreignKey: 'accountId' });
module.exports = Order;
