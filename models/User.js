const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Kết nối đến cơ sở dữ liệu của bạn

const User = sequelize.define('User', {
    // ID: Mã định danh người dùng
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    // Email: trường duy nhất cho email của khách hàng
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Kiểm tra định dạng email
        },
    },

    // Password: Mật khẩu mã hóa của người dùng
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // First Name: Tên khách hàng
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Last Name: Họ khách hàng
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Role: Vai trò của người dùng (ví dụ: 'user', 'admin')
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // Giá trị mặc định là 'user'
    },

    // Status: Trạng thái hoạt động của tài khoản
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'users', // Tên bảng trong cơ sở dữ liệu
    timestamps: true,   // Thêm `createdAt` và `updatedAt`
});

module.exports = User;
