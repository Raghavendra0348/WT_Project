# 📚 PaperVault - Question Paper Repository

A full-stack MERN application for managing and accessing question papers for Intermediate and Engineering students.

## 🚀 Features

- 📄 Browse and download question papers
- 🔍 Advanced search and filtering
- 👤 User authentication and profiles
- 🔖 Bookmark favorite papers
- 📊 Download history tracking
- ⭐ Rate and review papers
- 🎯 Admin panel for managing papers
- 📱 Fully responsive design

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- React Toastify
- React PDF Viewer

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Cloudinary for file storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
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

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables

**Server (.env)**
Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/papervault
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FROM_NAME=PaperVault

CLIENT_URL=http://localhost:3000
```

**Client (.env)**
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Set up Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your server `.env` file

### 5. Set up Email (Gmail example)

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password
3. Use this password in `EMAIL_PASSWORD` in `.env`

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 3 - Start Frontend:**
```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
# Build frontend
cd client
npm run build

# Start server
cd ../server
npm start
```

## 📁 Project Structure

```
papervault/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context API
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS files
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
└── README.md
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

After setting up, create an admin user manually in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- File type validation
- Request validation
- Security headers (Helmet)
- CORS configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env file

**Port Already in Use:**
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in .env file

**File Upload Issues:**
- Check Cloudinary credentials
- Ensure uploads/ directory exists
- Check file size limits (default 10MB)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- React Documentation
- Express.js Documentation
- MongoDB Documentation
- Cloudinary
- All contributors

---

**Happy Coding! 🚀**
