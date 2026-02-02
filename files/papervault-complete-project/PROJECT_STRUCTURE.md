# PaperVault - Complete MERN Stack Project Structure

## 📁 Project Root Structure

```
papervault/
│
├── client/                          # Frontend React Application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── components/             # Reusable Components
│   │   │   ├── common/            # Common components used across app
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   └── PrivateRoute.jsx
│   │   │   │
│   │   │   ├── auth/              # Authentication components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── home/              # Home page components
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── CategoryCard.jsx
│   │   │   │   ├── Stats.jsx
│   │   │   │   └── RecentPapers.jsx
│   │   │   │
│   │   │   ├── papers/            # Paper-related components
│   │   │   │   ├── PaperList.jsx
│   │   │   │   ├── PaperCard.jsx
│   │   │   │   ├── PaperDetail.jsx
│   │   │   │   ├── PaperFilters.jsx
│   │   │   │   ├── PdfViewer.jsx
│   │   │   │   └── RatingStars.jsx
│   │   │   │
│   │   │   ├── user/              # User dashboard components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Bookmarks.jsx
│   │   │   │   ├── DownloadHistory.jsx
│   │   │   │   └── Settings.jsx
│   │   │   │
│   │   │   └── admin/             # Admin panel components
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── UploadPaper.jsx
│   │   │       ├── ManagePapers.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── pages/                 # Page Components (Route Components)
│   │   │   ├── HomePage.jsx
│   │   │   ├── PapersPage.jsx
│   │   │   ├── PaperDetailPage.jsx
│   │   │   ├── UserDashboardPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── context/               # React Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── PaperContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── hooks/                 # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePapers.js
│   │   │   ├── useDebounce.js
│   │   │   └── useInfiniteScroll.js
│   │   │
│   │   ├── services/              # API Service Functions
│   │   │   ├── api.js             # Axios instance configuration
│   │   │   ├── authService.js
│   │   │   ├── paperService.js
│   │   │   ├── userService.js
│   │   │   └── uploadService.js
│   │   │
│   │   ├── utils/                 # Utility Functions
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   │
│   │   ├── styles/                # Global Styles
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── responsive.css
│   │   │
│   │   ├── assets/                # Static Assets
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── App.jsx                # Main App Component
│   │   ├── App.css                # App-level styles
│   │   ├── index.js               # Entry point
│   │   └── routes.js              # Route definitions
│   │
│   ├── .env.example               # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── server/                         # Backend Node.js/Express Application
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   └── config.js              # App configuration
│   │
│   ├── models/                    # Mongoose Models
│   │   ├── User.js
│   │   ├── Paper.js
│   │   ├── Category.js
│   │   ├── Review.js
│   │   └── Download.js
│   │
│   ├── controllers/               # Route Controllers
│   │   ├── authController.js
│   │   ├── paperController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── uploadController.js
│   │
│   ├── routes/                    # API Routes
│   │   ├── auth.js
│   │   ├── papers.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── upload.js
│   │
│   ├── middleware/                # Custom Middleware
│   │   ├── auth.js                # JWT authentication
│   │   ├── admin.js               # Admin authorization
│   │   ├── errorHandler.js        # Error handling
│   │   ├── upload.js              # File upload (Multer)
│   │   └── validators.js          # Request validation
│   │
│   ├── utils/                     # Utility Functions
│   │   ├── sendEmail.js
│   │   ├── generateToken.js
│   │   ├── cloudinaryUpload.js
│   │   └── helpers.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js                  # Express app setup
│   ├── package.json
│   └── README.md
│
├── uploads/                        # Temporary file uploads (gitignored)
│
├── .gitignore                     # Root gitignore
├── README.md                      # Project documentation
└── package.json                   # Root package.json (optional for scripts)
```

## 📝 File Descriptions

### **Frontend (client/)**

#### **Components Structure**

