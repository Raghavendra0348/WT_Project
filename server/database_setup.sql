-- ============================================
-- PaperVault Database Setup Script
-- ============================================
-- Run this script in MySQL to create the database
-- 
-- How to run:
-- 1. Open terminal
-- 2. Run: mysql -u root -p
-- 3. Enter your MySQL password
-- 4. Copy and paste these commands:
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS papervault 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify database was created
SHOW DATABASES LIKE 'papervault';

-- Use the database
USE papervault;

-- Show that we're connected
SELECT 'Database papervault created successfully!' AS Status;

-- ============================================
-- Optional: Create a dedicated user (recommended for production)
-- ============================================
-- CREATE USER 'papervault_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON papervault.* TO 'papervault_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- Note: Tables will be created automatically by Sequelize
-- when you run the server for the first time.
-- ============================================
