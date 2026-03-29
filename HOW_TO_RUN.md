# How to Run PaperVault Locally

Follow these step-by-step instructions to get the PaperVault full-stack application running on your local machine.

## Prerequisites
Before you start, make sure you have the following installed on your system:
- **Node.js** (v16.x or newer) and **npm**
- **Python 3** (for the simple frontend server)
- **MySQL Server** (running locally on port 3306)

---

## 1. Database Setup (MySQL)

We need to create the database and a dedicated user for the application to use.

1. Open your MySQL terminal or interface:
   ```bash
   mysql -u root -p
   ```
2. Execute the following SQL commands to create the database and user:
   ```sql
   CREATE DATABASE IF NOT EXISTS papervault;
   CREATE USER IF NOT EXISTS 'papervault_user'@'localhost' IDENTIFIED BY 'papervault123';
   GRANT ALL PRIVILEGES ON papervault.* TO 'papervault_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Exit MySQL and run the database initialization script (if applicable):
   ```bash
   mysql -u papervault_user -p papervault < server/database_setup.sql
   ```
   *(Enter `papervault123` when prompted for the password).*

---

## 2. Backend Configuration

1. Open a new terminal and navigate to the `server/` directory:
   ```bash
   cd WT_Project/server
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Verify the `.env` file exists in the `server/` directory. It should contain at least:
   ```ini
   PORT=5000
   CLIENT_URL=http://localhost:3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=papervault
   DB_USER=papervault_user
   DB_PASSWORD=papervault123
   ```
   *(Note: Ensure your `GOOGLE_CLIENT_ID` and `JWT_SECRET` are also filled in here).*

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The terminal should confirm: "Server running in development mode on port 5000" and "Database connected & synced successfully").*

---

## 3. Frontend Configuration

We need a dedicated server running on port `3000` to serve the HTML/CSS/JS frontend without hitting CORS issues with Google Auth.

1. Open a **completely new terminal tab/window** (leave the backend running).
2. Navigate to the `frontend/` directory:
   ```bash
   cd WT_Project/frontend
   ```
3. Start the Python HTTP server exactly on port `3000`:
   ```bash
   python3 -m http.server 3000
   ```
   *(If you are on Windows and using an older Python version, you may need to use `python -m http.server 3000`)*.

---

## 4. Access the Application

1. Open your preferred web browser (e.g., Google Chrome).
2. Navigate to: **[http://localhost:3000](http://localhost:3000)**
3. You will be greeted by the PaperVault homepage. Navigate to the login screen and test the Google Authentication!

### Important Tips:
- **Never open HTML files directly** from your file explorer (e.g., `file:///C:/WT_Project/frontend/index.html`). Google Authentication and backend APIs will block the connection. Always explicitly load local pages via `http://localhost:3000`.
- The MySQL Database must be active and running before launching the Node server.
