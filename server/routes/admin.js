const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Paper = require('../models/Paper');
const DownloadHistory = require('../models/DownloadHistory');
const Review = require('../models/Review');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const router = express.Router();

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    // Count total papers
    const totalPapers = await Paper.count();

    // Count total users
    const totalUsers = await User.count();

    // Sum total downloads using Sequelize
    const downloadResult = await Paper.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('downloads')), 'total']
      ],
      raw: true
    });
    const totalDownloads = downloadResult[0]?.total || 0;

    // Count papers created today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayPapers = await Paper.count({
      where: {
        createdAt: { [Op.gte]: todayStart }
      }
    });

    // Count papers by category
    const papersByCategory = await Paper.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    // Count users by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // Recent activity (last 7 days downloads)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentDownloads = await DownloadHistory.count({
      where: {
        downloadedAt: { [Op.gte]: weekAgo }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        totalUsers,
        totalDownloads: parseInt(totalDownloads) || 0,
        todayPapers,
        recentDownloads,
        papersByCategory,
        usersByRole
      }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { count: total, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

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

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update role
    await user.update({ role: req.body.role });

    // Fetch updated user without password
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all papers (admin view)
// @route   GET /api/admin/papers
// @access  Private/Admin
router.get('/papers', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.category) where.category = req.query.category;
    if (req.query.course) where.course = req.query.course;

    const { count: total, rows: papers } = await Paper.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'uploadedBy',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: papers
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update paper status (approve/reject)
// @route   PUT /api/admin/papers/:id
// @access  Private/Admin
router.put('/papers/:id', async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    const { status } = req.body;
    if (status && ['approved', 'rejected', 'pending'].includes(status)) {
      paper.status = status;
      await paper.save();
    }

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete paper (admin)
// @route   DELETE /api/admin/papers/:id
// @access  Private/Admin
router.delete('/papers/:id', async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    const fs = require('fs');
    const path = require('path');

    // --- Delete local file from disk if it's a local upload ---
    if (paper.fileUrl && !paper.fileUrl.startsWith('http')) {
      const localPath = path.join(__dirname, '../../frontend', paper.fileUrl);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
          console.log('Deleted local file:', localPath);
        } catch (fsErr) {
          console.log('Could not delete local file (non-critical):', fsErr.message);
        }
      }
    }

    // --- Delete from Cloudinary if it was a cloud upload ---
    if (paper.fileUrl && paper.fileUrl.startsWith('http')) {
      try {
        const cloudinary = require('../config/cloudinary');
        if (paper.filePublicId && !paper.filePublicId.startsWith('local-')) {
          await cloudinary.uploader.destroy(paper.filePublicId, { resource_type: 'raw' });
        }
        if (paper.solutionPublicId && !paper.solutionPublicId.startsWith('local-')) {
          await cloudinary.uploader.destroy(paper.solutionPublicId, { resource_type: 'raw' });
        }
      } catch (cloudErr) {
        console.log('Cloudinary delete error (non-critical):', cloudErr.message);
      }
    }

    // Clean up related records first (bookmarks and download history)
    const Bookmark = require('../models/Bookmark');
    const DownloadHistoryModel = require('../models/DownloadHistory');
    await Bookmark.destroy({ where: { paperId: paper.id } });
    await DownloadHistoryModel.destroy({ where: { paperId: paper.id } });

    // Now delete the paper record
    await paper.destroy();

    res.status(200).json({
      success: true,
      message: 'Paper and associated file deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});


// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
router.get('/activity', async (req, res, next) => {
  try {
    // Recent downloads
    const recentDownloads = await DownloadHistory.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Paper, as: 'paper', attributes: ['id', 'title', 'subject'] }
      ],
      order: [['downloadedAt', 'DESC']],
      limit: 10
    });

    // Recent reviews
    const recentReviews = await Review.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Paper, as: 'paper', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Recent users
    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        recentDownloads,
        recentReviews,
        recentUsers
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
