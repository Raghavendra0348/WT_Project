# 🚀 PaperVault — Deployment Guide

Deploy PaperVault with **GitHub + Vercel (Frontend) + Render (Backend)**.

---

## 📋 What You Need Before Starting

| Service | Sign Up Link | Purpose |
|---------|-------------|---------|
| GitHub | [github.com](https://github.com) | Code hosting |
| Vercel | [vercel.com](https://vercel.com) | Frontend hosting |
| Render | [render.com](https://render.com) | Backend API hosting |
| Cloudinary | [cloudinary.com](https://cloudinary.com) | PDF file storage |

> **Tip:** Sign up for Vercel and Render using your GitHub account — it links your repos automatically.

---

## 🏗️ Project Architecture

```
User Browser
    │
    ├── Frontend (Vercel) ── Static HTML/CSS/JS
    │       │
    │       └── API calls ──► Backend (Render) ── Node.js/Express
    │                              │
    │                              ├── MySQL Database (Aiven Cloud)
    │                              └── File Storage (Cloudinary)
```

---

## Step 1: Set Up Cloudinary (File Storage)

Uploaded PDFs need cloud storage because Vercel/Render delete local files on redeploy.

1. Go to [cloudinary.com](https://cloudinary.com) → **Sign Up** (free)
2. After login, go to **Dashboard**
3. Copy these 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Open `server/.env` and replace the Cloudinary placeholders:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

---

## Step 2: Push Code to GitHub

### 2.1 — Make sure secrets are NOT committed

Check that `.gitignore` includes these (it should already):
```
.env
client_secret_*.json
ca.pem
uploads/
```

### 2.2 — Commit and Push

Open terminal in the project root folder:

```bash
cd /home/a-raghavendra/Desktop/WT_PROJECT/WT_Project

git add .
git commit -m "Prepare PaperVault for deployment"
git push origin main
```

Your repo: `https://github.com/Raghavendra0348/WT_Project`

---

## Step 3: Deploy Backend on Render.com

### 3.1 — Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended — auto-links your repos)

### 3.2 — Create New Web Service
1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"** → **Next**
3. Find and select `Raghavendra0348/WT_Project` → **Connect**

### 3.3 — Configure the Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `papervault-api` |
| **Region** | `Singapore (Southeast Asia)` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 3.4 — Add Environment Variables

Scroll down to **"Environment Variables"** section or go to **Environment** tab after creation.

Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DB_HOST` | *(your Aiven MySQL host)* |
| `DB_PORT` | *(your Aiven MySQL port)* |
| `DB_NAME` | *(your database name)* |
| `DB_USER` | *(your database username)* |
| `DB_PASSWORD` | *(your database password)* |
| `DB_SSL` | `true` |
| `JWT_SECRET` | *(generate a strong random secret)* |
| `JWT_EXPIRE` | `30d` |
| `GOOGLE_CLIENT_ID` | *(your Google OAuth client ID)* |
| `CLOUDINARY_CLOUD_NAME` | *(your Cloudinary cloud name)* |
| `CLOUDINARY_API_KEY` | *(your Cloudinary API key)* |
| `CLOUDINARY_API_SECRET` | *(your Cloudinary API secret)* |
| `SYNC_DB` | `true` |

> ⚠️ **IMPORTANT:** After the first successful deploy, go back and change `SYNC_DB` to `false` to prevent accidental database changes.

### 3.5 — Add SSL Certificate (for Aiven MySQL)

Aiven MySQL requires an SSL certificate. On Render:

1. Go to your service → **Environment** tab
2. Scroll to **"Secret Files"** section
3. Click **"Add Secret File"**
   - **Filename:** `ca.pem`
   - **Contents:** Open your local `server/ca.pem` file, copy ALL its contents, and paste here
4. Add one more environment variable:

| Key | Value |
|-----|-------|
| `DB_SSL_CA` | `/etc/secrets/ca.pem` |

### 3.6 — Deploy

1. Click **"Create Web Service"**
2. Wait 2–5 minutes for the build and deploy
3. Once deployed, you'll see a URL like:
   ```
   https://papervault-api.onrender.com
   ```
4. **Copy this URL** — you need it for the next step

### 3.7 — Test Backend

Open in browser:
```
https://papervault-api.onrender.com/api/health
```

You should see:
```json
{ "success": true, "message": "PaperVault API is running!" }
```

---

## Step 4: Update Frontend API URL

Before deploying the frontend, update it to point to your Render backend.

### 4.1 — Edit `frontend/js/config.js`

Replace the `API_URL` section with:

```javascript
const CONFIG = {
    API_URL: (() => {
        const hostname = window.location.hostname;
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:') {
            const protocol = window.location.protocol === 'file:' ? 'http:' : window.location.protocol;
            const host = window.location.hostname || 'localhost';
            return `${protocol}//${host}:5000/api`;
        }
        // Production — Render backend
        return 'https://papervault-api.onrender.com/api';
    })(),

    // ... keep everything else the same
```

> **Replace** `papervault-api` with your actual Render service name if different.

### 4.2 — Commit and Push

```bash
cd /home/a-raghavendra/Desktop/WT_PROJECT/WT_Project
git add frontend/js/config.js
git commit -m "Update API URL for production"
git push origin main
```

---

## Step 5: Deploy Frontend on Vercel

### 5.1 — Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → choose **"Continue with GitHub"**

### 5.2 — Import Project
1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find `Raghavendra0348/WT_Project` in the list → click **"Import"**

### 5.3 — Configure Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Other` |
| **Root Directory** | Click **"Edit"** → type `frontend` → click **"Continue"** |
| **Build Command** | *(leave empty — it's static HTML)* |
| **Output Directory** | `.` |
| **Install Command** | *(leave empty)* |

### 5.4 — Deploy
1. Click **"Deploy"**
2. Wait 1–2 minutes
3. Your frontend is now live at:
   ```
   https://wt-project-xxxx.vercel.app
   ```
4. **Copy this URL** — you need it for the next step

---

## Step 6: Post-Deployment Configuration

### 6.1 — Update CORS on Backend

Go to Render → Your Service → **Environment** tab:

1. Add/Update this variable:

| Key | Value |
|-----|-------|
| `CLIENT_URL` | `https://wt-project-xxxx.vercel.app` *(your actual Vercel URL)* |

2. The server will auto-redeploy with the new CORS setting.

### 6.2 — Update CORS in Code (for safety)

Edit `server/server.js`, add your Vercel URL to the `allowedOrigins` array:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:3000',
    'http://127.0.0.1:3000',
    'https://wt-project-xxxx.vercel.app',   // ← ADD YOUR VERCEL URL
    process.env.CLIENT_URL || 'http://localhost:3000'
];
```

Then commit and push:
```bash
git add server/server.js
git commit -m "Add Vercel URL to CORS"
git push origin main
```

Render will auto-redeploy.

### 6.3 — Update Google OAuth (for Google Login)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized JavaScript Origins**, add:
   ```
   https://wt-project-xxxx.vercel.app
   ```
4. Under **Authorized Redirect URIs**, add:
   ```
   https://wt-project-xxxx.vercel.app/login.html
   ```
5. Click **Save**

---

## Step 7: Final Testing ✅

Open your Vercel URL and test:

- [ ] Homepage loads correctly
- [ ] Login page works
- [ ] Google Sign-In works
- [ ] Dashboard shows papers
- [ ] Upload a paper → file goes to Cloudinary
- [ ] Download a paper → PDF opens
- [ ] Bookmarks work
- [ ] Admin panel works (if admin user)

---

## 🔧 Troubleshooting

### "API not responding" or CORS errors
- Check Render dashboard → is the service running?
- Verify `CLIENT_URL` on Render matches your Vercel URL exactly
- Render free tier sleeps after 15 min inactivity. First request takes ~30s to wake up.

### "File upload failed"
- Verify Cloudinary credentials are correct in Render environment variables
- Check Render logs for error details

### "Database connection failed"
- Verify all `DB_*` environment variables on Render
- Make sure `ca.pem` is added as a Secret File on Render
- Make sure `DB_SSL_CA` is set to `/etc/secrets/ca.pem`

### Google Login not working
- Make sure your Vercel URL is added to Google OAuth authorized origins
- Both `https://` and exact URL (no trailing slash) must match

### Render service keeps restarting
- Set `SYNC_DB` to `false` after first deploy
- Check logs in Render Dashboard → **Logs** tab

---

## 📝 Quick Reference

| What | URL |
|------|-----|
| GitHub Repo | `https://github.com/Raghavendra0348/WT_Project` |
| Frontend (Vercel) | `https://wt-project-xxxx.vercel.app` |
| Backend (Render) | `https://papervault-api.onrender.com` |
| Backend Health Check | `https://papervault-api.onrender.com/api/health` |

---

## 💡 Tips

- **Auto-deploy:** Both Vercel and Render auto-deploy when you push to `main` branch
- **Render cold starts:** Free tier sleeps after 15 min. Use [cron-job.org](https://cron-job.org) to ping `/api/health` every 14 minutes to keep it awake
- **Custom domain:** Both Vercel and Render support custom domains in project settings
- **Environment changes:** On Render, changing env vars triggers auto-redeploy
