require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const path = require("path");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "siber_guvenlik_lab_gizli_anahtari_123!";
// ==========================================
// FIREBASE ADMİN BAŞLATMA (GERÇEK VERİLER İÇİN)
// ==========================================
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = admin.firestore();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// ==========================================
// GÜVENLİK GÖREVLİSİ (JWT Doğrulama Middleware'i)
// ==========================================
const authenticateToken = (req, res, next) => {
  // Frontend bileti "Authorization: Bearer <token>" formatında gönderecek
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Erişim reddedildi. Geçerli bir biletiniz (token) yok.",
    });
  }

  // Biletin sahte olup olmadığını ve süresini kontrol et
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Oturum süreniz dolmuş veya bilet geçersiz.",
      });
    }

    // Bilet geçerliyse kullanıcının bilgilerini (user.email) isteğe ekle ve kapıyı aç
    req.user = user;
    next();
  });
};

// ==========================================
// ANA PLATFORM GİRİŞ/KAYIT (TAMAMEN FIREBASE)
// ==========================================

// Kayıt Ol API
app.post("/api/secure/register", async (req, res) => {
  const { email, password } = req.body;

  // 1. BACKEND GİRDİ DOĞRULAMASI (KATI REGEX)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message:
        "Geçersiz e-posta formatı. Lütfen gerçek bir e-posta adresi girin.",
    });
  }

  if (!password || password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "Şifre en az 4 karakter olmalıdır.",
    });
  }

  try {
    const safeEmail = email.trim().toLowerCase();

    // 1. Kullanıcı Firebase'de var mı diye kontrol et
    const userRef = firestore.collection("users").doc(safeEmail);
    const doc = await userRef.get();

    if (doc.exists) {
      return res
        .status(400)
        .json({ success: false, message: "Bu e-posta zaten kullanımda!" });
    }

    // 2. Şifreyi Hashle (Güvenlik Katmanı)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Kullanıcı yoksa Firebase'e şifrelenmiş halde kaydet
    await userRef.set({
      email: safeEmail,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Kullanıcıya 24 saat geçerli bir giriş bileti (token) kesiyoruz.
    const token = jwt.sign({ email: safeEmail }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      message: "Kayıt başarılı! Sisteme giriş yapılıyor...",
      token: token,
    });
  } catch (error) {
    console.error("Firebase Kayıt Hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Veritabanı hatası oluştu." });
  }
});

// Giriş Yap API (BENİ HATIRLA EKLENDİ)
app.post("/api/secure/login", async (req, res) => {
  // Frontend'den artık rememberMe bilgisini de bekliyoruz
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "E-posta ve şifre zorunludur." });
  }

  try {
    const safeEmail = email.trim().toLowerCase();

    // 1. Kullanıcıyı Firebase'den bul
    const userRef = firestore.collection("users").doc(safeEmail);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res
        .status(401)
        .json({ success: false, message: "Hatalı e-posta veya şifre!" });
    }

    const userData = doc.data();

    // 2. Girilen şifre ile Firebase'deki Hashlenmiş şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Hatalı e-posta veya şifre!" });
    }

    // 3. Şifre doğru! Beni Hatırla durumuna göre bilete ömür biç:
    // İşaretliyse 30 gün (30d), değilse 1 saat (1h)
    const tokenExpireTime = rememberMe ? "30d" : "1h";

    const token = jwt.sign({ email: safeEmail }, JWT_SECRET, {
      expiresIn: tokenExpireTime,
    });

    res.json({
      success: true,
      message: "Giriş başarılı!",
      token: token,
    });
  } catch (error) {
    console.error("Firebase Giriş Hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});

// ==========================================
// FIREBASE VERİ YÖNETİMİ (SKORLAR) - KORUMA EKLENDİ
// ==========================================

const ALL_MODULES = ["bac", "sqli", "cf"];

app.post("/api/save-score", authenticateToken, async (req, res) => {
  const { email, module, preScore, postScore, answers } = req.body;

  try {
    const safeEmail = email.trim().toLowerCase();
    const diff = postScore - preScore;
    const docRef = firestore.collection("results").doc(safeEmail);

    // 1. Modül skorunu kaydet
    await docRef.set(
      {
        [module + "_pre"]: preScore,
        [module + "_post"]: postScore,
        [module + "_diff"]: diff,
        [module + "_completed"]: true,
        [module + "_answers"]: answers,
        last_updated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    // 2. Güncel dökümanı çek ve özet istatistikleri hesapla
    const doc = await docRef.get();
    const data = doc.data() || {};

    const completedModules = ALL_MODULES.filter((m) => data[m + "_completed"]);
    const completedCount = completedModules.length;

    let summaryFields = { summary_completedCount: completedCount };

    if (completedCount > 0) {
      const totalPre = completedModules.reduce((sum, m) => sum + (data[m + "_pre"] || 0), 0);
      const totalPost = completedModules.reduce((sum, m) => sum + (data[m + "_post"] || 0), 0);
      const avgPre = Math.round(totalPre / completedCount);
      const avgPost = Math.round(totalPost / completedCount);
      summaryFields = {
        summary_completedCount: completedCount,
        summary_avgPre: avgPre,
        summary_avgPost: avgPost,
        summary_avgDiff: avgPost - avgPre,
        summary_completedModules: completedModules.join(", "),
      };
    }

    // 3. Özeti aynı dökümanın içine yaz
    await docRef.set(summaryFields, { merge: true });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Skor Çekme
app.get("/api/get-user-stats/:email", authenticateToken, async (req, res) => {
  try {
    const safeEmail = req.params.email.trim().toLowerCase();
    const doc = await firestore.collection("results").doc(safeEmail).get();
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
// ZAFİYETLİ MODÜLLER (VULNERABLE) - KORUMA EKLENDİ
// ==========================================

// Module 1: SQL Injection
app.post("/api/vuln/sqli/login", authenticateToken, (req, res) => {
  const { email } = req.body;
  const query = `SELECT * FROM dummy_admins WHERE email = '${email}'`;
  db.all(query, [], (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    if (rows && rows.length > 0) res.json({ success: true, data: rows });
    else res.status(401).json({ success: false, message: "Kayıt bulunamadı." });
  });
});

// Module 2: Broken Access Control - Admin (Vulnerable: authenticates but never checks role)
app.get("/api/vuln/bac/admin", authenticateToken, (req, res) => {
  db.all("SELECT id, name, role, department, email FROM dummy_profiles", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({
      success: true,
      data: {
        totalUsers: 247,
        activeSessions: 31,
        pendingAlerts: 3,
        lastBackup: "2026-05-06 03:00 UTC",
        users: rows,
      },
    });
  });
});

// Module 2: Broken Access Control - Profile
app.get("/api/vuln/bac/profile/:id", authenticateToken, (req, res) => {
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

// Module 2: Cryptographic Failures API
app.post("/api/vuln/cf/check", authenticateToken, (req, res) => {
  res.json({ success: true });
});


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda canlıya alındı!`);
});
