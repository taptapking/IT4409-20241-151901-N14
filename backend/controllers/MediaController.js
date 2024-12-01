// controllers/MediaController.js
const Media = require('../models/Media');
const Book = require('../models/Book');
const CD = require('../models/CD');
const DVD = require('../models/DVD');

class MediaController {
  // Create a new media item (Book, CD, or DVD)
  static async create(req, res) {
    const { type, mediaData, specificData } = req.body;
    try {
      // Create the base Media item first
      const mediaItem = await Media.create(mediaData);

      // Then create the specific type (Book, CD, DVD) associated with this Media
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

      return res.status(201).json({ mediaItem, specificItem });
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
      return res.status(200).json({ mediaItems, books, cds, dvds });
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

      return res.status(200).json({ mediaItem, specificItem });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a specific media item
  static async update(req, res) {
    const { type, id } = req.params;
    const { mediaData, specificData } = req.body;

    try {
      // Update the base Media item
      await Media.update(mediaData, { where: { id } });

      // Update the specific type (Book, CD, DVD)
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

      return res.status(200).json({ message: 'Media updated successfully' });
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
