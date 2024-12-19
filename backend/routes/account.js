const express = require('express');
const AccountController = require('../controllers/accountController');
const AuthService = require('../services/authService');

const router = express.Router();

// Register route for creating an account
router.post('/register', AccountController.createAccount);

// Protect the following routes with authentication middleware
router.get('/account/:id',  AccountController.getAccount);  // Get account info by ID
router.put('/account/:id', AuthService.verifyToken, AccountController.updateAccount);  // Update account information


module.exports = router;
