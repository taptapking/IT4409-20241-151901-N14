const AuthService = require('../services/authService');
const Account = require('../models/Account');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (!account || !(await account.isPasswordValid(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token = AuthService.generateToken(account);
        res.status(200).json({ token, role: account.role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        // Handle logout based on token invalidation (e.g., via token blacklist or client-side deletion)
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
