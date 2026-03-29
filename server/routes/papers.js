const express = require('express');
const {
  getPapers,
  getPaper,
  createPaper,
  updatePaper,
  deletePaper,
  downloadPaper,
  getPendingPapers,
  approvePaper
} = require('../controllers/paperController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/pending')
  .get(protect, authorize('admin'), getPendingPapers);

router.route('/')
  .get(getPapers)
  .post(protect, createPaper);

router.route('/:id/approve')
  .put(protect, authorize('admin'), approvePaper);

router.route('/:id')
  .get(getPaper)
  .put(protect, authorize('admin'), updatePaper)
  .delete(protect, authorize('admin'), deletePaper);

router.route('/:id/download')
  .get(downloadPaper);

module.exports = router;
