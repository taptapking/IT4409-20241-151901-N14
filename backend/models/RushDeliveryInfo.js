// models/RushDeliveryInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const DeliveryInfo = require('./DeliveryInfo');

const RushDeliveryInfo = sequelize.define('RushDeliveryInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: DeliveryInfo,
            key: 'id'
        }
    },
    rushInstruction: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    rushTime: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'RushDeliveryInfo',
    timestamps: false
});

// Thiết lập mối quan hệ một-một giữa DeliveryInfo và RushDeliveryInfo
DeliveryInfo.hasOne(RushDeliveryInfo, { foreignKey: 'id' });
RushDeliveryInfo.belongsTo(DeliveryInfo, { foreignKey: 'id' });

module.exports = RushDeliveryInfo;
