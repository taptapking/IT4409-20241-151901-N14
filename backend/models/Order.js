// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING(16),
        allowNull: true
    }
}, {
    tableName: 'Order',
    timestamps: false
});

module.exports = Order;
