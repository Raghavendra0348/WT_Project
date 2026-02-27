# ⚙️ Backend - Implementation Status

> PaperVault Backend API Documentation  
> Node.js + Express + Sequelize ORM

---

## 📊 Overall Status: 🚧 IN PROGRESS

Core structure is in place. Database models and controllers need completion.

---

## 🗄️ Database Models

### ✅ User Model - `models/User.js`
**Status:** Needs Implementation  
**Purpose:** Store user accounts (students & admins)

#### Expected Schema
```javascript
{
  id: UUID (Primary Key)
  name: STRING (required)
  email: STRING (unique, required)
  password: STRING (hashed, required)
  role: ENUM('student', 'admin') (default: 'student')
  branch: STRING (CSE, ECE, EEE, ME, CE, CHE, MME, PUC1, PUC2)
  year: STRING (1st, 2nd, 3rd, 4th, PUC-1, PUC-2)
  campus: STRING (RK Valley, Nuzvid, Ongole, Srikakulam, Basar)
  avatar: STRING (URL, optional)
  isVerified: BOOLEAN (default: false)
  resetToken: STRING (nullable)
  resetTokenExpiry: DATE (nullable)
  createdAt: DATE
  updatedAt: DATE
}
```

#### Relationships
- **User** `hasMany` **Bookmark**
- **User** `hasMany` **DownloadHistory**
- **User** `hasMany` **Review**

---

### ✅ Paper Model - `models/Paper.js`
**Status:** Needs Implementation  
**Purpose:** Store question paper metadata

#### Expected Schema
```javascript
{
  id: UUID (Primary Key)
  title: STRING (required) // e.g., "Mathematics-IIA Mid-1 2024"
  subject: STRING (required)
  branch: STRING (required) // CSE, ECE, EEE, ME, CE, CHE, MME, PUC1, PUC2
  year: STRING (required) // 1st, 2nd, 3rd, 4th, PUC-1, PUC-2
  examType: ENUM('Mid-1', 'Mid-2', 'End Sem', 'Supply') (required)
  academicYear: STRING (required) // "2024-25"
  campus: STRING (required)
  semester: STRING (optional) // I, II
  fileUrl: STRING (required) // Cloudinary URL
  fileType: STRING (default: 'pdf')
  fileSize: INTEGER // in bytes
  thumbnailUrl: STRING (optional)
  views: INTEGER (default: 0)
  downloads: INTEGER (default: 0)
  uploadedBy: UUID (Foreign Key → User)
  isApproved: BOOLEAN (default: false)
  tags: JSON (optional) // ['calculus', 'algebra']
  createdAt: DATE
  updatedAt: DATE
}
```

#### Relationships
- **Paper** `belongsTo` **User** (uploadedBy)
- **Paper** `hasMany` **Bookmark**
- **Paper** `hasMany` **DownloadHistory**
- **Paper** `hasMany` **Review**

---

### ✅ Bookmark Model - `models/Bookmark.js`
**Status:** Needs Implementation  
**Purpose:** Track user-saved papers

#### Expected Schema
```javascript
{
  id: UUID (Primary Key)
  userId: UUID (Foreign Key → User)
  paperId: UUID (Foreign Key → Paper)
  createdAt: DATE
}
```

#### Relationships
- **Bookmark** `belongsTo` **User**
- **Bookmark** `belongsTo` **Paper**

---

### ✅ DownloadHistory Model - `models/DownloadHistory.js`
**Status:** Needs Implementation  
**Purpose:** Track paper downloads

#### Expected Schema
```javascript
{
  id: UUID (Primary Key)
  userId: UUID (Foreign Key → User)
  paperId: UUID (Foreign Key → Paper)
  downloadedAt: DATE (default: NOW)
}
```

#### Relationships
- **DownloadHistory** `belongsTo` **User**
- **DownloadHistory** `belongsTo` **Paper**

---

### ✅ Review Model - `models/Review.js`
**Status:** Needs Implementation  
**Purpose:** Store paper reviews/ratings

#### Expected Schema
```javascript
{
  id: UUID (Primary Key)
  userId: UUID (Foreign Key → User)
  paperId: UUID (Foreign Key → Paper)
  rating: INTEGER (1-5, required)
  comment: TEXT (optional)
  createdAt: DATE
  updatedAt: DATE
}
```

#### Relationships
- **Review** `belongsTo` **User**
- **Review** `belongsTo` **Paper**

---

### ✅ Associations - `models/associations.js`
**Status:** Needs Implementation  
**Purpose:** Define all Sequelize model relationships

```javascript
// Example structure
User.hasMany(Bookmark, { foreignKey: 'userId' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(DownloadHistory, { foreignKey: 'userId' });
DownloadHistory.belongsTo(User, { foreignKey: 'userId' });

Paper.hasMany(Bookmark, { foreignKey: 'paperId' });
Bookmark.belongsTo(Paper, { foreignKey: 'paperId' });

// ... etc.
```

