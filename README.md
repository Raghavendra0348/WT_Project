# 📚 PaperVault - RGUKT Question Paper Repository

A full-stack web application for managing and accessing question papers for RGUKT students (PUC 1, PUC 2 & Engineering) across all campuses.

## 🚀 Features

### For Students
- 📄 Browse and download question papers
- 🔍 Advanced search and filtering by course, campus, exam type, and year
- 👤 User authentication and profiles
- 🔖 Bookmark favorite papers
- 📊 Download history tracking
- ⭐ Rate and review papers
- 📱 Fully responsive design

### For Admins
- 🎯 Admin dashboard for managing papers
- 📤 Upload new question papers
- 👥 User management
- 📊 Platform statistics

### Campus Support
- RK Valley
- Nuzvid
- Ongole
- Srikakulam
- Basar

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive Design

**Backend:**
- Node.js
- Express.js
- Sequelize ORM
- MySQL Database
- JWT Authentication
- Multer for file uploads
- Cloudinary for file storage
- Nodemailer for emails

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/papervault.git
cd papervault
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=papervault

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FROM_NAME=PaperVault

# Client URL
CLIENT_URL=http://localhost:3000
```

### 4. Set up MySQL Database

```sql
CREATE DATABASE papervault;
```

The tables will be automatically created by Sequelize when the server starts.

### 5. Set up Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your server `.env` file

### 6. Set up Email (Gmail example)

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password
3. Use this password in `EMAIL_PASSWORD` in `.env`

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Serve Frontend:**
You can use any static file server (e.g., Live Server extension in VS Code) to serve the frontend folder.

```bash
# Using Python's built-in server
cd frontend
python -m http.server 3000

# Or using Node.js http-server
npx http-server frontend -p 3000
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
cd server
npm start
```

## 📁 Project Structure

```
papervault/
├── frontend/                    # Frontend Application (HTML/CSS/JS)
│   ├── index.html              # Landing page
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── forgot-password.html    # Password recovery
│   ├── question-papers-dashboard.html  # Main dashboard
│   ├── browse-papers.html      # Papers listing
│   ├── advanced-search.html    # Advanced search
│   ├── bookmarks.html          # User bookmarks
│   ├── my-downloads.html       # Download history
│   ├── my-profile.html         # User profile
│   ├── view-history.html       # View history
│   ├── settings.html           # User settings
│   ├── upload-paper.html       # Upload papers
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
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
│   │
│   ├── config/                 # Configuration files
│   │   ├── db.js               # MySQL/Sequelize connection
│   │   └── cloudinary.js       # Cloudinary setup
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
├── BACKEND_STATUS.md           # Backend development status
├── FRONTEND_STATUS.md          # Frontend development status
├── PROJECT_STRUCTURE.md        # Detailed project structure
└── README.md                   # Project documentation
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:token` - Reset password

### Papers
- `GET /api/papers` - Get all papers (with filters)
- `GET /api/papers/:id` - Get single paper
- `POST /api/papers` - Create paper (Admin)
- `PUT /api/papers/:id` - Update paper (Admin)
- `DELETE /api/papers/:id` - Delete paper (Admin)
- `GET /api/papers/:id/download` - Download paper

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/bookmarks` - Get bookmarks
- `POST /api/users/bookmarks/:paperId` - Add bookmark
- `DELETE /api/users/bookmarks/:paperId` - Remove bookmark
- `GET /api/users/downloads` - Get download history

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Default Admin Account

After setting up, create an admin user by updating a user's role in the database:

```sql
UPDATE Users SET role = 'admin' WHERE email = 'admin@example.com';
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- File type validation
- Request validation with express-validator
- Security headers (Helmet)
- CORS configuration
- Request compression

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

**MySQL Connection Error:**
- Ensure MySQL is running
- Check database credentials in .env file
- Verify the database exists

**Port Already in Use:**
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in .env file

**File Upload Issues:**
- Check Cloudinary credentials
- Ensure uploads/ directory exists
- Check file size limits (default 10MB)

**Sequelize Errors:**
- Run `npm install` to ensure all dependencies are installed
- Check model associations in `models/associations.js`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

RGUKT Students

## 🙏 Acknowledgments

- Express.js Documentation
- Sequelize Documentation
- MySQL Documentation
- Cloudinary
- All contributors

---

**Happy Coding! 🚀**
