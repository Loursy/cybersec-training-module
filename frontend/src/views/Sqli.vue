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

              <div class="info-box logic-box">
                <h4>{{ currentText.infoTitle }}</h4>
                <ul>
                  <li><b class="blue-text">' (Tek Tırnak):</b> <span>{{ currentText.expl1 }}</span></li>
                  <li><b class="yellow-text">OR 1=1:</b> <span>{{ currentText.expl2 }}</span></li>
                  <li><b class="red-text">-- (İki Tire):</b> <span>{{ currentText.expl3 }}</span></li>
                </ul>
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

                <div class="db-dump-screen fade-in" v-else-if="exploitStatus === 'success'">
                  <div class="dump-header">
                    <h3>⚠️ {{ currentText.msgSuccess }}</h3>
                  </div>
                  
                  <div class="cyber-table-wrapper">
                    <table class="cyber-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>{{ currentText.tblEmail }}</th>
                          <th>{{ currentText.tblPass }}</th>
                          <th>{{ currentText.tblSecret }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="user in leakedData" :key="user.id">
                          <td>{{ user.id }}</td>
                          <td class="td-email">{{ user.email }}</td>
                          <td class="td-pass">{{ user.password }}</td>
                          <td class="td-secret">{{ user.secret_data }}</td>
                        </tr>
                      </tbody>
                    </table>
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

              <div class="action-footer" style="margin-top: 25px;">
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
            
            <div style="margin-top: 25px; text-align: center; border-radius: 8px; overflow: hidden; border: 1px solid #334155;">
              
            </div>

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

          <div class="action-footer">
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
  pre: { q1: "b", q2: "c", q3: "b" },
  post: { q1: "b", q2: "c", q3: "b" },
};

