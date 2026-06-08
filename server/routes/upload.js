const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const router = express.Router();

// Helper: stream a memory buffer directly to Cloudinary
const uploadToCloudinary = (buffer, folder = 'papervault/papers', resourceType = 'raw') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        allowed_formats: ['pdf'],
        format: 'pdf'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Upload paper file
// @route   POST /api/upload/paper
// @access  Private
router.post('/paper', protect, upload.single('paper'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'papervault/papers');

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes
      }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Upload solution file
// @route   POST /api/upload/solution
// @access  Private
router.post('/solution', protect, upload.single('solution'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'papervault/solutions');

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