---

## 🛣️ API Routes

### Authentication Routes - `routes/auth.js`
**Base:** `/api/auth`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/register` | Create new user account | 🚧 TODO |
| POST | `/login` | Authenticate user, return JWT | 🚧 TODO |
| POST | `/logout` | Invalidate token (if using refresh tokens) | 🚧 TODO |
| POST | `/forgot-password` | Send password reset email | 🚧 TODO |
| POST | `/reset-password/:token` | Reset password with token | 🚧 TODO |
| GET | `/verify/:token` | Verify email address | 🚧 TODO |
| GET | `/me` | Get current logged-in user | 🚧 TODO |

---

### Papers Routes - `routes/papers.js`
**Base:** `/api/papers`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/` | Get all papers (with filters) | 🚧 TODO |
| GET | `/:id` | Get single paper details | 🚧 TODO |
| POST | `/` | Upload new paper (auth required) | 🚧 TODO |
| PUT | `/:id` | Update paper (admin/owner only) | 🚧 TODO |
| DELETE | `/:id` | Delete paper (admin/owner only) | 🚧 TODO |
| GET | `/category/:category` | Get papers by category (PUC1, PUC2, ENGG) | 🚧 TODO |
| GET | `/branch/:branch` | Get papers by branch (CSE, ECE, etc.) | 🚧 TODO |
| GET | `/search` | Search papers by query | 🚧 TODO |
| POST | `/:id/download` | Increment download count, log history | 🚧 TODO |
| POST | `/:id/view` | Increment view count | 🚧 TODO |

#### Query Filters (for GET `/`)
```
?category=puc1             // PUC1, PUC2, Engineering
?branch=CSE                // CSE, ECE, EEE, ME, CE, CHE, MME
?examType=Mid-1            // Mid-1, Mid-2, End Sem, Supply
?academicYear=2024-25      // 2024-25, 2023-24, etc.
?campus=RK Valley          // RK Valley, Nuzvid, Ongole, Srikakulam, Basar
?year=3rd                  // 1st, 2nd, 3rd, 4th, PUC-1, PUC-2
?subject=Mathematics       // Subject name
?page=1&limit=20           // Pagination
?sort=-downloads           // Sort by field (- for desc)
```

---

### Upload Routes - `routes/upload.js`
**Base:** `/api/upload`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/paper` | Upload paper file to Cloudinary | 🚧 TODO |
| POST | `/avatar` | Upload user avatar | 🚧 TODO |

---

### User Routes - `routes/users.js`
**Base:** `/api/users`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/profile` | Get user profile (auth required) | 🚧 TODO |
| PUT | `/profile` | Update user profile | 🚧 TODO |
| GET | `/bookmarks` | Get user's bookmarked papers | 🚧 TODO |
| POST | `/bookmarks/:paperId` | Add bookmark | 🚧 TODO |
| DELETE | `/bookmarks/:paperId` | Remove bookmark | 🚧 TODO |
| GET | `/downloads` | Get user's download history | 🚧 TODO |
| GET | `/reviews` | Get user's reviews | 🚧 TODO |
| POST | `/reviews/:paperId` | Add review | 🚧 TODO |
| PUT | `/reviews/:reviewId` | Update review | 🚧 TODO |
| DELETE | `/reviews/:reviewId` | Delete review | 🚧 TODO |

---

### Admin Routes - `routes/admin.js`
**Base:** `/api/admin`

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/dashboard` | Get admin dashboard stats | 🚧 TODO |
| GET | `/users` | Get all users | 🚧 TODO |
| PUT | `/users/:id/role` | Change user role | 🚧 TODO |
| DELETE | `/users/:id` | Delete user | 🚧 TODO |
| GET | `/papers/pending` | Get papers pending approval | 🚧 TODO |
| POST | `/papers/:id/approve` | Approve paper | 🚧 TODO |
| POST | `/papers/:id/reject` | Reject paper | 🚧 TODO |
| GET | `/analytics` | Get platform analytics | 🚧 TODO |

---

## 🎛️ Controllers

### Auth Controller - `controllers/authController.js`
**Status:** Needs Implementation

#### Expected Functions
```javascript
register(req, res)         // Create user, hash password, send verification email
login(req, res)            // Verify credentials, generate JWT
logout(req, res)           // Invalidate token (if using refresh tokens)
forgotPassword(req, res)   // Generate reset token, send email
resetPassword(req, res)    // Verify token, update password
verifyEmail(req, res)      // Mark user as verified
getCurrentUser(req, res)   // Return logged-in user data
```

---

### Paper Controller - `controllers/paperController.js`
**Status:** Needs Implementation

#### Expected Functions
```javascript
getAllPapers(req, res)           // Get papers with filters/pagination
getPaperById(req, res)           // Get single paper
createPaper(req, res)            // Upload new paper
updatePaper(req, res)            // Update paper metadata
deletePaper(req, res)            // Delete paper
getPapersByCategory(req, res)   // Get PUC1/PUC2/ENGG papers
getPapersByBranch(req, res)     // Get CSE/ECE/etc. papers
searchPapers(req, res)           // Search by query
incrementDownload(req, res)      // Log download
incrementView(req, res)          // Log view
```

---

## 🔒 Middleware

### Auth Middleware - `middleware/auth.js`
**Status:** Needs Implementation

#### Expected Functions
```javascript
authenticate(req, res, next)    // Verify JWT, attach user to req
isAdmin(req, res, next)         // Check if user is admin
isOwnerOrAdmin(req, res, next)  // Check if user owns resource or is admin
```

#### Usage Example
```javascript
router.get('/profile', authenticate, getUserProfile);
router.delete('/papers/:id', authenticate, isOwnerOrAdmin, deletePaper);
router.get('/admin/users', authenticate, isAdmin, getAllUsers);
```

---

### Upload Middleware - `middleware/upload.js`
**Status:** Needs Implementation

#### Expected Configuration
```javascript
// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

