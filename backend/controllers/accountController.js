// controllers/accountController.js
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Role = require('../models/Role');
const AccountRole = require('../models/AccountRole');

// Hàm thêm tài khoản mới
exports.createAccount = async (req, res) => {
    try {
        const { email, password, status, roles } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingAccount = await Account.findOne({ where: { email } });
        if (existingAccount) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const newAccount = await Account.create({
            email,
            password: hashedPassword,
            status
        });

        // Gán vai trò cho tài khoản (nếu có)
        if (roles && roles.length > 0) {
            const roleRecords = await Role.findAll({
                where: {
                    roleName: roles
                }
            });
            await newAccount.setRoles(roleRecords);
        }

        res.status(201).json({ message: 'Tài khoản được tạo thành công.', account: newAccount });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi tạo tài khoản.' });
    }
};

// Hàm sửa thông tin tài khoản
exports.updateAccount = async (req, res) => {
    try {
        const accountId = req.params.id;
        const { email, password, status, roles } = req.body;

        // Tìm tài khoản cần sửa
        const account = await Account.findByPk(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        // Cập nhật các trường thông tin
        if (email) {
            // Kiểm tra email đã tồn tại chưa
            const existingAccount = await Account.findOne({ where: { email } });
            if (existingAccount && existingAccount.id !== accountId) {
                return res.status(400).json({ message: 'Email đã được sử dụng.' });
            }
            account.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            account.password = hashedPassword;
        }

        if (status) {
            account.status = status;
        }

        await account.save();

        // Cập nhật vai trò (nếu có)
        if (roles) {
            const roleRecords = await Role.findAll({
                where: {
                    roleName: roles
                }
            });
            await account.setRoles(roleRecords);
        }

        res.status(200).json({ message: 'Tài khoản được cập nhật thành công.', account });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi cập nhật tài khoản.' });
    }
};

// Hàm xóa tài khoản
exports.deleteAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        // Tìm tài khoản cần xóa
        const account = await Account.findByPk(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        // Xóa các liên kết với vai trò
        await account.setRoles([]);

        // Xóa tài khoản
        await account.destroy();

        res.status(200).json({ message: 'Tài khoản được xóa thành công.' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi xóa tài khoản.' });
    }
};

// Hàm lấy thông tin tài khoản (tùy chọn)
exports.getAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        const account = await Account.findByPk(accountId, {
            include: Role
        });

        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        res.status(200).json({ account });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy thông tin tài khoản.' });
    }
};

// Hàm lấy tất cả tài khoản (tùy chọn)
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            include: Role
        });

        res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy danh sách tài khoản.' });
    }
};



// Hàm chặn tài khoản
exports.blockAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        // Tìm tài khoản cần chặn
        const account = await Account.findByPk(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        // Đặt trạng thái tài khoản thành "blocked"
        account.status = 'blocked';
        await account.save();

        res.status(200).json({ message: 'Tài khoản đã bị chặn.' });
    } catch (error) {
        console.error('Error blocking account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi chặn tài khoản.' });
    }
};

// Hàm bỏ chặn tài khoản
exports.unblockAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        // Tìm tài khoản cần bỏ chặn
        const account = await Account.findByPk(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        // Đặt trạng thái tài khoản thành "active"
        account.status = 'active';
        await account.save();

        res.status(200).json({ message: 'Tài khoản đã được bỏ chặn.' });
    } catch (error) {
        console.error('Error unblocking account:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi bỏ chặn tài khoản.' });
    }
};