// controllers/MediaController.js
const Media = require('../models/Media');
const Book = require('../models/Book');
const CD = require('../models/CD');
const DVD = require('../models/DVD');
const fs = require('fs');
const path = require('path');

class MediaController {
  // Create a new media item (Book, CD, or DVD)
  static async create(req, res) {
    const mediaData = JSON.parse(req.body.mediaData);
    const specificData = JSON.parse(req.body.specificData);
    const { type } = req.body;

    try {
      // Kiểm tra nếu không có file được tải lên
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      // Cập nhật đường dẫn ảnh vào dữ liệu media
      mediaData.imageUrl = `/uploads/${req.file.filename}`;

      // Tạo Media item
      const mediaItem = await Media.create(mediaData);

      // Tạo loại Media cụ thể (Book, CD, DVD)
      let specificItem;
      switch (type) {
        case 'Book':
          specificItem = await Book.create({ ...specificData, id: mediaItem.id });
          break;
        case 'CD':
          specificItem = await CD.create({ ...specificData, id: mediaItem.id });
          break;
        case 'DVD':
          specificItem = await DVD.create({ ...specificData, id: mediaItem.id });
          break;
        default:
          return res.status(400).json({ error: 'Invalid media type' });
      }

    // Cập nhật imageUrl thành URL đầy đủ
    const fullMediaItem = {
      ...mediaItem.dataValues,  // Giữ lại các trường hiện tại
      imageUrl: `${req.protocol}://${req.get('host')}${mediaItem.imageUrl}`  // Thêm URL đầy đủ
    };

    return res.status(201).json({ mediaItem: fullMediaItem, specificItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  
  }

  // Get all media items
  static async getAll(req, res) {
    try {
      const mediaItems = await Media.findAll();
      const books = await Book.findAll();
      const cds = await CD.findAll();
      const dvds = await DVD.findAll();

    // Cập nhật URL ảnh để trả về đường dẫn đầy đủ
    const fullMediaItems = mediaItems.map(item => {
      return {
        ...item.dataValues,  // giữ lại tất cả các trường hiện tại
        imageUrl: `${req.protocol}://${req.get('host')}${item.imageUrl}`  // thêm URL đầy đủ vào trường imageUrl
      };
    });

    // Trả về kết quả với full imageUrl
    return res.status(200).json({ mediaItems: fullMediaItems, books, cds, dvds });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

  // Get a specific media item by ID and type
static async getById(req, res) {
  const { type, id } = req.params;
  try {
    const mediaItem = await Media.findByPk(id);
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Cập nhật URL ảnh để trả về đường dẫn đầy đủ
    const fullMediaItem = {
      ...mediaItem.dataValues,  // giữ lại tất cả các trường hiện tại
      imageUrl: `${req.protocol}://${req.get('host')}${mediaItem.imageUrl}`  // thêm URL đầy đủ vào trường imageUrl
    };

    let specificItem;
    switch (type) {
      case 'Book':
        specificItem = await Book.findByPk(id);
        break;
      case 'CD':
        specificItem = await CD.findByPk(id);
        break;
      case 'DVD':
        specificItem = await DVD.findByPk(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid media type' });
    }

    return res.status(200).json({ mediaItem: fullMediaItem, specificItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

  // Update a specific media item
  static async update(req, res) {
    const { type, id } = req.params;
  
    try {
      // Parse các trường mediaData và specificData nếu tồn tại
      const mediaData = req.body.mediaData ? JSON.parse(req.body.mediaData) : {};
      const specificData = req.body.specificData ? JSON.parse(req.body.specificData) : {};
  
      // Lấy thông tin Media hiện tại từ database
      const mediaItem = await Media.findByPk(id);
      if (!mediaItem) {
        return res.status(404).json({ error: 'Media not found' });
      }
  
      // Kiểm tra nếu có file mới được tải lên
      if (req.file) {
        // Xóa file cũ nếu tồn tại
        if (mediaItem.imageUrl) {
          const oldFilePath = path.join(__dirname, '..', mediaItem.imageUrl);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath); // Xóa file cũ
          }
        }
  
        // Cập nhật đường dẫn file mới
        mediaData.imageUrl = `/uploads/${req.file.filename}`;
      }
  
      // Cập nhật Media (bảng chung)
      await Media.update(mediaData, { where: { id } });
  
      // Cập nhật bảng cụ thể (Book, CD, DVD)
      let specificUpdate;
      switch (type) {
        case 'Book':
          specificUpdate = await Book.update(specificData, { where: { id } });
          break;
        case 'CD':
          specificUpdate = await CD.update(specificData, { where: { id } });
          break;
        case 'DVD':
          specificUpdate = await DVD.update(specificData, { where: { id } });
          break;
        default:
          return res.status(400).json({ error: 'Invalid media type' });
      }
  
     // Cập nhật imageUrl thành URL đầy đủ
    const fullMediaItem = {
      ...mediaItem.dataValues,  // Giữ lại các trường hiện tại
      imageUrl: `${req.protocol}://${req.get('host')}${mediaItem.imageUrl}`  // Thêm URL đầy đủ
    };

      return res.status(200).json({ mediaItem: fullMediaItem, specificData });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete a specific media item
  static async delete(req, res) {
    const { type, id } = req.params;

    try {
      // Delete the specific type first
      let specificDelete;
      switch (type) {
        case 'Book':
          specificDelete = await Book.destroy({ where: { id } });
          break;
        case 'CD':
          specificDelete = await CD.destroy({ where: { id } });
          break;
        case 'DVD':
          specificDelete = await DVD.destroy({ where: { id } });
          break;
        default:
          return res.status(400).json({ error: 'Invalid media type' });
      }

      if (!specificDelete) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Then delete the base Media item
      await Media.destroy({ where: { id } });
      return res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MediaController;
