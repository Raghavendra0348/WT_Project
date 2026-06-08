const multer = require('multer');
const path = require('path');

// Use memory storage — files are held in buffer for Cloudinary streaming
// (disk storage breaks on cloud hosts that wipe local files on redeploy)
const storage = multer.memoryStorage();

// Check file type — PDFs only
function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf' || filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
}

// Initialize multer with memory storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
