// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// API Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    return res.json({ message: 'Logged in successfully' });
  } catch (error) {
	console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// API Đăng xuất
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
