// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Route Đăng Nhập
router.post('/login', authController.login);

// Route Đăng Xuất
router.post('/logout', authenticate, authController.logout);

module.exports = router;