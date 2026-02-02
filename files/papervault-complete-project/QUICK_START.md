# 🚀 PaperVault - Quick Start Guide

## 📦 What's Included

This complete MERN stack project includes:

✅ **25+ Files** ready to use
✅ **Backend Server** with Express.js
✅ **Frontend React App** with routing
✅ **MongoDB Models** (User, Paper, Review)
✅ **Authentication System** (JWT)
✅ **File Upload** (Cloudinary integration)
✅ **Email Service** (Password reset)
✅ **API Routes** (Auth, Papers, Users, Admin)
✅ **Middleware** (Auth, Error handling, Upload)
✅ **React Context** (State management)
✅ **Service Layer** (API calls)

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
# Navigate to project
cd papervault-project

# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### Step 2: Configure Environment

**Server Environment (.env)**
```bash
cd server
cp .env.example .env
# Edit .env with your values
```

**Client Environment (.env)**
```bash
cd client
cp .env.example .env
# Edit .env with API URL
```

### Step 3: Setup Services

1. **MongoDB** - Install and run:
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   
   # Windows - Download from mongodb.com
   ```

2. **Cloudinary Account**:
   - Sign up at https://cloudinary.com
   - Copy Cloud Name, API Key, API Secret
   - Add to server/.env

3. **Gmail (for password reset)**:
   - Enable 2-Step Verification
   - Generate App Password
   - Add to server/.env

### Step 4: Run the App

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

Access at: http://localhost:3000

## 📝 First Time Setup Checklist

- [ ] MongoDB installed and running
- [ ] Node.js v14+ installed
- [ ] server/.env file configured
- [ ] client/.env file configured
- [ ] Cloudinary account created
- [ ] Gmail app password generated
- [ ] Dependencies installed
- [ ] Server running on port 5000
- [ ] Client running on port 3000

## 🎯 What to Do Next

### 1. Create Admin User

After registration, update user role in MongoDB:

```javascript
// In MongoDB Compass or shell
use papervault
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### 2. Test the Application

1. Register a new account
2. Login with credentials
3. Browse papers page
4. Upload a paper (as admin)
5. Download a paper
6. Test bookmarks
7. Check user dashboard

### 3. Customize the App

**Frontend Customization:**
- Update colors in CSS variables
- Modify components in `/client/src/components`
- Add new pages in `/client/src/pages`
- Update logo and branding

**Backend Customization:**
- Add new models in `/server/models`
- Create new routes in `/server/routes`
- Add controllers in `/server/controllers`
- Extend middleware in `/server/middleware`

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: MongoNetworkError: connect ECONNREFUSED
```
**Solution:** Start MongoDB service
```bash
mongod
# or
sudo systemctl start mongodb
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process
```bash
lsof -ti:5000 | xargs kill -9
```

### Cloudinary Upload Fails
```
Error: Invalid cloud_name
```
**Solution:** Check CLOUDINARY_CLOUD_NAME in .env

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update CLIENT_URL in server/.env

## 📚 Project Structure Overview

```
papervault-project/
│
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── pages/      # Route Pages
│   │   ├── context/    # Global State
│   │   ├── services/   # API Calls
│   │   └── App.jsx     # Main App
│   └── package.json
│
├── server/              # Express Backend
│   ├── config/         # Configuration
│   ├── models/         # Database Models
│   ├── controllers/    # Business Logic
│   ├── routes/         # API Endpoints
│   ├── middleware/     # Custom Middleware
│   ├── utils/          # Helper Functions
│   └── server.js       # Entry Point
│
└── README.md
```

## 🔐 Default Test Credentials

After setup, you can create test accounts:

**Student Account:**
- Email: student@test.com
- Password: student123
- Role: student

**Admin Account:**
- Email: admin@test.com  
- Password: admin123
- Role: admin (set manually in DB)

## 📖 API Documentation

Full API documentation in README.md includes:

- Authentication endpoints
- Paper CRUD operations
- User profile management
- Bookmark functionality
- Admin operations
- Upload endpoints

## 🎨 Customization Tips

1. **Colors:** Update CSS variables in client/src/styles
2. **Logo:** Replace in client/public
3. **Fonts:** Import in client/public/index.html
4. **Email Templates:** Modify server/utils/sendEmail.js
5. **Validation:** Update server/middleware/validators.js

## 📱 Mobile Optimization

The app is responsive by default. Test on:
- Chrome DevTools (F12 > Toggle Device)
- Real devices
- Different screen sizes

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (cloud)
- [ ] Update CORS settings
- [ ] Enable HTTPS
- [ ] Set strong JWT_SECRET
- [ ] Configure production URLs
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Create backups
- [ ] Test all features

## 📞 Need Help?

- Check README.md for detailed documentation
- Review server logs for errors
- Check browser console for frontend issues
- Verify .env variables are correct
- Ensure all services are running

## 🎉 You're Ready!

You now have a complete, production-ready MERN stack application. Start building your features!

**Happy Coding! 🚀**
