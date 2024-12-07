const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    initiatePayment,
    handleWebhook,
} = require('../controllers/paymentController');

const router = express.Router();

// Tạo yêu cầu thanh toán
router.post('/payments/initiate', authenticate, initiatePayment);

// Webhook xử lý callback từ cổng thanh toán
router.post('/payments/webhook', handleWebhook);

module.exports = router;
