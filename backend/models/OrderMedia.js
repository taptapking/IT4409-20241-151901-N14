// models/OrderMedia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Media = require('./Media');

const OrderMedia = sequelize.define('OrderMedia', {
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id'
        },
        primaryKey: true
    },
    mediaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Media,
            key: 'id'
        },
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'OrderMedia',
    timestamps: false
});

// Thiết lập mối quan hệ nhiều-nhiều giữa Order và Media thông qua OrderMedia
Order.belongsToMany(Media, { through: OrderMedia, foreignKey: 'orderId' });
Media.belongsToMany(Order, { through: OrderMedia, foreignKey: 'mediaId' });

module.exports = OrderMedia;
