# PaperVault — Frontend Developer's Guide to Project Explanation

> This document helps you walk your guide through the **Frontend** of PaperVault.
> Read each section before the meeting. Speak in your own words.

---

## 🎯 1. One-Line Opening (Say This First)

> *"I built the entire frontend of PaperVault using Vanilla HTML5, CSS3, and JavaScript ES6+.
> There is no framework like React or Angular — just pure HTML, CSS, and JavaScript.
> The frontend communicates with the backend REST API using the browser's built-in fetch() function."*

---

## 🗂️ 2. All Frontend Files — Complete List

### 📄 HTML Pages (User-facing views)

| File | What it does |
|---|---|
| `index.html` | 🏠 Home / Landing page — shows stats, recent papers, search |
| `login.html` | 🔐 Login form — email + password |
| `register.html` | 📝 Registration form — new user signup |
| `complete-profile.html` | ✏️ Complete profile after registration |
| `forgot-password.html` | 🔑 Request password reset via email |
| `question-papers-dashboard.html` | 📚 Main browse page — search, filter, view all papers |
| `upload-paper.html` | ⬆️ Upload a question paper (PDF) |
| `bookmarks.html` | 🔖 Show all saved/bookmarked papers |
| `my-downloads.html` | 📥 Show download history |
| `view-history.html` | 🕐 Viewing/browsing history |
| `my-profile.html` | 👤 User profile editor |
| `settings.html` | ⚙️ Account settings |
| `about.html` | ℹ️ About PaperVault page |
| `contact.html` | 📬 Contact form |
| `admin-dashboard.html` | 🛡️ Admin overview — stats & activity (Admin only) |
| `admin-approvals.html` | ✅ Approve / Reject / Delete papers (Admin only) |
| `admin-users.html` | 👥 Manage all users (Admin only) |

### ⚙️ JavaScript Files

#### Core Logic (`js/`)
| File | Purpose |
|---|---|
| `js/config.js` | 🌐 Global constants — API URL, localStorage keys, pagination size |
| `js/api.js` | 📡 **All API calls** — AuthService, PaperService, UserService, AdminService |
| `js/auth.js` | 🔐 Auth UI — navbar state, protect pages, toast notifications, paper cards |
| `js/home.js` | 🏠 Home page logic — loads stats, recent papers, search form |
| `js/papers.js` | 📚 Dashboard logic — filters, search, pagination, view toggle |
| `js/paper-detail.js` | 📄 Single paper view — download, bookmark, reviews |
| `js/login.js` | 🔐 Login form submission and error handling |
| `js/register.js` | 📝 Register form submission |
| `js/contact.js` | 📬 Contact form handler |
| `js/forgot-password.js` | 🔑 Password reset form |

#### Admin JS (`js/admin/`)
| File | Purpose |
|---|---|
| `js/admin/role-nav.js` | 🛡️ Redirects non-admins away from admin pages |
| `js/admin/dashboard.js` | 📊 Loads admin stats, recent activity, charts |
| `js/admin/approvals.js` | ✅ Approve, reject, delete papers logic |
| `js/admin/papers.js` | 📋 Full paper management (edit, filter, view all) |
| `js/admin/users.js` | 👥 List, search, delete users |
| `js/admin/upload.js` | ⬆️ Admin paper upload flow |

### 🎨 CSS Files
| File | Purpose |
|---|---|
| `css/styles.css` | Main global stylesheet — all component styles, navbar, cards, buttons |
| `css/premium.css` | Premium theme — sidebar layout, glassmorphism, custom fonts (Syne, DM Sans) |
| `question-paper-dash.css` | Styles specific to the papers dashboard page |

### 📁 Other
| File/Folder | Purpose |
|---|---|
| `papers/uploads/` | Locally uploaded PDF files stored here |
| `favicon.svg` | Browser tab icon |
| `Login-pana.svg` | Illustration used on login page |

---

## 🧱 3. How the Frontend is Structured

**Say:**  *"The frontend is a Multi-Page Application — each HTML file is a standalone page.
Every page loads 3 core scripts and then its own page-specific script:"*

```html
<!-- Bottom of every HTML page — in this exact order -->
<script src="js/config.js"></script>    ← 1st: Constants (API URL, keys)
<script src="js/api.js"></script>       ← 2nd: All service functions
<script src="js/auth.js"></script>      ← 3rd: Auth checks + navbar update
<script src="js/papers.js"></script>    ← 4th: Page-specific logic
```

**Why this order matters:**
- `config.js` must be first — other scripts depend on `CONFIG.API_URL`
- `api.js` must load before any page tries to call the backend
- `auth.js` auto-runs `checkAuth()` to update the navbar on every page

