const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paperId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'papers',
      key: 'id'
    },
    field: 'paper_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a rating' },
      min: { args: [1], msg: 'Rating must be at least 1' },
      max: { args: [5], msg: 'Rating cannot be more than 5' }
    }
  },
  comment: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: { args: [0, 500], msg: 'Comment cannot be more than 500 characters' }
    }
  },
  helpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['paper_id', 'user_id']
    }
  ],
  hooks: {
    afterCreate: async (review) => {
      await Review.updatePaperRating(review.paperId);
    },
    afterUpdate: async (review) => {
      await Review.updatePaperRating(review.paperId);
    },
    afterDestroy: async (review) => {
      await Review.updatePaperRating(review.paperId);
    }
  }
});

// Static method to update paper's average rating
Review.updatePaperRating = async function (paperId) {
  try {
    const Paper = require('./Paper');
    const result = await Review.findAll({
      where: { paperId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews']
      ],
      raw: true
    });

    await Paper.update(
      {
        averageRating: result[0]?.averageRating || 0,
        numReviews: result[0]?.numReviews || 0
      },
      { where: { id: paperId } }
    );
  } catch (err) {
    console.error('Error updating paper rating:', err);
  }
};

module.exports = Review;
