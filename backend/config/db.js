// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();  // Đảm bảo bạn đã cài dotenv nếu sử dụng biến môi trường

// Kết nối tới DB MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME ,     // Tên database
  process.env.DB_USER ,         // Tên người dùng
  process.env.DB_PASS ,     // Mật khẩu
  {
    host: process.env.DB_HOST , // Máy chủ
    dialect: 'mysql',                         // Loại cơ sở dữ liệu
  }
);

module.exports = sequelize;
