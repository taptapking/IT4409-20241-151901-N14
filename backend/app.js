const express = require('express');
const authRoutes = require('./routes/auth');
// const User = require('../models/User');
// const orderRoutes = require('./routes/order');
// const paymentRoutes = require('./routes/payment');

const app = express();
const sequelize = require('./config/db'); // Thêm dòng này để import Sequelize instance
const path = require('path');
// Import các model
const Account = require('./models/Account');
const AccountRole = require('./models/AccountRole');
const Book = require('./models/Book');
const CD = require('./models/CD');
const DeliveryInfo = require('./models/DeliveryInfo');
const DVD = require('./models/DVD');
const Order = require('./models/Order');
const OrderMedia = require('./models/OrderMedia');
const Invoice = require('./models/Invoice');
const Media = require('./models/Media');
const Role = require('./models/Role');
const RushDeliveryInfo = require('./models/RushDeliveryInfo');
const Track = require('./models/Track');
const cors = require('cors');
const accountRoutes = require('./routes/account'); 
const adminOrderRoutes = require('./routes/adminOrder');
// Cấu hình CORS cho ứng dụng
app.use(cors());  // Cài đặt CORS mặc định cho tất cả các routes

// Thiết lập mối quan hệ giữa Invoice và Order
Invoice.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasOne(Invoice, { foreignKey: 'orderId' });

// Thiết lập mối quan hệ giữa Invoice và DeliveryInfo
Invoice.belongsTo(DeliveryInfo, { foreignKey: 'deliveryInfoId' });
DeliveryInfo.hasOne(Invoice, { foreignKey: 'deliveryInfoId' });

const mediaRoutes = require('./routes/mediaRoutes'); // Đường dẫn đến file routes

app.use(express.json());

// Khởi tạo và đồng bộ hóa cơ sở dữ liệu
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Đồng bộ hóa models với cơ sở dữ liệu
sequelize.sync()
    .then(() => console.log('Models synchronized...'))
    .catch(err => console.log('Error syncing models: ' + err));

    
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sử dụng routes đã khai báo
app.use('/api', mediaRoutes);
app.use('/api/accounts', accountRoutes); 
app.use('/api/orders', adminOrderRoutes);  // Cấu hình prefix /api/orders cho tất cả các route trong orderRoutes

// Sử dụng auth routes cho các endpoint xác thực
app.use('/api/auth', authRoutes);
// app.use('/api', orderRoutes);
// app.use('/api', paymentRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
