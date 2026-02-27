const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a name' },
      len: { args: [1, 50], msg: 'Name cannot be more than 50 characters' }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Please provide an email' }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a password' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student'
  },
  course: {
    type: DataTypes.ENUM('intermediate', 'engineering'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please select a course' }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please select your year' },
      min: { args: [1], msg: 'Year must be at least 1' },
      max: { args: [4], msg: 'Year cannot be more than 4' }
    }
  },
  semester: {
    type: DataTypes.INTEGER,
    validate: {
      min: { args: [1], msg: 'Semester must be at least 1' },
      max: { args: [2], msg: 'Semester cannot be more than 2' }
    }
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  },
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method: Compare password
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method: Generate JWT token
User.prototype.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this.id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Instance method: Generate password reset token
User.prototype.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

module.exports = User;
