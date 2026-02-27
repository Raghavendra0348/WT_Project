const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const router = express.Router();

// @desc    Upload paper file
// @route   POST /api/upload/paper
// @access  Private/Admin
router.post('/paper', protect, authorize('admin'), upload.single('paper'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'papervault/papers',
      resource_type: 'raw'
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes
      }
    });
  } catch (err) {
    // Delete local file if upload fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

// @desc    Upload solution file
// @route   POST /api/upload/solution
// @access  Private/Admin
router.post('/solution', protect, authorize('admin'), upload.single('solution'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'papervault/solutions',
      resource_type: 'raw'
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes
      }
    });
  } catch (err) {
    // Delete local file if upload fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

module.exports = router;
