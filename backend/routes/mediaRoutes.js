//routes/mediaRoutes.js
const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/MediaController');
const upload = require('../middleware/multer'); // Import Multer middleware
// Route để tạo một Media (Book, CD, DVD)
router.post('/media', upload.single('image'), MediaController.create);


// Route để lấy tất cả các Media items
router.get('/media', MediaController.getAll);

// Route để lấy một Media theo ID và loại (Book, CD, DVD)
router.get('/media/:type/:id', MediaController.getById);


// Route để cập nhật một Media theo ID và loại (Book, CD, DVD)
router.put('/media/:type/:id', upload.single('image'), MediaController.update);

// Route để xóa một Media theo ID và loại (Book, CD, DVD)
router.delete('/media/:type/:id', MediaController.delete);

module.exports = router;
