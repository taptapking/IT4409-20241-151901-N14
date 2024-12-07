const express = require('express');
const Order = require('../models/Order'); // Model của bảng Order
const { authenticate } = require('../middleware/auth'); // Middleware xác thực

const router = express.Router();

// API Hủy Đơn Hàng
router.delete('/orders/:orderId/cancel', authenticate, async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id; // Lấy ID khách hàng từ token (đã xác thực)

    try {
        // Tìm đơn hàng
        const order = await Order.findOne({ where: { id: orderId, customerId: userId } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order cannot be canceled' });
        }

        // Cập nhật trạng thái đơn hàng thành "canceled"
        order.status = 'canceled';
        await order.save();

        res.json({ message: 'Order canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

module.exports = router;
