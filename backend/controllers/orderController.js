const Order = require('../models/Order');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const newOrder = await Order.create({ status });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

exports.approveOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Cập nhật trạng thái đơn hàng thành 'Approved'
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'Approved' },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order approved successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };


  exports.rejectOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Cập nhật trạng thái đơn hàng thành 'Rejected'
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'Rejected' },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order rejected successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
