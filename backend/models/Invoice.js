// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const DeliveryInfo = require('./DeliveryInfo');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mediaTotal: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    mediaSubtotal: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    vat: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    shippingFee: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id'
        },
        allowNull: true
    },
    deliveryInfoId: {
        type: DataTypes.INTEGER,
        references: {
            model: DeliveryInfo,
            key: 'id'
        },
        allowNull: true
    }
}, {
    tableName: 'Invoice',
    timestamps: false
});

// Thiết lập mối quan hệ giữa Invoice và Order
Invoice.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasOne(Invoice, { foreignKey: 'orderId' });

// Thiết lập mối quan hệ giữa Invoice và DeliveryInfo
Invoice.belongsTo(DeliveryInfo, { foreignKey: 'deliveryInfoId' });
DeliveryInfo.hasOne(Invoice, { foreignKey: 'deliveryInfoId' });

module.exports = Invoice;
