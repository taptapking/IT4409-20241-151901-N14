// models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
    roleName: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'Role',
    timestamps: false
});

module.exports = Role;
