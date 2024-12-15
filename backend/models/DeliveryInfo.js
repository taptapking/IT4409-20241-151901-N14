const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryInfo = sequelize.define('DeliveryInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    instruction: {
        type: DataTypes.STRING(32),
        allowNull: true
    }
}, {
    tableName: 'DeliveryInfo',
    timestamps: false
});

module.exports = DeliveryInfo;
