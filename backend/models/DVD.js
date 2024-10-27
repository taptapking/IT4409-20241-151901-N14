// models/DVD.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Media = require('./Media');

const DVD = sequelize.define('DVD', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: Media,
            key: 'id'
        }
    },
    studio: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    disc_type: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    subtitle: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    language: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    runtime: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    director: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dvd_category: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'DVD',
    timestamps: false
});

// Thiết lập mối quan hệ một-một giữa Media và DVD
Media.hasOne(DVD, { foreignKey: 'id' });
DVD.belongsTo(Media, { foreignKey: 'id' });

module.exports = DVD;