const translations = {
  tr: {
    modTitle: "Modül 1: SQL Injection (SQLi)",
    s1Title: "Adım 1: Ön-Test (Bilgi Ölçümü)",
    s1Desc: "Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.",
    preQ1Text: "Soru 1: SQL Injection (SQLi) nedir?",
    preQ1a: "A) Veritabanı sunucuları arasındaki trafiğin şifrelenmemesinden kaynaklanan veri sızıntısıdır.",
    preQ1b: "B) Kullanıcı girdilerinin, çalıştırılabilir SQL komutlarının bir parçası olarak yorumlanmasıdır.",
    preQ1c: "C) Sistemi kandırmak amacıyla veritabanına sahte bilgiler enjekte etme işlemidir.",
    preQ1d: "D) Web sunucusuna aşırı istek göndererek veritabanını erişilemez hale getirmektir.",
    preQ2Text: "Soru 2: Siber güvenlikte 'Payload' terimi ne anlama gelir?",
    preQ2a: "A) Veritabanına sızdıktan sonra elde edilen kullanıcı şifrelerinin bütünü",
    preQ2b: "B) Sistemin güvenlik duvarını aşmak için kullanılan şifreleme algoritması",
    preQ2c: "C) Bir zafiyeti tetiklemek için hedefe iletilen zararlı veri veya kod parçası",
    preQ2d: "D) Sunucunun istemciye yanıt olarak gönderdiği HTTP başlıklarının tamamı",
    preQ3Text: "Soru 3: SQL Injection zafiyetine neden olan en riskli hata hangisidir?",
    preQ3a: "A) Şifrelerin veritabanına kaydedilmeden önce hashlenmemesi",
    preQ3b: "B) Kullanıcı girdilerinin doğrudan SQL sorgu metniyle birleştirilmesi",
    preQ3c: "C) Web sitesinde SSL sertifikası bulunmaması",
    preQ3d: "D) Sistemin çok sayıda hatalı girişi engellememesi",
    btnNext1: "Testi Bitir ve Simülasyona Geç",

    s2Title: "Adım 2: Zafiyet Simülasyonu",
    gTitle: "OPERASYON BRİFİNGİ",
    s2Summary: "Amacımız şifreyi bilmeden, veritabanını kandırarak aşağıdaki kullanıcı giriş paneline sızmak.",
    s2Desc: "<b>Durum Analizi:</b><br>Karşımızda standart bir giriş paneli var ve hiçbir şifre bilmiyoruz. Geliştirici, kullanıcıdan aldığı e-posta verisini kontrol etmeden doğrudan veritabanı sorgusuna dahil etmiş. <br><br><b>Arka Plandaki Tehlikeli Kod:</b><br>Sistem giriş yaparken veritabanına şu soruyu soruyor:<br><code style='background:#000; color:#cbd5e1; padding:4px 8px; border-radius:4px; display:inline-block; font-size:12px;'>SELECT * FROM users WHERE email='<span style=\"color:#ef4444\">[SENİN_YAZDIĞIN]</span>' AND password='...'</code><br><br><b>Saldırı Planı (Payload):</b><br>Biz e-posta kutusuna sıradan bir metin yerine, veritabanının doğrudan çalıştıracağı bir <b>SQL komutu</b> yazacağız. Aşağıdaki giriş paneline inin ve E-posta kısmına bu SQL komutunu yazın:<br><code class='glitch-payload' style='font-size:16px; margin: 10px 0; display:inline-block;'>' OR 1=1 --</code>",
    infoTitle: "Peki bu payload ne işe yarayacak? (' OR 1=1 --)",
    expl1: "Geliştiricinin arka planda yazdığı kodu biz erken kapatıyoruz. Böylece sistemin kodunun içine kendi kelimelerimizi ekleyebiliyoruz.",
    expl2: "'Veya 1 eşittir 1' diyoruz. 1 her zaman 1'e eşit olduğu için, veritabanı 'Tamam bu kişi doğru söylüyor' diyerek bizi zorla içeri alıyor.",
    expl3: "Veritabanına 'Bundan sonra yazan şifre kontrol kısmını tamamen görmezden gel, sil gitsin' emrini veriyor.",
    
    simPanelTitle: "KULLANICI GİRİŞİ",
    emailPlaceholder: "E-posta (SQL komutunu buraya yazın)",
    passPlaceholder: "Şifre (Boş bırakın veya sallayın)",
    btnHack: "Giriş Yap",
    btnNext2: "Saldırıyı Analiz Et (Eğitime Geç)",

    s3Title: "Adım 3: Zafiyet Analizi ve Çözümü",
    s3DefTitle: "SQL Injection (SQLi) Nedir?",
    s3DefDesc: "Kötü niyetli kullanıcıların, uygulamanın veritabanına gönderdiği sorgulara müdahale etmesini sağlayan kritik bir güvenlik açığıdır. Geliştirici, kullanıcıdan aldığı veriyi filtrelemeden doğrudan SQL komutunun içine koyarsa, saldırgan kendi komutlarını çalıştırttırabilir.",
    s3SolTitle: "Nasıl Çözülür? (Prepared Statements)",
    s3SolDesc1: "Açığın temel sebebi, kullanıcının girdiği metnin 'veri' olarak değil, çalıştırılabilir bir 'SQL komutu' olarak algılanmasıdır. Bunu kesin olarak çözmek için <b>Parametreli Sorgular</b> kullanmalıyız.",
    s3SolDesc2: "Güvenli kodda görebileceğiniz gibi, dışarıdan gelen verileri SQL metnine yazmak yerine <b>? (soru işareti)</b> koyuyoruz. Veritabanı sürücüsü, bu kısımları sadece düz metin olarak işler.",
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

    msgSuccess: "SYSTEM OVERRIDE: VERİTABANI DÖKÜMÜ BAŞARILI",
    msgFail: "Erişim Reddedildi! Geçersiz E-posta veya Şifre.",
    tblEmail: "E-Posta Adresi",
    tblPass: "Şifre (Hash)",
    tblSecret: "Gizli Departman Verisi",
    warnEmpty: "Lütfen ilerlemeden önce tüm soruları yanıtlayın.",
    alertResult: (pre, post) => `Modül tamamlandı!\n\n📋 Ön-Test Başarınız: ${pre}/100\n🏆 Son-Test Başarınız: ${post}/100\n\nFarkındalık artışınız kaydediliyor... Dashboard'a yönlendiriliyorsunuz.`,
  },
  en: {
    modTitle: "Module 1: SQL Injection (SQLi)",
    s1Title: "Step 1: Pre-Test (Knowledge Assessment)",
    s1Desc: "Let's measure your current knowledge level.",
    preQ1Text: "Question 1: What is SQL Injection (SQLi)?",
    preQ1a: "A) A data leak caused by unencrypted traffic.",
    preQ1b: "B) A vulnerability allowing user inputs to be interpreted as executable SQL commands.",
    preQ1c: "C) Injecting fake information to deceive the system.",
    preQ1d: "D) Making the database inaccessible via DDoS.",
    preQ2Text: "Question 2: What does 'Payload' mean?",
    preQ2a: "A) User passwords obtained after infiltrating.",
    preQ2b: "B) Encryption algorithm used to bypass firewalls.",
    preQ2c: "C) Malicious data delivered to trigger a vulnerability.",
    preQ2d: "D) HTTP headers sent by the server.",
    preQ3Text: "Question 3: Riskiest programming error for SQLi?",
    preQ3a: "A) Not hashing passwords.",
    preQ3b: "B) Directly concatenating user inputs with SQL text.",
    preQ3c: "C) Lacking an SSL certificate.",
    preQ3d: "D) Not blocking multiple failed logins.",
    btnNext1: "Finish Test & Go to Simulation",

    s2Title: "Step 2: Vulnerability Simulation",
    s2Summary: "Our goal is to bypass the login panel without a password by tricking the database.",
    gTitle: "MISSION BRIEFING",
    s2Desc: "<b>Situation Analysis:</b><br>We have a standard user login panel and no passwords. The developer has directly included the email input into the database query without validation.<br><br><b>The Dangerous Background Code:</b><br>The system asks the database this question:<br><code style='background:#000; color:#cbd5e1; padding:4px 8px; border-radius:4px; display:inline-block; font-size:12px;'>SELECT * FROM users WHERE email='<span style=\"color:#ef4444\">[YOUR_INPUT]</span>' AND password='...'</code><br><br><b>Attack Plan (Payload):</b><br>Instead of a normal text, we will write an <b>SQL command</b> into the email box. Go to the login panel below and inject this SQL command:<br><code class='glitch-payload' style='font-size:16px; margin: 10px 0; display:inline-block;'>' OR 1=1 --</code>",
    infoTitle: "What will this payload do? (' OR 1=1 --)",
    expl1: "Prematurely closes the developer's background code.",
    expl2: "'Or 1=1' makes the condition always TRUE.",
    expl3: "Comments out and entirely cancels the rest of the query (password check).",
    
    simPanelTitle: "USER LOGIN",
    emailPlaceholder: "Email (Type SQL command here)",
    passPlaceholder: "Password (Type anything)",
    btnHack: "Log In",
    btnNext2: "Analyze Attack",

    s3Title: "Step 3: Vulnerability Analysis",
    s3DefTitle: "What is SQL Injection?",
    s3DefDesc: "A critical vulnerability allowing attackers to interfere with DB queries. If inputs aren't filtered, attackers can execute their own commands.",
    s3SolTitle: "How to Solve It? (Prepared Statements)",
    s3SolDesc1: "The root cause is inputs being perceived as 'executable commands'. We must use <b>Parameterized Queries</b>.",
    s3SolDesc2: "Instead of writing data directly, we use a <b>? (question mark)</b>. The DB driver processes it only as plain text.",
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

    msgSuccess: "SYSTEM OVERRIDE: DATABASE DUMP SUCCESSFUL",
    msgFail: "Access Denied! Invalid Email or Password.",
    tblEmail: "Email Address",
    tblPass: "Password (Hash)",
    tblSecret: "Secret Dept Data",
    warnEmpty: "Please answer all questions.",
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
  if (!isReviewMode.value) {
    localStorage.setItem('sqli_draft_answers', JSON.stringify(newAnswers));
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
    const savedDraft = localStorage.getItem('sqli_draft_answers');
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
    
    // Çok daha hızlı simülasyon (0.1 Saniye bekleme / anlık flaş efekti)
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
  if (isReviewMode.value) {
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
    localStorage.removeItem('sqli_draft_answers'); 
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

.info-box { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
.info-box h4 { color: #f8fafc; margin-top: 0; margin-bottom: 15px; font-size: 16px;}
.info-box ul { padding-left: 20px; margin: 0; line-height: 1.8; color: #94a3b8; font-size: 14px;}
.blue-text { color: #38bdf8; }
.yellow-text { color: #f59e0b; }
.red-text { color: #ef4444; }
.green-text { color: #10b981; }

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
.btn-hack-action { width: 100%; background: #0f172a; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.3s; margin-top: 15px;}
.btn-hack-action:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(29, 78, 216, 0.4); }
.error-toast { background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 6px; margin-top: 20px; font-size: 14px; font-weight: bold; border: 1px solid #fca5a5; text-align: center;}

/* Hacking Loading Ekranı */
.hacking-overlay { display: flex; flex-direction: column; justify-content: center; align-items: center; background: #050505; color: #ef4444; font-family: monospace; padding: 60px 40px; text-align: center; min-height: 250px;}
.hack-spinner { width: 50px; height: 50px; border: 3px solid transparent; border-top-color: #ef4444; border-right-color: #ef4444; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px;}
.blink-text { animation: blink 1s infinite; color: #f8fafc; margin-top: 5px;}
@keyframes blink { 0%, 100% {opacity:1;} 50% {opacity:0.3;} }

/* Veritabanı Dökümü Ekranı (DB Dump - Blursuz) */
.db-dump-screen { padding: 30px; background: #050505; }
.dump-header { border-bottom: 1px dashed #ef4444; padding-bottom: 15px; margin-bottom: 20px; }
.dump-header h3 { margin: 0; color: #ef4444; font-family: monospace; font-size: 18px; letter-spacing: 1px;}
.cyber-table-wrapper { overflow-x: auto; border: 1px solid #1e293b; border-radius: 6px; }
.cyber-table { width: 100%; border-collapse: collapse; font-family: "Consolas", monospace; font-size: 14px; text-align: left; }
.cyber-table th { background: #111827; color: #94a3b8; padding: 12px 15px; border-bottom: 1px solid #334155; }
.cyber-table td { padding: 12px 15px; border-bottom: 1px solid #1e293b; color: #10b981; }
.cyber-table tr:last-child td { border-bottom: none;}
.cyber-table tr:hover td { background: rgba(16, 185, 129, 0.05); }
.td-email { color: #f8fafc !important; }
.td-pass { color: #cbd5e1 !important; }
.td-secret { color: #f59e0b !important; font-weight: bold; }

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