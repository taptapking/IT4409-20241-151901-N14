// middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Role = require('../models/Role');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token xác thực bị thiếu hoặc không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await Account.findByPk(decoded.id, { include: Role });

        if (!account) {
            return res.status(401).json({ message: 'Token không hợp lệ: người dùng không tồn tại' });
        }

        req.user = account; // Gắn thông tin người dùng vào request
        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

module.exports = authenticate;