# PaperVault — Backend Documentation
> **Runtime:** Node.js · **Framework:** Express.js · **Port:** 5000
> **Root file:** `server/server.js` | **Base API URL:** `http://localhost:5000/api`

---

## 1. Overview & Folder Structure

```
server/
├── server.js                 ← App entry point (starts Express, loads routes)
├── .env                      ← Environment variables (secrets, DB credentials)
├── ca.pem                    ← SSL certificate for Aiven MySQL connection
├── config/
│   ├── db.js                 ← Sequelize MySQL connection setup
│   └── cloudinary.js         ← Cloudinary SDK configuration
├── middleware/
│   ├── auth.js               ← JWT verification (protect, optionalAuth, authorize)
│   ├── upload.js             ← Multer file upload handler
│   └── errorHandler.js       ← Global error formatting
├── models/
│   ├── User.js, Paper.js, Bookmark.js, DownloadHistory.js, Review.js
│   └── associations.js       ← Defines all Sequelize relationships
├── routes/
│   ├── auth.js               ← /api/auth/*
│   ├── papers.js             ← /api/papers/*
│   ├── users.js              ← /api/users/*
│   ├── admin.js              ← /api/admin/*
│   └── upload.js             ← /api/upload/*
├── controllers/
│   ├── authController.js     ← Register, login, logout, password reset logic
│   └── paperController.js    ← CRUD for papers, search, download logic
└── utils/
    └── sendEmail.js          ← Nodemailer wrapper for password reset emails
```

---

## 2. Entry Point — `server.js`

This is the first file executed when the server starts (`npm run dev`).

**What it does, step by step:**
1. **Loads `.env`** using `dotenv.config()` — must be first, before any other import
2. **Connects to MySQL** via `connectDB()` from `config/db.js`
3. **Registers model associations** via `require('./models/associations')`
4. **Creates the Express app** and applies global middleware:
   - `helmet(...)` → adds HTTP security headers (prevents XSS, clickjacking, etc.)
   - `compression()` → gzip-compresses all responses to save bandwidth
   - `cors(...)` → only allows requests from whitelisted origins (localhost:3000, Vercel, local network IPs)
   - `express.json()` → parses JSON request bodies
   - `express.urlencoded()` → parses form-encoded data
   - `morgan('dev')` → logs every request to the terminal
5. **Mounts route files** at their API paths
6. **Serves local uploaded PDFs** as static files at `/papers/uploads/`
7. **Defines inline routes** for `/api/stats` (public) and `/api/health` (health check)
8. **Attaches the 404 handler** and global `errorHandler`
9. **Starts listening** on `PORT` (default: 5000)

---

## 3. Configuration Files (`config/`)

### `config/db.js`
Sets up the Sequelize connection to the remote Aiven MySQL server.
- Uses `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT` from `.env`
- SSL is enabled with the `ca.pem` certificate to encrypt the connection
- Exports both `sequelize` (the connection instance) and `connectDB` (an async function that authenticates and syncs tables)

### `config/cloudinary.js`
Configures the Cloudinary v2 SDK with:
- `CLOUDINARY_CLOUD_NAME` = `dflhurerg`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Exports the configured `cloudinary` object used in controllers and routes.

---

## 4. Middleware (`middleware/`)

### `middleware/auth.js`
Contains 3 exported middleware functions:

**`protect`** — Used on all private routes that require login.
1. Looks for `Authorization: Bearer <token>` header
2. If no token → returns `401 Unauthorized`
3. Verifies JWT with `jwt.verify(token, JWT_SECRET)`
4. Fetches user from DB: `User.findByPk(decoded.id)`
5. Sets `req.user` → passes to next handler

**`optionalAuth`** — Used on the download route.
- Same as `protect`, but silently skips if no token is present
- If token exists → decodes and sets `req.user`
- If no token or invalid → sets `req.user = null` and continues
- Allows anonymous downloads while still tracking history for logged-in users

**`authorize(...roles)`** — Role-based access control.
- e.g., `authorize('admin')` → only lets admins through
- Used after `protect` to further restrict routes

### `middleware/upload.js`
Uses **Multer** to handle `multipart/form-data` (file uploads).
- Accepts only `.pdf` files (mime type: `application/pdf`)
- Saves temp files to `server/uploads/` before processing
- Limits file size (configured in the middleware)
- Exported as a Multer instance — used as `upload.single('paper')` in routes

### `middleware/errorHandler.js`
Catches any error passed to `next(err)` from any route.
- Returns a consistent JSON format: `{ success: false, message: "..." }`
- Handles Sequelize validation errors, duplicate entries, and generic errors

---

## 5. Routes (`routes/`)

Routes handle URL matching and hand off to middleware/controllers. All routes are prefixed with `/api/`.

### `routes/auth.js` → `/api/auth`

| Method | Path | Access | What it does |
|---|---|---|---|
| POST | `/register` | Public | Creates new user account |
| POST | `/login` | Public | Validates credentials, returns JWT |
| GET | `/me` | Private | Returns current logged-in user |
| POST | `/forgotpassword` | Public | Sends password reset email |
| PUT | `/resetpassword/:token` | Public | Resets password using token |

### `routes/papers.js` → `/api/papers`

| Method | Path | Access | What it does |
|---|---|---|---|
| GET | `/` | Public | List all approved papers (with filters & pagination) |
| GET | `/:id` | Public | Get single paper details |
| POST | `/` | Private (admin) | Create a new paper record |
| PUT | `/:id` | Private (admin) | Update a paper |
| DELETE | `/:id` | Private (admin) | Delete a paper + its Cloudinary file |
| GET | `/:id/download` | Public + optionalAuth | Download the paper file |
| POST | `/:id/reviews` | Private | Add a review/rating |

