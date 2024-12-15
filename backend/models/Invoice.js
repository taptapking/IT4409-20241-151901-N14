const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
        allowNull: true
    },
    deliveryInfoId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Invoice',
    timestamps: false
});

module.exports = Invoice;
