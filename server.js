const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const path = require("path");
const admin = require("firebase-admin");

// Firebase Admin Başlatma
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// ==========================================
// ANA PLATFORM GİRİŞ/KAYIT (SECURE)
// ==========================================

// Kayıt Ol API
app.post("/api/secure/register", (req, res) => {
  const { email, password } = req.body;

  // Sunucu tarafı kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Geçersiz e-posta formatı!" });
  }

  const query = `INSERT INTO system_users (email, password) VALUES (?, ?)`;
  db.run(query, [email, password], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Email zaten kullanımda!" });
    }
    res.json({ success: true, message: "Kayıt başarılı!" });
  });
});

// Giriş Yap API
app.post("/api/secure/login", (req, res) => {
  const { email, password } = req.body;
  db.get(
    "SELECT * FROM system_users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (row) {
        console.log(`Giriş başarılı: ${email}`);
        res.json({ success: true, message: "Giriş başarılı!" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Hatalı email veya şifre!" });
      }
    },
  );
});

// ==========================================
// FIREBASE VERİ YÖNETİMİ
// ==========================================

// Skor Kaydetme
app.post("/api/save-score", async (req, res) => {
  const { email, module, preScore, postScore } = req.body;
  try {
    await firestore
      .collection("results")
      .doc(email)
      .set(
        {
          [module + "_pre"]: preScore,
          [module + "_post"]: postScore,
          [module + "_completed"]: true,
          last_updated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Skor Çekme
app.get("/api/get-user-stats/:email", async (req, res) => {
  try {
    const doc = await firestore
      .collection("results")
      .doc(req.params.email)
      .get();
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
app.post("/api/vuln/sqli/login", (req, res) => {
  const { email } = req.body;
  // Buradaki zafiyetli sorguyu koruyoruz (Tez gereği)
  const query = `SELECT * FROM dummy_admins WHERE email = '${email}'`;
  db.all(query, [], (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    if (rows && rows.length > 0) res.json({ success: true, data: rows });
    else res.status(401).json({ success: false, message: "Kayıt bulunamadı." });
  });
});

// Module 2: Broken Access Control (Vulnerable Endpoint)
/* KASITLI ZAFİYET: Normalde kullanıcının gerçekten o ID'ye sahip olup olmadığı 
   (Token veya Session üzerinden) kontrol edilmelidir. 
   Ancak burada, dışarıdan (frontend'den) gelen 'id' parametresine körü körüne güveniyoruz.
*/

app.get("/api/vuln/bac/profile/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM dummy_profiles WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    if (row) res.json({ success: true, data: row });
    else
      res.status(404).json({ success: false, message: "Profil bulunamadı." });
  });
});

app.listen(3000, () =>
  console.log("Sunucu http://localhost:3000 üzerinde çalışıyor."),
);