### `routes/users.js` → `/api/users`

All routes require authentication (`protect` is applied globally via `router.use(protect)`).

| Method | Path | What it does |
|---|---|---|
| GET | `/profile` | Get current user's profile data |
| PUT | `/profile` | Update profile (name, email, year, semester) |
| GET | `/bookmarks` | List all bookmarked papers |
| POST | `/bookmarks/:paperId` | Add a bookmark |
| DELETE | `/bookmarks/:paperId` | Remove a bookmark |
| PUT | `/bookmarks/:paperId` | Toggle bookmark (add if missing, remove if exists) |
| GET | `/bookmarks/:paperId/check` | Check if a specific paper is bookmarked |
| GET | `/downloads` | Get download history list |
| POST | `/downloads/:paperId` | Manually record a download |
| GET | `/stats` | Get counts: bookmarks, downloads, uploads |

### `routes/upload.js` → `/api/upload`

| Method | Path | Access | What it does |
|---|---|---|---|
| POST | `/paper` | Private | Uploads a PDF. If Cloudinary is configured → uploads to Cloudinary (`raw` type). Else → saves to `frontend/papers/uploads/` locally |
| POST | `/solution` | Private | Uploads a solution PDF directly to Cloudinary |

### `routes/admin.js` → `/api/admin`

All admin routes use `protect` + `authorize('admin')`.

| Method | Path | What it does |
|---|---|---|
| GET | `/papers/pending` | List all papers awaiting approval |
| PUT | `/papers/:id/approve` | Approve a paper |
| PUT | `/papers/:id/reject` | Reject a paper |
| GET | `/users` | List all users |
| PUT | `/users/:id/role` | Change a user's role |
| DELETE | `/users/:id` | Delete a user |

---

## 6. Controllers (`controllers/`)

Controllers contain the actual business logic called by the routes.

### `controllers/authController.js`

**`register`**
1. Creates `User` in DB (password hashed via Sequelize hook)
2. Calls `user.getSignedJwtToken()` → returns JWT
3. Sends JWT back in the response

**`login`**
1. Finds user by email using `User.scope('withPassword').findOne(...)` (includes hashed password, excluded by default)
2. Calls `user.matchPassword(req.body.password)` → bcrypt compare
3. Returns JWT on success

**`forgotPassword`**
1. Finds user by email
2. Calls `user.getResetPasswordToken()` → generates reset token, saves hash to DB
3. Sends email with `http://localhost:3000/reset-password.html?token=<rawToken>`

**`resetPassword`**
1. Hashes the incoming token
2. Finds user where `resetPasswordToken = hashedToken` AND `resetPasswordExpire > NOW`
3. Sets new password → clears the token fields

### `controllers/paperController.js`

**`getPapers`**
Builds a dynamic Sequelize `where` clause from query parameters:
- `search` → `Op.like` on `title` and `subject` (FULLTEXT)
- `category`, `year`, `semester`, `subject`, `examType` → exact match filters
- `sort` → `newest`, `oldest`, `downloads`, `rating`
- `page` + `limit` → pagination using `offset` and `limit`
- Always adds `status: 'approved'` to the filter (public users can't see pending papers)

**`downloadPaper`**
1. Finds paper by ID
2. Calls `paper.incrementDownloads()` → updates DB counter
3. If `req.user` exists (logged in) → creates `DownloadHistory` record
4. **For Cloudinary files** (`fileUrl` contains `cloudinary.com`):
   - Generates a signed URL using `cloudinary.utils.download_zip_url({ public_ids: [filePublicId] })`
   - Fetches that URL server-side using `https.get()`
   - Streams (`pipe`) the response directly to the browser
   - Browser receives it as `application/pdf` download
5. **For local files** → constructs full URL and returns JSON `{ url }`

---

## 7. Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 5000) |
| `MYSQL_HOST` | Aiven DB host |
| `MYSQL_USER` | Aiven DB username |
| `MYSQL_PASSWORD` | Aiven DB password |
| `MYSQL_DATABASE` | Database name |
| `MYSQL_PORT` | Aiven DB port |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRE` | Token validity (e.g. `30d`) |
| `CLOUDINARY_CLOUD_NAME` | `dflhurerg` |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL (for CORS) |
| `EMAIL_*` | SMTP settings for password reset emails |

---

## 8. Complete Request Lifecycle Example

**Request:** `GET /api/papers/13/download` (logged-in student)

```
1. Request arrives at Express server (port 5000)
2. cors() checks origin header → allowed (localhost:3000) → continues
3. helmet() adds security headers to response
4. morgan() logs: "GET /api/papers/13/download 200 1204ms"
5. Route match: papers router → /:id/download → optionalAuth middleware
6. optionalAuth: reads "Authorization: Bearer eyJ..." header
   → jwt.verify() → decodes { id:14, role:'student' }
   → User.findByPk(14) → sets req.user
7. Handler: paperController.downloadPaper runs:
   a. Paper.findByPk(13) → fetches paper from DB (SELECT * from papers WHERE id=13)
   b. paper.incrementDownloads() → UPDATE papers SET downloads=downloads+1 WHERE id=13
   c. DownloadHistory.create({ userId:14, paperId:13 }) → INSERT into download_histories
   d. fileUrl includes 'cloudinary.com' AND filePublicId exists:
      → cloudinary.utils.download_zip_url({ public_ids:[...] }) → signed URL
      → https.get(signedUrl) → Cloudinary responds 200 with file data
      → cloudRes.pipe(res) → streams file bytes to browser
8. Browser receives file with Content-Disposition: attachment; filename="paper.pdf"
9. Browser saves as ZIP file (Cloudinary wraps in zip due to account ACL settings)
```
