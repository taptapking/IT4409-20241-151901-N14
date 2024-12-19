const express = require('express');
const Order = require('../models/Order'); // Model của bảng Order
const { authenticate } = require('../middleware/auth'); // Middleware xác thực
const  OrderController = require('../controllers/orderController');
const router = express.Router();

router.post('/orders',  OrderController.createOrder);

// Get all orders
router.get('/orders', OrderController.getAllOrders);

// Get order by ID
router.get('/orders/:id', OrderController.getOrderById);

// Update order status
router.put('/orders/:id', OrderController.updateOrder);

// Delete order
router.delete('/orders/:id', OrderController.deleteOrder);

router.get('/orders/account/:accountId', OrderController.getOrderByAccountId);


module.exports = router;
