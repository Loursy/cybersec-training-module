<template>
  <div class="module-wrapper">
    <div class="dot-grid"></div>

    <div class="container">
      <button class="lang-btn" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
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
              <p class="guide-desc" v-html="currentText.s2Desc"></p>

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
              <div class="simulation-box">
                <div class="sim-header">
                  <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                  <span style="margin-left: 10px; font-family: monospace; color: #94a3b8;">admin.panel.local</span>
                </div>
                <div class="sim-body">
                  <h3>{{ currentText.simPanelTitle }}</h3>
                  
                  <div class="input-group">
                    <label>E-posta / Kullanıcı Adı</label>
                    <input type="text" v-model="simEmail" class="sim-input" :placeholder="currentText.emailPlaceholder" autocomplete="off" />
                  </div>
                  
                  <div class="input-group">
                    <label>Şifre</label>
                    <input type="password" v-model="simPass" class="sim-input" :placeholder="currentText.passPlaceholder" />
                  </div>

                  <button class="sim-btn" @click="runExploit">
                    {{ currentText.btnHack }}
                  </button>
                  
                  <div v-if="simResult" class="result-container fade-in" v-html="simResult"></div>
                </div>
              </div>

              <div class="action-footer space-between" style="margin-top: 25px;">
                <button class="btn-secondary" @click="currentStep = 1">Önceki</button>
                <button class="btn-success" @click="currentStep = 3" v-if="simResult && simResult.includes('BAŞARILI') || isReviewMode">
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
const simResult = ref('');

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
    preQ1a: "A) Veritabanı sunucuları arasındaki trafiğin şifrelenmemesinden kaynaklanan bir veri sızıntısı türüdür.",
    preQ1b: "B) Kullanıcı girdilerinin, çalıştırılabilir SQL komutlarının bir parçası olarak yorumlanmasına izin veren bir güvenlik açığıdır.",
    preQ1c: "C) Sistemi kandırmak amacıyla veritabanına sahte bilgiler enjekte etme işlemidir.",
    preQ1d: "D) Web sunucusuna aşırı istek göndererek (DDoS) veritabanını erişilemez hale getirme yöntemidir.",
    preQ2Text: "Soru 2: Siber güvenlikte 'Payload' terimi ne anlama gelir?",
    preQ2a: "A) Veritabanına sızdıktan sonra elde edilen kullanıcı şifrelerinin bütünü",
    preQ2b: "B) Sistemin güvenlik duvarını aşmak için kullanılan şifreleme algoritması",
    preQ2c: "C) Bir zafiyeti tetiklemek için hedefe iletilen zararlı veri veya kod parçası",
    preQ2d: "D) Sunucunun istemciye yanıt olarak gönderdiği HTTP başlıklarının tamamı",
    preQ3Text: "Soru 3: Bir web sitesinde SQL Injection zafiyeti oluşmasına neden olan en riskli programlama hatası aşağıdakilerden hangisidir?",
    preQ3a: "A) Kullanıcı şifrelerinin veritabanına kaydedilmeden önce hashlenmemesi",
    preQ3b: "B) Kullanıcı girdilerinin doğrudan SQL sorgu metniyle birleştirilmesi",
    preQ3c: "C) Web sitesinde SSL sertifikası bulunmadığı için verilerin açık okunabilmesi",
    preQ3d: "D) Sistemin art arda yapılan çok sayıda hatalı giriş denemesini engellememesi",
    btnNext1: "Testi Bitir ve Simülasyona Geç",

    s2Title: "Adım 2: Zafiyet Simülasyonu (Hack Time)",
    s2Summary: "Bu login paneline kullanıcı adı ve şifre gibi istenen verileri girmek yerine bir SQL sorgusu yazıyoruz. Yani bize bırakılan bu boşluktan faydalanarak istediğimiz sorguyu yazıp veritabanını manipüle ediyor ve normalde gizlenmesi gereken bilgilere ulaşıyoruz. :)",
    s2Desc: "Aşağıda güvenlik açığı barındıran zafiyetli bir sistemin giriş paneli bulunmaktadır. Sizden normal bir 'E-posta' bekleniyor. Ancak biz buraya kendi ismimizi yazmak yerine, arka planda çalışan veritabanını kandıracak <b>özel bir metin</b> yazacağız. <br><br>Siber güvenlikte buna <b>'Payload' (Saldırı Yükü)</b> denir. Hedefe gönderdiğimiz bu metni, sistemin masum sanıp içeri aldığı ama aslında kapıları içeriden açan <b>dijital bir Truva Atı 🐴</b> gibi düşünebilirsin!<br><br> Hadi o Truva Atını sisteme yollayalım. E-posta kısmına tam olarak şunu yazın: <b style='color: #ef4444;'>' OR 1=1 --</b>",
    infoTitle: "Peki bu payload ne işe yarayacak? (' OR 1=1 --)",
    expl1: "Geliştiricinin arka planda yazdığı kodu biz erken kapatıyoruz. Böylece sistemin kodunun içine kendi kelimelerimizi ekleyebiliyoruz.",
    expl2: "'Veya 1 eşittir 1' diyoruz. 1 her zaman 1'e eşit olduğu için, veritabanı 'Tamam bu kişi doğru söylüyor' diyerek bizi zorla içeri alıyor.",
    expl3: "Veritabanına 'Bundan sonra yazan şifre kontrol kısmını tamamen görmezden gel, sil gitsin' emrini veriyor.",
    simPanelTitle: "Zafiyetli Yönetici Paneli",
    emailPlaceholder: "E-posta (Saldırı metnini yazın)",
    passPlaceholder: "Şifre (Rastgele bir şeyler sallayın)",
    btnHack: "Giriş Yapmayı Dene (Hack)",
    btnNext2: "Saldırıyı Analiz Et",

    s3Title: "Adım 3: Zafiyet Analizi ve Çözümü",
    s3DefTitle: "SQL Injection (SQLi) Nedir?",
    s3DefDesc: "Kötü niyetli kullanıcıların, uygulamanın veritabanına gönderdiği sorgulara müdahale etmesini sağlayan kritik bir güvenlik açığıdır. Geliştirici, kullanıcıdan aldığı veriyi güvenlik süzgecinden geçirmeden doğrudan SQL komutunun içine koyarsa, saldırgan kendi zararlı komutlarını sistemin komutuymuş gibi veritabanına çalıştırttırabilir.",
    s3SolTitle: "Nasıl Çözülür? (Prepared Statements)",
    s3SolDesc1: "Güvenlik açığının temel sebebi, kullanıcının girdiği metnin bir 'veri' olarak değil, çalıştırılabilir bir 'SQL komutu' olarak algılanmasıdır. Bunu kesin olarak çözmek için <b>Parametreli Sorgular (Prepared Statements)</b> kullanmalıyız.",
    s3SolDesc2: "Aşağıdaki güvenli kodda görebileceğiniz gibi, dışarıdan gelen verileri doğrudan SQL metnine yazmak yerine <b>? (soru işareti)</b> koyuyoruz. Veritabanı sürücüsü, bu soru işaretlerinin yerine gelecek verileri otomatik olarak temizler ve sadece düz metin olarak işler.",
    labelVuln: "Hatalı (Zafiyetli) Kod Kullanımı:",
    labelSec: "Güvenli (Doğru) Kod Kullanımı:",
    btnNext3: "Öğrendiklerini Test Et (Son-Test)",

    s4Title: "Adım 4: Son-Test",
    s4Desc: "Bu modülde öğrendiklerinizi pekiştirelim.",
    postQ1Text: "Soru 1: Bir Node.js uygulamasında SQL Injection'ı KESİN olarak önlemek için en iyi yöntem aşağıdakilerden hangisidir?",
    postQ1a: "A) Sunucuya gelen tüm istekleri Base64 formatına çevirerek veritabanına kaydetmek",
    postQ1b: "B) Veritabanı sorgularında Parametreli Sorgular kullanarak kod ve veriyi yalıtmak",
    postQ1c: "C) Veritabanı şifrelerini SHA-256 gibi algoritmalarla hashleyerek saklamak",
    postQ1d: "D) Kullanıcıdan alınan verilerdeki özel işaretleri sadece Frontend'de engellemek",
    postQ2Text: "Soru 2: Simülasyonda kullandığımız ' OR 1=1 -- payload'unun teknik olarak tam işlevi nedir?",
    postQ2a: "A) Veritabanındaki 'admin' tablosunu bulup ilk kaydı yetkilendirir.",
    postQ2b: "B) SQL sunucusunda bellek taşması yaratarak sistemi güvenli moda geçirir.",
    postQ2c: "C) Sorgu koşulunu her zaman doğru yapıp kalan komutları yorum satırına çevirir.",
    postQ2d: "D) Veritabanı bağlantı şifresini güncelleyerek sisteme gizli bir arka kapı bırakır.",
    postQ3Text: "Soru 3: Eğitim adımında gördüğümüz 'Parametreli Sorgular' yöntemi, SQL Injection saldırılarını temel olarak nasıl durdurur?",
    postQ3a: "A) Gelen tüm metinleri veritabanına ulaşmadan önce şifreleyerek",
    postQ3b: "B) Kullanıcı girdisini çalıştırılabilir kod yerine yalnızca salt veri olarak işleyerek",
    postQ3c: "C) İçerisinde zararlı kelimeler geçen tüm girişleri otomatik olarak silerek",
    postQ3d: "D) Veritabanında sadece yöneticilerin işlem yapabilmesi için yetki kontrolleri uygulayarak",
    btnFinish: "Modülü Tamamla",

    msgSuccess: "VERİTABANI SIZINTISI BAŞARILI! <br><span style='font-size:14px; color:#94a3b8; font-weight:normal;'>Şifre kontrolü atlatıldı ve tüm tablo verileri döküldü:</span>",
    msgError: "SQL Hatası Tetiklendi:",
    msgFail: "Giriş Başarısız. Veritabanı bu sorguyu reddetti.",
    tblEmail: "E-posta",
    tblPass: "Şifre",
    tblSecret: "Gizli Veri",
    warnEmpty: "Lütfen ilerlemeden önce tüm soruları yanıtlayın.",
    alertResult: (pre, post) => `Modül tamamlandı!\n\n📋 Ön-Test Başarınız: ${pre}/100\n🏆 Son-Test Başarınız: ${post}/100\n\nFarkındalık artışınız kaydediliyor... Dashboard'a yönlendiriliyorsunuz.`,
  },
  en: {
    modTitle: "Module 1: SQL Injection (SQLi)",
    s1Title: "Step 1: Pre-Test (Knowledge Assessment)",
    s1Desc: "Let's measure your current knowledge level by answering the questions below.",
    preQ1Text: "Question 1: What is SQL Injection (SQLi)?",
    preQ1a: "A) A data leak type caused by unencrypted traffic between database servers.",
    preQ1b: "B) A vulnerability allowing user inputs to be interpreted as part of executable SQL commands.",
    preQ1c: "C) The process of injecting fake information into the database to deceive the system.",
    preQ1d: "D) A method of making the database inaccessible by sending excessive requests (DDoS) to the web server.",
    preQ2Text: "Question 2: What does the term 'Payload' mean in cybersecurity?",
    preQ2a: "A) The entirety of user passwords obtained after infiltrating the database.",
    preQ2b: "B) The encryption algorithm used to bypass the system's firewall.",
    preQ2c: "C) Malicious data or code snippet delivered to the target to trigger a vulnerability.",
    preQ2d: "D) The entirety of HTTP headers sent by the server in response to the client.",
    preQ3Text: "Question 3: Which of the following is the riskiest programming error causing an SQL Injection vulnerability on a website?",
    preQ3a: "A) Not hashing user passwords before saving them to the database.",
    preQ3b: "B) Directly concatenating user inputs with the SQL query text.",
    preQ3c: "C) Data being read openly because the website lacks an SSL certificate.",
    preQ3d: "D) The system not blocking multiple consecutive failed login attempts.",
    btnNext1: "Finish Test & Go to Simulation",

    s2Title: "Step 2: Vulnerability Simulation (Hack Time)",
    s2Summary: "Instead of entering the requested data like username and password into this login panel, we write an SQL query. In other words, we exploit this gap left for us to write any query we want, manipulate the database, and access information that should normally be hidden. :)",
    s2Desc: "Below is a vulnerable login panel. A normal 'Email' is expected from you. However, instead of writing our name, we will write a <b>special text</b> that will deceive the background database. <br><br>In cybersecurity, this is called a <b>'Payload'</b>. Think of this text we send to the target as a <b>digital Trojan Horse 🐴</b> that the system thinks is innocent and lets in, but actually opens the doors from the inside!<br><br> Let's send that Trojan Horse. Type exactly this into the Email field: <b style='color: #ef4444;'>' OR 1=1 --</b>",
    infoTitle: "So, what will this payload do? (' OR 1=1 --)",
    expl1: "We prematurely close the code written by the developer in the background. Thus, we can add our own words into the system's code.",
    expl2: "We say 'Or 1 equals 1'. Since 1 always equals 1, the database says 'Okay, this person is telling the truth' and forcefully lets us in.",
    expl3: "It gives the database the command 'Completely ignore the password checking part written after this, just delete it'.",
    simPanelTitle: "Vulnerable Admin Panel",
    emailPlaceholder: "Email Address (Type the attack text here)",
    passPlaceholder: "Password (Type anything random)",
    btnHack: "Try to Log In (Hack)",
    btnNext2: "Analyze Attack",

    s3Title: "Step 3: Vulnerability Analysis and Solution",
    s3DefTitle: "What is SQL Injection (SQLi)?",
    s3DefDesc: "It is a critical security vulnerability that allows malicious users to interfere with the queries the application sends to its database. If the developer puts the data received from the user directly into the SQL command without passing it through a security filter, the attacker can make the database execute their own malicious commands as if they were the system's commands.",
    s3SolTitle: "How to Solve It? (Prepared Statements)",
    s3SolDesc1: "The root cause of the vulnerability is that the text entered by the user is perceived as an executable 'SQL command' rather than just 'data'. To definitively solve this, we must use <b>Parameterized Queries (Prepared Statements)</b>.",
    s3SolDesc2: "As you can see in the secure code below, instead of writing external data directly into the SQL text, we put a <b>? (question mark)</b>. The database driver automatically cleans the data that will replace these question marks and processes it only as plain text.",
    labelVuln: "Incorrect (Vulnerable) Code Usage:",
    labelSec: "Secure (Correct) Code Usage:",
    btnNext3: "Test Your Knowledge (Post-Test)",

    s4Title: "Step 4: Post-Test",
    s4Desc: "Let's reinforce what you learned in this module.",
    postQ1Text: "Question 1: Which of the following is the best method to DEFINITIVELY prevent SQL Injection in a Node.js application?",
    postQ1a: "A) Converting all incoming requests to the server into Base64 format and saving them to the database.",
    postQ1b: "B) Isolating code and data by using Parameterized Queries in database queries.",
    postQ1c: "C) Storing database passwords by hashing them with algorithms like SHA-256.",
    postQ1d: "D) Blocking special characters in user inputs only on the Frontend.",
    postQ2Text: "Question 2: What is the exact technical function of the ' OR 1=1 -- payload we used in the simulation?",
    postQ2a: "A) It finds the 'admin' table in the database and authorizes the first record.",
    postQ2b: "B) It creates a memory overflow on the SQL server, putting the system into safe mode.",
    postQ2c: "C) It always makes the query condition true and turns the remaining commands into comments.",
    postQ2d: "D) It updates the database connection password, leaving a secret backdoor in the system.",
    postQ3Text: "Question 3: How does the 'Parameterized Queries' method seen in the training step basically stop SQL Injection attacks?",
    postQ3a: "A) By encrypting all incoming text before it reaches the database.",
    postQ3b: "B) By processing the user input only as plain data instead of executable code.",
    postQ3c: "C) By automatically deleting all inputs containing malicious words.",
    postQ3d: "D) By applying authorization checks in the database so only administrators can perform operations.",
    btnFinish: "Complete Module",

    msgSuccess: "DATABASE LEAK SUCCESSFUL! <br><span style='font-size:14px; color:#94a3b8; font-weight:normal;'>Password check bypassed and all table data dumped:</span>",
    msgError: "SQL Error Triggered:",
    msgFail: "Login Failed. The database rejected this query.",
    tblEmail: "Email",
    tblPass: "Password",
    tblSecret: "Secret Data",
    warnEmpty: "Please answer all questions before proceeding.",
    alertResult: (pre, post) => `Module completed!\n\n📋 Pre-Test Score: ${pre}/100\n🏆 Post-Test Score: ${post}/100\n\nYour awareness increase is being recorded... Redirecting to Dashboard.`,
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
      // JWT ENTEGRE EDİLDİ VE LOCALHOST SİLİNDİ
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
  simResult.value = `<p style="color:#94a3b8; text-align:center;">${currentLang.value === 'tr' ? 'Sunucuya bağlanılıyor...' : 'Connecting to server...'}</p>`;
  
  try {
    // JWT ENTEGRE EDİLDİ VE LOCALHOST SİLİNDİ
    const response = await fetch(`/api/vuln/sqli/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: simEmail.value, password: simPass.value }),
    });
    
    const responseData = await response.json();
    
    if (responseData.success) {
      let tableHTML = `<div class="table-container"><table class="db-table"><thead><tr>
                        <th>ID</th><th>${currentText.value.tblEmail}</th><th>${currentText.value.tblPass}</th><th>${currentText.value.tblSecret}</th>
                       </tr></thead><tbody>`;
                       
      responseData.data.forEach((user) => {
        tableHTML += `<tr><td>${user.id}</td><td>${user.email}</td><td><span class="blur-text">${user.password}</span></td><td style="color:#10b981; font-weight:bold;">${user.secret_data}</td></tr>`;
      });
      tableHTML += `</tbody></table></div>`;
      
      simResult.value = `<div class="success-alert"><h3>🔓 ${currentText.value.msgSuccess}</h3></div>` + tableHTML;
    } else {
      simResult.value = `<div class="error-alert"><h3>⛔ ${currentText.value.msgFail}</h3></div>`;
    }
  } catch (error) {
    simResult.value = `<div class="error-alert"><h3>📡 Connection Error</h3></div>`;
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
    // JWT ENTEGRE EDİLDİ VE LOCALHOST SİLİNDİ
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

/* İnceleme Modu Renkleri */
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* GÖREV REHBERİ (Adım 2) - Izgara Tasarımı */
.mission-layout { display: grid; grid-template-columns: 1fr; gap: 25px; margin-top: 20px; }
@media (min-width: 850px) { .mission-layout { grid-template-columns: 1fr 1fr; } }
.guide-panel { display: flex; flex-direction: column; gap: 20px; }
.summary-box { background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 0 8px 8px 0; font-style: italic; color: #a7f3d0;}
.guide-desc { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0; }

.info-box { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
.info-box h4 { color: #f8fafc; margin-top: 0; margin-bottom: 15px; font-size: 16px;}
.info-box ul { padding-left: 20px; margin: 0; line-height: 1.8; color: #94a3b8; font-size: 14px;}
.blue-text { color: #38bdf8; }
.yellow-text { color: #f59e0b; }
.red-text { color: #ef4444; }
.green-text { color: #10b981; }

/* UYGULAMA PANELİ (Adım 2 Sağ Taraf) */
.app-container { display: flex; flex-direction: column; justify-content: flex-start; }
.simulation-box { background: #050505; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4); height: max-content;}
.sim-header { background: #1e293b; padding: 10px 15px; display: flex; align-items: center; border-bottom: 1px solid #000; }
.dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; display: inline-block;}
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }

.sim-body { padding: 30px; }
.sim-body h3 { margin-top: 0; color: #f8fafc; font-size: 20px; margin-bottom: 25px; text-align: center;}
.input-group { margin-bottom: 20px; }
.input-group label { display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: bold;}
.sim-input { width: 100%; padding: 12px 15px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; box-sizing: border-box; outline: none; transition: 0.3s; font-size: 14px;}
.sim-input:focus { border-color: #ef4444; box-shadow: inset 0 0 0 1px #ef4444; }
.sim-btn { width: 100%; background: #ef4444; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px;}
.sim-btn:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4); }

.result-container { margin-top: 25px; }
.success-alert { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 15px;}
.success-alert h3 { margin: 0; color: #10b981; font-size: 16px;}
.error-alert { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 15px; border-radius: 6px; text-align: center; }
.error-alert h3 { margin: 0; color: #ef4444; font-size: 16px;}

.table-container { overflow-x: auto; border-radius: 6px; border: 1px solid #334155; }
.db-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.db-table th { background: #1e293b; color: #94a3b8; padding: 12px 15px; font-weight: 600; border-bottom: 1px solid #334155;}
.db-table td { padding: 12px 15px; border-bottom: 1px solid #1e293b; color: #cbd5e1;}
.db-table tr:last-child td { border-bottom: none; }
.blur-text { filter: blur(3px); user-select: none; }
.blur-text:hover { filter: none; }

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
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; }
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