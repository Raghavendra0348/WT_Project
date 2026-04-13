# PaperVault — Database Developer's Guide to Project Explanation

> This document helps you walk your guide through the **Database Design** of PaperVault.
> Read each section before the meeting. Speak in your own words.

---

## 🎯 1. One-Line Opening (Say This First)

> *"I designed the entire database for PaperVault using MySQL — a relational database.
> I created 5 tables with proper relationships, constraints, and indexes.
> The ORM I used is Sequelize, which lets us interact with the database using JavaScript instead of raw SQL."*

---

## 🧰 2. Technologies I Used

| Technology | What it is | Why I chose it |
|---|---|---|
| **MySQL** | Relational Database | Data has clear relationships (users, papers, bookmarks) |
| **Aiven Cloud** | Managed MySQL hosting | Remote DB, accessible from anywhere, SSL secured |
| **Sequelize** | ORM (Object-Relational Mapper) | Write JS instead of raw SQL, handles migrations |
| **bcryptjs** | Password hashing library | Securely stores passwords — never plaintext |

---

## 🗂️ 3. The 5 Tables I Designed

```
┌─────────────┐        ┌─────────────┐
│   USERS     │        │   PAPERS    │
│─────────────│        │─────────────│
│ id (PK)     │──────► │ id (PK)     │
│ name        │  1:M   │ title       │
│ email       │        │ subject     │
│ password    │        │ fileUrl     │
│ role        │        │ status      │
│ course      │        │ downloads   │
│ year        │        │ uploadedById│ ◄── FK to users
│ semester    │        └─────────────┘
└─────────────┘              │
       │                     │
       │    ┌────────────────┘
       │    │
       │  ┌─▼────────────────────┐
       │  │     BOOKMARKS        │  ◄── Junction table (Many-to-Many)
       │  │──────────────────────│
       │  │ id (PK)              │
       │  │ user_id (FK→users)   │
       │  │ paper_id (FK→papers) │
       │  └──────────────────────┘
       │
       │  ┌──────────────────────────┐
       │  │    DOWNLOAD_HISTORIES    │  ◄── Audit log
       │  │──────────────────────────│
       │  │ id (PK)                  │
       │  │ user_id (FK→users)       │
       │  │ paper_id (FK→papers)     │
       │  │ downloaded_at            │
       │  └──────────────────────────┘
       │
       │  ┌──────────────────────────┐
       └─►│       REVIEWS            │
          │──────────────────────────│
          │ id (PK)                  │
          │ rating (1-5)             │
          │ comment (TEXT)           │
          │ user_id (FK→users)       │
          │ paper_id (FK→papers)     │
          └──────────────────────────┘
```

---

## 📋 4. Explain Each Table in Detail

### Table 1: `users`  →  `models/User.js`

**Say:** *"This table stores all registered user accounts."*

| Column | Type | Key Point |
|---|---|---|
| `id` | INT, Auto-increment | Primary Key |
| `name` | VARCHAR(50) | Max 50 characters, validated |
| `email` | VARCHAR(255), UNIQUE | Forced lowercase on save, unique constraint |
| `password` | VARCHAR(255) | **bcrypt hashed** — never stored as plain text |
| `role` | ENUM: `student/admin` | Controls what the user can access |
| `course` | ENUM: `intermediate/engineering` | For filtering relevant papers |
| `year` | INT (1–4) | Academic year |
| `semester` | INT (1–2) | First or second half |
| `reset_password_token` | VARCHAR | SHA-256 hashed token for password reset |
| `reset_password_expire` | DATETIME | Token expires after 10 minutes |

**Important design decisions to mention:**
- **Password never stored plain** → bcrypt hash with salt factor 10
- **`defaultScope`** excludes password from all queries by default
- **Email auto-lowercased** → prevents duplicate accounts with different cases
- **Hooks** run automatically before save → `beforeCreate`, `beforeUpdate`

---

