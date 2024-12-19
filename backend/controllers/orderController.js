const Order = require('../models/Order');
const DeliveryInfo = require('../models/DeliveryInfo');
const Invoice = require('../models/Invoice');
const RushDeliveryInfo = require('../models/RushDeliveryInfo');
const OrderMedia = require('../models/OrderMedia');
const sequelize = require('../config/db');
const Media = require('../models/Media');
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

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Invoice,
                    attributes: ['mediaTotal', 'vat', 'total'],
                    include: [
                        {
                            model: DeliveryInfo,
                            attributes: ['name', 'phone', 'address', 'city', 'instruction'],
                        }
                    ]
                },
                {
                    model: Media,
                    attributes: ['id', 'title', 'price'],
                    through: {
                        attributes: ['quantity'],
                    }
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const { status } = order;
        const invoice = order.Invoice || {};
        const deliveryInfo = invoice.DeliveryInfo || {};
        const invoiceDetails = {
            mediaTotal: invoice.mediaTotal,
            VATAmount: invoice.vat,
            finalTotal: invoice.total
        };

        const mediaDetails = (order.Media || []).map(media => ({
            mediaId: media.id,
            quantity: media.OrderMedia?.quantity || 0,
            title: media.title,
            price: media.price,
        }));

        res.status(200).json({
            status,
            deliveryInfo,
            invoiceDetails,
            mediaDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};








const getOrderByAccountId = async (req, res) => {
    try {
        const { accountId } = req.params;

        const orders = await Order.findAll({
            where: { accountId }
        });

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders found for this account' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    
        const { status, deliveryInfo, invoiceDetails, rushDeliveryInfo, mediaDetails,accountId } = req.body;

        const newOrder = await Order.create({ status ,accountId}, { transaction: t });

        const newDeliveryInfo = await DeliveryInfo.create({
            ...deliveryInfo,
            orderId: newOrder.id
        }, { transaction: t });

        const newInvoice = await Invoice.create({
            ...invoiceDetails,
            orderId: newOrder.id,
            deliveryInfoId: newDeliveryInfo.id
        }, { transaction: t });


        const newOrderMedia = await OrderMedia.bulkCreate(
            mediaDetails.map(media => ({
                orderId: newOrder.id,
                mediaId: media.mediaId,
                quantity: media.quantity
            })),
            { transaction: t }
        );

        await t.commit();

        res.status(201).json({
            order: newOrder,
            deliveryInfo: newDeliveryInfo,
            invoice: newInvoice,
            rushOrderInfo: newDeliveryInfo,
            orderMedia: newOrderMedia
        });
   
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
    getOrderByAccountId
};
