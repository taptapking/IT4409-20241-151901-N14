// models/Account.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(32),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(128), // Tăng độ dài để lưu trữ mật khẩu đã mã hóa
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(32),
        allowNull: false
    }
}, {
    tableName: 'Account',
    timestamps: false
});

module.exports = Account;
