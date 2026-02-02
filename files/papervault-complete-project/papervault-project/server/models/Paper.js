const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['intermediate', 'engineering']
  },
  course: {
    type: String,
    required: [true, 'Please specify the course']
  },
  year: {
    type: Number,
    required: [true, 'Please specify the year'],
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    required: [true, 'Please specify the semester'],
    min: 1,
    max: 2
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject'],
    trim: true
  },
  examType: {
    type: String,
    required: [true, 'Please specify exam type'],
    enum: ['midterm', 'final', 'model']
  },
  examYear: {
    type: Number,
    required: [true, 'Please specify exam year']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please upload a file']
  },
  filePublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  thumbnailUrl: String,
  hasSolution: {
    type: Boolean,
    default: false
  },
  solutionUrl: String,
  solutionPublicId: String,
  tags: [String],
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for faster queries
PaperSchema.index({ category: 1, year: 1, semester: 1 });
PaperSchema.index({ subject: 1 });
PaperSchema.index({ examType: 1 });
PaperSchema.index({ title: 'text', subject: 'text', tags: 'text' });

// Virtual for reviews
PaperSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'paperId',
  justOne: false
});

// Increment downloads
PaperSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  await this.save();
};

// Increment views
PaperSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

module.exports = mongoose.model('Paper', PaperSchema);
