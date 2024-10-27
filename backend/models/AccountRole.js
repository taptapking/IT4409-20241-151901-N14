// models/AccountRole.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Account = require('./Account');
const Role = require('./Role');

const AccountRole = sequelize.define('AccountRole', {
    accountId: {
        type: DataTypes.INTEGER,
        references: {
            model: Account,
            key: 'id'
        },
        primaryKey: true
    },
    roleName: {
        type: DataTypes.STRING(32),
        references: {
            model: Role,
            key: 'roleName'
        },
        primaryKey: true
    }
}, {
    tableName: 'AccountRole',
    timestamps: false
});

// Thiết lập mối quan hệ nhiều-nhiều giữa Account và Role thông qua AccountRole
Account.belongsToMany(Role, { through: AccountRole, foreignKey: 'accountId' });
Role.belongsToMany(Account, { through: AccountRole, foreignKey: 'roleName' });

module.exports = AccountRole;
