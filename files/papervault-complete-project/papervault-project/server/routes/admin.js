const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Paper = require('../models/Paper');

const router = express.Router();

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const totalDownloads = await Paper.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloads' }
        }
      }
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayPapers = await Paper.countDocuments({
      createdAt: { $gte: todayStart }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        totalUsers,
        totalDownloads: totalDownloads[0]?.total || 0,
        todayPapers
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
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password');

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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
