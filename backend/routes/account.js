const express = require('express');
const router = express.Router();
const Account = require('../controllers/accountController');

// Route để tạo tài khoản mới
router.post('/create', Account.createAccount);
// Route để cập nhật tài khoản
router.put('/:id', Account.updateAccount);  // Sử dụng phương thức PUT để cập nhật thông tin tài khoản
router.delete('/:id', Account.deleteAccount);  // Phương thức DELETE để xóa tài khoản
// Route để lấy thông tin tài khoản theo id
router.get('/:id', Account.getAccount);

// Route để lấy tất cả tài khoản
router.get('/', Account.getAllAccounts);
// Route để chặn tài khoản
router.put('/block/:id', Account.blockAccount);  // Chặn tài khoản

// Route để bỏ chặn tài khoản
router.put('/unblock/:id', Account.unblockAccount);  // Bỏ chặn tài khoản

module.exports = router;