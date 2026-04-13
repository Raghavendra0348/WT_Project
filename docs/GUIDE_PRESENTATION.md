# PaperVault — Backend Developer's Guide to Project Explanation

> This document helps you walk your guide through the project as the **Backend Developer**.
> Read each section before the meeting. Speak in your own words, not memorized lines.

---

## 🎯 1. What is PaperVault? (30 seconds intro)

**Say this to your guide:**

> "PaperVault is a web-based Question Paper Repository System.
> Students can browse, search, download, and bookmark previous year exam question papers.
> There is also an admin panel where admins can approve or reject uploaded papers and manage users.
> I am the backend developer — I built the entire server-side API, database, and file management system."

---

## 🏗️ 2. My Role as Backend Developer

Tell your guide exactly what YOU built:

| What I Built | Technology Used |
|---|---|
| REST API Server | Node.js + Express.js |
| Database Design | MySQL (hosted on Aiven Cloud) |
| ORM & Queries | Sequelize |
| User Authentication | JWT (JSON Web Token) + bcryptjs |
| File Upload System | Multer middleware |
| File Download | fs.createReadStream (local), Cloudinary API (cloud) |
| Role-based Access Control | Custom `protect`, `authorize` middleware |
| Password Reset | Nodemailer + crypto tokens |
| Admin API | Full CRUD with paper approval pipeline |

---

## 🗂️ 3. Explain the Folder Structure

**Show your guide the `server/` folder and say:**

> "The backend is organized into 6 main folders:"

```
server/
├── server.js        ← The app starts here. Loads all middleware and routes.
├── config/          ← Database and Cloudinary connection setup
├── models/          ← 5 database tables defined here (User, Paper, Bookmark, etc.)
├── middleware/       ← Security layers (auth check, file upload handler)
├── routes/          ← URL path definitions
└── controllers/     ← The actual business logic
```

**Key point to say:**
> "I used the MVC pattern — Models define the data, Routes define the URL paths,
> and Controllers contain the logic. This keeps the code organized and maintainable."

---

## 🗄️ 4. Explain the Database Design

**Say:** "I designed a relational database with 5 tables:"

```
users ──────────────── papers
  │   (one uploads many)  │
  │                       │
  ├── bookmarks ──────────┘   (Many-to-Many: user saves many papers)
  │
  ├── download_histories      (Audit log: who downloaded what, when)
  │
  └── reviews                 (User can rate and comment on papers)
```

**Key fields to mention for Paper table:**
- `fileUrl` — path to the PDF file (local disk or Cloudinary URL)
- `filePublicId` — used to delete files from Cloudinary
- `status` — ENUM: `pending / approved / rejected` (approval workflow)
- `downloads` / `views` — auto-incremented counters

**Key fields to mention for User table:**
- `password` — stored as **bcrypt hash** (never stored as plain text)
- `role` — ENUM: `student / admin` (controls access)
- `resetPasswordToken` — for secure password recovery

---

## 🔐 5. Explain Authentication (Most Important Feature)

**Your guide WILL ask about this. Be ready.**

**How Login Works — explain step by step:**

```
1. User sends email + password → POST /api/auth/login
2. Server finds user by email from database
3. bcrypt.compare(enteredPassword, storedHash) → true or false
4. If correct → jwt.sign({ id, role }, JWT_SECRET) → returns token
5. Token stored in browser's localStorage
6. Every future request sends: Authorization: Bearer <token>
7. Server verifies token → identifies user
```

**Show the code in `middleware/auth.js`:**
- `protect` middleware — verifies JWT, blocks if missing or invalid
- `optionalAuth` middleware — allows anonymous users but identifies logged-in users
- `authorize('admin')` middleware — blocks non-admin from admin routes

**Quote to say:**
> "I implemented stateless authentication using JWT.
> The server doesn't store sessions — it just verifies the token signature using the secret key.
> This is scalable and works well with REST APIs."

---

## 📄 6. Explain the Paper Upload & Download Flow

### Upload Flow:
```
1. User selects PDF on frontend → form submitted
2. Multer middleware intercepts → saves file to server/uploads/ temporarily
3. Route handler copies file to frontend/papers/uploads/ with unique name
4. File path stored in database: fileUrl = "papers/uploads/paper-1234.pdf"
5. Admin reviews → approves → paper visible to all students
```

### Download Flow:
```
1. Student clicks Download → GET /api/papers/:id/download
2. optionalAuth middleware → identifies user if logged in
3. Controller finds paper record in DB
4. paper.downloads += 1 (saved to DB)
5. If user logged in → DownloadHistory record created
6. fs.createReadStream(localFilePath).pipe(res) → PDF streamed to browser
7. Browser saves file as "PaperTitle.pdf"
```

---

## 🛡️ 7. Explain the Admin Approval Pipeline

**Say:**
> "I built a paper approval system. When a student uploads a paper,
> its status is set to 'pending'. Admins see all pending papers and can:
> - **Approve** → paper becomes visible to all students
> - **Reject** → paper is hidden
> - **Delete** → paper record deleted + file removed from disk"

