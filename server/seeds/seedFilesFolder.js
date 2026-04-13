/**
 * seedFilesFolder.js
 * ------------------
 * Reads every PDF in server/files/, parses the filename to extract
 * branch (course), year, semester and exam-type, copies the file to
 * frontend/papers/uploads/, then creates a Paper row in the database.
 *
 * Naming patterns handled:
 *   cse1-2_mid1.pdf        →  CSE  year=1 sem=2  mid1
 *   cse1-2_mid2.pdf        →  CSE  year=1 sem=2  mid2
 *   cse1-2_mid3.pdf        →  CSE  year=1 sem=2  mid3
 *   cse1-1_sem.pdf         →  CSE  year=1 sem=1  final
 *   cse4-1_mid.pdf         →  CSE  year=4 sem=1  midterm
 *   civil 2-1 mid1.pdf     →  Civil  year=2 sem=1  mid1
 *   civil 2-2sem.pdf       →  Civil  year=2 sem=2  final
 *
 * Run:
 *   cd server && node seeds/seedFilesFolder.js
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');
const User = require('../models/User');
const Paper = require('../models/Paper');

// ------------------------------------------------------------------
// 1.  File-name parser
// ------------------------------------------------------------------

/**
 * Extracts metadata from a PDF filename.
 * Returns null if the filename cannot be parsed.
 */
function parseFilename(filename) {
  // Remove extension and normalise separators / spaces / underscores
  const base = filename.replace(/\.pdf$/i, '').toLowerCase();

  // ---- course -------------------------------------------------------
  // Supported prefixes: cse, civil, ece, mech, eee, it, …
  const courseMatch = base.match(/^([a-z]+)/);
  if (!courseMatch) return null;
  const course = courseMatch[1].toUpperCase();

  // Remove the course prefix and trim remaining separators
  const rest = base.slice(courseMatch[1].length).replace(/^[\s_-]+/, '');

  // ---- year-semester  (formats: "1-2", "2-1", "4-1") ---------------
  const yearSemMatch = rest.match(/^(\d)-(\d)/);
  if (!yearSemMatch) return null;
  const year = parseInt(yearSemMatch[1], 10);
  const semester = parseInt(yearSemMatch[2], 10);

  // ---- exam type  (everything after "year-sem" + separator) ---------
  const afterYearSem = rest.slice(yearSemMatch[0].length).replace(/^[\s_-]+/, '');

  let examType;
  if (/^mid3/.test(afterYearSem)) {
    examType = 'mid3';
  } else if (/^mid2/.test(afterYearSem)) {
    examType = 'mid2';
  } else if (/^mid1/.test(afterYearSem)) {
    examType = 'mid1';
  } else if (/^mid/.test(afterYearSem)) {
    // generic "mid" → midterm
    examType = 'midterm';
  } else if (/^sem/.test(afterYearSem)) {
    examType = 'final';
  } else {
    // Default to final if unrecognised
    examType = 'final';
  }

  return { course, year, semester, examType };
}

/**
 * Build a human-readable title from parsed metadata.
 */
function buildTitle(course, year, semester, examType) {
  const examLabel = {
    mid1: 'Mid-1',
    mid2: 'Mid-2',
    mid3: 'Mid-3',
    midterm: 'Midterm',
    final: 'Final Sem',
  }[examType] || examType;

  return `${course} Year-${year} Sem-${semester} ${examLabel}`;
}

// ------------------------------------------------------------------
// 2.  Main seed function
// ------------------------------------------------------------------

async function seedFilesFolder() {
  try {
    console.log('🔌 Connecting to database…');
    await sequelize.authenticate();
    console.log('✅ Connected\n');

    // Sync models (without altering existing tables)
    await sequelize.sync();

    // Need an admin user as the uploader
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.error('❌  No admin user found. Run: node seeds/createAdmin.js  first.');
      process.exit(1);
    }

    const filesDir = path.join(__dirname, '../files');
    const uploadDir = path.join(__dirname, '../../frontend/papers/uploads');

    // Ensure upload destination exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁  Created upload directory: ${uploadDir}`);
    }

    const files = fs.readdirSync(filesDir).filter(f => /\.pdf$/i.test(f));
    console.log(`📂  Found ${files.length} PDF(s) in server/files/\n`);

    let created = 0;
    let skipped = 0;
    let failed  = 0;

    for (const filename of files) {
      const meta = parseFilename(filename);

      if (!meta) {
        console.warn(`⚠️   Could not parse: "${filename}" — skipping`);
        failed++;
        continue;
      }

      const { course, year, semester, examType } = meta;
      const title = buildTitle(course, year, semester, examType);

      // Copy file to uploads dir with a safe name
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const destName = `files-${safeName}`;
      const srcPath  = path.join(filesDir, filename);
      const destPath = path.join(uploadDir, destName);
      const fileUrl  = `papers/uploads/${destName}`;   // relative URL stored in DB
      const fileSize = fs.statSync(srcPath).size;

      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }

      // Check if this exact paper is already in the database
      const existing = await Paper.findOne({ where: { fileUrl } });

      if (existing) {
        console.log(`  ℹ️   Already exists: ${title}`);
        skipped++;
        continue;
      }

      await Paper.create({
        title,
        category: 'engineering',
        course,
        year,
        semester,
        subject: course,               // you can refine this later
        examType,
        examYear: new Date().getFullYear(),
        fileUrl,
        filePublicId: `local-files-${safeName}`,
        fileSize,
        status: 'approved',
        uploadedById: admin.id,
      });

      console.log(`  ✅  Inserted: ${title}  (${examType}, Y${year}S${semester})`);
      created++;
    }

    console.log('\n─────────────────────────────────');
    console.log(`✅  Created : ${created}`);
    console.log(`ℹ️   Skipped : ${skipped}`);
    console.log(`⚠️   Failed  : ${failed}`);
    console.log(`📝  Total papers in DB: ${await Paper.count()}`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Fatal error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seedFilesFolder();