**common/** - Reusable UI components
- `Navbar.jsx` - Main navigation bar with logo, links, and user menu
- `Footer.jsx` - Footer with links and copyright
- `Loader.jsx` - Loading spinner component
- `SearchBar.jsx` - Search input with autocomplete
- `ErrorBoundary.jsx` - Error boundary wrapper
- `PrivateRoute.jsx` - Protected route wrapper for authenticated users

**auth/** - Authentication pages
- `Login.jsx` - Login form with validation
- `Register.jsx` - Registration form with course/year selection
- `ForgotPassword.jsx` - Password reset request form
- `ResetPassword.jsx` - New password form with token

**home/** - Landing page sections
- `Hero.jsx` - Hero section with search and stats
- `CategoryCard.jsx` - Category selection cards
- `Stats.jsx` - Statistics display (papers, users, downloads)
- `RecentPapers.jsx` - Recent papers grid

**papers/** - Paper browsing and viewing
- `PaperList.jsx` - Grid/List view of papers with pagination
- `PaperCard.jsx` - Individual paper card component
- `PaperDetail.jsx` - Full paper details with metadata
- `PaperFilters.jsx` - Filter sidebar (year, semester, subject)
- `PdfViewer.jsx` - PDF viewer component (react-pdf)
- `RatingStars.jsx` - Star rating component

**user/** - User dashboard features
- `Dashboard.jsx` - User dashboard overview
- `Profile.jsx` - User profile edit form
- `Bookmarks.jsx` - Bookmarked papers list
- `DownloadHistory.jsx` - Download history with dates
- `Settings.jsx` - User settings and preferences

**admin/** - Admin panel
- `AdminDashboard.jsx` - Admin statistics and overview
- `AdminSidebar.jsx` - Admin navigation sidebar
- `UploadPaper.jsx` - Paper upload form with validation
- `ManagePapers.jsx` - Table to edit/delete papers
- `ManageUsers.jsx` - User management table
- `Analytics.jsx` - Charts and analytics

#### **Context & State Management**
- `AuthContext.jsx` - Global auth state (user, login, logout)
- `PaperContext.jsx` - Papers data and filtering state
- `ThemeContext.jsx` - Theme switching (light/dark mode)

#### **Custom Hooks**
- `useAuth.js` - Authentication logic and state
- `usePapers.js` - Fetch and manage papers data
- `useDebounce.js` - Debounce search inputs
- `useInfiniteScroll.js` - Infinite scroll pagination

#### **Services (API Calls)**
- `api.js` - Axios configuration with interceptors
- `authService.js` - Login, register, logout APIs
- `paperService.js` - CRUD operations for papers
- `userService.js` - User profile and settings APIs
- `uploadService.js` - File upload to server

### **Backend (server/)**

#### **Models**
- `User.js` - User schema (name, email, password, role, course, year)
- `Paper.js` - Paper schema (title, category, year, semester, subject, fileUrl)
- `Category.js` - Category schema (name, subjects, years)
- `Review.js` - Review schema (rating, comment, userId, paperId)
- `Download.js` - Download tracking schema

#### **Controllers**
- `authController.js` - Register, login, logout, forgot password
- `paperController.js` - Get papers, filter, search, get by ID
- `userController.js` - Profile, bookmarks, download history
- `adminController.js` - Upload, edit, delete papers, manage users
- `uploadController.js` - Handle file uploads to Cloudinary

#### **Routes**
- `auth.js` - `/api/auth/*` routes
- `papers.js` - `/api/papers/*` routes
- `users.js` - `/api/users/*` routes
- `admin.js` - `/api/admin/*` routes (protected)
- `upload.js` - `/api/upload/*` routes

#### **Middleware**
- `auth.js` - Verify JWT token, attach user to request
- `admin.js` - Check if user has admin role
- `errorHandler.js` - Global error handling
- `upload.js` - Multer configuration for file uploads
- `validators.js` - Express-validator schemas

## 🚀 Getting Started Commands

### **Root Directory Setup**
```bash
mkdir papervault
cd papervault
```

### **Frontend Setup**
```bash
# Create React app
npx create-react-app client
cd client

# Install dependencies
npm install react-router-dom axios react-toastify
npm install react-pdf @react-pdf-viewer/core
npm install react-icons
npm install @headlessui/react  # For modals, dropdowns

cd ..
```

### **Backend Setup**
```bash
mkdir server
cd server

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose dotenv cors
npm install bcryptjs jsonwebtoken
npm install express-validator
npm install multer cloudinary
npm install nodemailer
npm install helmet compression morgan

# Dev dependencies
npm install --save-dev nodemon

cd ..
```

## 🔧 Environment Variables

### **client/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### **server/.env**
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/papervault
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

CLIENT_URL=http://localhost:3000
```

## 📦 Package.json Scripts

### **Root package.json (Optional)**
```json
{
  "name": "papervault",
  "version": "1.0.0",
  "scripts": {
    "client": "cd client && npm start",
    "server": "cd server && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "install-all": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### **client/package.json (Key Scripts)**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### **server/package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 📋 Development Workflow

1. **Start MongoDB** (if local)
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   cd client
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🗂️ File Organization Best Practices

1. **Component Naming**: Use PascalCase for component files (e.g., `PaperCard.jsx`)
2. **Service Naming**: Use camelCase for service files (e.g., `authService.js`)
3. **Route Organization**: Group related routes in separate files
4. **Model Naming**: Use singular, PascalCase (e.g., `User.js`, not `users.js`)
5. **Constants**: Use UPPER_SNAKE_CASE for constants
6. **Context Files**: End with `Context.jsx` for clarity

## 🔐 Security Considerations

1. Never commit `.env` files
2. Use `.env.example` as template
3. Always validate user inputs
4. Sanitize file uploads
5. Use HTTPS in production
6. Implement rate limiting
7. Use helmet for security headers
8. Hash passwords with bcrypt
9. Validate JWT tokens properly
10. Implement CORS correctly

## 📚 Additional Folders (As Needed)

```
papervault/
├── docs/                    # Documentation
├── tests/                   # Test files
│   ├── client/
│   └── server/
├── scripts/                 # Utility scripts
└── docker/                  # Docker configuration (if using)
```

---

This structure is designed to be scalable, maintainable, and follows MERN best practices!
