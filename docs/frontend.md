# PaperVault - Frontend Architecture & Documentation

## Overview
PaperVault's frontend is a fully decoupled **Single Page Application (SPA)** architecture style built upon Vanilla **HTML5, CSS3**, and **JavaScript (ES6+)**. This enables lightweight operation, exceptionally quick DOM loads, and strong programmatic integration decoupled from complicated compilation pipelines. 

## Structure and Directory System

### 1. HTML Views (Root Directory)
Each logical component of the platform acts as an isolated `.html` rendering boundary.
- **`index.html`**: Entry point or Landing Page displaying statistical overviews and hero designs without requiring a token.
- **`login.html` & `register.html`**: User authentication portals collecting programmatic entry payload points securely.
- **`question-papers-dashboard.html`**: The unified browsing interface rendering paginated tiles, sortable dropdown parameters, and search inputs seamlessly.
- **`upload-paper.html`**: Interface resolving form-based inputs (binary files alongside encoded JSON strings) bound for administrative approval routes. 
- **User Activity Pages**: `bookmarks.html`, `my-downloads.html`, `view-history.html`. Dedicated visual dashboards for rendering user timeline and preserved resource points.
- **Admin Layouts**: Includes isolated boundaries (`admin-dashboard.html`, `admin-approvals.html`) protected mechanically inside the logic checks.

### 2. Styling (`/css/`)
Elements are systematically branded and customized globally using modular CSS imports. 
- **`premium.css`**: Centralized style repository integrating custom fonts (`Syne`, `DM Sans`), CSS UI scaling components (Glassmorphism, custom sidebars), and dynamically scaling DOM class mechanics allowing UI alignment seamlessly across viewports.

### 3. JavaScript Mechanics (`/js/`)
The JavaScript architecture splits complex implementations into modular globally accessible object trees.

#### A. Core API Engine (`api.js`)
The backbone communicating fully formatted web payloads with the remote Node server.
- **`API` Base Object**: Sets global interceptors implementing `fetch()` dynamically appending headers utilizing local properties checking specifically for `Bearer ${localStorage.getItem('token')}` presence. Identifies `401 Unauthorized` responses and auto-recycles navigation safely.
- **`AuthService`**: Manages localStorage states cleanly mapping strings out representing logical state mechanisms like `logout()` or `getCurrentUser()`.
- **`PaperService` & `UserService`**: Bridges functional endpoints allowing distinct JavaScript components purely programmatic returns securely returning native objects mapping strictly over raw outputs. `downloadPaper(id)` parses specific API blob outputs vs URLs seamlessly.

#### B. Component Handlers (`papers.js`, `home.js`, `auth.js`)
- **`auth.js`**: Triggers universally inside the `DOMContentLoaded` cycle. It parses logic like `checkAuth()` configuring navigation states hiding login buttons swapping UI icons cleanly in real time. 
- **`papers.js`**: Integrates deep pagination routing parsing `URLSearchParams` on pageload. Listens to filter change events recursively executing mapped renders injecting elements deep inside `container.innerHTML` strings dynamically.
- **`home.js`**: Isolates statistical public rendering metrics safely avoiding private authorization tokens safely pushing UI boundaries recursively correctly globally checking nullability constraints. 
- **`admin/role-nav.js`**: Evaluates layout trees cleanly ensuring isolated sidebar navigation is enforced preventing standard user boundaries manipulating admin tools.

## Standard Control & Interaction Flow
1. **Application Load (e.g., Bookmarks View)**: 
   - `bookmarks.html` natively imports `config.js` > `api.js` > `auth.js` > `admin/role-nav.js` at the bottom of the structure tree cleanly enforcing progressive loads.
2. **Access Control**: Immediate functional trigger `init()` checks `AuthService.isLoggedIn()`. Unauthenticated queries trigger `window.location.href = 'login.html'` forcefully stopping flow. 
3. **Data Binding**: Wait state queries `UserService.getBookmarks()` dynamically rendering isolated list components checking explicitly empty strings representing "Empty State". 
4. **Trigger Mechanism**: Buttons call raw functional blocks like `removeBookmark(12)` interacting cleanly resolving asynchronous Promises natively.
