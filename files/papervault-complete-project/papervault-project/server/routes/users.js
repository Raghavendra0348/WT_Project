const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// All routes here require authentication
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
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
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      course: req.body.course,
      year: req.body.year,
      semester: req.body.semester
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

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
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.status(200).json({
      success: true,
      data: user.bookmarks
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
    const user = await User.findById(req.user.id);

    // Check if already bookmarked
    if (user.bookmarks.includes(req.params.paperId)) {
      return res.status(400).json({
        success: false,
        message: 'Paper already bookmarked'
      });
    }

    user.bookmarks.push(req.params.paperId);
    await user.save();

    res.status(200).json({
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
    const user = await User.findById(req.user.id);

    user.bookmarks = user.bookmarks.filter(
      id => id.toString() !== req.params.paperId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully'
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
    const user = await User.findById(req.user.id).populate('downloadHistory.paperId');
    res.status(200).json({
      success: true,
      data: user.downloadHistory
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
