const { Sequelize } = require('sequelize');

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
    }
  }
);

// Test connection and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}`);

    // Sync all models (use { alter: true } in development to update tables)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
