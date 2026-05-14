# 🛡️ Full-Stack Security Lab: Vulnerability & AI-Defense
A comprehensive educational platform designed to demonstrate the "Cause and Effect" of common web vulnerabilities and their modern remediations. This project features a unique Security Toggle that shifts the entire application architecture between an insecure, legacy state and a hardened, AI-protected environment.
## 🚀 Features
### Dynamic Security Toggle: 
Real-time switching between Insecure and Secure modes.
### Vulnerability Demonstrations: 
Hands-on labs for SQL Injection, XSS, IDOR, and CSRF.
### Cryptographic Hardening: 
Implementation of SHA-512 hashing.
### AI Moderation: 
Natural Language Processing (NLP) layer to detect toxic content and anomalous behavior.
### Cloud Ready: 
Configured for local or cloud-based MySQL deployment.
## 🛠️ Tech Stack
- Frontend: React.js, Axios
- Backend: Node.js, Express.js
- Database: MySQL (Local or Cloud/TIDB)
- Security/AI: Crypto-JS, Natural (NLP Library)
## 📥 Installation & Setup
# Database Configuration
1. Run the following queries in your MySQL terminal to set up the schema and seed the initial admin user:
SQLCREATE DATABASE secure_ecom;
USE secure_ecom;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL
);

-- Seed Admin (Password: admin123)
INSERT INTO users (email, password, role) VALUES 
('admin@test.com', '482243d2ec9434860df100e4085f16c708764020a442e9734e569a710e206037a5089223e7f975877c86a3449339e0839e4e6f982a7a407f35b2721f57912d09', 'admin');

2. Backend Setup
Bashcd backend
npm install express mysql2 cors crypto-js natural dotenv
4. Update DB credentials in server.js
node server.js
5. Frontend SetupBashcd frontend
npm install axios
npm start
## 🧪 Laboratory Guide
### Lab 1: SQL Injection & Hashing
### Insecure Mode: 
Login using ' OR '1'='1. The server will grant access because it concatenates raw strings into the query.
### Secure Mode: 
The attack fails. The server uses Parameterized Queries and hashes your input with SHA-512 to match the database.
## Lab 2: Stored XSS (Cross-Site Scripting)
### Insecure Mode: 
Post a review: <img src=x onerror=alert('Hacked')>. The script executes immediately.Secure Mode: The same post is rendered as harmless text. React’s automatic escaping is used to neutralize the payload.
## Lab 3: AI-Driven Content Moderation
### Action: 
Enable Secure Mode and then toggle AI Moderation.
Test: Attempt to post a highly toxic comment (e.g., "I hate this app and everyone here").
Result: The natural library calculates a sentiment score. If the score is too negative, the AI blocks the post at the application layer.
## Lab 4: IDOR & CSRF
### IDOR: 
In secure mode, direct access to profile IDs is blocked via server-side authorization checks.
### CSRF: 
The "Place Order" button requires a custom security header (X-CSRF-TOKEN) in secure mode; otherwise, the transaction is rejected.
# 📝 Troubleshooting
401 Unauthorized: Ensure the hash in the DB is exactly 128 characters (no extra spaces).
CORS Error: Ensure the frontend is on port 3000 and backend is on port 5000.
MySQL Not Recognized: Add the MySQL bin folder to your System Environment Variables (PATH).
# 🎓 Academic Disclaimer
This project is for educational purposes only. It contains intentional vulnerabilities to demonstrate security flaws. Do not deploy the "Insecure Mode" logic to a public production environment.
