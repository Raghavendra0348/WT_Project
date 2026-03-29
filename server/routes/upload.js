const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @desc    Upload paper file
// @route   POST /api/upload/paper
// @access  Private
router.post('/paper', protect, upload.single('paper'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    let result = {};
    
    // Auto-detect if Cloudinary is configured
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your_api_key') {
      const uploadDir = path.join(__dirname, '../../frontend/papers/uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `paper-${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
      fs.copyFileSync(req.file.path, path.join(uploadDir, fileName));
      result = {
        secure_url: `papers/uploads/${fileName}`,
        public_id: `local-${Date.now()}`,
        bytes: req.file.size
      };
    } else {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'papervault/papers',
        resource_type: 'raw'
      });
    }

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
// @access  Private
router.post('/solution', protect, upload.single('solution'), async (req, res, next) => {
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
