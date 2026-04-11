const dotenv = require('dotenv');

// Load environment variables FIRST (before any other imports that use them)
dotenv.config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to MySQL
connectDB();

// Setup model associations
require('./models/associations');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
  // Allow Google Identity popup flow to call back into the page
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
})); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://0.0.0.0:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL || 'http://localhost:3000'
    ];

    const localNetworkPattern = /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/;

    if (allowedOrigins.includes(origin) || localNetworkPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

// Serve locally uploaded papers as static files
app.use('/papers/uploads', express.static(path.join(__dirname, '../frontend/papers/uploads')));

// Public stats route (for homepage - no auth required)
app.get('/api/stats', async (req, res) => {
  try {
    const Paper = require('./models/Paper');
    const User = require('./models/User');
    const { sequelize } = require('./config/db');

    const totalPapers = await Paper.count({ where: { status: 'approved' } });
    const totalUsers = await User.count();

    const downloadResult = await Paper.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('downloads')), 'total']],
      raw: true
    });
    const totalDownloads = parseInt(downloadResult[0]?.total) || 0;

    const subjectResult = await Paper.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('subject')), 'subject']],
      where: { status: 'approved' },
      raw: true
    });
    const totalSubjects = subjectResult.length;

    res.status(200).json({
      success: true,
      data: { totalPapers, totalUsers, totalDownloads, totalSubjects }
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(200).json({
      success: true,
      data: { totalPapers: 0, totalUsers: 0, totalDownloads: 0, totalSubjects: 0 }
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PaperVault API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});
