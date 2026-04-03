# 🛡️ Interactive Cybersecurity Lab (Etkileşimli Siber Güvenlik Laboratuvarı)

Bu proje, yazılım geliştiricileri ve siber güvenlik meraklıları için tasarlanmış **tamamen etkileşimli, oyunlaştırılmış ve çift dilli (TR/EN)** bir siber güvenlik eğitim platformudur. 

Kullanıcılar; teorik metinler okumak yerine, gerçeğe birebir uygun olarak tasarlanmış arayüzler (Terminal, Web Tarayıcısı, DevTools, Ağ Dinleyicisi) üzerinden sanal sistemleri "hackleyerek" zafiyetleri uygulamalı olarak öğrenirler. Her modül; **Ön-Test, Simülasyon (Sızma), Teknik Analiz (Eğitim) ve Son-Test** olmak üzere 4 aşamadan oluşur.



## ✨ Temel Özellikler

* **🎮 İnteraktif Simülasyonlar:** Gerçekçi web tarayıcısı, ağ trafiği (Network) okuyucu, Brute-Force için Hydra terminali ve OS Command için Linux konsolu.
* **🌍 Çift Dil Desteği:** Tek tıkla Türkçe ve İngilizce arasında anında geçiş (i18n mantığı).
* **🔒 JWT Kimlik Doğrulaması:** Backend rotalarının tamamı JSON Web Token (JWT) ile korunmaktadır.
* **💾 İzole State Management:** Kullanıcı test cevapları (taslaklar), tarayıcı belleğinde (LocalStorage) **kullanıcının e-posta adresine özel** olarak şifrelenir. Böylece aynı cihazda farklı hesaplarla girilse bile "Veri İfşası" yaşanmaz.
* **📈 Dinamik Dashboard:** Kullanıcının tamamladığı modüller, başarı puanları ve rozetleri anlık olarak takip edilir.
* **🎨 Modern UI/UX:** Glassmorphism (cam efekti), dinamik neon parlamalar, Typewriter (harf harf yazma) terminal efektleri ve akıcı CSS animasyonları.

---

## 🦠 Eğitim Modülleri

Sistem şu anda endüstri standardı olan (OWASP Top 10) 6 farklı zafiyet modülünü içermektedir:

1. **💉 SQL Injection (SQLi):** Kullanıcı giriş panelindeki zafiyeti `' OR 1=1 --` payload'u ile atlatarak veritabanı dökümünü alma simülasyonu. Parametreli sorguların (Prepared Statements) önemi öğretilir.
2. **🪪 Broken Access Control (BAC / IDOR):** URL adres çubuğundaki parametreyi (`/profile/2` -> `/profile/1`) değiştirerek yetkisiz yatay/dikey geçiş yapma. Token (JWT) ve Backend doğrulaması öğretilir.
3. **🩻 Excessive Data Exposure:** Ön yüzde gizlenen ancak API'nin arka planda gönderdiği (Network sekmesi) ham JSON verilerini dinleyerek "Kurtarma Şifresini" çalma simülasyonu. DTO (Data Transfer Object) kullanımı öğretilir.
4. **🕷️ Cross-Site Scripting (XSS):** Arama kutusuna zararlı JavaScript `<img src="x" onerror="...">` enjekte ederek Admin'in çerezlerini (Cookie) çalma ve DevTools "Application" sekmesinden yetki yükseltme (Hijack).
5. **🚦 Rate Limiting:** 4 haneli SMS Onay (2FA) kodunu kırmak için sınırlandırılmamış bir API'ye sanal **Hydra Terminali** üzerinden Brute-Force (Kaba Kuvvet) saldırısı yapma. HTTP 429 ve Account Lockout mekanizmaları öğretilir.
6. **⚡ OS Command Injection:** Sıradan bir "Web Ping Aracı"na noktalı virgül (`;`) ile sistem komutları (`; ls`, `; cat /etc/passwd`) enjekte ederek doğrudan sunucu terminalinde Root yetkisi elde etme. İzin listesi (Allowlist) doğrulaması öğretilir.

---

## 🛠️ Kullanılan Teknolojiler

**Frontend (İstemci):**
* [Vue.js 3](https://vuejs.org/) (Composition API, `<script setup>`)
* Vue Router (SPA Yönlendirmeleri)
* Saf CSS3 (Scoped, Flexbox/Grid, Animasyonlar)

**Backend (Sunucu):**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* SQLite3 (Veritabanı) & Firebase Cloud Database
* JSON Web Token (JWT Auth)

---
