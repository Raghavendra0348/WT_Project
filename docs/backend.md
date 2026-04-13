# PaperVault - Backend Architecture & Documentation

## Overview
PaperVault's backend is a RESTful API built on **Node.js** encompassing the **Express.js** web framework. The backend manages all secure data routing, payload parsing, file uploads via Cloudinary, robust JWT-based protection logic, and serves as an intermediary between the MySQL Database and the Frontend.

## Core Modules and File Overview

### 1. Application Entry (`server.js`)
This is the root initialization file:
- **Environment & Integrations**: Loads `.env` environmental variables early and uses libraries like `cors`, `helmet`, `compression`, and `morgan` for network security and request formatting.
- **Bootstrapping**: Boots database connectivity (`connectDB()`), resolves model associations (`require('./associations')`), and registers dynamic route endpoints sequentially.
- **Global Error Handling**: Attaches the centralized `errorHandler` block alongside manual fallbacks for unhandled promise rejections.

### 2. Configuration (`/server/config/`)
- **`db.js`**: Integrates `Sequelize` dialect settings utilizing Aiven managed MySQL environmental credentials (host, db_name, ssl checks using `ca.pem`). 
- **`cloudinary.js`**: Stores API configuration maps to authenticate remote asset transfers to the Cloudinary Media interface using `CLOUDINARY_CLOUD_NAME`.

### 3. Middleware (`/server/middleware/`)
Contains interceptors determining how a request proceeds:
- **`auth.js`**: 
  - `protect`: Verifies strict JWT presence encoded in headers. If missing/invalid, throws 404/401 HTTP errors. Decodes user to `req.user`.
  - `optionalAuth`: Light-weight wrapper decoding `req.user` if a token is present but still passes silently allowing partial anonymous endpoints (essential for public paper downloads tracking).
  - `authorize`: Enforces endpoint exclusivity (e.g. `admin` only). 
- **`upload.js`**: Wrapper logic implementing the `multer` utility. It handles `multipart/form-data` constraints locally determining memory buffering limits, PDF constraints, and extension extraction rules before offloading chunks to routes.
- **`errorHandler.js`**: Standardizes error code reporting ensuring the frontend receives a predictable JSON format regardless of application crashing logic.

### 4. Routing Layer (`/server/routes/`)
Routes dictate URL path mapping. Rather than crowding logic, routes bind endpoints explicitly to controller operations.
- **`auth.js`**: Binds `/api/auth/register`, `/login`, `/me`, `/forgotpassword`, `/resetpassword`.
- **`papers.js`**: Focuses on `/api/papers`. Public fetching points, dynamic search patterns (`/:id`), and restricted features like `/pending` and `/:id/approve` using chained `protect` / `authorize('admin')`.
- **`upload.js`**: Resolves POST routes implementing `upload.single('paper')`. It switches cleanly between processing pure local uploads onto disk via `fs` and offloading raw streams to `cloudinary.uploader.upload()`. 
- **`users.js`**: Hosts heavy logic regarding user interaction mechanics internally including `/api/users/profile`, `/bookmarks`, and dynamic interaction mappings like `/downloads` or statistical rollups (`/stats`).

### 5. Controllers (`/server/controllers/`)
Encapsulated logic resolving database reads, mapping JSON data transformations, and resolving success blocks.
- **`paperController.js`**: Highly interactive query logic. 
  - `getPapers`: Employs powerful query builders using `Op.like` dynamic SQL filters for searching pagination and sorting limits. 
  - `downloadPaper`: Highly engineered logic fetching the Cloudinary payload using the Admin App mechanism `download_zip_url` API. Bypasses restricted ACL access controls correctly to serve pristine streams sequentially back to frontend browsers locally using `https.get()`. 
- **`authController.js`**: Uses `setTokenResponse` to wrap JSON web sign logic securely against cookies simultaneously. Performs secure queries resolving user instances safely without injecting plaintext database footprints.

## Backend Interaction Flow
1. **Request Reception**: Request is evaluated through `cors()` allowing origins and headers. 
2. **Route Match**: A request like `GET /api/papers/1/download` activates `papers.js`. 
3. **Middleware**: Hits `optionalAuth`. The JWT matches, making `req.user` accessible securely. 
4. **Resolution**: `downloadPaper` runs, increments numerical counters, creates a `DownloadHistory` entry securely, creates a server-side Cloudinary pipeline download zip string representation, and pipes `cloudRes.pipe(res)` cleanly avoiding backend memory overload.