### Table 2: `papers`  →  `models/Paper.js`

**Say:** *"This is the main table — stores every question paper uploaded to the platform."*

| Column | Type | Key Point |
|---|---|---|
| `id` | INT, Auto-increment | Primary Key |
| `title` | VARCHAR(200) | Required, max 200 chars |
| `category` | ENUM: `intermediate/engineering` | Education level |
| `course` | VARCHAR(100) | CSE, ECE, MPC, BiPC etc. |
| `year` | INT (1–4) | Which year of study |
| `semester` | INT (1–2) | Sem 1 or Sem 2 |
| `subject` | VARCHAR(255) | Subject name |
| `exam_type` | ENUM: `midterm/mid1/mid2/mid3/final/model` | Type of exam |
| `exam_year` | INT | Year exam was conducted (e.g. 2024) |
| `file_url` | VARCHAR(500) | **Path to the PDF** (local or Cloudinary URL) |
| `file_public_id` | VARCHAR(255) | Used to delete file from Cloudinary |
| `file_size` | INT | Size in bytes |
| `has_solution` | BOOLEAN | Whether a solution is attached |
| `tags` | JSON | Array of tags for searching |
| `downloads` | INT | Auto-incremented on each download |
| `views` | INT | Auto-incremented on each view |
| `average_rating` | DECIMAL(3,2) | Rolling average of reviews |
| `uploaded_by_id` | INT, FK → users | Who uploaded this paper |
| `status` | ENUM: `pending/approved/rejected` | **Approval workflow** |

**Important design decisions to mention:**
- **`status` ENUM** → implements the approval pipeline. Default is `pending`.
- **Indexes** → compound index on `(category, year, semester)` for fast filtering
- **FULLTEXT index** on `(title, subject)` → powers the search feature
- **Instance methods** → `incrementDownloads()` and `incrementViews()` update atomically

---

### Table 3: `bookmarks`  →  `models/Bookmark.js`

**Say:** *"This is a junction table — it implements a Many-to-Many relationship between users and papers."*

| Column | Type | Key Point |
|---|---|---|
| `id` | INT, Auto-increment | Primary Key |
| `user_id` | INT, FK → users | Which user bookmarked |
| `paper_id` | INT, FK → papers | Which paper was bookmarked |
| `created_at` | DATETIME | When it was bookmarked |

**Important design decisions to mention:**
- **Compound UNIQUE INDEX** on `(user_id, paper_id)` → prevents a user from bookmarking the same paper twice
- Acts as a **bridge/lookup table** for the Many-to-Many relationship

---

### Table 4: `download_histories`  →  `models/DownloadHistory.js`

**Say:** *"This is an immutable audit log. Every time a logged-in user downloads a paper, one record is inserted here."*

| Column | Type | Key Point |
|---|---|---|
| `id` | INT, Auto-increment | Primary Key |
| `user_id` | INT, FK → users | Who downloaded |
| `paper_id` | INT, FK → papers | What was downloaded |
| `downloaded_at` | DATETIME | Auto-set to current time |

**Important design decisions to mention:**
- Records are **only created for logged-in users** (anonymous downloads only update the counter)
- Used to render the "My Downloads" page on the frontend
- Never deleted by the user — admins delete it only when deleting a paper

---

### Table 5: `reviews`  →  `models/Review.js`

**Say:** *"This table stores user feedback and ratings for each paper."*

| Column | Type | Key Point |
|---|---|---|
| `id` | INT, Auto-increment | Primary Key |
| `rating` | INT (1–5) | Star rating |
| `comment` | TEXT | Written review |
| `user_id` | INT, FK → users | Reviewer |
| `paper_id` | INT, FK → papers | Paper being reviewed |

---

## 🔗 5. Explain the Relationships (`associations.js`)

**Say:** *"All 5 tables are connected using Sequelize associations defined in `associations.js`.
This lets the API do JOIN queries without writing SQL manually."*

