# PaperVault - Database Architecture & Documentation

## Overview
PaperVault uses **MySQL** as its relational database. The Object-Relational Mapping (ORM) Tool used to interact with the database is **Sequelize**. The database acts as a central repository for user accounts, uploaded question papers, bookmark functionality, reviews, and a detailed audit trail of download activities. 

## Entity-Relationship (ER) Models and Files
The models are stored in the `/server/models/` directory.

### 1. User Model (`User.js`)
Handles everything related to authentication and user profiles. 
* **`id`**: Primary Key, auto-incremented INT.
* **`name`**: VARCHAR(50). User's full name.
* **`email`**: VARCHAR(255). Unique string used for login. 
* **`password`**: VARCHAR(255). Contains a bcrypt-hashed representation of the user password. 
* **`role`**: ENUM constraint allowing values `student` or `admin`. Defaults to `student`. 
* **`course`**: ENUM for either `intermediate` or `engineering`.
* **`year`**: INT. Used for academic year filtering (1-4).
* **`semester`**: INT. Defines semester (1-2).
* **`resetPasswordToken`** & **`resetPasswordExpire`**: Used for password recovery implementations.
* **Hooks & Methods**: The schema incorporates `beforeCreate` and `beforeUpdate` hooks to automatically hash the password using `bcryptjs`. Methods like `matchPassword()` are attached to instances.

### 2. Paper Model (`Paper.js`)
Represents the educational resources logic. Stores paths linking to physical/cloud files.
* **`id`**: Primary Key.
* **`title`**: String. High-level descriptor of the document.
* **`category`**: ENUM (`intermediate`, `engineering`).
* **`course`**: Contextual course name (e.g., CSE, ECE, MPC, BiPC).
* **`year`** & **`semester`**: Academic bounds.
* **`subject`**: Explicit module code/name.
* **`examType`**: ENUM (`midterm`, `final`, `other`).
* **`examYear`**: INT (eg. 2024).
* **`fileUrl`**: Directly links to the Cloudinary remote secure URL or local static directory tree. 
* **`filePublicId`**: Required for signing programmatic Cloudinary zip streams or deleting files upon removal.
* **`uploadedById`**: Foreign Key referencing the user who uploaded the document.
* **`status`**: ENUM (`pending`, `approved`, `rejected`). Defaults to `pending` to allow admin review pipelines.
* **`views`** & **`downloads`**: Statistical integers incremented mechanically.

### 3. Bookmark Model (`Bookmark.js`)
Serves as the junction/through-table mapping Many-to-Many relationships between `Users` and `Papers` allowing quick resource saving.
* **`id`**: PK.
* **`userId`**: Maps to `User.id`. (Database column: user_id)
* **`paperId`**: Maps to `Paper.id`. (Database column: paper_id)
* **Constraints**: Implements a compound unique index on `(user_id, paper_id)` protecting against duplicate saves. 

### 4. DownloadHistory Model (`DownloadHistory.js`)
An immutable audit log for keeping track of active engagement streams. 
* **`id`**: PK.
* **`userId`**: Which user downloaded the file.
* **`paperId`**: Which paper was downloaded. 
* **`downloadedAt`**: Automatically mapped to `Sequelize.NOW`. 

### 5. Review Model (`Review.js`)
Allows comments, ratings, and feedback on particular papers.
* **`id`**: PK.
* **`rating`**: INT between 1 and 5.
* **`comment`**: Text blob describing the user's feedback. 
* **`userId`** & **`paperId`**: Standard relational foreign keys.

## Database Associations (`associations.js`)
The `associations.js` file glues the entity relations properly so that Express controllers can query deeply nested relationships using `include`.

* **One-to-Many**: `User` has many `Paper` (as `uploadedPapers`). 
* **Many-to-Many**: `User` belongs to many `Paper` via `Bookmark`. 
* **One-to-Many**: `User` and `Paper` have multiple `DownloadHistory` records. Tracking helps populate user dashboard statistics.
* **One-to-Many**: `Paper` operates with many `Review` items. 

## Flow & Data Pipeline
1. **Migrations & Initialization**: On launch (`npm run dev`), the `server.js` calls `connectDB()`, and `sequelize.sync()` automatically creates the mapped data tables if they don't exist. 
2. **Access Flow**: The Express request enters passing the JWT. The ORM translates endpoints like `GET /api/users/bookmarks` into `SELECT` queries across `users` JOIN `bookmarks` JOIN `papers`.
3. **Stat Processing**: The database employs statistical mathematical queries via hooks directly like `[[sequelize.fn('SUM', sequelize.col('downloads')), 'total']]` within the `/api/stats` boundary.
