const Paper = require('../models/Paper');

// @desc    Get all papers with filters
// @route   GET /api/papers
// @access  Public
exports.getPapers = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Paper.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      query = query.find({ $text: { $search: req.query.search } });
    }

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Paper.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate uploadedBy
    query = query.populate({
      path: 'uploadedBy',
      select: 'name email'
    });

    // Execute query
    const papers = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
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
    const paper = await Paper.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('reviews');

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
// @access  Private/Admin
exports.createPaper = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.uploadedBy = req.user.id;

    const paper = await Paper.create(req.body);

    res.status(201).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private/Admin
exports.updatePaper = async (req, res, next) => {
  try {
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
    const paper = await Paper.findById(req.params.id);

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

    await paper.remove();

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
// @access  Public
exports.downloadPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);

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
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          downloadHistory: {
            paperId: paper._id,
            downloadedAt: Date.now()
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      url: paper.fileUrl
    });
  } catch (err) {
    next(err);
  }
};