---

## 📡 4. Explain `js/api.js` — Most Important File

**Say:** *"This is the most important frontend file.
It contains all the code that talks to the backend server."*

### It has 4 service objects:

#### `API` — Base fetch helper
```javascript
// Every API call automatically:
// 1. Adds Authorization: Bearer <token> header
// 2. Handles 401 → auto logout and redirect to login
// 3. Returns parsed JSON

API.get('/papers')         // GET request
API.post('/auth/login', data)  // POST with JSON body
API.put('/users/profile', data) // PUT
API.delete('/papers/5')    // DELETE
```

#### `AuthService` — Login / Logout / User State
| Method | Does |
|---|---|
| `login(email, password)` | POST to API, saves token to localStorage |
| `logout()` | Clears localStorage, redirects to login |
| `isLoggedIn()` | Returns true if token exists |
| `isAdmin()` | Returns true if user role is 'admin' |
| `getCurrentUser()` | Returns user object from localStorage |

#### `PaperService` — Paper Operations
| Method | API Call |
|---|---|
| `getPapers(filters)` | `GET /api/papers?search=&year=&...` |
| `getPaper(id)` | `GET /api/papers/:id` |
| `downloadPaper(id)` | `GET /api/papers/:id/download` → streams PDF |
| `addReview(id, data)` | `POST /api/papers/:id/reviews` |

#### `UserService` — Bookmarks, Profile, History
| Method | API Call |
|---|---|
| `getBookmarks()` | `GET /api/users/bookmarks` |
| `toggleBookmark(id)` | `PUT /api/users/bookmarks/:id` |
| `getDownloadHistory()` | `GET /api/users/downloads` |
| `getProfile()` | `GET /api/users/profile` |
| `updateProfile(data)` | `PUT /api/users/profile` |
| `getStats()` | `GET /api/users/stats` |

---

## 🔐 5. Explain Authentication Flow in Frontend

**Say:** *"I implemented client-side auth state using localStorage:"*

```
User fills login form → js/login.js handles submit
  ↓
AuthService.login(email, password)
  ↓
fetch('POST /api/auth/login', { email, password })
  ↓
Server returns: { success: true, token: "eyJ..." }
  ↓
localStorage.setItem('papervault_token', token)
localStorage.setItem('papervault_user', JSON.stringify(user))
  ↓
Redirect to question-papers-dashboard.html
  ↓
Every page loads auth.js → checkAuth() runs
  ↓
localStorage.getItem('papervault_token') → found!
  ↓
Navbar shows user name + hides Login button
```

**For protected pages:**
```javascript
// Top of bookmarks.html
if (!AuthService.isLoggedIn()) {
    window.location.href = 'login.html'; // Bounced to login
}
```

---

## 📥 6. Explain the Download Flow (Frontend side)

**Say:** *"When a student clicks download, the frontend handles the file streaming:"*

```javascript
async function downloadPaper(id) {
    // 1. Send GET request to server
    const response = await fetch('/api/papers/5/download', {
        headers: { 'Authorization': 'Bearer eyJ...' }
    });

    // 2. Read Content-Type header
    const contentType = response.headers.get('content-type');

    if (contentType.includes('application/pdf')) {
        // 3. Convert stream to Blob
        const blob = await response.blob();

        // 4. Create invisible download link
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'paper-5.pdf';

        // 5. Simulate click → file saves
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
```

---

## 🔖 7. Explain the Bookmark Feature (Frontend side)

```
Student clicks 🔖 button on paper card
  ↓
toggleBookmarkCard(paperId, buttonElement)
  ↓
UserService.toggleBookmark(paperId)
  ↓
PUT /api/users/bookmarks/5
  ↓
Server returns: { bookmarked: true } or { bookmarked: false }
  ↓
If bookmarked: icon changes to bi-bookmark-fill (filled, purple)
If removed:   icon changes to bi-bookmark (empty)
Toast notification shown: "Bookmarked!" or "Bookmark removed"
  ↓
bookmarks.html → UserService.getBookmarks() → renders the list
```

---

## 🛡️ 8. Explain Admin Pages (Frontend side)

**Say:** *"I built a completely separate admin section:"*

```
Admin logs in → role = 'admin'
  ↓
js/admin/role-nav.js runs on every admin page
  ↓
AuthService.isAdmin() → checks localStorage user.role
  ↓
If NOT admin → alert('Access Denied') → redirect to dashboard
  ↓
If admin → admin-specific nav items shown
```

