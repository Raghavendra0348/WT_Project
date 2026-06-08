const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Build SSL options for cloud databases (e.g., Aiven)
const buildSSLOptions = () => {
  if (process.env.DB_SSL !== 'true') return {};

  const sslOptions = {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      }
    }
  };

  // If a CA certificate file path is provided, use it
  if (process.env.DB_SSL_CA) {
    const caPath = path.resolve(process.env.DB_SSL_CA);
    if (fs.existsSync(caPath)) {
      sslOptions.dialectOptions.ssl.ca = fs.readFileSync(caPath);
      console.log('🔒 Using SSL CA certificate:', caPath);
    } else {
      console.warn('⚠️  SSL CA file not found:', caPath);
      // Fall back to not verifying (less secure but works)
      sslOptions.dialectOptions.ssl.rejectUnauthorized = false;
    }
  } else {
    // No CA provided — allow self-signed certs
    sslOptions.dialectOptions.ssl.rejectUnauthorized = false;
  }

  return sslOptions;
};

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'papervault',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    ...buildSSLOptions()
  }
);

// Test connection and sync models — retries every 10s instead of crashing
const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}`);

    // Sync all models
    await sequelize.sync({ alter: process.env.SYNC_DB === 'true' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ Retrying DB connection in 10s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), 10000);
    } else {
      console.error('💀 Max DB retries reached. Server running WITHOUT database.');
      // Don't exit — let the server keep running so Render keeps the port open
    }
  }
};

module.exports = { sequelize, connectDB };
