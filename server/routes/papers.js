const express = require('express');
const {
  getPapers,
  getPaper,
  createPaper,
  updatePaper,
  deletePaper,
  downloadPaper
} = require('../controllers/paperController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPapers)
  .post(protect, authorize('admin'), createPaper);

router.route('/:id')
  .get(getPaper)
  .put(protect, authorize('admin'), updatePaper)
  .delete(protect, authorize('admin'), deletePaper);

router.route('/:id/download')
  .get(downloadPaper);

module.exports = router;