| Relationship | Tables | Type | Alias |
|---|---|---|---|
| User uploads Papers | users ↔ papers | **One-to-Many** | `uploadedPapers` / `uploadedBy` |
| User bookmarks Papers | users ↔ papers | **Many-to-Many** (via bookmarks) | `bookmarkedPapers` |
| User has Reviews | users ↔ reviews | **One-to-Many** | `reviews` |
| Paper has Reviews | papers ↔ reviews | **One-to-Many** | `reviews` |
| User has Downloads | users ↔ download_histories | **One-to-Many** | `downloadHistory` |
| Paper has Downloads | papers ↔ download_histories | **One-to-Many** | `paperDownloads` |

**Key sentence to say:**
> "Because we define associations, Sequelize can auto-generate complex JOIN queries.
> For example, `GET /api/users/bookmarks` returns full paper details using:
> `Bookmark.findAll({ include: [{ model: Paper, include: [User] }] })`
> — no SQL needed."

---

## 🔒 6. Explain Database Security

**Your guide will ask about this. Be ready.**

### A. Password Security
```
User registers with password "hello123"
  ↓
bcrypt.genSalt(10) → generates random salt
  ↓
bcrypt.hash("hello123", salt) → "$2b$10$xK3....(60 chars)"
  ↓
Only the HASH is stored in the database — never "hello123"

When user logs in:
bcrypt.compare("hello123", storedHash) → true/false
```

### B. SQL Injection Prevention
> "Sequelize uses **parameterized queries** internally.
> User input is never directly embedded in SQL strings,
> so SQL injection attacks are automatically blocked."

### C. SSL Connection to Database
> "The connection to the Aiven MySQL server is SSL encrypted using a `ca.pem` certificate.
> This means data between the server and database is encrypted in transit."

### D. Role-Based Access
> "The `role` column is an ENUM — only `student` or `admin` are valid values.
> Admin-only database operations are protected by middleware that checks this role."

---

## ⚡ 7. Explain Performance Optimizations

**Say:** *"I added database indexes to speed up the most common queries:"*

| Index | Type | What it speeds up |
|---|---|---|
| `(category, year, semester)` | Compound | Filtering papers by education level |
| `subject` | Single | Subject-based filtering |
| `exam_type` | Single | Filter by mid/final/model |
| `(title, subject)` | **FULLTEXT** | The search bar feature |
| `(user_id, paper_id)` on bookmarks | **UNIQUE** | Bookmark lookup + duplicate prevention |

**Key sentence:**
> "Without these indexes, every search would do a full table scan — reading every row.
> With FULLTEXT indexing, MySQL can find matching papers in milliseconds."

---

## 🔄 8. Explain a Complete Data Flow

### Example: Student Downloads a Paper

**Walk your guide through this step by step:**

```
Step 1: Student clicks Download button
  → Browser sends: GET /api/papers/5/download
  → JWT token in header: Authorization: Bearer eyJ...

Step 2: Server → optionalAuth middleware
  → jwt.verify(token, secret) → decoded: { id: 14, role: 'student' }
  → SELECT * FROM users WHERE id=14
  → req.user = { id:14, name:'Rahul', role:'student' }

Step 3: Controller → Paper.findByPk(5)
  → SELECT * FROM papers WHERE id=5
  → Returns: { title:'CSE Mid-1', fileUrl:'papers/uploads/paper-xxx.pdf', ... }

Step 4: paper.incrementDownloads()
  → UPDATE papers SET downloads = downloads + 1 WHERE id = 5

Step 5: DownloadHistory.create({ userId:14, paperId:5 })
  → INSERT INTO download_histories (user_id, paper_id, downloaded_at)
     VALUES (14, 5, NOW())

Step 6: fs.createReadStream('frontend/papers/uploads/paper-xxx.pdf').pipe(res)
  → PDF file streams back to browser → saved as "CSE_Mid-1.pdf"
```

