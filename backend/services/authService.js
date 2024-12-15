const jwt = require('jsonwebtoken');

exports.generateToken = (account) => {
    const payload = {
        id: account._id,
        role: account.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
