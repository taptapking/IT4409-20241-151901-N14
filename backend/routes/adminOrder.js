// routes/order.js
const express = require('express');
const router = express.Router();
const Orders  = require('../controllers/orderController');  // Import controller

// Route để lấy tất cả đơn hàng
router.get('/', Orders.getAllOrders);
// Route để lấy đơn hàng chi tiết
router.get('/:id', Orders.getOrderById);
// Route để approve đơn hàng
router.put('/approve/:orderId', Orders.approveOrder);

// Route để reject đơn hàng
router.put('/reject/:orderId', Orders.rejectOrder);
module.exports = router;
