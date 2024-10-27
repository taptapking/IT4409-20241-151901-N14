// models/Track.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CD = require('./CD');

const Track = sequelize.define('Track', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: CD,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    CD_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CD,
            key: 'id'
        }
    }
}, {
    tableName: 'Track',
    timestamps: false
});

// Thiết lập mối quan hệ giữa CD và Track
CD.hasMany(Track, { foreignKey: 'CD_id' });
Track.belongsTo(CD, { foreignKey: 'CD_id' });

module.exports = Track;
