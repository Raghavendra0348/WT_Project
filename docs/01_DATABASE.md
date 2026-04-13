# PaperVault — Database Documentation
> **Technology:** MySQL (hosted on Aiven cloud) · **ORM:** Sequelize (Node.js)
> **Config file:** `server/config/db.js` | **Models folder:** `server/models/`

---

## 1. Overview

PaperVault uses a relational MySQL database. All database interaction happens through **Sequelize**, an ORM (Object-Relational Mapper) that lets us write JavaScript objects instead of raw SQL queries. There are **5 models (tables)** and their **associations** are defined separately.

```
MySQL Database (Aiven Cloud)
│
├── users              ← registered accounts
├── papers             ← uploaded question papers
├── bookmarks          ← junction table (user ↔ paper)
├── download_histories ← audit log of who downloaded what
└── reviews            ← ratings & comments on papers
```

---

## 2. Model Files (One file per table)

### `models/User.js` → Table: `users`

Represents every registered user. Handles password hashing and JWT token generation internally.

| Column | Type | Details |
|---|---|---|
| `id` | INT (PK, Auto-increment) | Unique user identifier |
| `name` | VARCHAR(50) | Full name (required) |
| `email` | VARCHAR(255), UNIQUE | Login email, lowercased automatically on save |
| `password` | VARCHAR(255) | Stored as a **bcrypt hash** (never plaintext) |
| `role` | ENUM: `student` / `admin` | Defaults to `student`. Admins can approve papers |
| `course` | ENUM: `intermediate` / `engineering` | Academic program type |
| `year` | INT (1–4) | Current year of study |
| `semester` | INT (1–2) | Current semester |
| `reset_password_token` | VARCHAR(255), nullable | SHA-256 hashed token for password reset |
| `reset_password_expire` | DATETIME, nullable | Expiry time (10 minutes from generation) |
| `created_at` | DATETIME | Auto-timestamp |
| `updated_at` | DATETIME | Auto-timestamp |

**Hooks (Auto-executed logic):**
- `beforeCreate`: Automatically hashes the password using `bcrypt.genSalt(10)` before saving a new user.
- `beforeUpdate`: Re-hashes password when it is changed.

**Instance Methods (attached to every user object):**
- `matchPassword(enteredPassword)` → compares entered string with stored bcrypt hash. Returns `true/false`.
- `getSignedJwtToken()` → signs and returns a JWT containing `{ id, role }` using `JWT_SECRET` from `.env`.
- `getResetPasswordToken()` → generates a random 20-byte hex token, stores its SHA-256 hash in DB, returns the raw token for the email link.

**Default Scope:** Password field is **excluded** by default on all queries. To query with password, use `User.scope('withPassword').findOne(...)`.

---

### `models/Paper.js` → Table: `papers`

Represents an uploaded question paper resource.

| Column | Type | Details |
|---|---|---|
| `id` | INT (PK, Auto-increment) | Unique paper identifier |
| `title` | VARCHAR(200) | Descriptive paper title (required) |
| `category` | ENUM: `intermediate` / `engineering` | Type of education level |
| `course` | VARCHAR(100) | Stream name (e.g., CSE, ECE, MPC, BiPC) |
| `year` | INT (1–4) | Academic year the paper belongs to |
| `semester` | INT (1–2) | Semester (1 = first half, 2 = second half) |
| `subject` | VARCHAR(255) | Subject name (e.g., "Data Structures") |
| `exam_type` | ENUM: `midterm` / `mid1` / `mid2` / `mid3` / `final` / `model` | Type of exam |
| `exam_year` | INT | Year the exam was conducted (e.g., 2024) |
| `file_url` | VARCHAR(500) | Full URL to the file on Cloudinary OR local relative path |
| `file_public_id` | VARCHAR(255) | Cloudinary public_id for deletion / signing. For local files, stores `local-<timestamp>` |
| `file_size` | INT | File size in bytes |
| `thumbnail_url` | VARCHAR(500), nullable | Optional preview image |
| `has_solution` | BOOLEAN | Whether a solution file exists for this paper |
| `solution_url` | VARCHAR(500), nullable | URL to the solution file |
| `solution_public_id` | VARCHAR(255), nullable | Cloudinary ID for the solution |
| `tags` | JSON | Array of tag strings (e.g., `["2023", "model", "important"]`) |
| `downloads` | INT | Number of times the paper has been downloaded |
| `views` | INT | Number of times the paper detail page was viewed |
| `average_rating` | DECIMAL(3,2) | Rolling average of all review ratings |
| `num_reviews` | INT | Total count of reviews |
| `uploaded_by_id` | INT (FK → users.id) | Which user uploaded this paper |
| `status` | ENUM: `pending` / `approved` / `rejected` | Approval state. Only `approved` papers appear in public listings |
| `created_at` | DATETIME | Auto-timestamp |
| `updated_at` | DATETIME | Auto-timestamp |

