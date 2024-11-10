// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        // Xác minh token và giải mã để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào req để dùng ở các middleware/route sau
        next(); // Cho phép truy cập vào endpoint tiếp theo
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token!' });
    }
};

module.exports = { authenticate };
