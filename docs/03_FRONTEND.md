# PaperVault — Frontend Documentation
> **Technology:** Vanilla HTML5 + CSS3 + JavaScript (ES6+)
> **Served at:** `http://localhost:3000` (or opened directly as static files)
> **Root folder:** `frontend/`

---

## 1. Overview & Folder Structure

The frontend is a **multi-page static website** — no build tools, no React, no bundler. Each page is a standalone `.html` file that imports its own JavaScript. Communication with the backend happens entirely through `fetch()` calls to `http://localhost:5000/api`.

```
frontend/
├── index.html                    ← Home/Landing page
├── login.html                    ← Login form
├── register.html                 ← Redirects to login (or full form)
├── question-papers-dashboard.html← Main paper browsing page
├── question-paper-dash.css       ← Styles specific to the dashboard
├── upload-paper.html             ← Upload form for submitting papers
├── bookmarks.html                ← Saved papers list
├── my-downloads.html             ← Download history page
├── view-history.html             ← Detailed view history
├── my-profile.html               ← User profile editor
├── settings.html                 ← Account settings
├── about.html                    ← About PaperVault page
├── contact.html                  ← Contact form page
├── forgot-password.html          ← Password reset request
├── complete-profile.html         ← Post-registration profile setup
├── admin-dashboard.html          ← Admin overview (admin only)
├── admin-approvals.html          ← Approve/reject pending papers
├── admin-users.html              ← Manage users
├── css/
│   └── premium.css               ← Global stylesheet (fonts, colors, components)
├── js/
│   ├── config.js                 ← Global configuration (API URL, constants)
│   ├── api.js                    ← All API service functions (AuthService, PaperService, etc.)
│   ├── auth.js                   ← Auth UI logic (navbar state, login checks, toasts)
│   ├── home.js                   ← Home page specific logic
│   ├── papers.js                 ← Papers dashboard page logic
│   ├── paper-detail.js           ← Single paper detail page logic
│   ├── login.js                  ← Login form submission handler
│   ├── register.js               ← Register form handler
│   ├── contact.js                ← Contact form handler
│   ├── forgot-password.js        ← Password reset request handler
│   └── admin/
│       └── role-nav.js           ← Hides/shows admin nav links based on role
└── papers/
    └── uploads/                  ← Locally stored uploaded PDFs
```

---

## 2. JavaScript Files Explained (in detail)

### `js/config.js` — Global Configuration

This is **always the first script loaded** on every page. It defines global constants used by all other scripts.

```javascript
const CONFIG = {
  API_URL: 'http://localhost:5000/api',  // Backend base URL
  STORAGE_KEYS: {
    TOKEN: 'papervault_token',           // localStorage key for JWT
    USER:  'papervault_user'             // localStorage key for user object
  },
  ITEMS_PER_PAGE: 12,                    // Pagination page size
  TOAST_DURATION: 3000                   // Toast notification timeout (ms)
};
```

All other scripts reference `CONFIG.API_URL`, `CONFIG.STORAGE_KEYS`, etc.

---

### `js/api.js` — API Service Layer

This is the most important file. It contains all **communication with the backend**. It exports several service objects as global `window.*` variables.

#### `API` Object (base fetch helper)

```javascript
const API = {
  baseURL: CONFIG.API_URL,   // http://localhost:5000/api
  get(endpoint),             // sends GET request with auth header
  post(endpoint, data),      // sends POST with JSON body
  put(endpoint, data),       // sends PUT with JSON body
  delete(endpoint)           // sends DELETE with auth header
}
```

Every method:
1. Reads token from `localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN)`
2. Adds `Authorization: Bearer <token>` header automatically
3. If response is `401 Unauthorized` → calls `AuthService.logout()` and redirects to login
4. Returns the parsed JSON response

#### `AuthService` Object

Manages login state stored in `localStorage`.

| Method | What it does |
|---|---|
| `register(data)` | POST /api/auth/register → stores token + user |
| `login(email, password)` | POST /api/auth/login → stores token + user |
| `logout()` | Clears localStorage, redirects to `login.html` |
| `getCurrentUser()` | Returns parsed user object from localStorage |
| `isLoggedIn()` | Returns `true` if token exists |
| `isAdmin()` | Returns `true` if user role is `'admin'` |
| `getToken()` | Returns raw JWT string |

#### `PaperService` Object

