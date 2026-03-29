require('dotenv').config();
const { sequelize } = require('../config/db');
const Paper = require('../models/Paper');
const User = require('../models/User');

const samplePapers = [
        // Engineering Papers
        {
                title: 'Mathematics-IIA Mid-1 2024',
                category: 'engineering',
                course: 'CSE',
                year: 2,
                semester: 1,
                subject: 'Mathematics-IIA',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_math_1',
                fileSize: 1024000,
                isApproved: true,
                views: 150,
                downloadCount: 45
        },
        {
                title: 'Data Structures Mid-2 2024',
                category: 'engineering',
                course: 'CSE',
                year: 2,
                semester: 1,
                subject: 'Data Structures',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_ds_1',
                fileSize: 2048000,
                isApproved: true,
                views: 200,
                downloadCount: 78
        },
        {
                title: 'Database Management Systems End Sem 2023',
                category: 'engineering',
                course: 'CSE',
                year: 3,
                semester: 1,
                subject: 'DBMS',
                examType: 'final',
                examYear: 2023,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_dbms_1',
                fileSize: 3072000,
                isApproved: true,
                views: 320,
                downloadCount: 112
        },
        {
                title: 'Operating Systems Mid-1 2024',
                category: 'engineering',
                course: 'CSE',
                year: 3,
                semester: 1,
                subject: 'Operating Systems',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_os_1',
                fileSize: 1536000,
                isApproved: true,
                views: 180,
                downloadCount: 56
        },
        {
                title: 'Computer Networks End Sem 2023',
                category: 'engineering',
                course: 'CSE',
                year: 3,
                semester: 2,
                subject: 'Computer Networks',
                examType: 'final',
                examYear: 2023,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_cn_1',
                fileSize: 2560000,
                isApproved: true,
                views: 250,
                downloadCount: 89
        },
        // ECE Papers
        {
                title: 'Digital Electronics Mid-1 2024',
                category: 'engineering',
                course: 'ECE',
                year: 2,
                semester: 1,
                subject: 'Digital Electronics',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_de_1',
                fileSize: 1800000,
                isApproved: true,
                views: 140,
                downloadCount: 42
        },
        {
                title: 'Signals & Systems End Sem 2023',
                category: 'engineering',
                course: 'ECE',
                year: 2,
                semester: 2,
                subject: 'Signals & Systems',
                examType: 'final',
                examYear: 2023,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_ss_1',
                fileSize: 2200000,
                isApproved: true,
                views: 175,
                downloadCount: 63
        },
        // Intermediate/PUC Papers
        {
                title: 'Physics Mid-1 2024',
                category: 'intermediate',
                course: 'MPC',
                year: 1,
                semester: 1,
                subject: 'Physics',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_phy_1',
                fileSize: 1400000,
                isApproved: true,
                views: 280,
                downloadCount: 95
        },
        {
                title: 'Chemistry End Sem 2023',
                category: 'intermediate',
                course: 'MPC',
                year: 1,
                semester: 2,
                subject: 'Chemistry',
                examType: 'final',
                examYear: 2023,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_chem_1',
                fileSize: 1600000,
                isApproved: true,
                views: 220,
                downloadCount: 78
        },
        {
                title: 'Mathematics Mid-2 2024',
                category: 'intermediate',
                course: 'MPC',
                year: 2,
                semester: 1,
                subject: 'Mathematics',
                examType: 'midterm',
                examYear: 2024,
                fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                filePublicId: 'papervault/sample_math_puc_1',
                fileSize: 1900000,
                isApproved: true,
                views: 310,
                downloadCount: 125
        }
];

async function seedPapers() {
        try {
                console.log('🔄 Connecting to database...');
                await sequelize.authenticate();
                console.log('✅ Connected to database');

                console.log('🔄 Syncing models...');
                await sequelize.sync();
                console.log('✅ Models synced');

                // Find admin user to assign as uploader
                const admin = await User.findOne({ where: { role: 'admin' } });

                if (!admin) {
                        console.error('❌ No admin user found. Run createAdmin.js first.');
                        process.exit(1);
                }

                console.log('🔄 Creating sample papers...');

                let created = 0;
                for (const paperData of samplePapers) {
                        // Check if paper already exists
                        const existing = await Paper.findOne({
                                where: {
                                        title: paperData.title,
                                        examYear: paperData.examYear
                                }
                        });

                        if (!existing) {
                                await Paper.create({
                                        ...paperData,
                                        uploadedById: admin.id
                                });
                                created++;
                                console.log(`  ✅ Created: ${paperData.title}`);
                        } else {
                                console.log(`  ℹ️ Skipped (exists): ${paperData.title}`);
                        }
                }

                console.log(`\n✅ Sample papers created: ${created}/${samplePapers.length}`);
                console.log('📝 Total papers in database:', await Paper.count());

                process.exit(0);
        } catch (err) {
                console.error('❌ Error:', err.message);
                console.error(err.stack);
                process.exit(1);
        }
}

seedPapers();
