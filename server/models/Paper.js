const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Paper = sequelize.define('Paper', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a title' },
      len: { args: [1, 200], msg: 'Title cannot be more than 200 characters' }
    }
  },
  category: {
    type: DataTypes.ENUM('intermediate', 'engineering'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please select a category' }
    }
  },
  course: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify the course' }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify the year' },
      min: { args: [1], msg: 'Year must be at least 1' },
      max: { args: [4], msg: 'Year cannot be more than 4' }
    }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify the semester' },
      min: { args: [1], msg: 'Semester must be at least 1' },
      max: { args: [2], msg: 'Semester cannot be more than 2' }
    }
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify the subject' }
    }
  },
  examType: {
    type: DataTypes.ENUM('midterm', 'final', 'model'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify exam type' }
    }
  },
  examYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify exam year' }
    }
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please upload a file' }
    }
  },
  filePublicId: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  hasSolution: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  solutionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  solutionPublicId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('tags');
      return value ? value : [];
    }
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  uploadedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'papers',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['category', 'year', 'semester'] },
    { fields: ['subject'] },
    { fields: ['exam_type'] },
    { type: 'FULLTEXT', fields: ['title', 'subject'] }
  ]
});

// Instance method: Increment downloads
Paper.prototype.incrementDownloads = async function () {
  this.downloads += 1;
  await this.save();
};

// Instance method: Increment views
Paper.prototype.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

module.exports = Paper;
