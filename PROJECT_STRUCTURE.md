# 📁 PaperVault - Project Structure

> RGUKT Question Paper Repository Platform  
> Built for PUC 1, PUC 2 & Engineering students across all RGUKT campuses

---

## 🏗️ Project Overview

```
papervault-project/
│
├── frontend/                    # Frontend Application (HTML/CSS/JS)
│   ├── index.html              # Landing page
│   ├── login.html              # Login/Signup page
│   ├── question-papers-dashboard.html  # Main dashboard (post-login)
│   ├── papers.html             # Papers listing page
│   ├── paper-detail.html       # Individual paper details
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── register.html           # Registration page
│   ├── forgot-password.html    # Password recovery
│   │
│   ├── admin/                  # Admin Panel
│   │   ├── dashboard.html      # Admin dashboard
│   │   ├── papers.html         # Manage papers
│   │   └── upload.html         # Upload papers
│   │
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   │
│   └── js/                     # JavaScript modules
│       ├── api.js              # API service layer
│       ├── auth.js             # Authentication utilities
│       ├── config.js           # Configuration
│       ├── home.js             # Landing page logic
│       ├── login.js            # Login page logic
│       ├── register.js         # Registration logic
│       ├── papers.js           # Papers listing logic
│       ├── paper-detail.js     # Paper details logic
│       ├── contact.js          # Contact form logic
│       ├── forgot-password.js  # Password recovery logic
│       │
│       └── admin/              # Admin JS modules
│           ├── dashboard.js    # Admin dashboard logic
│           ├── papers.js       # Manage papers logic
│           └── upload.js       # Upload papers logic
│
├── server/                     # Backend Application (Node.js/Express)
│   ├── server.js               # Main server entry point
│   ├── package.json            # Node.js dependencies
│   ├── .env.example            # Environment variables template
│   │
│   ├── config/                 # Configuration files
│   │   ├── db.js               # Database connection
│   │   └── cloudinary.js       # Cloudinary setup (file storage)
│   │
│   ├── models/                 # Database models (Sequelize)
│   │   ├── User.js             # User model
│   │   ├── Paper.js            # Question paper model
│   │   ├── Bookmark.js         # Bookmark model
│   │   ├── DownloadHistory.js  # Download tracking
│   │   ├── Review.js           # Paper reviews
│   │   └── associations.js     # Model relationships
│   │
│   ├── controllers/            # Business logic
│   │   ├── authController.js   # Authentication controller
│   │   └── paperController.js  # Papers CRUD controller
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Auth routes
│   │   ├── papers.js           # Papers routes
│   │   ├── upload.js           # Upload routes
│   │   ├── users.js            # User routes
│   │   └── admin.js            # Admin routes
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── upload.js           # File upload (Multer)
│   │
│   └── utils/                  # Utility functions
│       └── sendEmail.js        # Email service
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🎯 Key Features

### For Students
- ✅ Browse question papers by **PUC 1**, **PUC 2**, and **Engineering** (all branches)
- ✅ Filter by campus (RK Valley, Nuzvid, Ongole, Srikakulam)
- ✅ Filter by exam type (Mid-1, Mid-2, End Sem, Supply)
- ✅ Filter by academic year
- ✅ Bookmark favorite papers
- ✅ Download history tracking
- ✅ Search functionality

### For Admins
- ✅ Upload new question papers
- ✅ Manage existing papers
- ✅ User management
- ✅ Analytics dashboard

---

## 🏫 RGUKT Context

### Supported Categories
- **PUC 1** (Pre-University Course - Year 1)
- **PUC 2** (Pre-University Course - Year 2)
- **Engineering** - All branches:
  - CSE (Computer Science & Engineering)
  - ECE (Electronics & Communication Engineering)
  - EEE (Electrical & Electronics Engineering)
  - ME (Mechanical Engineering)
  - CE (Civil Engineering)
  - CHE (Chemical Engineering)
  - MME (Metallurgical & Materials Engineering)

### Supported Campuses
- RGUKT RK Valley (Idupulapaya)
- RGUKT Nuzvid
- RGUKT Ongole
- RGUKT Srikakulam

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables
- **JavaScript (ES6+)** - Modern vanilla JS
- **Bootstrap 5.3.2** - UI framework
- **Bootstrap Icons 1.11.1** - Icon library
- **Anime.js 3.2.1** - Animations
- **Google Fonts** - Inter, Poppins, Syne, DM Sans

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize ORM** - Database ORM
- **PostgreSQL/MySQL** - Database (configurable)
- **Cloudinary** - File storage & CDN
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service

---

## 🔗 Page Flow

```
Landing Page (index.html)
    ↓
Login/Signup (login.html)
    ↓
├─→ Regular User → Question Papers Dashboard (question-papers-dashboard.html)
│                      ↓
│                  Browse Papers → Download/Bookmark
│
└─→ Admin User → Admin Dashboard (admin/dashboard.html)
                     ↓
                 Manage Papers / Upload / Analytics
```

---

## 📝 Additional Documentation

- [FRONTEND_STATUS.md](FRONTEND_STATUS.md) - Frontend implementation details
- [BACKEND_STATUS.md](BACKEND_STATUS.md) - Backend API documentation
- [README.md](README.md) - Setup and installation guide

---

**Last Updated:** February 27, 2026  
**Version:** 1.0.0  
**License:** MIT
