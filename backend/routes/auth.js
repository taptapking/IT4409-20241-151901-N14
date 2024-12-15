// routes/auth.js
const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Protected route for admins
router.get('/admin-only', verifyToken, requireRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' });
});

module.exports = router;
