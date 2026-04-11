const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const DownloadHistory = require('../models/DownloadHistory');
const Paper = require('../models/Paper');

const router = express.Router();

// All routes here require authentication
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    const fieldsToUpdate = {};

    // Only include fields that are provided
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;
    if (req.body.course) fieldsToUpdate.course = req.body.course;
    if (req.body.year) fieldsToUpdate.year = req.body.year;
    if (req.body.semester) fieldsToUpdate.semester = req.body.semester;

    await User.update(fieldsToUpdate, {
      where: { id: req.user.id }
    });

    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
router.get('/bookmarks', async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Paper,
        as: 'paper',
        include: [{
          model: User,
          as: 'uploadedBy',
          attributes: ['id', 'name']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks.map(b => b.paper)
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Add bookmark
// @route   POST /api/users/bookmarks/:paperId
// @access  Private
router.post('/bookmarks/:paperId', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId);

    // Check if paper exists
    const paper = await Paper.findByPk(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        paperId: paperId
      }
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Paper already bookmarked'
      });
    }

    // Create bookmark
    await Bookmark.create({
      userId: req.user.id,
      paperId: paperId
    });

    res.status(201).json({
      success: true,
      message: 'Bookmark added successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Remove bookmark
// @route   DELETE /api/users/bookmarks/:paperId
// @access  Private
router.delete('/bookmarks/:paperId', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId);

    const bookmark = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        paperId: paperId
      }
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await bookmark.destroy();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Toggle bookmark (add if not exists, remove if exists)
// @route   PUT /api/users/bookmarks/:paperId
// @access  Private
router.put('/bookmarks/:paperId', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId);

    // Check if paper exists
    const paper = await Paper.findByPk(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        paperId: paperId
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.destroy();
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed'
      });
    } else {
      // Add bookmark
      await Bookmark.create({
        userId: req.user.id,
        paperId: paperId
      });
      return res.status(200).json({
        success: true,
        bookmarked: true,
        message: 'Bookmark added'
      });
    }
  } catch (err) {
    next(err);
  }
});

// @desc    Check if paper is bookmarked
// @route   GET /api/users/bookmarks/:paperId/check
// @access  Private
router.get('/bookmarks/:paperId/check', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId);

    const bookmark = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        paperId: paperId
      }
    });

    res.status(200).json({
      success: true,
      bookmarked: !!bookmark
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get download history
// @route   GET /api/users/downloads
// @access  Private
router.get('/downloads', async (req, res, next) => {
  try {
    const downloads = await DownloadHistory.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Paper,
        as: 'paper',
        include: [{
          model: User,
          as: 'uploadedBy',
          attributes: ['id', 'name']
        }]
      }],
      order: [['downloadedAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: downloads.length,
      data: downloads
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Add to download history
// @route   POST /api/users/downloads/:paperId
// @access  Private
router.post('/downloads/:paperId', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId);

    // Check if paper exists
    const paper = await Paper.findByPk(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Add to download history
    await DownloadHistory.create({
      userId: req.user.id,
      paperId: paperId,
      downloadedAt: new Date()
    });

    // Increment paper downloads count
    await paper.incrementDownloads();

    res.status(201).json({
      success: true,
      message: 'Download recorded'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', async (req, res, next) => {
  try {
    const bookmarkCount = await Bookmark.count({
      where: { userId: req.user.id }
    });

    const downloadCount = await DownloadHistory.count({
      where: { userId: req.user.id }
    });

    const uploadCount = await Paper.count({
      where: { uploadedById: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: {
        bookmarks: bookmarkCount,
        downloads: downloadCount,
        uploads: uploadCount
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