**Admin Approvals page (`admin-approvals.html`) flow:**
```
Page loads → API.get('/admin/papers?limit=100')
  ↓
Renders all papers with status badges (pending / approved / rejected)
  ↓
Admin clicks Approve → API.put('/admin/papers/5', { status: 'approved' })
Admin clicks Reject  → API.put('/admin/papers/5', { status: 'rejected' })
Admin clicks Delete  → API.delete('/admin/papers/5')
  ↓
Toast notification → paper list reloads
```

---

## ❓ 9. Questions Your Guide May Ask

### Q: "Why Vanilla JS and not React or Angular?"
**A:** "Vanilla JavaScript keeps the project lightweight — no build tools, no Node.js required for the frontend, no `npm install` just to open a page. Every file is a plain HTML file that works directly in the browser. This made it easy for all team members to contribute without learning a framework."

### Q: "What is localStorage and why use it?"
**A:** "localStorage is a browser storage API that persists data even after closing the tab. I store the JWT token and user object here after login. Every page reads from localStorage to check if the user is logged in and what their role is. On logout, we clear it."

### Q: "How does the frontend communicate with the backend?"
**A:** "Using the browser's built-in `fetch()` function. Every API call goes to `http://localhost:5000/api/...`, includes the JWT token in the Authorization header, and the server responds with JSON. The `api.js` file centralizes all these calls so no page directly writes fetch code."

### Q: "How do you protect admin pages from regular users?"
**A:** "Every admin page has a guard at the top: it calls `AuthService.isAdmin()` which checks the role stored in localStorage. If the user is not an admin, it shows an alert and redirects them. The actual enforcement happens server-side too — the backend middleware checks the JWT role before processing any admin API request."

### Q: "What is the script loading order and why does it matter?"
**A:** "config.js must load first because it defines `CONFIG.API_URL` which api.js depends on. api.js must load before auth.js because auth.js calls AuthService functions. If the order is wrong, you get 'AuthService is not defined' errors. JavaScript is synchronous in the browser so order matters."

### Q: "How does the search and filter work?"
**A:** "The dashboard page reads all filter values from the form inputs and adds them as URL query parameters: `GET /api/papers?search=CSE&year=2&semester=1`. The server builds a dynamic SQL WHERE clause from these parameters and returns matching papers."

### Q: "What happens when the JWT token expires?"
**A:** "Every API response with status 401 triggers the auto-logout in api.js. The `API.get/post/put/delete` methods check `if (response.status === 401)` → call `AuthService.logout()` → which clears localStorage and redirects to login.html. The user has to log in again."

---

## 🔄 10. Live Demo Order for Your Guide

1. **Show `index.html`** → Landing page, stats, recent papers
2. **Login** → Show localStorage in DevTools (Application tab) → JWT token appears
3. **Go to Dashboard** → Show search and filter working → network tab shows API calls
4. **Click a paper card** → Bookmark button → show icon toggle
5. **Download a paper** → PDF saves to computer
6. **Go to Bookmarks page** → Show the bookmarked paper appeared
7. **Go to My Downloads** → Show history recorded
8. **Login as admin** → Show admin-only nav links appearing
9. **Admin Approvals** → Show pending papers → Approve one → Reject one → Delete one

---

## 📁 11. Frontend Files Quick Summary

```
frontend/
│
├── 17 HTML pages          ← One per feature/view
│
├── css/
│   ├── styles.css         ← Main stylesheet (all components)
│   └── premium.css        ← Premium sidebar + glassmorphism theme
│
├── js/
│   ├── config.js          ← Global API URL + constants
│   ├── api.js             ← ALL backend communication
│   ├── auth.js            ← Navbar, page protection, toasts, paper cards
│   ├── home.js            ← Home page
│   ├── papers.js          ← Dashboard + filters + pagination
│   ├── paper-detail.js    ← Single paper, download, reviews, bookmark
│   ├── login.js           ← Login form
│   ├── register.js        ← Register form
│   ├── contact.js         ← Contact form
│   └── forgot-password.js ← Password reset
│
└── js/admin/
    ├── role-nav.js        ← Admin access guard
    ├── dashboard.js       ← Admin stats + charts
    ├── approvals.js       ← Approve/reject/delete papers
    ├── papers.js          ← Full paper management
    ├── users.js           ← User management
    └── upload.js          ← Admin upload flow
```

---

## ✅ Final Closing Line

> *"To summarize the frontend:
> I built 17 HTML pages using Vanilla JavaScript with no framework.
> The api.js file handles all communication with the backend using fetch().
> Authentication state is managed using localStorage with JWT tokens.
> The UI is fully role-aware — students see only their features,
> admins see the full management panel.
> The design uses CSS glassmorphism with Google Fonts for a modern look."*