---

## ❓ 9. Questions Your Guide May Ask

### Q: "What is Sequelize? Why not write raw SQL?"
**A:** "Sequelize is an ORM — Object Relational Mapper. It converts JavaScript objects into SQL queries automatically. Instead of writing `SELECT * FROM users WHERE id=1`, I write `User.findByPk(1)`. It also prevents SQL injection, handles data type validation, and manages relationships between tables."

### Q: "What is a Primary Key and Foreign Key?"
**A:** "A Primary Key uniquely identifies each row in a table — every paper has a unique `id`. A Foreign Key links two tables — the `papers` table has `uploaded_by_id` which points to the `id` in the `users` table. This enforces referential integrity — you can't have a paper without a valid user."

### Q: "Why use ENUM for status and role?"
**A:** "ENUM restricts the column to only specific allowed values. For `status`, only `pending`, `approved`, or `rejected` are valid. For `role`, only `student` or `admin`. This prevents invalid data from entering the database — the database itself enforces these constraints."

### Q: "What is a Many-to-Many relationship? Give an example."
**A:** "A Many-to-Many means one user can bookmark many papers, AND one paper can be bookmarked by many users. In a relational database, we can't store this directly — we create a junction table called `bookmarks` with `user_id` and `paper_id`. Each row represents one bookmark connection."

### Q: "What is a FULLTEXT index? How is it used?"
**A:** "A FULLTEXT index is a special MySQL index optimized for text search. I created one on the `title` and `subject` columns of the `papers` table. When a student searches for 'Data Structures', MySQL uses this index to quickly find all matching papers — much faster than scanning every row."

### Q: "How does the password reset work in the database?"
**A:** "When a user requests a password reset, we generate a random 20-byte token using Node's `crypto` module. We store its SHA-256 HASH in `reset_password_token` and set `reset_password_expire` to 10 minutes from now. The raw token is sent via email. When the user clicks the link, we hash the URL token and compare it to what's stored — if it matches and hasn't expired, they can reset."

### Q: "What happens to bookmarks when a paper is deleted?"
**A:** "I handle this in the admin delete route. Before deleting the paper record, the server first runs `Bookmark.destroy({ where: { paperId } })` and `DownloadHistory.destroy({ where: { paperId } })` to clean up all related records. Then the paper is deleted. This prevents orphan records in the database."

### Q: "What is `sequelize.sync()`?"
**A:** "On server startup, `sequelize.sync()` compares the model definitions in JavaScript with the actual tables in MySQL. If a table doesn't exist, it creates it. If it already exists, it leaves it unchanged. This means I never have to write `CREATE TABLE` SQL manually."

---

## 🏁 10. Live Demo to Show Your Guide

### In Terminal:
```bash
cd server && npm run dev
```
Show: Database connected message

### In Browser (DevTools → Network tab):
1. Open `localhost:5000/api/stats` → Show live data from database
2. Open `localhost:5000/api/papers` → Show all papers with their DB fields
3. Login → open DevTools → Application → LocalStorage → Show JWT token
4. Go to Bookmarks → API call → Show database JOIN response in Network tab

### Show the model files in VS Code:
- Open `server/models/User.js` → Point to each field, explain constraints
- Open `server/models/Paper.js` → Point to `status` ENUM, `indexes` array
- Open `server/models/associations.js` → Explain the relationship definitions

---

## ✅ Final Summary to Close With

> *"To summarize the database design:*
> *I created 5 normalized tables in MySQL — users, papers, bookmarks, download_histories, and reviews.*
> *The relationships are: One-to-Many between users and papers, Many-to-Many for bookmarks,*
> *and One-to-Many for download history and reviews.*
> *I used Sequelize ORM for all database operations, bcrypt for password security,*
> *and added FULLTEXT and compound indexes for query performance.*
> *The database is hosted on Aiven's managed MySQL cloud with SSL encryption."*
