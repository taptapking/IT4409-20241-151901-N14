// middlewares/multer.js
const multer = require('multer');
const path = require('path');

// Định nghĩa thư mục lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lưu ảnh vào thư mục 'uploads/'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file ảnh theo timestamp
  }
});

// Middleware Multer để upload file
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: File must be an image (jpg, jpeg, png, gif)');
    }
  }
});

module.exports = upload;