module.exports = upload;
```

---

### Error Handler - `middleware/errorHandler.js`
**Status:** Needs Implementation

#### Expected Structure
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
```

---

## ⚙️ Configuration

### Database Config - `config/db.js`
**Status:** Needs Implementation

#### Expected Structure
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // or 'mysql'
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

---

### Cloudinary Config - `config/cloudinary.js`
**Status:** Needs Implementation

#### Expected Structure
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

## 🛠️ Utilities

### Email Service - `utils/sendEmail.js`
**Status:** Needs Implementation

#### Expected Structure
```javascript
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
```

#### Use Cases
- Account verification emails
- Password reset emails
- Welcome emails
- Admin notifications

---

## 📦 Dependencies

### Required npm Packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.3",              // PostgreSQL (or mysql2 for MySQL)
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "nodemailer": "^6.9.7",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",           // Security headers
    "express-rate-limit": "^7.1.5" // Rate limiting
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🌍 Environment Variables

### `.env.example`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=papervault
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=PaperVault <noreply@papervault.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@rgukt.edu
```

---

## 🚀 Server Entry Point - `server.js`

### Expected Structure
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Error handler
app.use(errorHandler);

// Database connection & server start
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync({ alter: true }); // Dev only
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });
```

---

## 🧪 Testing Strategy

### Unit Tests (TODO)
- Model validations
- Controller functions
- Middleware logic

### Integration Tests (TODO)
- API endpoints
- Authentication flow
- File uploads

### Tools
- Jest
- Supertest
- Postman/Insomnia for manual testing

---

## 🔐 Security Considerations

### Implemented
- [ ] Password hashing with bcrypt
- [ ] JWT authentication
- [ ] CORS configuration
- [ ] Helmet.js security headers
- [ ] Rate limiting
- [ ] Input validation (express-validator)
- [ ] SQL injection protection (Sequelize ORM)
- [ ] File upload validation

### Best Practices
- Store sensitive data in `.env` (never commit)
- Use HTTPS in production
- Implement refresh tokens for better security
- Sanitize user inputs
- Set proper file size limits
- Validate file types before upload

---

## 📈 Next Steps (Development Roadmap)

### Phase 1: Core Setup ✅
- [x] Project structure created
- [x] Models defined
- [x] Routes defined
- [x] Middleware scaffolded

### Phase 2: Implementation 🚧
- [ ] Implement database models
- [ ] Implement auth controller & routes
- [ ] Implement paper controller & routes
- [ ] Implement file upload with Cloudinary
- [ ] Implement middleware (auth, upload, error handling)
- [ ] Set up email service

### Phase 3: Testing 🚧
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Manual API testing with Postman

### Phase 4: Integration 🚧
- [ ] Connect frontend to backend API
- [ ] Update frontend JS to use real endpoints
- [ ] Replace mock data with API calls

### Phase 5: Deployment 🚧
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Deploy to cloud (Heroku, AWS, DigitalOcean, etc.)
- [ ] Set up CI/CD pipeline

---

## 🐛 Known Issues

### Database
- Models not yet implemented
- Associations not configured
- Migrations not set up

### Controllers
- No business logic implemented
- No validation implemented

### Authentication
- JWT middleware incomplete
- Password reset flow not implemented
- Email verification not implemented

---

## 📚 API Documentation (Postman Collection)

### TODO
- [ ] Create Postman collection
- [ ] Document all endpoints
- [ ] Add example requests/responses
- [ ] Export and include in repo

---

**Last Updated:** February 27, 2026  
**Status:** Structure Complete, Implementation Pending 🚧  
**Database:** PostgreSQL (recommended) or MySQL  
**Cloud Storage:** Cloudinary
