const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');
const admin = require("firebase-admin");

// Firebase Admin Başlatma
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// ==========================================
// ANA PLATFORM GİRİŞ/KAYIT (SECURE)
// ==========================================

// Kayıt Ol API
app.post('/api/secure/register', (req, res) => {
    const { email, password } = req.body;
    const query = `INSERT INTO system_users (email, password) VALUES (?, ?)`;
    db.run(query, [email, password], (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Email zaten kullanımda!' });
        }
        res.json({ success: true, message: 'Kayıt başarılı!' });
    });
});

// Giriş Yap API
app.post('/api/secure/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM system_users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (row) {
            console.log(`Giriş başarılı: ${email}`);
            res.json({ success: true, message: 'Giriş başarılı!' });
        } else {
            res.status(401).json({ success: false, message: 'Hatalı email veya şifre!' });
        }
    });
});

// ==========================================
// FIREBASE VERİ YÖNETİMİ
// ==========================================

// Skor Kaydetme
app.post('/api/save-score', async (req, res) => {
    const { email, module, preScore, postScore } = req.body;
    try {
        await firestore.collection("results").doc(email).set({
            [module + "_pre"]: preScore,
            [module + "_post"]: postScore,
            [module + "_completed"]: true,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Skor Çekme
app.get('/api/get-user-stats/:email', async (req, res) => {
    try {
        const doc = await firestore.collection("results").doc(req.params.email).get();
        if (doc.exists) {
            res.json({ success: true, data: doc.data() });
        } else {
            res.json({ success: true, data: {} });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// ZAFİYETLİ MODÜLLER (VULNERABLE)
// ==========================================

// Module 1: SQL Injection
app.post('/api/vuln/sqli/login', (req, res) => {
    const { email } = req.body;
    // Buradaki zafiyetli sorguyu koruyoruz (Tez gereği)
    const query = `SELECT * FROM dummy_admins WHERE email = '${email}'`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (rows && rows.length > 0) res.json({ success: true, data: rows });
        else res.status(401).json({ success: false, message: 'Kayıt bulunamadı.' });
    });
});

app.listen(3000, () => console.log('Sunucu http://localhost:3000 üzerinde çalışıyor.'));