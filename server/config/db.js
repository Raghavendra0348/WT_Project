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

// Test connection and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}`);

    // Sync all models (use { alter: true } only when explicitly requested to speed up start times)
    await sequelize.sync({ alter: process.env.SYNC_DB === 'true' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
