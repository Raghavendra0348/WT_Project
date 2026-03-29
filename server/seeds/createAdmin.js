require('dotenv').config();
const { sequelize } = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
        try {
                console.log('🔄 Connecting to database...');
                await sequelize.authenticate();
                console.log('✅ Connected to database');

                console.log('🔄 Syncing models...');
                await sequelize.sync();
                console.log('✅ Models synced');

                // Check if admin already exists
                const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });

                if (existingAdmin) {
                        console.log('ℹ️ Admin user already exists');
                        process.exit(0);
                }

                // Create admin user
                const admin = await User.create({
                        name: 'Admin User',
                        email: 'admin@example.com',
                        password: 'admin123',
                        role: 'admin',
                        course: 'engineering',
                        year: 4,
                        semester: 2
                });

                console.log('✅ Admin user created successfully!');
                console.log('📧 Email:', admin.email);
                console.log('🔑 Password: admin123');
                console.log('\n⚠️  IMPORTANT: Change this password after first login!');

                process.exit(0);
        } catch (err) {
                console.error('❌ Error:', err.message);
                process.exit(1);
        }
}

createAdmin();
