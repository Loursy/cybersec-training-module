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

// ==========================================
// MODÜL 3: EXCESSIVE DATA EXPOSURE API
// ==========================================
app.post("/api/vuln/ede/search", (req, res) => {
  const { username } = req.body;

  // Zafiyetli Backend: Arayüz sadece isim istiyor ama backend tüm tabloyu yolluyor!
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
        recovery_token: "X7F9-ADMIN-SECURE-KEY", // HACKER'IN ARAYACAĞI VERİ
      },
    });
  }

  return res.json({ success: false, message: "Kullanıcı bulunamadı" });
});

// ==========================================
// MODÜL 4: CROSS-SITE SCRIPTING (XSS) API
// ==========================================
app.post("/api/vuln/xss/search", (req, res) => {
  const { term } = req.body;

  // Zafiyetli Backend: Kullanıcıdan gelen "term" değerini HİÇBİR HTML Encode
  // işlemine tabi tutmadan, olduğu gibi Frontend'e geri yansıtıyor (Reflect).
  // Frontend (xss.html) bu ham veriyi innerHTML ile ekrana basınca zafiyet tetiklenir.

  return res.json({ success: true, term: term });
});

// ==========================================
// MODÜL 5: RATE LIMITING (HIZ SINIRLANDIRMA) API
// ==========================================
// ZAFİYET: Bu API noktasına hiçbir hız sınırlandırması (Örn: express-rate-limit)
// konmamıştır. Bir IP adresi saniyede 1000 istek atsa bile sunucu bunu engellemez.
app.post("/api/vuln/rate/verify", (req, res) => {
  const { otp } = req.body;
  const gercekSmsKodu = "8427"; // Veritabanındaki hedef kod

  // Sistem sadece kodun doğruluğuna bakıyor, kaç kere denendiğine BAKMIYOR!
  if (otp === gercekSmsKodu) {
    return res.json({
      success: true,
      message: "2FA Doğrulandı! Kripto Cüzdanına erişim sağlandı.",
    });
  } else {
    // Hatalı girişte hesabı kilitleme (Account Lockout) mekanizması YOK.
    // Saldırgan sonsuza kadar bu hatayı alıp yeni kod deneyebilir.
    return res.status(401).json({
      success: false,
      message: "Hatalı SMS kodu.",
    });
  }
});
// ==========================================
// MODÜL 6: OS COMMAND INJECTION (SAHTE SİMÜLASYON)
// ==========================================
app.post("/api/vuln/cmd/ping", (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.json({
      success: false,
      output: "Hata: Lütfen bir IP adresi girin.",
    });
  }

  // Zafiyet Simülasyonu: Eğer kullanıcı araya ; veya && veya | koyup komut eklerse
  if (ip.includes(";") || ip.includes("&&") || ip.includes("|")) {
    let output = `PING ${ip.split(/[;&|]/)[0].trim()} (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.042 ms\n\n`;

    // cat sömürüsü (Daha esnek kontrol: sadece 'cat' kelimesi geçiyorsa)
    if (ip.toLowerCase().includes("cat")) {
      output += `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nadmin:x:1000:1000:Admin,,,:/home/admin:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`;
      return res.json({ success: true, isHacked: true, output: output });
    }
    // ls sömürüsü (Daha esnek kontrol: sadece 'ls' kelimesi geçiyorsa)
    if (ip.toLowerCase().includes("ls")) {
      output += `index.html\nserver.js\ndatabase.sqlite\npackage.json\nsecret_keys.txt`;
      return res.json({ success: true, isHacked: true, output: output });
    }
    // whoami sömürüsü (Opsiyonel)
    if (ip.toLowerCase().includes("whoami")) {
      output += `root`;
      return res.json({ success: true, isHacked: true, output: output });
    }

    // Bilinmeyen komut (Eğer cat veya ls dışında rastgele bir şey yazılırsa)
    output += `sh: command not found`;
    return res.json({ success: true, isHacked: true, output: output });
  }

  // Normal Davranış (Zafiyet tetiklenmezse)
  const normalOutput = `PING ${ip} (${ip}): 56 data bytes\n64 bytes from ${ip}: icmp_seq=0 ttl=64 time=0.045 ms\n64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.048 ms\n64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.041 ms\n\n--- ${ip} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss`;

  res.json({ success: true, isHacked: false, output: normalOutput });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda canlıya alındı!`);
});
