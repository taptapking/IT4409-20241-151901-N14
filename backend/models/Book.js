// models/Book.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Media = require('./Media');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: Media,
            key: 'id'
        }
    },
    author: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    publisher: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    publish_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numer_of_page: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    book_category: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    cover_type: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    language: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'Book',
    timestamps: false
});

// Thiết lập mối quan hệ một-một giữa Media và Book
Media.hasOne(Book, { foreignKey: 'id' });
Book.belongsTo(Media, { foreignKey: 'id' });

module.exports = Book;
