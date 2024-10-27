// models/CD.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Media = require('./Media');

const CD = sequelize.define('CD', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: Media,
            key: 'id'
        }
    },
    artist: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    music_type: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    record_label: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    category_cd: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'CD',
    timestamps: false
});

// Thiết lập mối quan hệ một-một giữa Media và CD
Media.hasOne(CD, { foreignKey: 'id' });
CD.belongsTo(Media, { foreignKey: 'id' });

module.exports = CD;
