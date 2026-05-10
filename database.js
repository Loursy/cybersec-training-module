const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./training.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Successfully connected to SQLite database.");

    // GÜVENLİ TABLO: Platformun gerçek öğrencileri için
    db.run(`CREATE TABLE IF NOT EXISTS system_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            pre_test_score INTEGER DEFAULT 0,
            post_test_score INTEGER DEFAULT 0
        )`);

    // ZAFİYETLİ TABLO: SQL Injection modülü için hedef (Kurban) tablo
    db.run(
      `CREATE TABLE IF NOT EXISTS dummy_admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            password TEXT,
            secret_data TEXT
        )`,
      () => {
        db.get("SELECT COUNT(*) AS count FROM dummy_admins", (err, row) => {
          if (row.count === 0) {
            // Asenkron sorununu çözmek için serialize kullanıyoruz
            db.serialize(() => {
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('admin@vulnerable.com', 'SuperAdmin123!', 'FLAG{SQLi_M4st3r_2026}')",
              );
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('ceo@vulnerable.com', 'BossMan2026', 'Maaş_Bordroları_Gizli.pdf')",
              );
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('it_support@vulnerable.com', 'qwerty', 'Sunucu_Root_Sifreleri.txt')",
              );
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('john.doe@vulnerable.com', 'johnny_bravo', 'Müşteri_Kredi_Kartlari.csv')",
              );
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('jane.smith@hr.vulnerable.com', 'ilovemycat', 'İşten_Çıkarılacaklar_Listesi.docx')",
              );
              db.run(
                "INSERT INTO dummy_admins (email, password, secret_data) VALUES ('walter.mitty@vulnerable.com', 'negative25', 'Kayıp_Negatif_25_Lokasyonu.txt')",
              );
            });
          }
        });
      },
    );

    // BAC & EDE Modülleri için Profiller
    db.run(
      `CREATE TABLE IF NOT EXISTS dummy_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT,
            department TEXT,
            email TEXT,
            phone TEXT,
            secret_message TEXT
        )`,
      () => {
        db.serialize(() => {
              db.run("INSERT OR REPLACE INTO dummy_profiles (id, name, role, department, email, phone, secret_message) VALUES (1, 'Mert Aslan', 'Sistem Yöneticisi', 'Bilişim Teknolojileri', 'mert.a@globalcorp.com', '+90 555 100 0001', 'Root Şifresi: Srv@2026!Master — Üretim sunucusu erişimi. KİMSEYLE PAYLAŞMA.')");
              db.run("INSERT OR REPLACE INTO dummy_profiles (id, name, role, department, email, phone, secret_message) VALUES (2, 'Atakan', 'YBS Uzmanı', 'Bilişim Teknolojileri', 'atakan@globalcorp.com', '+90 555 200 0002', 'Sistem güncelleme notu: Sunucu şifreleri yarın sıfırlanacak.')");
              db.run("INSERT OR REPLACE INTO dummy_profiles (id, name, role, department, email, phone, secret_message) VALUES (3, 'Elif Şahin', 'Güvenlik Analisti', 'Bilişim Teknolojileri', 'elif.s@globalcorp.com', '+90 555 300 0003', 'Pentest Raporu 2026-05: Sistemde 3 kritik zafiyet tespit edildi. Rapor gizli tutulmalıdır.')");
              db.run("INSERT OR REPLACE INTO dummy_profiles (id, name, role, department, email, phone, secret_message) VALUES (4, 'Burak Kılıç', 'CFO', 'Finans', 'burak.k@globalcorp.com', '+90 555 400 0004', 'UYARI: Q4 bilanço raporu gizlendi. Belge: finans_2026_gizli.xlsx')");
            });
      },
    );
  }
});

module.exports = db;
