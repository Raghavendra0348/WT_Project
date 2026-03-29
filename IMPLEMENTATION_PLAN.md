# 📋 PaperVault - Complete Implementation Plan

> **Project:** RGUKT Question Paper Repository  
> **Date:** March 9, 2026  
> **Status:** In Development

---

## 📊 Current Project Status

| Component | Status | Completion |

|-----------|--------|------------|
| Frontend Pages | ✅ Complete | 100% |
| Backend Structure | ✅ Complete | 100% |
| Database Models | ✅ Complete | 100% |
| API Routes Setup | ✅ Complete | 100% |
| Database Connection | ⏳ Needs Setup | 0% |
| Cloud Storage | ⏳ Needs Setup | 0% |
| Email Service | ⏳ Needs Setup | 0% |
| Testing | ⏳ Not Started | 0% |
| Deployment | ⏳ Not Started | 0% |

---

## 🎯 Implementation Phases

---

## Phase 1: Database Setup (Day 1)

### Step 1.1: Install MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### Step 1.2: Create Database
```bash
# Login to MySQL
sudo mysql -u root -p

# Run these commands in MySQL shell:
```

```sql
-- Create Database
CREATE DATABASE papervault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create User (optional, recommended for production)
CREATE USER 'papervault_user'@'localhost' IDENTIFIED BY 'your_strong_password';

-- Grant Privileges
GRANT ALL PRIVILEGES ON papervault.* TO 'papervault_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
USE papervault;
```

### Step 1.3: Create Environment File
Create `.env` file in `/server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=papervault
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=papervault_super_secret_key_2026_change_in_production
JWT_EXPIRE=30d

# Cloudinary Configuration (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FROM_NAME=PaperVault
FROM_EMAIL=noreply@papervault.com
```

### Step 1.4: Test Database Connection
```bash
cd server
npm install
npm run dev
```

**Expected Output:**
```
✅ MySQL Connected: localhost
✅ Database synchronized
🚀 Server running in development mode on port 5000
```

---

## Phase 2: Cloudinary Setup (Day 1-2)

### Step 2.1: Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for free account
3. Navigate to Dashboard
4. Copy: Cloud Name, API Key, API Secret

### Step 2.2: Update `.env` with Cloudinary Credentials
```env
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2.3: Verify Cloudinary Config
Check `server/config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

---

## Phase 3: Email Service Setup (Day 2)

### Step 3.1: Gmail App Password Setup
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Select "Mail" and "Other (Custom name)"
5. Enter "PaperVault"
6. Copy the 16-character password

