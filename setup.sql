-- Database setup for Secure vs Insecure E-Com Simulation
CREATE DATABASE IF NOT EXISTS secure_ecom;
USE secure_ecom;

-- Creating a vulnerable users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255), -- Storing as plain text (Insecure!)
    role VARCHAR(50) DEFAULT 'user',
    bio TEXT
);

-- Creating a vulnerable reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    content TEXT -- Will be used for XSS
);

-- Seed some data
-- Clear existing data first to avoid duplicates during setup
DELETE FROM users;
DELETE FROM reviews;

-- Admin with Hashed Password (SHA-512 for 'admin123')
INSERT INTO users (email, password, role, bio) VALUES (
    'admin@store.com', 
    '7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d', 
    'admin',
    'Admin Private Key: 0x888-SECRET-999'
);

-- Normal User with Plain Text Password (Insecure!)
INSERT INTO users (email, password, role, bio) VALUES (
    'user@store.com', 
    'password123', 
    'user',
    'My home address is 123 Secure Lane, NY.'
);

-- Verify table structure
DESCRIBE users;
DESCRIBE reviews;

-- Verify initial data
SELECT id, email, role, LENGTH(password) as password_len FROM users;
