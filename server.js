require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const CryptoJS = require("crypto-js");
const natural = require('natural'); // AI Library

const app = express();
app.use(cors());
app.use(express.json());

// AI Tools Setup
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'secure_ecom',
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: true
    }
});

let isSecureMode = false;
let isAiEnabled = false; // New state for AI

app.post('/api/toggle-security', (req, res) => {
    isSecureMode = req.body.isSecure;
    res.json({ isSecure: isSecureMode });
});

// New AI Toggle Endpoint
app.post('/api/toggle-ai', (req, res) => {
    isAiEnabled = req.body.isAiEnabled;
    console.log("AI Moderation Status:", isAiEnabled);
    res.json({ isAiEnabled });
});

// 1. LOGIN (Hashed & Parameterized)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (isSecureMode) {
        const hashedPassword = CryptoJS.SHA512(password).toString();
        const query = "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) res.send({ message: "Secure Login Success!", user: result[0] });
            else res.status(401).send({ message: "Invalid Credentials" });
        });
    } else {
        const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) res.send({ message: "Insecure Login Success!", user: result[0] });
            else res.status(401).send({ message: "Invalid Credentials" });
        });
    }
});

// 2. REVIEWS (With AI Layer)
app.post('/api/reviews', (req, res) => {
    const { content } = req.body;
    if (!content) {

        return res.status(400).send({ message: "Review content is required" });

    }

    // AI MODERATION LAYER
    if (isSecureMode && isAiEnabled) {
        const tokens = tokenizer.tokenize(content);
        const sentimentScore = analyzer.getSentiment(tokens);

        console.log(`AI Analysis - Score: ${sentimentScore}, Content: ${content}`);

        // Block if sentiment is very negative or looks like code/gibberish
        if (sentimentScore <= -1 || content.includes("<") || tokens.length < 2) {
            return res.status(403).json({
                message: `AI BLOCK: Review rejected. (Sentiment Score: ${sentimentScore.toFixed(2)})`
            });
        }
    }

    if (isSecureMode) {

        // SECURE PATH

        db.query("INSERT INTO reviews (content) VALUES (?)", [content], (err, result) => {

            if (err) {

                console.error("SECURE INSERT ERROR:", err);

                return res.status(500).send(err);

            }

            res.send({ message: "Review posted securely!" });

        });

    } else {

        // INSECURE PATH

        const query = `INSERT INTO reviews (content) VALUES ('${content}')`;

        db.query(query, (err, result) => {

            if (err) {

                console.error("INSECURE INSERT ERROR:", err);

                return res.status(500).send(err);

            }

            res.send({ message: "Review posted (Insecure)!" });

        });

    }
});

app.get('/api/reviews', (req, res) => {
    db.query("SELECT * FROM reviews", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// 3. PROFILE (IDOR)
app.get('/api/profile/:id', (req, res) => {
    if (isSecureMode) return res.status(403).send({ message: "Access Denied." });
    db.query(`SELECT id, email, role FROM users WHERE id = ${req.params.id}`, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result[0]);
    });
});

// 4. ORDER (CSRF)
app.post('/api/place-order', (req, res) => {
    if (isSecureMode && !req.headers['x-csrf-token']) {
        return res.status(403).send({ message: "CSRF Blocked!" });
    }
    res.send({ message: "Order Placed!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server LIVE on port ${PORT}`));
