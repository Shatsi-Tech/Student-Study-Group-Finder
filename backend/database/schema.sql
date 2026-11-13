-- ==============================================================================
-- STUDENT STUDY GROUP FINDER - DATABASE SCHEMA
-- Institution: Uganda Christian University (UCU)
-- Course: Web and Mobile Application Development
-- Database System: MySQL 8.0+
-- Database Name: student_study_group_finder
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS student_study_group_finder
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_study_group_finder;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    reg_number VARCHAR(40) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    programme VARCHAR(120) NOT NULL,
    faculty VARCHAR(120) NOT NULL,
    year_of_study ENUM('Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate') NOT NULL DEFAULT 'Year 1',
    bio TEXT NULL,
    avatar_url VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_reg (reg_number),
    INDEX idx_user_faculty (faculty),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: study_groups
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS study_groups;
CREATE TABLE study_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    course_code VARCHAR(30) NOT NULL,
    faculty VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    meeting_location VARCHAR(150) NOT NULL,
    meeting_type ENUM('Physical', 'Online', 'Hybrid') NOT NULL DEFAULT 'Physical',
    leader_id INT NOT NULL,
    max_members INT NOT NULL DEFAULT 15,
    status ENUM('Active', 'Archived', 'Suspended') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_group_course_code (course_code),
    INDEX idx_group_faculty (faculty),
    INDEX idx_group_leader (leader_id),
    INDEX idx_group_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: group_members
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS group_members;
CREATE TABLE group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    member_role ENUM('LEADER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    status ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_group_user UNIQUE (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_member_group (group_id),
    INDEX idx_member_user (user_id),
    INDEX idx_member_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: study_sessions
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS study_sessions;
CREATE TABLE study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    created_by INT NOT NULL,
    title VARCHAR(180) NOT NULL,
    study_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_or_link VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('UPCOMING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_session_group (group_id),
    INDEX idx_session_date (study_date),
    INDEX idx_session_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: posts
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('DISCUSSION', 'ANNOUNCEMENT', 'QUESTION') NOT NULL DEFAULT 'DISCUSSION',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_post_group (group_id),
    INDEX idx_post_user (user_id),
    INDEX idx_post_type (post_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Table: comments
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_comment_post (post_id),
    INDEX idx_comment_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Table: notifications
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('SESSION', 'ANNOUNCEMENT', 'MEMBER', 'SYSTEM', 'COMMENT') NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
