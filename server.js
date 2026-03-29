const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const path = require("path");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "siber_guvenlik_lab_gizli_anahtari_123!";
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

// GÜVENLİK GÖREVLİSİ (JWT Doğrulama Middleware'i)
const authenticateToken = (req, res, next) => {
  // Frontend bileti "Authorization: Bearer <token>" formatında gönderecek
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Erişim reddedildi. Geçerli bir biletiniz (token) yok.",
      });
  }

  // Biletin sahte olup olmadığını ve süresini kontrol et
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({
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
      password: hashedPassword, // Artık düz metin değil, hashlenmiş şifre gidiyor!
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Kullanıcıya 24 saat geçerli bir giriş bileti (token) kesiyoruz.
    const token = jwt.sign({ email: safeEmail }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      message: "Kayıt başarılı! Sisteme giriş yapılıyor...",
      token: token, // Frontend'in bu bileti alıp saklaması için gönderiyoruz!
    });
  } catch (error) {
    console.error("Firebase Kayıt Hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Veritabanı hatası oluştu." });
  }
});

// Giriş Yap API
app.post("/api/secure/login", async (req, res) => {
  const { email, password } = req.body;

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

    // Kullanıcı yoksa güvenlik gereği "Kullanıcı bulunamadı" yerine genel bir hata mesajı verilir
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

    // 3. Şifre doğru! Kullanıcıya 24 saatlik giriş bileti (Token) kes
    const token = jwt.sign({ email: safeEmail }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      message: "Giriş başarılı!",
      token: token, // Frontend bu bileti alacak!
    });
  } catch (error) {
    console.error("Firebase Giriş Hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});

// ==========================================
// FIREBASE VERİ YÖNETİMİ (SKORLAR)
// ==========================================

app.post("/api/save-score", async (req, res) => {
  // YENİ: Frontend'den artık "answers" (cevaplar) objesini de bekliyoruz
  const { email, module, preScore, postScore, answers } = req.body;

  try {
    const safeEmail = email.trim().toLowerCase();

    await firestore
      .collection("results")
      .doc(safeEmail)
      .set(
        {
          [module + "_pre"]: preScore,
          [module + "_post"]: postScore,
          [module + "_completed"]: true,
          [module + "_answers"]: answers, // YENİ: Kullanıcının tüm şıklarını veritabanına yazıyoruz!
          last_updated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }, // merge: true sayesinde eski veriler silinmez, yenileri üstüne eklenir
      );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Skor Çekme
app.get("/api/get-user-stats/:email", async (req, res) => {
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
// ZAFİYETLİ MODÜLLER (VULNERABLE) - BUNLAR SQLITE KULLANIR
// ==========================================

// Module 1: SQL Injection
app.post("/api/vuln/sqli/login", (req, res) => {
  const { email } = req.body;
  const query = `SELECT * FROM dummy_admins WHERE email = '${email}'`;
  db.all(query, [], (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    if (rows && rows.length > 0) res.json({ success: true, data: rows });
    else res.status(401).json({ success: false, message: "Kayıt bulunamadı." });
  });
});

// Module 2: Broken Access Control (Vulnerable Endpoint)
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

// Module 3: Excessive Data Exposure API
app.post("/api/vuln/ede/search", (req, res) => {
  const { username } = req.body;
  if (username === "admin") {
    return res.json({
      success: true,
      user: {
        id: 1,
        username: "admin",
        full_name: "Sistem Yöneticisi",
        role: "IT Departmanı",
        salary_usd: 15000,
        home_address: "Cyber Street No: 404, Istanbul",
        password_hash: "$2b$12$eImiTXuWVxfM37uY4JANjQ==...",
        recovery_token: "X7F9-ADMIN-SECURE-KEY",
      },
    });
  }
  return res.json({ success: false, message: "Kullanıcı bulunamadı" });
});

// Module 4: Cross-Site Scripting (XSS) API
app.post("/api/vuln/xss/search", (req, res) => {
  const { term } = req.body;
  return res.json({ success: true, term: term });
});

// Module 5: Rate Limiting (HIZ SINIRLANDIRMA) API
app.post("/api/vuln/rate/verify", (req, res) => {
  const { otp } = req.body;
  const gercekSmsKodu = "8427";
  if (otp === gercekSmsKodu) {
    return res.json({
      success: true,
      message: "2FA Doğrulandı! Kripto Cüzdanına erişim sağlandı.",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Hatalı SMS kodu.",
    });
  }
});

// Module 6: OS Command Injection
app.post("/api/vuln/cmd/ping", (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.json({
      success: false,
      output: "Hata: Lütfen bir IP adresi girin.",
    });
  }

  if (ip.includes(";") || ip.includes("&&") || ip.includes("|")) {
    let output = `PING ${ip.split(/[;&|]/)[0].trim()} (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.042 ms\n\n`;

    if (ip.toLowerCase().includes("cat")) {
      output += `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nadmin:x:1000:1000:Admin,,,:/home/admin:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`;
      return res.json({ success: true, isHacked: true, output: output });
    }
    if (ip.toLowerCase().includes("ls")) {
      output += `index.html\nserver.js\ndatabase.sqlite\npackage.json\nsecret_keys.txt`;
      return res.json({ success: true, isHacked: true, output: output });
    }
    if (ip.toLowerCase().includes("whoami")) {
      output += `root`;
      return res.json({ success: true, isHacked: true, output: output });
    }

    output += `sh: command not found`;
    return res.json({ success: true, isHacked: true, output: output });
  }

  const normalOutput = `PING ${ip} (${ip}): 56 data bytes\n64 bytes from ${ip}: icmp_seq=0 ttl=64 time=0.045 ms\n64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.048 ms\n64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.041 ms\n\n--- ${ip} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss`;
  res.json({ success: true, isHacked: false, output: normalOutput });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda canlıya alındı!`);
});
