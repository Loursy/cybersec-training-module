<template>
  <div class="module-wrapper">
    <div class="dot-grid"></div>

    <div class="container">
      <button class="lang-btn" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>

      <div v-if="isLoading" class="loading-screen">
        <span class="spinner"></span>
        <p>{{ currentLang === 'tr' ? 'Sunucu ile iletişim kuruluyor...' : 'Communicating with server...' }}</p>
      </div>

      <div v-else class="module-content fade-in">
        <h1 class="mod-title">{{ currentText.modTitle }}</h1>
        <div class="neon-divider"></div>

        <div v-if="currentStep === 1" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Ön-Test Analizi' : '🔍 Review Mode: Pre-Test Analysis') : currentText.s1Title }}
          </h2>
          <p class="step-desc" v-if="!isReviewMode">{{ currentText.s1Desc }}</p>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'pre'+index">
            <p><b v-html="currentText[`preQ${q}Text`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" :class="getLabelClass('pre', `q${q}`, opt)">
                <input type="radio" v-model="answers[`preQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`preQ${q}${opt}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer">
            <button class="btn-primary" @click="finishPreTest">
              {{ isReviewMode ? (currentLang === 'tr' ? 'Sonraki Aşama (Simülasyon)' : 'Next Step (Simulation)') : currentText.btnNext1 }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Simülasyon' : '🔍 Review Mode: Simulation') : currentText.s2Title }}
          </h2>
          
          <div class="mission-layout">
            <div class="guide-panel">
              <div class="summary-box">
                <p>{{ currentText.s2Summary }}</p>
              </div>
              
              <div class="mission-briefing">
                <div class="brief-header">
                  <span class="pulse-icon"></span> 
                  <b>{{ currentText.gTitle }}</b>
                </div>
                <div class="brief-body">
                  <p v-html="currentText.s2Desc"></p>
                </div>
              </div>
            </div>

            <div class="app-container">
              <div class="simulation-box" :class="{'system-hacked': exploitStatus === 'success'}">
                <div class="sim-header">
                  <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                  <span style="margin-left: 10px; font-family: monospace; color: #94a3b8;">admin.globalcorp.local</span>
                </div>

                <div class="hacking-overlay" v-if="exploitStatus === 'hacking'">
                  <div class="hack-spinner"></div>
                  <p class="blink-text">{{ currentLang === 'tr' ? 'Kimlik doğrulama atlatılıyor...' : 'Bypassing authentication...' }}</p>
                </div>

                <div class="admin-panel fade-in" v-else-if="exploitStatus === 'success'">
                  <div class="ap-topbar">
                    <div class="ap-brand">🏢 GlobalCorp — {{ currentText.apPortalName }}</div>
                    <div class="ap-user-chip">
                      <span class="online-dot"></span>
                      {{ leakedData[0]?.email || 'admin@globalcorp.com' }}
                    </div>
                  </div>

                  <div class="ap-bypass-alert">
                    <span class="bypass-icon">⚠️</span>
                    <div>
                      <b>{{ currentText.bypassTitle }}</b>
                      <p>{{ currentText.bypassDesc }}</p>
                    </div>
                  </div>

                  <div class="ap-stats-grid">
                    <div class="ap-stat-card">
                      <div class="stat-icon">👥</div>
                      <div class="stat-num">1,247</div>
                      <div class="stat-label">{{ currentText.apStatUsers }}</div>
                    </div>
                    <div class="ap-stat-card">
                      <div class="stat-icon">💰</div>
                      <div class="stat-num">$2.4M</div>
                      <div class="stat-label">{{ currentText.apStatRevenue }}</div>
                    </div>
                    <div class="ap-stat-card ap-danger-card">
                      <div class="stat-icon">🔓</div>
                      <div class="stat-num">OPEN</div>
                      <div class="stat-label">{{ currentText.apStatSecurity }}</div>
                    </div>
                    <div class="ap-stat-card">
                      <div class="stat-icon">🖥️</div>
                      <div class="stat-num">843</div>
                      <div class="stat-label">{{ currentText.apStatSessions }}</div>
                    </div>
                  </div>

                  <div class="ap-internal-docs">
                    <div class="ap-docs-header">
                      <span>🔒</span>
                      <span>{{ currentText.apDocsTitle }}</span>
                    </div>
                    <div class="ap-doc-row">
                      <span class="doc-icon">📊</span>
                      <span class="doc-name">{{ currentText.apDoc1 }}</span>
                      <span class="doc-badge">{{ currentText.apDocBadge }}</span>
                    </div>
                    <div class="ap-doc-row">
                      <span class="doc-icon">🗄️</span>
                      <span class="doc-name">{{ currentText.apDoc2 }}</span>
                      <span class="doc-badge">{{ currentText.apDocBadge }}</span>
                    </div>
                    <div class="ap-doc-row ap-highlight-row" v-if="leakedData[0]">
                      <span class="doc-icon">🔑</span>
                      <span class="doc-name">{{ leakedData[0].secret_data }}</span>
                      <span class="doc-badge doc-badge-red">{{ currentText.apDocBadgeTop }}</span>
                    </div>
                  </div>
                </div>

                <div class="sim-body" v-else>
                  <h3>{{ currentText.simPanelTitle }}</h3>
                  
                  <div class="input-group">
                    <label>E-posta / Kullanıcı Adı</label>
                    <input type="text" v-model="simEmail" class="sim-input" :placeholder="currentText.emailPlaceholder" autocomplete="off" />
                  </div>
                  
                  <div class="input-group">
                    <label>Şifre</label>
                    <input type="password" v-model="simPass" class="sim-input" :placeholder="currentText.passPlaceholder" />
                  </div>

                  <button class="btn-hack-action" @click="runExploit">
                    {{ currentText.btnHack }}
                  </button>
                  
                  <div v-if="exploitStatus === 'error'" class="error-toast fade-in">
                    {{ currentText.msgFail }}
                  </div>
                </div>
              </div>

              <div class="action-footer" style="margin-top: 25px; display: flex; justify-content: center;">
                <button class="btn-success" @click="currentStep = 3" v-if="exploitStatus === 'success' || isReviewMode">
                  {{ currentText.btnNext2 }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material') : currentText.s3Title }}
          </h2>

          <div class="edu-card">
            <h3 class="edu-heading blue-text">{{ currentText.s3DefTitle }}</h3>
            <p class="edu-desc">{{ currentText.s3DefDesc }}</p>
            

            <div class="neon-divider" style="margin: 30px 0; background: linear-gradient(90deg, #1e293b, #334155, #1e293b);"></div>

            <h3 class="edu-heading green-text">{{ currentText.s3SolTitle }}</h3>
            <p class="edu-desc" v-html="currentText.s3SolDesc1"></p>

            <div class="code-comparison">
              <div class="code-pane bad-code">
                <div class="pane-header red-bg">{{ currentText.labelVuln }}</div>
                <pre><code><span class="code-comment">// KÖTÜ KULLANIM: Kullanıcı verisi kodun içine doğrudan gömülüyor</span>
<span class="code-keyword">const</span> <span class="code-var">query</span> = <span class="code-string">`SELECT * FROM users 
               WHERE email = '<span style="color:#ef4444; font-weight:bold;">${email}</span>' 
               AND password = '<span style="color:#ef4444; font-weight:bold;">${password}</span>'`</span>;</code></pre>
              </div>

              <div class="code-pane good-code">
                <div class="pane-header green-bg">{{ currentText.labelSec }}</div>
                <pre><code><span class="code-comment">// GÜVENLİ: Doğrudan koda yapıştırmak yerine parametre (?) kullanımı</span>
<span class="code-keyword">const</span> <span class="code-var">query</span> = <span class="code-string">`SELECT * FROM users 
               WHERE email = <span style="color:#10b981; font-weight:bold; font-size:18px;">?</span> 
               AND password = <span style="color:#10b981; font-weight:bold; font-size:18px;">?</span>`</span>;</code></pre>
              </div>
            </div>

            <p class="edu-desc" v-html="currentText.s3SolDesc2"></p>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 2">Önceki</button>
            <button class="btn-primary" @click="currentStep = 4">{{ currentText.btnNext3 }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Son-Test Analizi' : '🔍 Review Mode: Post-Test Analysis') : currentText.s4Title }}
          </h2>
          <p class="step-desc" v-if="!isReviewMode">{{ currentText.s4Desc }}</p>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'post'+index">
            <p><b v-html="currentText[`postQ${q}Text`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" :class="getLabelClass('post', `q${q}`, opt)">
                <input type="radio" v-model="answers[`postQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`postQ${q}${opt}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 3">Önceki</button>
            <button class="btn-warning" @click="finishPostTest" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-small"></span>
              {{ isReviewMode ? (currentLang === 'tr' ? 'İncelemeyi Bitir ve Dön' : 'Finish Review & Return') : (isSaving ? (currentLang === 'tr' ? 'Kaydediliyor...' : 'Saving...') : currentText.btnFinish) }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); 
const currentLang = ref('tr');
const currentStep = ref(1); 
const isSaving = ref(false);
const isLoading = ref(true);

// Otomatik Scroll Eklemesi
watch(currentStep, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const isReviewMode = computed(() => route.query.review === 'true');

const answers = reactive({
  preQ1: '', preQ2: '', preQ3: '',
  postQ1: '', postQ2: '', postQ3: ''
});

// JWT Token ve User Email
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

const simEmail = ref('');
const simPass = ref('');
const exploitStatus = ref('idle'); // idle, hacking, success, error
const leakedData = ref([]);

const answerKeys = {
  pre: { q1: "c", q2: "b", q3: "d" },
  post: { q1: "b", q2: "c", q3: "b" },
};

const translations = {
  tr: {
    modTitle: "A05: SQL Injection",
    s1Title: "Adım 1: Ön-Test (Bilgi Ölçümü)",
    s1Desc: "Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.",
    
    preQ1Text: "Soru 1: SQL Injection (SQLi) nedir?",
    preQ1a: "A) Veritabanı içine dışarıdan bilgi enjekte etme işlemidir.",
    preQ1b: "B) Web sunucusuna başka bir veritabanı enjekte etme işlemidir.",
    preQ1c: "C) Sistemi kandıracak bir veritabanı sorgusuyla içeri sızma işlemidir.",
    preQ1d: "D) Veritabanına aşırı istek göndererek veritabanını ulaşılamaz hale getirmektir.",
    
    preQ2Text: "Soru 2: Siber güvenlikte 'Payload' terimi ne anlama gelir?",
    preQ2a: "A) Sistemin güvenlik duvarını aşmak için kullanılan şifreleme algoritmasıdır.",
    preQ2b: "B) Zararlı veri veya kod parçasıdır.",
    preQ2c: "C) Sunucunun istemciye yanıt olarak gönderdiği HTTP başlıklarının tamamıdır.",
    preQ2d: "D) Veritabanının aşırı yüklenmesi sonucu oluşan veri raporudur.",
    
    preQ3Text: "Soru 3: SQL Injection zafiyetine neden olan en riskli hata hangisidir?",
    preQ3a: "A) Şifrelerin veritabanına kaydedilmeden önce kriptlenmemiş olması.",
    preQ3b: "B) Web sitesinde SSL sertifikasının bulunmaması yani HTTPS yerine HTTP olması.",
    preQ3c: "C) SQL sisteminin sitede gizlenmemiş olması.",
    preQ3d: "D) Kullanıcı girdilerinin SQL sorgu metniyle birleşmesi.",
    
    btnNext1: "Testi Bitir ve Simülasyona Geç",

    s2Title: "Adım 2: Zafiyet Simülasyonu",
    s2Summary: "SQL Injection, kullanıcıya açık bir panele istenilen veri yerine SQL sorgusu yazılarak direkt veritabanıyla iletişime geçme işlemidir.",
    gTitle: "OPERASYON BRİFİNGİ",
    s2Desc: "<b>Durum Analizi:</b><br>Karşımızda standart bir giriş paneli var ve hiçbir şifre bilmiyoruz. Geliştirici, kullanıcıdan aldığı e-posta verisini kontrol etmeden doğrudan veritabanı sorgusuna dahil etmiş.<br><br><b>Saldırı Planı:</b><br>Biz e-posta kutusuna sıradan bir metin yerine, veritabanının doğrudan çalıştıracağı özel bir kod parçası yazacağız. Siber güvenlikte, hedef sistemi manipüle etmek veya zararlı bir işlemi tetiklemek için gönderilen bu tür verilere <b>'Payload' (Saldırı Yükü)</b> denir.<br><br>Aşağıdaki giriş paneline inin ve E-posta kısmına şu Payload'u yazın:<br><code class='glitch-payload' style='font-size:16px; margin: 10px 0; display:inline-block;'>' OR 1=1 --</code><br><br><b>Bu Payload Ne Yapacak?</b><br>1. <b style='color: #38bdf8;'>' (Tek Tırnak):</b> Geliştiricinin arka planda yazdığı e-posta sorgusunu erken kapatır.<br>2. <b style='color: #f59e0b;'>OR 1=1:</b> 'Veya 1=1' diyerek sorguya her zaman DOĞRU (True) kabul edilecek bir kural ekler.<br>3. <b style='color: #ef4444;'>-- (İki Tire):</b> SQL dilinde yorum satırı demektir. Sorgunun geri kalanını (şifre sorma kısmını) tamamen çöpe atar.",
    
    simPanelTitle: "KULLANICI GİRİŞİ",
    emailPlaceholder: "E-posta (SQL komutunu buraya yazın)",
    passPlaceholder: "Şifre (Boş bırakın veya sallayın)",
    btnHack: "Giriş Yap",
    btnNext2: "Saldırıyı Analiz Et (Eğitime Geç)",

    s3Title: "Adım 3: Zafiyet Analizi ve Çözümü",
    s3DefTitle: "SQL Injection (SQLi) Nedir?",
    s3DefDesc: "Kötü niyetli kullanıcıların, uygulamanın veritabanına gönderdiği sorgulara müdahale etmesini sağlayan kritik bir güvenlik açığıdır. Geliştirici, kullanıcıdan aldığı veriyi filtrelemeden doğrudan SQL komutunun içine koyarsa, saldırgan kendi komutlarını çalıştırttırabilir. Tıpkı az önce sizin şifre kontrolünü iptal ettirdiğiniz gibi!",
    s3SolTitle: "Nasıl Çözülür? (Prepared Statements)",
    s3SolDesc1: "Açığın temel sebebi, kullanıcının girdiği metnin 'veri' olarak değil, çalıştırılabilir bir 'SQL komutu' olarak algılanmasıdır. Bunu kesin olarak çözmek için <b>Parametreli Sorgular</b> kullanmalıyız.",
    s3SolDesc2: "Güvenli kodda görebileceğiniz gibi, dışarıdan gelen verileri SQL metnine yazmak yerine <b>? (soru işareti)</b> koyuyoruz. Veritabanı sürücüsü, bu kısımları sadece düz metin olarak işler. Siz oraya ' OR 1=1 -- yazsanız bile sistem bunu bir komut olarak değil, sadece garip bir e-posta adresi olarak okur ve reddeder.",
    labelVuln: "Hatalı (Zafiyetli) Kod Kullanımı:",
    labelSec: "Güvenli (Doğru) Kod Kullanımı:",
    btnNext3: "Öğrendiklerini Test Et (Son-Test)",

    s4Title: "Adım 4: Son-Test",
    s4Desc: "Bu modülde öğrendiklerinizi pekiştirelim.",
    postQ1Text: "Soru 1: Bir uygulamada SQL Injection'ı KESİN olarak önlemek için en iyi yöntem hangisidir?",
    postQ1a: "A) Tüm istekleri Base64 formatına çevirmek",
    postQ1b: "B) Parametreli Sorgular kullanarak kod ve veriyi yalıtmak",
    postQ1c: "C) Şifreleri SHA-256 ile hashlemek",
    postQ1d: "D) Özel işaretleri sadece Frontend'de engellemek",
    postQ2Text: "Soru 2: Simülasyonda kullandığımız ' OR 1=1 -- payload'unun işlevi nedir?",
    postQ2a: "A) Veritabanındaki 'admin' tablosunu bulur.",
    postQ2b: "B) Bellek taşması yaratır.",
    postQ2c: "C) Sorgu koşulunu doğru yapıp kalan komutları yorum satırına çevirir.",
    postQ2d: "D) Bağlantı şifresini günceller.",
    postQ3Text: "Soru 3: 'Parametreli Sorgular' SQL Injection'ı nasıl durdurur?",
    postQ3a: "A) Metinleri şifreleyerek",
    postQ3b: "B) Kullanıcı girdisini çalıştırılabilir kod yerine salt veri olarak işleyerek",
    postQ3c: "C) Zararlı kelimeleri otomatik silerek",
    postQ3d: "D) Sadece yöneticilere yetki vererek",
    btnFinish: "Modülü Tamamla",

    msgFail: "Erişim Reddedildi! E-posta veya şifre hatalı.",
    apPortalName: "Admin Paneli",
    bypassTitle: "KİMLİK DOĞRULAMA ATLATILDI",
    bypassDesc: "Hiçbir şifre bilmeden admin hesabıyla sisteme sızdınız. Şu anda kurumsal yönetim paneline yetkisiz erişiminiz var.",
    apStatUsers: "Kayıtlı Kullanıcı",
    apStatRevenue: "Aylık Gelir",
    apStatSecurity: "Güvenlik Kapısı",
    apStatSessions: "Aktif Oturum",
    apDocsTitle: "Yetkili Belgeler ve Kayıtlar",
    apDoc1: "Q4 2024 — Finansal Bilanço.xlsx",
    apDoc2: "kullanici_veritabani_yedek.sql",
    apDocBadge: "GİZLİ",
    apDocBadgeTop: "ADMIN ONLY",
    warnEmpty: "Lütfen ilerlemeden önce tüm soruları yanıtlayın.",
    // --- YÖNLENDİRME METNİ DÜZELTİLDİ ---
    alertResult: (pre, post) => `Modül tamamlandı!\n\n📋 Ön-Test Başarınız: ${pre}/100\n🏆 Son-Test Başarınız: ${post}/100\n\nFarkındalık artışınız kaydediliyor... Dashboard'a yönlendiriliyorsunuz.`,
  },
  en: {
    modTitle: "A05: SQL Injection",
    s1Title: "Step 1: Pre-Test (Knowledge Assessment)",
    s1Desc: "Let's measure your current knowledge level.",
    
    preQ1Text: "Question 1: What is SQL Injection (SQLi)?",
    preQ1a: "A) The process of injecting external information into the database.",
    preQ1b: "B) The process of injecting another database into the web server.",
    preQ1c: "C) The process of infiltrating by tricking the system with a database query.",
    preQ1d: "D) Making the database inaccessible by sending excessive requests to it.",
    
    preQ2Text: "Question 2: What does the term 'Payload' mean in cybersecurity?",
    preQ2a: "A) The encryption algorithm used to bypass the system's firewall.",
    preQ2b: "B) A piece of malicious data or code.",
    preQ2c: "C) The entirety of HTTP headers sent by the server in response to the client.",
    preQ2d: "D) The data report generated as a result of database overload.",
    
    preQ3Text: "Question 3: What is the riskiest programming error that causes an SQL Injection vulnerability?",
    preQ3a: "A) Passwords not being encrypted before being saved to the database.",
    preQ3b: "B) Lack of an SSL certificate on the website, i.e., HTTP instead of HTTPS.",
    preQ3c: "C) The SQL system not being hidden on the site.",
    preQ3d: "D) User inputs concatenating with the SQL query text.",
    
    btnNext1: "Finish Test & Go to Simulation",

    s2Title: "Step 2: Vulnerability Simulation",
    s2Summary: "SQL Injection is the process of communicating directly with the database by entering an SQL query instead of the requested data into a user-accessible panel.",
    gTitle: "MISSION BRIEFING",
    s2Desc: "<b>Situation Analysis:</b><br>We face a standard user login panel and don't know any passwords. The developer included the email input directly into the database query without validation.<br><br><b>Attack Plan:</b><br>Instead of normal text, we will enter a specific piece of code into the email box that the database will execute directly. In cybersecurity, data sent to manipulate a target system or trigger a malicious action is called a <b>'Payload'</b>.<br><br>Scroll down to the login panel and inject this Payload into the Email field:<br><code class='glitch-payload' style='font-size:16px; margin: 10px 0; display:inline-block;'>' OR 1=1 --</code><br><br><b>What will this Payload do?</b><br>1. <b style='color: #38bdf8;'>' (Single Quote):</b> Prematurely closes the developer's background email query.<br>2. <b style='color: #f59e0b;'>OR 1=1:</b> Adds a mathematical truth (Or 1=1) that makes the query condition always TRUE.<br>3. <b style='color: #ef4444;'>-- (Double Dash):</b> Means a comment line in SQL. It entirely trashes the rest of the query (the password check).",
    
    simPanelTitle: "USER LOGIN",
    emailPlaceholder: "Email (Type SQL command here)",
    passPlaceholder: "Password (Type anything)",
    btnHack: "Log In",
    btnNext2: "Analyze Attack",

    s3Title: "Step 3: Vulnerability Analysis",
    s3DefTitle: "What is SQL Injection?",
    s3DefDesc: "A critical vulnerability allowing attackers to interfere with DB queries. If inputs aren't filtered, attackers can execute their own commands. Just like how you canceled the password check!",
    s3SolTitle: "How to Solve It? (Prepared Statements)",
    s3SolDesc1: "The root cause is inputs being perceived as 'executable commands'. We must use <b>Parameterized Queries</b>.",
    s3SolDesc2: "Instead of writing data directly, we use a <b>? (question mark)</b>. The DB driver processes it only as plain text. Even if you type ' OR 1=1 --, the system treats it as a weird email and rejects it.",
    labelVuln: "Incorrect (Vulnerable) Code:",
    labelSec: "Secure (Correct) Code:",
    btnNext3: "Test Your Knowledge",

    s4Title: "Step 4: Post-Test",
    s4Desc: "Let's reinforce what you learned.",
    postQ1Text: "Question 1: Best method to DEFINITIVELY prevent SQLi?",
    postQ1a: "A) Base64 encoding.",
    postQ1b: "B) Isolating code and data using Parameterized Queries.",
    postQ1c: "C) Hashing passwords.",
    postQ1d: "D) Blocking chars on Frontend.",
    postQ2Text: "Question 2: Function of ' OR 1=1 -- payload?",
    postQ2a: "A) Finds the 'admin' table.",
    postQ2b: "B) Creates a memory overflow.",
    postQ2c: "C) Makes condition true and comments out the rest.",
    postQ2d: "D) Updates DB password.",
    postQ3Text: "Question 3: How do Parameterized Queries stop SQLi?",
    postQ3a: "A) By encrypting text.",
    postQ3b: "B) Processing input only as plain data instead of code.",
    postQ3c: "C) Auto-deleting malicious words.",
    postQ3d: "D) Applying authorization checks.",
    btnFinish: "Complete Module",

    msgFail: "Access Denied! Invalid Email or Password.",
    apPortalName: "Admin Panel",
    bypassTitle: "AUTHENTICATION BYPASSED",
    bypassDesc: "You infiltrated the system as admin without knowing any password. You now have unauthorized access to the corporate management panel.",
    apStatUsers: "Registered Users",
    apStatRevenue: "Monthly Revenue",
    apStatSecurity: "Security Gate",
    apStatSessions: "Active Sessions",
    apDocsTitle: "Authorized Documents & Records",
    apDoc1: "Q4 2024 — Financial Balance Sheet.xlsx",
    apDoc2: "user_database_backup.sql",
    apDocBadge: "CLASSIFIED",
    apDocBadgeTop: "ADMIN ONLY",
    warnEmpty: "Please answer all questions.",
    // --- YÖNLENDİRME METNİ DÜZELTİLDİ ---
    alertResult: (pre, post) => `Module completed!\n\n📋 Pre-Test: ${pre}/100\n🏆 Post-Test: ${post}/100\n\nRedirecting to Dashboard...`,
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
};

const getLabelClass = (testPrefix, questionKey, option) => {
  if (!isReviewMode.value) return ''; 
  const selectedAnswer = answers[`${testPrefix}${questionKey.charAt(0).toUpperCase() + questionKey.slice(1)}`]; 
  const correctAnswer = answerKeys[testPrefix][questionKey]; 
  
  if (option === correctAnswer) return 'correct-answer'; 
  if (selectedAnswer === option && option !== correctAnswer) return 'wrong-answer'; 
  return '';
};

watch(answers, (newAnswers) => {
  if (!isReviewMode.value && userEmail) {
    localStorage.setItem(`sqli_draft_answers_${userEmail}`, JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  if (!userEmail || !token) {
    router.push('/');
    return;
  }

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success && result.data && result.data.sqli_answers) {
        Object.assign(answers, result.data.sqli_answers); 
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem(`sqli_draft_answers_${userEmail}`);
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }
  
  isLoading.value = false; 
});


const calculateScore = (testPrefix) => {
  let score = 0;
  if (answers[`${testPrefix}Q1`] === answerKeys[testPrefix].q1) score += 33.33;
  if (answers[`${testPrefix}Q2`] === answerKeys[testPrefix].q2) score += 33.33;
  if (answers[`${testPrefix}Q3`] === answerKeys[testPrefix].q3) score += 33.34;
  return Math.round(score);
};

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    alert(currentText.value.warnEmpty);
    return;
  }
  currentStep.value = 2; 
};

const runExploit = async () => {
  if (!simEmail.value) return;

  exploitStatus.value = 'hacking'; 
  
  try {
    const response = await fetch(`/api/vuln/sqli/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: simEmail.value, password: simPass.value }),
    });
    
    const responseData = await response.json();
    
    setTimeout(() => {
      if (responseData.success) {
        leakedData.value = responseData.data;
        exploitStatus.value = 'success';
      } else {
        exploitStatus.value = 'error';
        setTimeout(() => { exploitStatus.value = 'idle'; }, 3000);
      }
    }, 100); 

  } catch (error) {
    exploitStatus.value = 'error';
    setTimeout(() => { exploitStatus.value = 'idle'; }, 3000);
  }
};

const finishPostTest = async () => {
  // --- YÖNLENDİRME VE SCROLL EKLENDİ ---
  if (isReviewMode.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push("/dashboard");
    return;
  }

  if (!answers.postQ1 || !answers.postQ2 || !answers.postQ3) {
    alert(currentText.value.warnEmpty);
    return;
  }
  
  let preScore = calculateScore("pre");
  let postScore = calculateScore("post");
  isSaving.value = true;
  
  try {
    await fetch(`/api/save-score`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        email: userEmail,
        module: "sqli",
        preScore: preScore,
        postScore: postScore,
        answers: answers 
      }),
    });
    
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem(`sqli_draft_answers_${userEmail}`); 
    // --- YÖNLENDİRME VE SCROLL EKLENDİ ---
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push("/dashboard");
  } catch (err) {
    alert("Skor kaydedilirken hata oluştu!");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* Genel Temel */
.module-wrapper { background-color: #0b0f19; color: #cbd5e1; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.container { width: 100%; max-width: 950px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #ef4444; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #ef4444, transparent); margin-bottom: 35px; }

.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #ef4444; padding-left: 15px; margin-bottom: 10px; }
.step-desc { font-size: 15px; color: #94a3b8; margin-bottom: 25px;}
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* Sorular ve Seçenekler */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #ef4444; }
.options label input:disabled { cursor: not-allowed; }
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* =========================================================
   YENİ SİMÜLASYON TASARIMI (ADIM 2) - Tek Sütun Yapısı
   ========================================================= */
.mission-layout { display: flex; flex-direction: column; gap: 30px; margin-top: 20px; }

/* Üst Panel: Rehber ve Brifing */
.guide-panel { display: flex; flex-direction: column; gap: 20px; width: 100%;}
.summary-box { background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 0 8px 8px 0; font-style: italic; color: #a7f3d0;}
.summary-box p { margin: 0; }

.mission-briefing { background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; overflow: hidden; }
.brief-header { background: #1e293b; padding: 12px 20px; color: #f8fafc; font-size: 14px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #334155;}
.pulse-icon { width: 10px; height: 10px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
.brief-body { padding: 25px; color: #cbd5e1; font-size: 15px; line-height: 1.6; }
.brief-body p { margin-top: 0; margin-bottom: 10px; }
.glitch-payload { background: #000; padding: 4px 10px; border-radius: 4px; border: 1px solid #ef4444; color: #ef4444; font-family: monospace; font-weight: bold;}

/* Alt Panel: Hedef Sistem (Ortalanmış) */
.app-container { display: flex; flex-direction: column; align-items: center; width: 100%;}
.simulation-box { background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.3); transition: all 0.5s ease; width: 100%; max-width: 650px;}
.simulation-box.system-hacked { background: #050505; border-color: #ef4444; box-shadow: 0 0 40px rgba(239, 68, 68, 0.2); max-width: 850px; }

.sim-header { background: #e2e8f0; padding: 10px 15px; border-bottom: 1px solid #cbd5e1; display: flex; align-items: center; transition: 0.5s;}
.system-hacked .sim-header { background: #1e293b; border-color: #000; }
.dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; display: inline-block;}
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }

/* Normal Login Ekranı */
.sim-body { padding: 40px; }
.sim-body h3 { margin-top: 0; color: #0f172a; font-size: 22px; margin-bottom: 25px; text-align: center;}
.input-group { margin-bottom: 20px; }
.input-group label { display: block; color: #475569; font-size: 13px; margin-bottom: 8px; font-weight: bold;}
.sim-input { width: 100%; padding: 14px 15px; background: #f8fafc; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; transition: 0.3s; font-size: 15px;}
.sim-input:focus { border-color: #0284c7; box-shadow: inset 0 0 0 1px #0284c7; }
.btn-hack-action { width: 100%; background: #0f172a; color: white; border: none; padding: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.3s; margin-top: 15px;}
.btn-hack-action:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(29, 78, 216, 0.4); }
.error-toast { background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 6px; margin-top: 20px; font-size: 14px; font-weight: bold; border: 1px solid #fca5a5; text-align: center;}

/* Hacking Loading Ekranı */
.hacking-overlay { display: flex; flex-direction: column; justify-content: center; align-items: center; background: #050505; color: #ef4444; font-family: monospace; padding: 60px 40px; text-align: center; min-height: 250px;}
.hack-spinner { width: 50px; height: 50px; border: 3px solid transparent; border-top-color: #ef4444; border-right-color: #ef4444; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px;}
.blink-text { animation: blink 1s infinite; color: #f8fafc; margin-top: 5px;}
@keyframes blink { 0%, 100% {opacity:1;} 50% {opacity:0.3;} }

/* ─── ADMIN PANEL (Başarı Ekranı) ───────────────────── */
.admin-panel { background: #050505; color: #e2e8f0; }

.ap-topbar {
  display: flex; justify-content: space-between; align-items: center;
  background: #0c1929; padding: 12px 20px;
  border-bottom: 1px solid #1a3045;
}
.ap-brand { font-weight: 700; font-size: 13px; color: #f1f5f9; letter-spacing: 0.3px; }
.ap-user-chip {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: #94a3b8;
  background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px; padding: 4px 12px;
}
.online-dot {
  width: 7px; height: 7px; background: #10b981; border-radius: 50%;
  animation: pulse 2s infinite;
}

.ap-bypass-alert {
  display: flex; align-items: flex-start; gap: 14px;
  background: rgba(239, 68, 68, 0.07); border-left: 4px solid #ef4444;
  border-bottom: 1px solid rgba(239, 68, 68, 0.15); padding: 14px 20px;
}
.bypass-icon { font-size: 20px; flex-shrink: 0; line-height: 1.3; }
.ap-bypass-alert b { display: block; color: #ef4444; font-size: 12px; letter-spacing: 0.8px; margin-bottom: 4px; }
.ap-bypass-alert p { margin: 0; font-size: 12.5px; color: #94a3b8; }

.ap-stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: #111; border-bottom: 1px solid #111;
}
.ap-stat-card { background: #090909; padding: 16px 14px; text-align: center; }
.ap-danger-card { background: rgba(239, 68, 68, 0.05); }
.stat-icon { font-size: 18px; margin-bottom: 6px; }
.stat-num { font-size: 20px; font-weight: 800; color: #f1f5f9; font-family: monospace; margin-bottom: 4px; }
.ap-danger-card .stat-num { color: #ef4444; }
.stat-label { font-size: 9.5px; color: #475569; text-transform: uppercase; letter-spacing: 0.8px; }

.ap-internal-docs { padding: 18px 20px; }
.ap-docs-header {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700; color: #475569;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
}
.ap-doc-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 6px;
  background: #0d0d0d; border: 1px solid #1a1a1a; margin-bottom: 8px;
}
.ap-highlight-row { border-color: rgba(239, 68, 68, 0.28); background: rgba(239, 68, 68, 0.04); }
.doc-icon { font-size: 15px; flex-shrink: 0; }
.doc-name { flex: 1; font-size: 12.5px; color: #cbd5e1; font-family: monospace; }
.doc-badge {
  font-size: 9.5px; font-weight: 800;
  background: rgba(245, 158, 11, 0.1); color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.22); border-radius: 4px;
  padding: 2px 8px; letter-spacing: 0.5px; flex-shrink: 0;
}
.doc-badge-red {
  background: rgba(239, 68, 68, 0.1); color: #ef4444;
  border-color: rgba(239, 68, 68, 0.22);
}

/* Eğitim Adımı (Adım 3) */
.edu-card { background: transparent; }
.edu-heading { margin-top: 0; font-size: 20px; margin-bottom: 15px; }
.edu-desc { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px; }

.code-comparison { display: flex; flex-direction: column; gap: 20px; margin: 25px 0; }
.code-pane { border-radius: 8px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.pane-header { padding: 10px 15px; font-size: 13px; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 1px; }
.red-bg { background: #ef4444; }
.green-bg { background: #10b981; }
pre { margin: 0; padding: 20px; background: #0b1120; overflow-x: auto; }
code { font-family: "Consolas", "Courier New", monospace; font-size: 14px; line-height: 1.6; color: #e2e8f0; }
.code-comment { color: #64748b; font-style: italic; }
.code-keyword { color: #c678dd; }
.code-string { color: #98c379; }
.code-var { color: #e5c07b; }

/* Butonlar & Aksiyonlar */
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; width: 100%;}
.action-footer.space-between { justify-content: space-between; }
button { font-family: inherit; }
.btn-primary { background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4); }
.btn-secondary { background: #334155; color: #f8fafc; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-secondary:hover { background: #475569; }
.btn-success { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; width: auto;}
.btn-success:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* Animasyonlar */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(239, 68, 68, 0.2); border-top-color: #ef4444; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>