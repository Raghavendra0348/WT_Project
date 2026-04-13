const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper: save uploaded file to local disk
function saveLocally(file, prefix = 'paper') {
  const uploadDir = path.join(__dirname, '../../frontend/papers/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
  const fileName = `${prefix}-${Date.now()}-${safeName}`;
  const destPath = path.join(uploadDir, fileName);

  fs.copyFileSync(file.path, destPath);
  fs.unlinkSync(file.path); // remove temp file

  return {
    secure_url: `papers/uploads/${fileName}`,
    public_id: `local-${Date.now()}`,
    bytes: file.size
  };
}

// @desc    Upload paper file
// @route   POST /api/upload/paper
// @access  Private
router.post('/paper', protect, upload.single('paper'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const result = saveLocally(req.file, 'paper');

    res.status(200).json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id, size: result.bytes }
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
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

    const result = saveLocally(req.file, 'solution');

    res.status(200).json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id, size: result.bytes }
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
});

module.exports = router;
