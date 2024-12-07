const Payment = require('../../models/Payment');
const { initiatePayment, verifyPayment } = require('../../services/paymentGateway');

exports.initiatePayment = async (req, res) => {
    const { orderId, amount, paymentGateway } = req.body;
    const customerId = req.user.id; // Lấy thông tin user từ middleware auth

    try {
        // Tạo bản ghi thanh toán trong cơ sở dữ liệu
        const payment = await Payment.create({
            orderId,
            customerId,
            amount,
            paymentGateway,
        });

        // Tạo yêu cầu thanh toán tới cổng thanh toán
        const paymentUrl = await initiatePayment(payment.id, amount, paymentGateway);

        res.json({ message: 'Payment initiated', paymentUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error initiating payment', error });
    }
};

exports.handleWebhook = async (req, res) => {
    const { paymentId, status } = req.body;

    try {
        // Xác thực và cập nhật trạng thái thanh toán
        const payment = await Payment.findByPk(paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        payment.status = status;
        await payment.save();

        res.json({ message: 'Payment status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error handling webhook', error });
    }
};