| Method | Backend call | What it does |
|---|---|---|
| `getPapers(filters)` | GET `/papers` | Returns paginated paper list |
| `getPaper(id)` | GET `/papers/:id` | Returns single paper details |
| `createPaper(data)` | POST `/papers` | Creates paper record |
| `updatePaper(id, data)` | PUT `/papers/:id` | Updates paper |
| `deletePaper(id)` | DELETE `/papers/:id` | Deletes paper |
| `downloadPaper(id)` | GET `/papers/:id/download` | Downloads file (explained below) |
| `addReview(id, data)` | POST `/papers/:id/reviews` | Submits rating + comment |

**`downloadPaper(id)` — Download Flow:**
```
1. fetch('GET /api/papers/:id/download', { Authorization: Bearer ... })
2. Read response Content-Type:
   a. 'application/pdf' or 'application/zip':
      → read response as blob
      → create invisible <a> element
      → set a.href = URL.createObjectURL(blob)
      → set a.download = 'paper-{id}.pdf' or '.zip'
      → trigger a.click() → browser saves file
      → cleanup: a.remove(), revokeObjectURL after 10s
   b. 'application/json':
      → parse JSON → get data.url
      → window.open(data.url, '_blank') → opens in new tab
```

#### `UserService` Object

| Method | Backend call | What it does |
|---|---|---|
| `getProfile()` | GET `/users/profile` | Fetch current user data |
| `updateProfile(data)` | PUT `/users/profile` | Update name, email, year, etc. |
| `getBookmarks()` | GET `/users/bookmarks` | List bookmarked papers |
| `addBookmark(id)` | POST `/users/bookmarks/:id` | Save bookmark |
| `removeBookmark(id)` | DELETE `/users/bookmarks/:id` | Remove bookmark |
| `toggleBookmark(id)` | PUT `/users/bookmarks/:id` | Add if not saved, remove if saved |
| `checkBookmark(id)` | GET `/users/bookmarks/:id/check` | Returns `{ bookmarked: true/false }` |
| `getDownloadHistory()` | GET `/users/downloads` | List download history |
| `getStats()` | GET `/users/stats` | Count bookmarks, downloads, uploads |

#### `AdminService` Object

| Method | Backend call |
|---|---|
| `getPendingPapers()` | GET `/admin/papers/pending` |
| `approvePaper(id)` | PUT `/admin/papers/:id/approve` |
| `rejectPaper(id)` | PUT `/admin/papers/:id/reject` |
| `getUsers()` | GET `/admin/users` |
| `updateUserRole(id, role)` | PUT `/admin/users/:id/role` |
| `deleteUser(id)` | DELETE `/admin/users/:id` |

---

### `js/auth.js` — Auth UI Handler

Loaded on **every page**. Runs automatically on `DOMContentLoaded`.

**`checkAuth()`** — Updates the navbar:
- If logged in: hides "Login/Register" buttons, shows user menu (`#userMenu`) with the user's first name
- If admin: shows admin navigation link (`#adminLink`)
- If not logged in: shows auth buttons, hides user menu

**`protectPage()`** — Redirect guard for private pages:
```javascript
function protectPage() {
  if (!AuthService.isLoggedIn()) {
    window.location.href = 'login.html';  // Bounce to login
    return false;
  }
  return true;
}
```
Called at the top of every authenticated page.

**`protectAdminPage()`** — Same as above but also checks for admin role.

**`showToast(message, type)`** — Displays Bootstrap toast notifications:
- `type` can be: `'success'`, `'error'`, `'warning'`, `'info'`
- Auto-hides after `CONFIG.TOAST_DURATION` ms
- Dynamically inserts into `#toastContainer`

**`generatePaperCard(paper)`** — Renders a Bootstrap card for a paper object. Returns HTML string. Used on home and papers pages to render paper grids.

**`logout()`** — Confirms with user then calls `AuthService.logout()`.

---

### `js/home.js` — Home Page

Executes on `index.html`.

**`loadPublicStats()`**
- Calls `GET /api/stats` (no auth required)
- Updates hero counter elements: `#heroPaperCount`, `#heroUserCount`, `#heroDownloadCount`
- Updates stats section: `#totalPapers`, `#totalUsers`, `#totalDownloads`, `#totalUniversities`

**`loadRecentPapers()`**
- Calls `PaperService.getPapers({ limit: 6, sort: 'newest' })`
- Renders result using `generatePaperCard()` into `#recentPapers` container

**`setupSearchForm()`**
- Listens for submit on `#searchForm`
- On submit → redirects to `papers.html?search=<query>`

---

### `js/papers.js` — Papers Dashboard

Executes on `question-papers-dashboard.html`.

**`parseURLParams()`**
- On load, reads URL query string (`?search=&category=&year=`)
- Pre-fills filter form fields with those values