### Step 3.2: Update `.env`
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # 16-char app password
```

### Step 3.3: Test Email (Create Test Route)
Add to `server/routes/auth.js`:
```javascript
// Test email route (remove in production)
router.get('/test-email', async (req, res) => {
  const sendEmail = require('../utils/sendEmail');
  try {
    await sendEmail({
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'Email service is working!'
    });
    res.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

---

## Phase 4: API Testing & Verification (Day 2-3)

### Step 4.1: Install Testing Tools
- **Postman** (Recommended): https://www.postman.com/downloads/
- Or **Thunder Client** VS Code Extension

### Step 4.2: Test API Endpoints

#### Health Check
```
GET http://localhost:5000/api/health
```

#### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "course": "engineering",
  "year": 2,
  "semester": 1
}
```

#### Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Get Papers (with Token)
```
GET http://localhost:5000/api/papers
Authorization: Bearer <your_jwt_token>
```

### Step 4.3: API Endpoints Checklist

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Register new user | ⏳ Test |
| `/api/auth/login` | POST | Login user | ⏳ Test |
| `/api/auth/me` | GET | Get current user | ⏳ Test |
| `/api/auth/forgotpassword` | POST | Request password reset | ⏳ Test |
| `/api/auth/resetpassword/:token` | PUT | Reset password | ⏳ Test |
| `/api/papers` | GET | Get all papers | ⏳ Test |
| `/api/papers/:id` | GET | Get single paper | ⏳ Test |
| `/api/papers/:id/download` | GET | Download paper | ⏳ Test |
| `/api/papers/:id/bookmark` | POST | Toggle bookmark | ⏳ Test |
| `/api/papers/:id/reviews` | GET | Get paper reviews | ⏳ Test |
| `/api/papers/:id/reviews` | POST | Add review | ⏳ Test |
| `/api/upload` | POST | Upload paper | ⏳ Test |
| `/api/users/bookmarks` | GET | Get user bookmarks | ⏳ Test |
| `/api/users/downloads` | GET | Get download history | ⏳ Test |
| `/api/users/profile` | PUT | Update profile | ⏳ Test |
| `/api/admin/stats` | GET | Admin statistics | ⏳ Test |
| `/api/admin/papers` | GET | Admin papers list | ⏳ Test |
| `/api/admin/papers/:id/approve` | PUT | Approve paper | ⏳ Test |
| `/api/admin/papers/:id` | DELETE | Delete paper | ⏳ Test |
| `/api/admin/users` | GET | Get all users | ⏳ Test |

---

## Phase 5: Frontend-Backend Integration (Day 3-4)

### Step 5.1: Update API URL
In `frontend/js/config.js`, ensure:
```javascript
API_URL: 'http://localhost:5000/api'
```

### Step 5.2: Serve Frontend
**Option A: Simple HTTP Server**
```bash
# Install serve globally
npm install -g serve

# Serve frontend folder
cd frontend
serve -l 3000
```

**Option B: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Step 5.3: Enable CORS
Update `server/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
}));
```

### Step 5.4: Integration Testing Checklist

| Feature | Page | Status |
|---------|------|--------|
| User Registration | `register.html` | ⏳ Test |
| User Login | `login.html` | ⏳ Test |
| View Papers | `question-papers-dashboard.html` | ⏳ Test |
| Search Papers | `advanced-search.html` | ⏳ Test |
| Download Paper | Dashboard | ⏳ Test |
| Bookmark Paper | Dashboard | ⏳ Test |
| Upload Paper | `upload-paper.html` | ⏳ Test |
| View Profile | `my-profile.html` | ⏳ Test |
| View Bookmarks | `bookmarks.html` | ⏳ Test |
| View Downloads | `my-downloads.html` | ⏳ Test |
| Admin Dashboard | `admin/dashboard.html` | ⏳ Test |
| Admin Papers | `admin/papers.html` | ⏳ Test |
| Admin Upload | `admin/upload.html` | ⏳ Test |

---

## Phase 6: Seed Data & Testing (Day 4)

### Step 6.1: Create Admin User
Create `server/seeds/createAdmin.js`:

```javascript
require('dotenv').config();
const { sequelize } = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@papervault.com',
      password: 'admin123',
      role: 'admin',
      course: 'engineering',
      year: 4,
      semester: 2
    });

    console.log('✅ Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
```

Run: `node seeds/createAdmin.js`

### Step 6.2: Create Sample Papers
Create `server/seeds/samplePapers.js`:

```javascript
require('dotenv').config();
const { sequelize } = require('../config/db');
const Paper = require('../models/Paper');
const User = require('../models/User');

const samplePapers = [
  {
    title: 'Mathematics-IIA Mid-1 2024',
    category: 'engineering',
    course: 'CSE',
    year: 2,
    semester: 1,
    subject: 'Mathematics-IIA',
    examType: 'midterm',
    examYear: 2024,
    fileUrl: 'https://example.com/sample.pdf',
    filePublicId: 'sample_1',
    fileSize: 1024000,
    isApproved: true
  },
  {
    title: 'Physics Mid-2 2024',
    category: 'intermediate',
    course: 'MPC',
    year: 1,
    semester: 1,
    subject: 'Physics',
    examType: 'midterm',
    examYear: 2024,
    fileUrl: 'https://example.com/sample2.pdf',
    filePublicId: 'sample_2',
    fileSize: 2048000,
    isApproved: true
  }
];

async function seedPapers() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const admin = await User.findOne({ where: { role: 'admin' } });
    
    for (const paper of samplePapers) {
      await Paper.create({
        ...paper,
        uploadedById: admin.id
      });
    }

    console.log('✅ Sample papers created');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedPapers();
```

---

## Phase 7: Security Hardening (Day 5)

### Step 7.1: Security Checklist
- [ ] Rate limiting on auth routes
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Sequelize handles this)
- [ ] XSS prevention (Helmet.js configured)
- [ ] CORS properly configured
- [ ] JWT secret is strong and unique
- [ ] Passwords properly hashed (bcrypt)
- [ ] File upload validation
- [ ] Error messages don't leak sensitive info

### Step 7.2: Add Rate Limiting
```bash
npm install express-rate-limit
```

Update `server/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: { success: false, message: 'Too many requests, try again later' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

## Phase 8: Production Deployment (Day 6-7)

### Step 8.1: Deployment Options

| Platform | Type | Cost | Difficulty |
|----------|------|------|------------|
| **Render** | Backend + DB | Free tier | Easy |
| **Railway** | Full Stack | Free tier | Easy |
| **Vercel** | Frontend | Free | Very Easy |
| **Netlify** | Frontend | Free | Very Easy |
| **Heroku** | Backend | $7/mo | Medium |
| **DigitalOcean** | VPS | $5/mo | Advanced |
| **AWS** | Full | Pay-as-use | Advanced |

### Step 8.2: Recommended Setup (Free)

**Frontend: Netlify/Vercel**
1. Push frontend folder to GitHub
2. Connect to Netlify/Vercel
3. Deploy

**Backend: Render**
1. Push server folder to GitHub
2. Create Web Service on Render
3. Add environment variables
4. Deploy

**Database: PlanetScale or Railway MySQL**
1. Create free MySQL database
2. Get connection string
3. Update environment variables

### Step 8.3: Production Environment Variables
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.com

DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=papervault
DB_USER=your-db-user
DB_PASSWORD=your-db-password

JWT_SECRET=very_long_random_string_at_least_32_characters

CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
```

---

## 📝 Quick Start Commands

### Development Setup
```bash
# 1. Clone and navigate
cd WT_Project

# 2. Install server dependencies
cd server
npm install

# 3. Create .env file (see Phase 1.3)

# 4. Start MySQL and create database
sudo mysql -u root -p
# CREATE DATABASE papervault;

# 5. Start server
npm run dev

# 6. In another terminal, serve frontend
cd ../frontend
npx serve -l 3000

# 7. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

---

## 🔧 Troubleshooting

### Database Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Check DB_PASSWORD in .env matches your MySQL password

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Update CORS origin in server.js to match frontend URL

### JWT Error
```
JsonWebTokenError: invalid token
```
**Solution:** Clear localStorage and login again

### Cloudinary Error
```
Error: Invalid Cloudinary credentials
```
**Solution:** Verify CLOUDINARY_* values in .env

### Email Error
```
Error: Invalid login
```
**Solution:** Use Gmail App Password, not regular password

---

## 📅 Implementation Timeline

| Day | Tasks | Hours |
|-----|-------|-------|
| Day 1 | MySQL setup, Database creation, .env setup | 3-4 |
| Day 2 | Cloudinary setup, Email setup, Basic testing | 3-4 |
| Day 3 | API testing, Bug fixes | 4-5 |
| Day 4 | Frontend integration, Full flow testing | 4-5 |
| Day 5 | Security hardening, Performance optimization | 3-4 |
| Day 6 | Deployment setup, Environment config | 3-4 |
| Day 7 | Final testing, Documentation | 2-3 |

**Total Estimated Time: 22-29 hours**

---

## ✅ Final Checklist

### Before Going Live
- [ ] All API endpoints working
- [ ] User registration & login functional
- [ ] Paper upload & download working
- [ ] Admin features working
- [ ] Email notifications working
- [ ] Mobile responsive verified
- [ ] Security measures in place
- [ ] Environment variables secured
- [ ] Database backed up
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] Documentation complete

---

## 📞 Support Resources

- **Sequelize Docs:** https://sequelize.org/docs/v6/
- **Express Docs:** https://expressjs.com/
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **MySQL Docs:** https://dev.mysql.com/doc/
- **JWT Docs:** https://jwt.io/introduction

---

**Good luck with your project! 🚀**
