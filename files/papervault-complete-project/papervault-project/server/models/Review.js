const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per paper
ReviewSchema.index({ paperId: 1, userId: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(paperId) {
  const obj = await this.aggregate([
    {
      $match: { paperId }
    },
    {
      $group: {
        _id: '$paperId',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Paper').findByIdAndUpdate(paperId, {
      averageRating: obj[0]?.averageRating || 0,
      numReviews: obj[0]?.numReviews || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.paperId);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.paperId);
});

module.exports = mongoose.model('Review', ReviewSchema);
