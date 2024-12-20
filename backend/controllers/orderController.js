const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const DeliveryInfo = require('../models/DeliveryInfo');
const RushDeliveryInfo = require('../models/RushDeliveryInfo');
const Media = require('../models/Media');
const sequelize = require('../config/db');
require('dotenv').config();  // Load biến môi trường từ file .env
const nodemailer = require('nodemailer');
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

    // Tìm Order và sử dụng 'include' để join các bảng liên quan
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Invoice, // Kết nối với bảng Invoice
          required: false, // 'required: false' nếu Order có thể không có Invoice
          include: [
            {
              model: DeliveryInfo, // Kết nối với bảng DeliveryInfo thông qua Invoice
              required: false, // 'required: false' nếu không có DeliveryInfo cho hóa đơn
            }
          ]
        },
        {
          model: Media, // Kết nối với bảng Media nếu cần thông tin về các media trong đơn hàng
          through: { attributes: ['quantity'] }, // Lấy thông tin về quantity từ bảng OrderMedia
          required: false
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Lấy RushDeliveryInfo qua DeliveryInfo
    const rushDeliveryInfo = await RushDeliveryInfo.findOne({
      where: {
        id: order.Invoice?.deliveryInfoId // Lấy RushDeliveryInfo theo deliveryInfoId của Invoice
      },
      include: {
        model: DeliveryInfo, // Kết nối với DeliveryInfo để lấy thông tin chi tiết
        required: false
      }
    });

    // Lấy DeliveryInfo từ Invoice và RushDeliveryInfo
    const invoiceDeliveryInfo = order.Invoice?.DeliveryInfo;
    const rushDeliveryInfoDeliveryInfo = rushDeliveryInfo?.DeliveryInfo;

    // Tạo bản sao của order và rushDeliveryInfo để tránh thay đổi trực tiếp đối tượng gốc
    const orderCopy = JSON.parse(JSON.stringify(order));  // Bản sao Order
    const rushDeliveryInfoCopy = rushDeliveryInfo ? JSON.parse(JSON.stringify(rushDeliveryInfo)) : null;

    // Xóa DeliveryInfo khỏi cả Invoice và RushDeliveryInfo trong bản sao
    if (orderCopy.Invoice) {
      delete orderCopy.Invoice.DeliveryInfo; // Xóa DeliveryInfo khỏi Invoice
    }
    if (rushDeliveryInfoCopy) {
      delete rushDeliveryInfoCopy.DeliveryInfo; // Xóa DeliveryInfo khỏi RushDeliveryInfo
    }

    // Cập nhật URL hình ảnh cho mỗi media
    if (orderCopy.Media && orderCopy.Media.length > 0) {
      orderCopy.Media = orderCopy.Media.map(mediaItem => {
        if (mediaItem.imageUrl) {
          mediaItem.imageUrl = `${req.protocol}://${req.get('host')}${mediaItem.imageUrl}`; // Thêm URL đầy đủ
        }
        return mediaItem;
      });
    }

    // Trả về dữ liệu, với DeliveryInfo nằm ngoài RushDeliveryInfo và Invoice
    const response = {
      ...orderCopy, // Thêm dữ liệu của Order
      deliveryInfo: invoiceDeliveryInfo || rushDeliveryInfoDeliveryInfo, // Thêm DeliveryInfo từ Invoice hoặc RushDeliveryInfo
      rushDeliveryInfo: rushDeliveryInfoCopy // Thêm RushDeliveryInfo nếu có
    };

    res.status(200).json(response); // Trả về dữ liệu đã xử lý
  } catch (error) {
    console.error(error); // Ghi log lỗi chi tiết ra console để dễ dàng debug
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};




const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
      const { status, deliveryInfo, invoiceDetails, rushDeliveryInfo, mediaDetails } = req.body;

      let mediaTotal = 0;
      for (const media of mediaDetails) {
          const mediaItem = await Media.findByPk(media.mediaId, { transaction: t });
          if (!mediaItem) {
              await t.rollback();
              return res.status(404).json({ error: `Media item with ID ${media.mediaId} not found` });
          }
          mediaTotal += mediaItem.price * media.quantity;
      }

      const vat = mediaTotal * 0.1;
      const total = mediaTotal + vat;

      const newOrder = await Order.create(
          { status},
          { transaction: t }
      );

      const newDeliveryInfo = await DeliveryInfo.create(
          { ...deliveryInfo, orderId: newOrder.id },
          { transaction: t }
      );

      const newInvoice = await Invoice.create(
          { ...invoiceDetails, orderId: newOrder.id, deliveryInfoId: newDeliveryInfo.id ,vat,total,mediaTotal},
          { transaction: t }
      );

      const newOrderMedia = await OrderMedia.bulkCreate(
          mediaDetails.map(media => ({
              orderId: newOrder.id,
              mediaId: media.mediaId,
              quantity: media.quantity,
              price: media.quantity * mediaDetails.find(md => md.mediaId === media.mediaId).price,
          })),
          { transaction: t }
      );

      await t.commit();

      res.status(201).json({
          order: newOrder,
          deliveryInfo: newDeliveryInfo,
          invoice: newInvoice,
          rushOrderInfo: newDeliveryInfo,
          orderMedia: newOrderMedia,
          mediaTotalPrice,
          vat,
          total,
      });
  } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
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



  
  
// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASS // Mật khẩu ứng dụng
  }
});

const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = 'Approved';
    await order.save();

    // Tìm Invoice dựa trên orderId
    const invoice = await Invoice.findOne({ where: { id: orderId } });
    if (!invoice || !invoice.deliveryInfoId) {
      return res.status(404).json({ message: 'Invoice or delivery information not found' });
    }

    // Tìm thông tin giao hàng từ DeliveryInfo
    const deliveryInfo = await DeliveryInfo.findByPk(invoice.deliveryInfoId);
    if (!deliveryInfo || !deliveryInfo.email) {
      return res.status(404).json({ message: 'Delivery information or email not found' });
    }


    // Gửi email thông báo
    try {
      const mailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: deliveryInfo.email,
        subject: 'Your order has been approved',
        text: `Dear ${deliveryInfo.name},\n\nYour order with ID ${orderId} has been approved.\n\nThank you for shopping with us!`
      });
      console.log(`Email sent successfully: ${mailResult.messageId}`);
    } catch (mailError) {
      console.error(`Failed to send email: ${mailError.message}`);
    }

    res.status(200).json({ message: 'Order approved successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = 'Rejected';
    await order.save();

    // Tìm Invoice dựa trên orderId
    const invoice = await Invoice.findOne({ where: { id: orderId } });

    if (!invoice || !invoice.deliveryInfoId) {
      return res.status(404).json({ message: 'Invoice or delivery information not found' });
    }

    // Tìm thông tin giao hàng từ DeliveryInfo
    const deliveryInfo = await DeliveryInfo.findByPk(invoice.deliveryInfoId);

    if (!deliveryInfo || !deliveryInfo.email) {
      return res.status(404).json({ message: 'Delivery information or email not found' });
    }

    // Gửi email thông báo
    try {
      const mailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: deliveryInfo.email,
        subject: 'Your order has been rejected',
        text: `Dear ${deliveryInfo.name},\n\nWe regret to inform you that your order with ID ${orderId} has been rejected.\n\nPlease contact our support team for further assistance.`
      });
      console.log(`Email sent successfully: ${mailResult.messageId}`);
    } catch (mailError) {
      console.error(`Failed to send email: ${mailError.message}`);
    }

    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};




module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    approveOrder,
    rejectOrder,
};
