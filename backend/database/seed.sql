-- ==============================================================================
-- STUDENT STUDY GROUP FINDER - ADMINISTRATOR SEED DATA
-- Institution: Uganda Christian University (UCU)
-- Administrator Credentials:
--   Name:        Karongo Shatsi
--   Email:       shatsikarongo55@mail.com
--   Password:    Shatsi@1234
--   Role:        ADMIN (System Administrator)
-- ==============================================================================

USE student_study_group_finder;

-- ------------------------------------------------------------------------------
-- 1. Insert Master Administrator
-- ------------------------------------------------------------------------------
INSERT INTO users (id, full_name, reg_number, email, password_hash, role, programme, faculty, year_of_study, bio, avatar_url, is_active) VALUES
(1, 'Karongo Shatsi', 'UCU/ADM/2024/001', 'shatsikarongo55@mail.com', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'ADMIN', 'Academic Administration', 'Faculty of Science & Technology', 'Postgraduate', 'Lead System Administrator for UCU Student Study Group Finder platform.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), email=VALUES(email);
