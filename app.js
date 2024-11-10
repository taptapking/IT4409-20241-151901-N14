const express = require('express');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/database');
const User = require('./models/User');
const orderRoutes = require('./routes/order');

const app = express();

app.use(express.json());

// Khởi tạo và đồng bộ hóa cơ sở dữ liệu
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Đồng bộ hóa models với cơ sở dữ liệu
sequelize.sync()
    .then(() => console.log('Models synchronized...'))
    .catch(err => console.log('Error syncing models: ' + err));

// Sử dụng auth routes cho các endpoint xác thực
app.use('/api', authRoutes);
app.use('/api', orderRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