**API endpoints for this:**
```
GET    /api/admin/papers         → See all papers (any status)
PUT    /api/admin/papers/:id     → Change status (approve/reject)
DELETE /api/admin/papers/:id     → Delete paper + file from disk
```

---

## 🌐 8. Key API Endpoints to Demo Live

Run the server and open these in browser or Postman:

| URL | What it shows |
|---|---|
| `GET localhost:5000/api/health` | Server is running |
| `GET localhost:5000/api/stats` | Total papers, users, downloads |
| `GET localhost:5000/api/papers` | All approved papers |
| `GET localhost:5000/api/papers?search=CSE` | Search by name |
| `GET localhost:5000/api/papers?year=2&semester=1` | Filter papers |

---

## ❓ 9. Questions Your Guide May Ask

### Q: "Why did you use Node.js and not Django or Spring Boot?"
**A:** "Node.js is asynchronous and non-blocking, making it very efficient for I/O operations like database queries and file streaming. It also uses JavaScript, which allows full-stack development with the same language. Express.js is lightweight and gives full control over routing and middleware."

### Q: "Why MySQL and not MongoDB?"
**A:** "PaperVault has clearly defined relationships — Users upload Papers, Papers have Reviews, Bookmarks link Users to Papers. This relational structure is a perfect fit for SQL. MySQL with Sequelize gives us foreign key constraints, JOIN queries, and ACID transactions."

### Q: "How is the password secured?"
**A:** "Passwords are hashed using bcrypt with a salt factor of 10. This means even if the database is compromised, raw passwords cannot be retrieved. We never store or log plaintext passwords anywhere."

### Q: "How does the file download work?"
**A:** "Files are stored on the server's local filesystem at `frontend/papers/uploads/`. When a download is requested, the server uses Node's `fs.createReadStream()` to read the file and `pipe()` it directly to the HTTP response. This is memory-efficient — the file data streams in chunks rather than loading the entire file into memory first."

### Q: "What is middleware in Express?"
**A:** "Middleware are functions that run between the HTTP request and the route handler. I wrote three custom middleware functions: `protect` checks the JWT token, `optionalAuth` identifies users when possible, and `authorize('admin')` restricts admin-only endpoints."

### Q: "What is an ORM? Why did you use Sequelize?"
**A:** "ORM stands for Object-Relational Mapper. Instead of writing raw SQL like `SELECT * FROM users WHERE id=1`, Sequelize lets us write `User.findByPk(1)`. It handles SQL injection prevention, type validation, associations, and database migrations automatically."

### Q: "How does the bookmark feature work?"
**A:** "Bookmarks are a Many-to-Many relationship. The `bookmarks` table is a junction table with `user_id` and `paper_id`. When a student clicks bookmark, the API does a PUT request that toggles — if the record exists, it deletes it; if not, it creates it. A compound unique index prevents duplicate bookmarks."

---

## 🔄 10. How to Demo the Project (Step by Step)

Follow this order during your demo:

1. **Start the server:**
   ```bash
   cd server && npm run dev
   ```
   Show: `🚀 Server running in development mode on port 5000`

2. **Open browser → `localhost:5000/api/stats`**
   Show: Live stats from the database

3. **Open frontend → `index.html`**
   Show: Homepage with stats, recent papers

4. **Login as admin:**
   - Go to `login.html`
   - Show the JWT token stored in localStorage (DevTools → Application → Local Storage)

5. **Browse papers:**
   - Go to `question-papers-dashboard.html`
   - Demo search and filter
   - Click bookmark button → show it toggling

6. **Download a paper:**
   - Click Download → show PDF saving to computer
   - Go to `my-downloads.html` → show history recorded

7. **Admin panel:**
   - Go to `admin-approvals.html`
   - Show Approve / Reject / Delete buttons
   - Upload a new paper → show it appears as Pending

---

## 📌 11. Key Technical Terms to Use

Use these terms confidently:

- **REST API** — Representational State Transfer, stateless HTTP endpoints
- **JWT** — JSON Web Token, used for stateless authentication
- **bcrypt** — password hashing algorithm with built-in salt
- **Middleware** — interceptor functions in the Express request pipeline
- **ORM** — Object-Relational Mapper (Sequelize)
- **Foreign Key** — DB column linking one table to another
- **CRUD** — Create, Read, Update, Delete operations
- **MVC** — Model-View-Controller design pattern
- **Async/Await** — modern JavaScript for handling asynchronous operations
- **Stream** — reading/writing data in chunks (used in file download)
- **CORS** — Cross-Origin Resource Sharing, controlled in server.js

---

## ✅ One-Line Summary to Open With:

> *"I built the backend of PaperVault — a RESTful API using Node.js, Express, MySQL, and Sequelize.
> It handles user authentication with JWT, role-based access control, file upload and download,
> a paper approval pipeline for admins, and features like bookmarks and download history tracking."*
