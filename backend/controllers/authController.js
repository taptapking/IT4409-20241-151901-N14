// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Role = require('../models/Role');
require('dotenv').config();

// Hàm tạo token JWT
const generateToken = (account) => {
    return jwt.sign(
        { id: account.id, email: account.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Controller Đăng Nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm tài khoản theo email
        const account = await Account.findOne({ where: { email }, include: Role });

        if (!account) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }

        // Kiểm tra trạng thái tài khoản
        if (account.status !== 'active') {
            return res.status(403).json({ message: 'Tài khoản không hoạt động' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }

        // Tạo token JWT
        const token = generateToken(account);

        res.json({
            message: 'Đăng nhập thành công',
            token
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Controller Đăng Xuất
exports.logout = async (req, res) => {
    // Với JWT, đăng xuất thường được xử lý phía client bằng cách xóa token
    res.json({ message: 'Đăng xuất thành công. Vui lòng xóa token ở phía client.' });
};