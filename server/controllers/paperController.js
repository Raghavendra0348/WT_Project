const Paper = require('../models/Paper');
const User = require('../models/User');
const Review = require('../models/Review');
const { Op } = require('sequelize');

// @desc    Get all papers with filters
// @route   GET /api/papers
// @access  Public
exports.getPapers = async (req, res, next) => {
  try {
    // Build where clause from query parameters
    const where = { status: 'approved' };
    const { category, year, semester, subject, examType, examYear, search } = req.query;

    if (category) where.category = category;
    if (year) where.year = parseInt(year);
    if (semester) where.semester = parseInt(semester);
    if (subject) where.subject = { [Op.like]: `%${subject}%` };
    if (examType) where.examType = examType;
    if (examYear) where.examYear = parseInt(examYear);

    // Search functionality
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } }
      ];
    }

    // Sort
    let order = [['createdAt', 'DESC']];
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      order = sortFields;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = (page - 1) * limit;

    // Execute query with count
    const { count: total, rows: papers } = await Paper.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [{
        model: User,
        as: 'uploadedBy',
        attributes: ['id', 'name', 'email']
      }]
    });

    // Pagination result
    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (offset > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      pagination,
      data: papers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single paper
// @route   GET /api/papers/:id
// @access  Public
exports.getPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'uploadedBy',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Review,
          as: 'reviews',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }]
        }
      ]
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Increment views
    await paper.incrementViews();

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new paper
// @route   POST /api/papers
// @access  Private
exports.createPaper = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.uploadedById = req.user.id;
    // Admins bypass pending state
    req.body.status = req.user.role === 'admin' ? 'approved' : 'pending';

    const paper = await Paper.create(req.body);

    res.status(201).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending papers
// @route   GET /api/papers/pending
// @access  Private/Admin
exports.getPendingPapers = async (req, res, next) => {
  try {
    const papers = await Paper.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'uploadedBy', attributes: ['id', 'name', 'email'] }]
    });
    res.status(200).json({ success: true, count: papers.length, data: papers });
  } catch(err) { next(err); }
};

// @desc    Approve paper
// @route   PUT /api/papers/:id/approve
// @access  Private/Admin
exports.approvePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (!paper) return res.status(404).json({ success: false, message: 'Paper not found' });
    
    paper.status = 'approved';
    await paper.save();
    
    res.status(200).json({ success: true, data: paper });
  } catch(err) { next(err); }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private/Admin
exports.updatePaper = async (req, res, next) => {
  try {
    let paper = await Paper.findByPk(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    await paper.update(req.body);

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete paper
// @route   DELETE /api/papers/:id
// @access  Private/Admin
exports.deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Delete file from cloudinary
    const cloudinary = require('../config/cloudinary');
    await cloudinary.uploader.destroy(paper.filePublicId);

    if (paper.solutionPublicId) {
      await cloudinary.uploader.destroy(paper.solutionPublicId);
    }

    await paper.destroy();

    res.status(200).json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Download paper
// @route   GET /api/papers/:id/download
// @access  Public (optionalAuth tracks logged-in users)
exports.downloadPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByPk(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Increment downloads
    await paper.incrementDownloads();

    // If user is logged in, add to download history
    if (req.user) {
      const DownloadHistory = require('../models/DownloadHistory');
      await DownloadHistory.create({
        userId: req.user.id,
        paperId: paper.id
      });
    }

    const fileUrl = paper.fileUrl;

    // --- Cloudinary files: use generate_archive which bypasses ACL restriction ---
    if (fileUrl && fileUrl.includes('cloudinary.com')) {
      if (paper.filePublicId) {
        try {
          const cloudinary = require('../config/cloudinary');
          // generate_archive creates a signed URL that works even in restricted mode
          const zipUrl = cloudinary.utils.download_zip_url({
            public_ids: [paper.filePublicId],
            resource_type: 'raw'
          });

          const https = require('https');
          const fileName = (paper.title || 'paper').replace(/[^a-zA-Z0-9 _-]/g, '_') + '.pdf';
          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          res.setHeader('Content-Type', 'application/pdf');

          https.get(zipUrl, (cloudRes) => {
            if (cloudRes.statusCode === 200) {
              cloudRes.pipe(res);
            } else {
              console.error('Archive download failed status:', cloudRes.statusCode);
              res.removeHeader('Content-Type');
              res.removeHeader('Content-Disposition');
              res.status(500).json({ success: false, message: 'File download failed. Please contact admin.' });
            }
          }).on('error', () => {
            res.status(500).json({ success: false, message: 'Failed to stream file from cloud' });
          });

          return;
        } catch (cloudErr) {
          console.error('generate_archive error:', cloudErr.message);
          // Fall through to return raw URL as last resort
        }
      }

      // Fallback: return raw URL (may show 401 in browser)
      return res.status(200).json({ success: true, url: fileUrl });
    }

    // --- Local files: stream directly from disk ---
    if (fileUrl && !fileUrl.startsWith('http')) {
      const fs = require('fs');
      const pathModule = require('path');

      // fileUrl is like: papers/uploads/paper-xxx.pdf
      const localPath = pathModule.join(__dirname, '../../frontend', fileUrl);

      if (!fs.existsSync(localPath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on server. It may have been moved or deleted.'
        });
      }

      const fileName = (paper.title || 'paper').replace(/[^a-zA-Z0-9 _-]/g, '_') + '.pdf';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      const fileStream = fs.createReadStream(localPath);
      fileStream.on('error', () => {
        res.status(500).json({ success: false, message: 'Failed to read file from disk' });
      });
      fileStream.pipe(res);
      return;
    }

    res.status(404).json({ success: false, message: 'No file associated with this paper' });
  } catch (err) {
    next(err);
  }
};