**Indexes (for query performance):**
- Compound index on `(category, year, semester)` — speeds up filtered browsing
- Single index on `subject`
- Single index on `exam_type`
- **FULLTEXT** index on `(title, subject)` — powers the search feature using `Op.like`

**Instance Methods:**
- `incrementDownloads()` → adds 1 to `downloads` counter and saves
- `incrementViews()` → adds 1 to `views` counter and saves

---

### `models/Bookmark.js` → Table: `bookmarks`

A junction (linking) table for the Many-to-Many relationship between users and papers.

| Column | Type | Details |
|---|---|---|
| `id` | INT (PK, Auto-increment) | - |
| `user_id` | INT (FK → users.id) | Which user saved this bookmark |
| `paper_id` | INT (FK → papers.id) | Which paper was bookmarked |
| `created_at` | DATETIME | When the bookmark was added |

**Constraint:** Compound **UNIQUE INDEX** on `(user_id, paper_id)` → prevents duplicate bookmarks for the same user-paper pair.

---

### `models/DownloadHistory.js` → Table: `download_histories`

An immutable audit log — every download event is recorded here.

| Column | Type | Details |
|---|---|---|
| `id` | INT (PK, Auto-increment) | - |
| `user_id` | INT (FK → users.id) | Who downloaded |
| `paper_id` | INT (FK → papers.id) | What was downloaded |
| `downloaded_at` | DATETIME | Defaults to `Sequelize.NOW` (current timestamp) |

> Records are only created when a logged-in user downloads. Anonymous downloads only increment the `papers.downloads` counter but do NOT create a history record.

---

### `models/Review.js` → Table: `reviews`

Stores user feedback on papers.

| Column | Type | Details |
|---|---|---|
| `id` | INT (PK, Auto-increment) | - |
| `rating` | INT (1–5) | Numeric star rating |
| `comment` | TEXT | Written feedback |
| `user_id` | INT (FK → users.id) | Reviewer |
| `paper_id` | INT (FK → papers.id) | Paper being reviewed |
| `created_at` / `updated_at` | DATETIME | Auto-timestamps |

---

## 3. Associations (`models/associations.js`)

This file defines all relationships between models so Sequelize can perform JOIN queries using `include`.

```
User ──────────────────── Paper
 │  (One-to-Many via       │
 │   uploadedById)         │
 │                         │
 ├── User has many Papers (as 'uploadedPapers')
 └── Paper belongs to User (as 'uploadedBy')

User ◄─── Many-to-Many ──► Paper
      (via Bookmark table)
 ├── User.belongsToMany(Paper) → as 'bookmarkedPapers'
 └── Paper.belongsToMany(User) → as 'bookmarkedBy'

User ──── One-to-Many ──── DownloadHistory
 └── User.hasMany(DownloadHistory) → as 'downloadHistory'
 └── DownloadHistory.belongsTo(User) → as 'user'

Paper ─── One-to-Many ─── DownloadHistory
 └── Paper.hasMany(DownloadHistory) → as 'paperDownloads'

User/Paper ─── One-to-Many ─── Review
 └── User.hasMany(Review) → as 'reviews'
 └── Paper.hasMany(Review) → as 'reviews'
```

---

## 4. Database Config (`config/db.js`)

```
Host:     Aiven managed MySQL server (SSL required)
SSL:      Uses ca.pem certificate file (in /server/ca.pem)
Dialect:  mysql
ORM:      Sequelize
Sync:     sequelize.sync() runs on startup (does NOT drop tables)
```

**Startup Flow:**
1. `server.js` calls `connectDB()` → connects Sequelize to the remote MySQL instance
2. `require('./models/associations')` runs → registers all model relationships
3. Sequelize auto-creates any missing tables (`sync()`) without destroying existing data

---

## 5. Data Flow Examples

### Example A: User Downloads a Paper
```
Browser clicks Download
  → GET /api/papers/:id/download  (with JWT in header)
  → optionalAuth middleware decodes JWT → sets req.user
  → paperController.downloadPaper runs:
      1. Paper.findByPk(id)              → SELECT from papers WHERE id=?
      2. paper.incrementDownloads()      → UPDATE papers SET downloads=downloads+1
      3. DownloadHistory.create(...)     → INSERT into download_histories
      4. Stream file back to browser
```

### Example B: User Bookmarks a Paper
```
Browser clicks Bookmark icon
  → PUT /api/users/bookmarks/:paperId  (with JWT)
  → protect middleware enforces login
  → Bookmark.findOne({ userId, paperId })  → check if exists
  → If not exists: Bookmark.create(...)    → INSERT into bookmarks
  → If exists:     bookmark.destroy()      → DELETE from bookmarks
```

### Example C: Admin Approves a Paper
```
Admin clicks Approve
  → PUT /api/admin/papers/:id/approve  (with admin JWT)
  → protect → authorize('admin') middleware chain
  → Paper.update({ status: 'approved' })
  → Paper is now visible in public listings
```