**`loadPapers()`**
- Gathers all current filter values + current page
- Calls `PaperService.getPapers({ ...filters, page, limit })`
- Shows loading spinner during fetch
- Renders results as grid (using `generatePaperCard()`) or list view
- Renders pagination if `totalPages > 1`

**`setupFilters()`**
- Apply button → reads all filter fields, calls `loadPapers()`
- Clear/Reset buttons → clears filters, reloads

**`setupViewToggle()`**
- Grid View button (`#gridViewBtn`) → re-renders as card grid
- List View button (`#listViewBtn`) → re-renders as list items

**`renderPagination(totalPages)`**
- Generates Bootstrap pagination HTML with Previous/Next and page number links
- Each page number click → updates `currentPage` and calls `loadPapers()`

---

### `js/paper-detail.js` — Paper Detail View

Handles the single paper page (loaded via `?id=<paperId>` in URL).

- Calls `PaperService.getPaper(id)` → renders full paper info
- Calls `paper.incrementViews()` server-side (via the GET detail route)
- Calls `UserService.checkBookmark(id)` → shows filled/unfilled bookmark icon
- Bookmark toggle button → calls `UserService.toggleBookmark(id)` → updates icon
- Download button → calls `PaperService.downloadPaper(id)` → triggers file download
- Review form submit → calls `PaperService.addReview(id, { rating, comment })`

---

### `js/login.js` — Login Page

- On form submit → calls `AuthService.login(email, password)`
- On success → `window.location.href = 'question-papers-dashboard.html'`
- On failure → shows error message below form

---

### `js/register.js` — Register Page

- On form submit → calls `AuthService.register({ name, email, password, course, year, semester })`
- On success → redirects to dashboard or complete-profile page

---

### `js/admin/role-nav.js` — Admin Navigation

- Loaded on admin pages
- Checks `AuthService.isAdmin()`
- If NOT admin → redirects to dashboard (prevents URL-based admin access)
- If admin → shows admin-specific nav elements

---

## 3. Script Loading Order on Every Page

Every HTML page loads its scripts in this exact order (at the bottom of `<body>`):

```html
<script src="js/config.js"></script>     <!-- 1. Global constants -->
<script src="js/api.js"></script>        <!-- 2. All service functions -->
<script src="js/auth.js"></script>       <!-- 3. Auth UI (auto-runs checkAuth) -->
<script src="js/papers.js"></script>     <!-- 4. Page-specific logic (varies per page) -->
```

---

## 4. Authentication Flow

```
User opens bookmarks.html
  │
  ├─ config.js loads → CONFIG ready
  ├─ api.js loads → AuthService, PaperService, UserService ready
  ├─ auth.js loads → checkAuth() runs:
  │    localStorage.getItem('papervault_token') → found!
  │    Shows user menu in navbar, hides login button
  │
  └─ Inline script in bookmarks.html:
       protectPage() → isLoggedIn() → true → page renders
       loadBookmarks() → UserService.getBookmarks() →
         fetch('GET /api/users/bookmarks', { Authorization: Bearer ... }) →
         Backend returns paper list →
         Renders paper cards into #bookmarksList
```

---

## 5. Key HTML Element IDs (Referenced by JavaScript)

| ID | Page | Used for |
|---|---|---|
| `#authButtons` | All | Login/Register navbar buttons |
| `#userMenu` | All | Logged-in user dropdown |
| `#userName` | All | Displays user's first name |
| `#adminLink` | All | Admin nav link (hidden for students) |
| `#toastContainer` | All | Toast notification injection point |
| `#papersContainer` | papers dashboard | Paper cards grid |
| `#loadingPapers` | papers dashboard | Loading spinner |
| `#paginationContainer` | papers dashboard | Pagination controls |
| `#resultsCount` | papers dashboard | "Showing X papers" text |
| `#filterSearch` | papers dashboard | Search input |
| `#filterCategory` | papers dashboard | Category dropdown |
| `#filterYear` | papers dashboard | Year dropdown |
| `#recentPapers` | index / home | Recent papers grid |
| `#heroPaperCount` | index / home | Hero stats counter |

---

## 6. CSS — `css/premium.css`

Global stylesheet applied to all pages.

- **Typography:** Uses Google Fonts — `Syne` (headings) and `DM Sans` (body)
- **Color palette:** Deep indigo/violet primary with glass-morphism effects
- **Paper card styles:** `.paper-card` with hover lift animation and gradient header
- **Sidebar layout:** Fixed 240px sidebar with icon + label nav items
- **Responsive breakpoints:** Sidebar collapses on mobile, cards stack to single column
- **Animations:** CSS keyframe animations for loading states, toast slide-in, card hover
