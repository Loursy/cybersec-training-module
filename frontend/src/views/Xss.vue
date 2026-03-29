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
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Ön-Test Analizi' : '🔍 Review Mode: Pre-Test Analysis') : currentText.preTitle }}
          </h2>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'pre'+index">
            <p><b v-html="currentText[`qPre${q}`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c']" :key="opt" :class="getLabelClass('pre', `q${q}`, opt)">
                <input type="radio" v-model="answers[`preQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`optPre${q}_${opt === 'a' ? 1 : opt === 'b' ? 2 : 3}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer">
            <button class="btn-primary" @click="finishPreTest">
              {{ isReviewMode ? (currentLang === 'tr' ? 'Sonraki Aşama (Simülasyon)' : 'Next Step (Simulation)') : currentText.btnPre }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Simülasyon' : '🔍 Review Mode: Simulation') : currentText.simTitle }}
          </h2>
          
          <div class="mission-layout">
            <div class="guide-panel">
              <h3 class="guide-title">{{ currentText.gTitle }}</h3>
              <p class="guide-desc" v-html="currentText.gDesc"></p>

              <div class="guide-step" :class="{ 'current': currentMission === 1, 'done': currentMission > 1 }">
                <b>{{ currentText.gs1T }}</b>
                <p v-html="currentText.gs1D"></p>
              </div>

              <div class="guide-step" :class="{ 'current': currentMission === 2, 'done': currentMission > 2 }">
                <b>{{ currentText.gs2T }}</b>
                <p v-html="currentText.gs2D"></p>
              </div>

              <div class="guide-step" :class="{ 'current': currentMission === 3, 'done': currentMission > 3 }">
                <b>{{ currentText.gs3T }}</b>
                <p v-html="currentText.gs3D"></p>
              </div>

              <div class="guide-step" :class="{ 'current': currentMission === 4, 'done': currentMission > 4 }">
                <b>{{ currentText.gs4T }}</b>
                <p v-html="currentText.gs4D"></p>
              </div>
            </div>

            <div class="app-container">
              
              <div class="browser-window fade-in" v-if="activeWindow === 'browser'">
                <div class="browser-header">
                  <div class="browser-dots">
                    <div class="dot dot-r"></div>
                    <div class="dot dot-y"></div>
                    <div class="dot dot-g"></div>
                  </div>
                  <div class="browser-url">{{ simulatedUrl }}</div>
                </div>
                <div class="browser-body">
                  <h2 class="browser-logo">{{ currentText.searchLogo }}</h2>
                  <div class="search-bar">
                    <input type="text" v-model="searchInput" :placeholder="currentText.inputSearch" @keyup.enter="executeSearch" autocomplete="off" />
                    <button @click="executeSearch" :class="{'btn-phish': currentMission === 3}">
                      {{ currentMission === 3 ? currentText.btnPhish : currentText.btnSearch }}
                    </button>
                  </div>
                  
                  <div v-if="simWarning" class="warning-msg fade-in">{{ simWarning }}</div>
                  
                  <div class="result-area fade-in" v-if="searchResultHtml">
                    <div v-html="searchResultHtml"></div>
                  </div>
                  <div class="result-area" v-else>
                    <span style="color: #94a3b8; font-style: italic">{{ currentText.resWait }}</span>
                  </div>
                </div>
              </div>

              <div class="mail-window fade-in" v-if="activeWindow === 'mail'">
                <div class="mail-header">
                  <span>{{ currentText.mailHeader }}</span>
                  <span style="font-weight: normal; font-size: 13px">{{ currentLang === 'tr' ? 'Gelen Kutusu (1 Yeni)' : 'Inbox (1 New)' }}</span>
                </div>
                <div class="mail-body">
                  <div class="mail-sidebar">
                    <div class="mail-folder active">{{ currentLang === 'tr' ? 'Gelen Kutusu' : 'Inbox' }}</div>
                    <div class="mail-folder">{{ currentLang === 'tr' ? 'Gönderilmiş' : 'Sent' }}</div>
                  </div>
                  <div class="mail-content">
                    <div class="mail-subject">
                      <span class="mail-tag">URGENT</span>
                      <span>{{ currentText.mailSubj }}</span>
                    </div>
                    <div class="mail-text">
                      <span v-html="currentText.mailText"></span>
                      <button class="mail-link" @click="adminClicksLink">{{ simulatedUrl }}</button>
                      <span v-html="currentText.mailSign"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="exploit-window fade-in" v-if="activeWindow === 'hacker'">
                <div class="hacker-terminal">
                  <div class="term-header">
                    <span>{{ currentText.termHeader }}</span>
                    <span style="color: #22c55e">● PORT: 4444 AÇIK</span>
                  </div>
                  <div class="term-body">
                    <div v-html="terminalLogs"></div>
                  </div>
                </div>

                <div class="devtools-window fade-in-up" v-if="showDevTools">
                  <div class="dev-header">
                    <span class="dev-tab">Elements</span>
                    <span class="dev-tab">Console</span>
                    <span class="dev-tab">Network</span>
                    <span class="dev-tab active">{{ currentText.devAppTab }}</span>
                  </div>
                  <div class="dev-body">
                    <p style="margin-top: 0; font-size: 13px; color: #94a3b8">{{ currentText.devDesc }}</p>
                    <table class="dev-table">
                      <tr><th>Name</th><th>Value</th><th>Domain</th></tr>
                      <tr>
                        <td>session_id</td>
                        <td>
                          <input type="text" v-model="cookieInput" class="dev-input" :placeholder="currentText.cookieLbl" autocomplete="off" />
                        </td>
                        <td>sirket-bilgi-bankasi.com</td>
                      </tr>
                    </table>
                    <button class="btn-inject" @click="hijackSession">
                      <span class="pulse-icon"></span> {{ currentText.btnHijack }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="admin-panel fade-in" v-if="activeWindow === 'admin'">
                <div class="admin-panel-header">
                  <span class="blinking-dot"></span> {{ currentText.adminTitle }}
                </div>
                <div class="admin-panel-body">
                  <p class="admin-desc">{{ currentText.adminDesc }}</p>
                  
                  <div class="admin-grid">
                    <div class="admin-card">
                      <h4>💳 {{ currentText.adminData1 }}</h4>
                      <code>4312-XXXX-XXXX-9912 (L: $50K)</code>
                      <code>5500-XXXX-XXXX-1102 (L: $15K)</code>
                      <code>4111-XXXX-XXXX-8822 (L: $90K)</code>
                    </div>
                    <div class="admin-card">
                      <h4>📂 {{ currentText.adminData2 }}</h4>
                      <code>DB_USER: root_master</code>
                      <code>DB_PASS: P@ssw0rd2026!</code>
                      <code>API_KEY: ak_live_99x82z</code>
                    </div>
                  </div>
                  
                  <div class="hacker-watermark">ACCESS GRANTED // SYSTEM COMPROMISED</div>
                </div>
              </div>

              <div class="action-footer" style="margin-top: 15px;">
                <button v-if="activeWindow === 'admin' || isReviewMode" class="btn-success fade-in" @click="currentStep = 3">
                  {{ currentText.btnToTrn }}
                </button>
              </div>

            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material') : currentText.trnTitle }}
          </h2>
          
          <div class="edu-card logic-box">
            <p class="edu-desc-txt">{{ currentText.trnDesc }}</p>

            <div class="flow-step">
              <div class="flow-num step-red">1</div>
              <div>
                <b class="step-title-text red-text">{{ currentText.trnH1 }}</b>
                <p class="step-desc-text" v-html="currentText.trnP1"></p>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num step-yellow">2</div>
              <div>
                <b class="step-title-text yellow-text">{{ currentText.trnH2 }}</b>
                <p class="step-desc-text" v-html="currentText.trnP2"></p>
              </div>
            </div>

            <div style="margin: 25px 0; text-align: center;">
               
            </div>

            <div class="solution-box">
              <b class="solution-title">{{ currentText.trnH3 }}</b>
              <p class="solution-desc" v-html="currentText.trnP3"></p>
              <div style="margin-top: 20px; text-align: center;">
                 
              </div>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 2">Önceki</button>
            <button class="btn-primary" @click="currentStep = 4">{{ currentText.btnToPost }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Son-Test Analizi' : '🔍 Review Mode: Post-Test Analysis') : currentText.postTitle }}
          </h2>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'post'+index">
            <p><b v-html="currentText[`qPost${q}`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c']" :key="opt" :class="getLabelClass('post', `q${q}`, opt)">
                <input type="radio" v-model="answers[`postQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`optPost${q}_${opt === 'a' ? 1 : opt === 'b' ? 2 : 3}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 3">Önceki</button>
            <button class="btn-warning" @click="finishPostTest" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-small"></span>
              {{ isReviewMode ? (currentLang === 'tr' ? 'İncelemeyi Bitir ve Dön' : 'Finish Review & Return') : (isSaving ? (currentLang === 'tr' ? 'Kaydediliyor...' : 'Saving...') : currentText.btnPost) }}
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
const isLoading = ref(true);
const isSaving = ref(false);

const isReviewMode = computed(() => route.query.review === 'true');

const answers = reactive({
  preQ1: '', preQ2: '', preQ3: '',
  postQ1: '', postQ2: '', postQ3: ''
});

// JWT Token ve User Email
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// Simülasyon Değişkenleri
const currentMission = ref(1);
const activeWindow = ref('browser'); 
const searchInput = ref('');
const simulatedUrl = ref('http://sirket-bilgi-bankasi.com/arama?q=');
const searchResultHtml = ref('');
const simWarning = ref('');
const terminalLogs = ref('');
const showDevTools = ref(false);
const cookieInput = ref('');
const adminCookie = "ADM-99482-SECRET";

const answerKeys = {
  pre: { q1: "b", q2: "c", q3: "a" },
  post: { q1: "b", q2: "c", q3: "a" },
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 4: Cross-Site Scripting (XSS)",
    preTitle: "Ön-Test",
    qPre1: "1. Cross-Site Scripting (XSS) zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPre1_1: "A) Kullanıcı girdilerinin işletim sistemi terminaline aktarılarak sunucunun ele geçirilmesi.",
    optPre1_2: "B) Zararlı JavaScript kodlarının, diğer kullanıcıların tarayıcılarında çalışacak şekilde sisteme enjekte edilmesi.",
    optPre1_3: "C) Ağ trafiğinin arasına girilerek sunucu ve istemci arasındaki iletişim paketlerinin değiştirilmesi.",
    qPre2: "2. 'Reflected (Yansıyan)' ve 'Stored (Kalıcı)' XSS arasındaki en temel fark nedir?",
    optPre2_1: "A) Reflected XSS sadece yönetici hesaplarını hedeflerken, Stored XSS standart hesapları hedefler.",
    optPre2_2: "B) Reflected XSS veritabanını silerken, Stored XSS yalnızca arayüzü bozar.",
    optPre2_3: "C) Reflected XSS bağlantı tıklandığında anlık çalışır, Stored XSS ise veritabanına kaydedilip sürekli tetiklenir.",
    qPre3: "3. XSS zafiyetinin başarıyla sömürülmesi durumunda saldırganın ulaşabileceği en yaygın ve kritik sonuç nedir?",
    optPre3_1: "A) Kurbanın oturum çerezlerinin (Session Cookies) çalınması ve hesabının yetkisiz ele geçirilmesi.",
    optPre3_2: "B) Sunucudaki tabloların şifrelenerek fidye talebinde bulunulması.",
    optPre3_3: "C) Sistemin aşırı yüklenmesi sonucu geçici olarak hizmet dışı (DDoS) kalması.",
    btnPre: "Simülasyona Başla",

    simTitle: "Adım 2: Zafiyet Sömürüsü",
    gTitle: "📋 Operasyon Dosyası",
    gDesc: "Hedefimiz <b>Sistem Yöneticisinin (Admin)</b> hesabını ele geçirmek. Hackerlar doğrudan zararlı link yollamazlar. Önce hedefin <b>gerçek ve güvenilir sitesinde</b> açık ararlar (Test). Açığı bulduklarında payload'u bu linkin içine gömüp Yöneticiye mail atarlar (Phishing).",
    gs1T: "1. Keşif: Yansımayı (Reflect) Gör",
    gs1D: "Önce hedef şirketin arama sayfasını kendi tarayıcında test et. Arama kutusuna <code class='highlight'>Maaşlar</code> yaz ve Ara de. Sistemin senin kelimeni sayfaya ve yukarıdaki <b>URL Çubuğuna</b> nasıl yansıttığına dikkat et.",
    gs2T: "2. Açık Tespiti (HTML Injection)",
    gs2D: "Sistem HTML kodlarını filtreliyor mu? Kutucuğa <code class='highlight'>&lt;h1&gt;Test&lt;/h1&gt;</code> yazıp Ara de. Eğer ekranda devasa bir 'Test' başlığı oluşursa, tarayıcı yazdığımızı kelime değil **HTML kodu sanıyor** demektir!",
    gs3T: "3. Oltalama (Phishing) Aşaması",
    gs3D: "Açığı bulduk! Artık arama kutusuna zararlı kodumuzu (<code class='highlight'>&lt;img src=\"x\" onerror=\"steal(document.cookie)\"&gt;</code>) yazıp <b>Zararlı Linki Oluştur</b> butonuna bas. Sistem bu kodu URL'ye gömüp Yöneticiye mail atacak.",
    gs4T: "4. Oturum Çalma (Hijack)",
    gs4D: "Yönetici kendi sitesine güvendiği için maildeki linke tıklayacak. Tıkladığı an kod çalışacak ve çerezi senin terminaline düşecek. Çerezi alıp tarayıcının <b>DevTools</b> sekmesine yapıştır ve yetkiyi al!",

    searchLogo: "🔎 Şirket Bilgi Bankası",
    btnSearch: "Arama Yap",
    btnPhish: "🔗 Zararlı Link Oluştur ve Mail At",
    inputSearch: "Aranacak kelimeyi girin...",
    resWait: "Arama sonuçları burada görünecek...",
    warningWord: "Lütfen rehberde istenen testi tam olarak yazın.",

    mailHeader: "✉️ Kurumsal E-Posta (Yönetici Hesabı)",
    mailSubj: "Sistem Güncellemesi: Şifre Değişikliği Gerekiyor",
    mailText: "Sayın Yönetici,<br><br>Şirket bilgi bankası sunucularımızda güvenlik güncellemesi yapılmıştır. Hesabınızın askıya alınmaması için lütfen aşağıdaki <b>şirket içi ve güvenli</b> bağlantıya tıklayarak oturumunuzu doğrulayın:<br><br>",
    mailSign: "<br><br><i>IT Destek Departmanı</i>",

    termHeader: ">_ SALDIRGAN SUNUCUSU (Dinleyici)",
    termWait: "[+] Dinleyici başlatıldı... Kurbanın maildeki linke tıklaması bekleniyor...<br>",
    termSuccess: "<br><span style='color:#ef4444;'>[!] UYARI: KURBAN LİNKE TIKLADI!</span><br>[+] Kurbanın tarayıcısından bağlantı alındı.<br>[+] ÇALINAN ÇEREZ (session_id) YAKALANDI: <b style='color:#000; background:#22c55e; padding:2px 5px;'>",

    devAppTab: "Application (Cookies)",
    devDesc: "Tarayıcının Çerez (Cookie) deposuna kurbanın çerezini yapıştırarak sistemi kandır:",
    cookieLbl: "Çalınan çerezi buraya yapıştır...",
    btnHijack: "💉 Çerezi Enjekte Et ve Sisteme Sız", 
    wrongCookie: "Hatalı çerez! Terminalden doğru değeri (ADM-...) kopyaladığınıza emin olun.",

    adminTitle: "🔴 ROOT YETKİSİ: SİSTEM ELE GEÇİRİLDİ",
    adminDesc: "Hedef sisteme başarıyla sızıldı. Yönetici (Admin) ayrıcalıklarıyla giriş yapıldı.",
    adminData1: "Müşteri Kredi Kartları [ŞİFRESİZ]",
    adminData2: "Kritik Sunucu Şifreleri [AÇIK]",

    btnToTrn: "GÖREVLER BAŞARILI - ANALİZE GEÇ",
    trnTitle: "Adım 3: Teknik Analiz - Sistem Nasıl Çöktü?",
    trnDesc: "Arama çubuğuna yazdığın basit bir metin, nasıl oldu da bir kod parçası gibi çalıştırılıp sistemi ele geçirdi? İşte Front-end geliştiricisinin yaptığı ölümcül hatalar:",
    trnH1: "Ölümcül Hata: innerHTML Kullanımı",
    trnP1: "Geliştirici, URL'deki arama terimini alıp web sayfasına yazdırırken tehlikeli olan <code class='code-red'>innerHTML</code> fonksiyonunu kullandı. Bu fonksiyon, gelen metnin içindeki her şeyi saf HTML komutu olarak kabul eder.",
    trnH2: "Oltalama ve Tarayıcının Kandırılması",
    trnP2: "Admin senin gönderdiğin (kendi şirketinin) zararlı linkine tıkladığında, tarayıcısı sayfayı açarken URL'deki <code class='code-red'>&lt;img src=\"x\" onerror=\"...\"&gt;</code> kodunu da DOM'a bastı. Tarayıcı bunu gerçek resim sandı. Bulamayınca <code class='code-red'>onerror</code> olayını tetikledi ve kodu çalıştırıp çerezi senin sunucuna fırlattı.",
    trnH3: "🛡️ Kesin Çözüm: Output Encoding ve HttpOnly Çerezler",
    trnP3: "XSS'i önlemenin tek yolu, kullanıcıdan alınan metinleri ekrana basmadan önce <b>Kodlamaktır (Output Encoding)</b>. Yani <code class='code-green'>&lt;</code> işaretini <code class='code-green'>&amp;lt;</code> formatına çevirmektir. Modern JS'de <code class='code-red'>innerHTML</code> yerine <code class='code-green'>textContent</code> kullanılmalıdır.<br><br>Ayrıca oturum çerezleri oluşturulurken mutlaka <code class='code-green'>HttpOnly</code> bayrağı eklenmelidir. Bu bayrak, çerezlerin JavaScript tarafından okunmasını tamamen engeller!",
    btnToPost: "Tüm Detayları Anladım -> Son Teste Geç",

    postTitle: "Son-Test",
    qPost1: "1. Simülasyonda admin'e gönderdiğimiz <code>&lt;img src=\"x\" onerror=\"...\"&gt;</code> payload'u JavaScript'i nasıl tetiklemektedir?",
    optPost1_1: "A) Zararlı JavaScript kodu 'src' özelliği içerisine gizlenerek güvenlik duvarını atlatır.",
    optPost1_2: "B) Tarayıcı geçersiz bir resim yüklemeye çalışıp hata aldığında 'onerror' içindeki JS kodunu çalıştırır.",
    optPost1_3: "C) HTML5 uyumlu olmayan etiketler veritabanına kaydedilirken otomatik olarak JavaScript'e dönüştürülür.",
    qPost2: "2. XSS zafiyetini kod seviyesinde önlemek için en etkili Front-end yöntemi aşağıdakilerden hangisidir?",
    optPost2_1: "A) Kullanıcıdan alınan verileri şifrelemek (Encryption) ve tarayıcıda bu şekilde saklamak.",
    optPost2_2: "B) Sadece yönetici yetkisine sahip kullanıcıların HTML formatında veri girmesine izin vermek.",
    optPost2_3: "C) Verileri DOM'a eklerken 'innerHTML' yerine güvenli olan 'textContent' metodunu kullanmak.",
    qPost3: "3. XSS saldırganının tarayıcıdaki çerezleri okuyarak hesabı çalmasını engelleyen güvenlik mekanizması nedir?",
    optPost3_1: "A) Çerezlere 'HttpOnly' bayrağı (flag) ekleyerek JavaScript erişimine kapatmak.",
    optPost3_2: "B) Çerezleri veritabanında 'SHA-256' algoritması ile hashlemek.",
    optPost3_3: "C) Kullanıcı her giriş yaptığında çerezin süresini (Expiration Date) uzatmak.",
    btnPost: "Eğitimi Bitir",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 4: Cross-Site Scripting (XSS)",
    preTitle: "Pre-Test",
    qPre1: "1. What is the fundamental mechanism of a Cross-Site Scripting (XSS) vulnerability?",
    optPre1_1: "A) Transferring user inputs to the operating system terminal to take over the server.",
    optPre1_2: "B) Injecting malicious JavaScript codes into the system to be executed in other users' browsers.",
    optPre1_3: "C) Intercepting network traffic to modify communication packets between server and client.",
    qPre2: "2. What is the primary difference between 'Reflected' and 'Stored' XSS?",
    optPre2_1: "A) Reflected XSS targets only admin accounts, while Stored XSS targets standard user accounts.",
    optPre2_2: "B) Reflected XSS deletes the background database, while Stored XSS only corrupts the web interface.",
    optPre2_3: "C) Reflected executes instantly when a link is clicked, Stored is saved in DB and triggers repeatedly.",
    qPre3: "3. What is the most common and critical outcome if an XSS vulnerability is successfully exploited?",
    optPre3_1: "A) Stealing the victim's Session Cookies and unauthorizedly taking over their account.",
    optPre3_2: "B) Encrypting database tables on the server to demand a Ransomware payment.",
    optPre3_3: "C) Causing a temporary Denial of Service (DDoS) by overloading the system.",
    btnPre: "Start Simulation",

    simTitle: "Step 2: Exploit Simulation",
    gTitle: "📋 Operation File",
    gDesc: "Our goal is to take over the <b>Company Admin's</b> account. Hackers first find a vulnerability on the target's <b>real, trusted site</b>. Once found, they embed the payload into this legitimate site's URL and email it to the Admin (Phishing).",
    gs1T: "1. Recon: See the Reflection",
    gs1D: "Test the search page on your browser. Type <code class='highlight'>Salaries</code> and hit Search. Notice how the system reflects your word onto the page AND the <b>URL Bar</b>.",
    gs2T: "2. HTML Injection (Test)",
    gs2D: "Does the system filter HTML? Search for <code class='highlight'>&lt;h1&gt;Test&lt;/h1&gt;</code>. If you see a giant 'Test' heading, the browser executes our input as **real HTML code**!",
    gs3T: "3. Phishing Phase",
    gs3D: "Paste our malicious JS payload into the search box: <code class='highlight'>&lt;img src=\"x\" onerror=\"steal(document.cookie)\"&gt;</code>. Click the Purple button. The system will disguise this in a URL and email it to the Admin.",
    gs4T: "4. Session Hijacking",
    gs4D: "The Admin trusts their site and clicks the link. The code executes and drops their cookie into your Terminal. Copy it, paste it into the <b>DevTools</b> tab, and hijack the session!",

    searchLogo: "🔎 Corporate Knowledge Base",
    btnSearch: "Search",
    btnPhish: "🔗 Generate Link & Email Admin",
    inputSearch: "Enter keyword to search...",
    resWait: "Search results will appear here...",
    warningWord: "Please enter the exact test word/code requested in the guide.",

    mailHeader: "✉️ Corporate Email (Admin Account)",
    mailSubj: "System Update: Password Reset Required",
    mailText: "Dear Administrator,<br><br>A security update has been applied to our servers. To prevent your account from being suspended, please verify your session by clicking the <b>secure internal</b> link below:<br><br>",
    mailSign: "<br><br><i>IT Support Department</i>",

    termHeader: ">_ ATTACKER SERVER (Listener)",
    termWait: "[+] Listener started... Awaiting victim to click the link in the email...<br>",
    termSuccess: "<br><span style='color:#ef4444;'>[!] WARNING: VICTIM CLICKED THE LINK!</span><br>[+] Connection received from victim's browser.<br>[+] STOLEN COOKIE CAPTURED: <b style='color:#000; background:#22c55e; padding:2px 5px;'>",

    devAppTab: "Application (Cookies)",
    devDesc: "Inject the stolen cookie into the browser's Cookie storage to trick the system:",
    cookieLbl: "Paste the stolen cookie here...",
    btnHijack: "💉 Inject Cookie & Breach System", 
    wrongCookie: "Invalid cookie! Make sure you copied the correct value (ADM-...) from the terminal.",

    adminTitle: "🔴 ROOT ACCESS: SYSTEM BREACHED",
    adminDesc: "Successfully infiltrated target system. Logged in with Administrator privileges.",
    adminData1: "Customer Credit Cards [UNENCRYPTED]",
    adminData2: "Critical Server Passwords [EXPOSED]",

    btnToTrn: "MISSIONS SUCCESSFUL - GO TO ANALYSIS",
    trnTitle: "Step 3: Technical Analysis - How the System Crashed?",
    trnDesc: "How did a simple text typed into a search bar act like a piece of code and hijack the system? Here are the fatal flaws:",
    trnH1: "Fatal Flaw: Using innerHTML",
    trnP1: "When rendering the search term from the URL to the web page, the developer used the dangerous <code class='code-red'>innerHTML</code> function. This function interprets everything inside the incoming text as raw HTML commands.",
    trnH2: "Phishing and Fooling the Browser",
    trnP2: "When the Admin clicked your malicious link, their browser embedded the <code class='code-red'>&lt;img src=\"x\" onerror=\"...\"&gt;</code> code into the DOM. The browser saw this as a real image. Since it couldn't find image 'x', it triggered the <code class='code-red'>onerror</code> event, executed the code, and hurled the cookie to your server.",
    trnH3: "🛡️ Ultimate Solution: Output Encoding and HttpOnly",
    trnP3: "The only way to prevent XSS is to <b>Encode</b> user inputs before rendering them. In modern JS, <code class='code-green'>textContent</code> should be used instead of <code class='code-red'>innerHTML</code>.<br><br>Furthermore, when creating session cookies, the <code class='code-green'>HttpOnly</code> flag must be added. This flag completely blocks JavaScript from reading the cookies!",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    qPost1: "1. How does the <code>&lt;img src=\"x\" onerror=\"...\"&gt;</code> payload sent to the admin trigger JavaScript?",
    optPost1_1: "A) The malicious JS code is hidden within the 'src' attribute to bypass the firewall.",
    optPost1_2: "B) When the browser tries to load an invalid image and fails, it executes the JS code inside 'onerror'.",
    optPost1_3: "C) Non-HTML5 compliant tags are automatically converted to JavaScript when saved to the database.",
    qPost2: "2. Which of the following is the most effective Front-end method to prevent XSS vulnerabilities?",
    optPost2_1: "A) Encrypting the data received from the user and storing it that way in the browser.",
    optPost2_2: "B) Allowing only users with administrator privileges to input data in HTML format.",
    optPost2_3: "C) Using the secure 'textContent' method instead of 'innerHTML' when appending data to the DOM.",
    qPost3: "3. What is the security mechanism that prevents an XSS attacker from reading session cookies (Session Hijacking)?",
    optPost3_1: "A) Adding the 'HttpOnly' flag to cookies to close them off to JavaScript access.",
    optPost3_2: "B) Irreversibly hashing the cookies in the database using the 'SHA-256' algorithm.",
    optPost3_3: "C) Extending the cookie's Expiration Date every time the user logs in.",
    btnPost: "Finish Training",
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
    localStorage.setItem('xss_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  if (!userEmail || !token) return router.push('/'); // JWT Güvenlik Kalkanı

  if (isReviewMode.value) {
    try {
      // JWT ENTEGRE EDİLDİ VE LOCALHOST SİLİNDİ
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data && result.data.xss_answers) {
        Object.assign(answers, result.data.xss_answers);
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem('xss_draft_answers');
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }
  
  terminalLogs.value = currentText.value.termWait;
  isLoading.value = false;
});

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    return alert(currentText.value.warnEmpty);
  }
  currentStep.value = 2; 
};

// --- SIMULATION LOGIC ---
const executeSearch = () => {
  const val = searchInput.value.trim();
  const lowerVal = val.toLowerCase();
  simWarning.value = '';

  simulatedUrl.value = "http://sirket-bilgi-bankasi.com/arama?q=" + encodeURIComponent(val);

  if (currentMission.value === 1) {
    if (lowerVal === "maaşlar" || lowerVal === "salaries") {
      searchResultHtml.value = `<span style="color:#64748b;">${currentLang.value==='tr'?'Sonuç bulunamadı:':'No results for:'}</span> <br> ${val}`;
      currentMission.value = 2;
    } else {
      simWarning.value = currentText.value.warningWord;
    }
  } 
  else if (currentMission.value === 2) {
    if (lowerVal.includes("<h1>") && lowerVal.includes("</h1>")) {
      searchResultHtml.value = `<span style="color:#64748b;">${currentLang.value==='tr'?'Sonuç bulunamadı:':'No results for:'}</span> <br> <h1 style="color:#ef4444; font-size:40px; margin:10px 0; border-bottom:2px solid #ef4444;">Test</h1>`;
      currentMission.value = 3;
    } else {
      simWarning.value = currentText.value.warningWord;
    }
  }
  else if (currentMission.value === 3) {
    if (lowerVal.includes("<img") && lowerVal.includes("onerror")) {
      activeWindow.value = 'mail';
    } else {
      simWarning.value = currentText.value.warningWord;
    }
  }
};

const adminClicksLink = () => {
  activeWindow.value = 'hacker';
  
  setTimeout(() => {
    terminalLogs.value += currentText.value.termSuccess + adminCookie + "</b><br>";
    setTimeout(() => {
      showDevTools.value = true;
      currentMission.value = 4;
    }, 1200);
  }, 1000);
};

const hijackSession = () => {
  if (cookieInput.value.trim() === adminCookie) {
    activeWindow.value = 'admin';
  } else {
    alert(currentText.value.wrongCookie);
  }
};

const finishPostTest = async () => {
  if (isReviewMode.value) return router.push("/stats");
  if (!answers.postQ1 || !answers.postQ2 || !answers.postQ3) return alert(currentText.value.warnEmpty);
  
  isSaving.value = true;
  let preScore = 0; let postScore = 0;
  if (answers.preQ1 === answerKeys.pre.q1) preScore += 33.33;
  if (answers.preQ2 === answerKeys.pre.q2) preScore += 33.33;
  if (answers.preQ3 === answerKeys.pre.q3) preScore += 33.34;
  
  if (answers.postQ1 === answerKeys.post.q1) postScore += 33.33;
  if (answers.postQ2 === answerKeys.post.q2) postScore += 33.33;
  if (answers.postQ3 === answerKeys.post.q3) postScore += 33.34;

  preScore = Math.round(preScore);
  postScore = Math.round(postScore);
  
  try {
    // JWT ENTEGRE EDİLDİ VE LOCALHOST SİLİNDİ
    await fetch(`/api/save-score`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: userEmail, module: "xss", preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem('xss_draft_answers'); 
    router.push("/stats");
  } catch (err) {
    alert("Hata oluştu!");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* Genel Temel */
.module-wrapper { background-color: #0b0f19; color: #cbd5e1; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.container { width: 100%; max-width: 1000px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #00e5ff; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #00e5ff, transparent); margin-bottom: 35px; }
.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #00e5ff; padding-left: 15px; margin-bottom: 25px; }
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* Sorular */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #00e5ff; background: rgba(0, 229, 255, 0.05); color: #f8fafc; }

/* Simülasyon Düzeni */
.mission-layout { display: grid; grid-template-columns: 350px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-title { margin-top: 0; color: #f8fafc; font-size: 18px; margin-bottom: 10px; }
.guide-desc { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
.guide-step { padding: 15px; border-radius: 8px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; border: 1px solid transparent; }
.guide-step.current { opacity: 1; background: rgba(0, 229, 255, 0.05); border: 1px solid #3b82f6; box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #38bdf8; margin-bottom: 5px; font-size: 14px; }
.guide-step p { margin: 0; font-size: 12.5px; line-height: 1.5; color: #cbd5e1; }
code.highlight { background: #000; color: #f59e0b; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; }

/* Uygulama Ekranları */
.app-container { display: flex; flex-direction: column; gap: 15px; position: relative; }

.browser-window { background: #fff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: fadeIn 0.5s; }
.browser-header { background: #e2e8f0; padding: 12px 15px; border-bottom: 1px solid #cbd5e1; display: flex; align-items: center; gap: 15px; }
.browser-dots { display: flex; gap: 6px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot-r { background: #ef4444; } .dot-y { background: #f59e0b; } .dot-g { background: #10b981; }
.browser-url { background: #fff; padding: 6px 15px; border-radius: 20px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 12px; flex-grow: 1; color: #64748b; }
.browser-body { padding: 30px; min-height: 250px; }
.browser-logo { color: #0284c7; margin-top: 0; font-size: 22px; text-align: center; margin-bottom: 20px; }

.search-bar { display: flex; gap: 10px; }
.search-bar input { flex-grow: 1; padding: 10px; border-radius: 6px; border: 1px solid #94a3b8; outline: none; font-size: 14px; font-family: monospace; }
.search-bar button { padding: 10px 20px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-phish { background: #8b5cf6 !important; }
.result-area { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; min-height: 60px; font-size: 13px; margin-top: 15px; color: #334155; }
.warning-msg { color: #ef4444; font-size: 13px; font-style: italic; margin-top: 10px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-left: 3px solid #ef4444; }

/* 2. MAIL */
.mail-window { background: #f8fafc; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; display: flex; flex-direction: column; color: #1e293b; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); animation: fadeIn 0.5s; }
.mail-header { background: #1e293b; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; }
.mail-body { display: flex; min-height: 300px; }
.mail-sidebar { width: 140px; background: #f1f5f9; border-right: 1px solid #e2e8f0; padding: 15px 0; }
.mail-folder { padding: 10px 15px; cursor: pointer; font-size: 14px; font-weight: bold; color: #64748b; }
.mail-folder.active { background: #e0f2fe; color: #0284c7; border-left: 3px solid #0284c7; }
.mail-content { flex-grow: 1; padding: 25px; }
.mail-subject { font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
.mail-tag { background: #ef4444; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
.mail-text { font-size: 14px; line-height: 1.6; color: #475569; }
.mail-link { display: inline-block; background: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin: 15px 0; font-weight: bold; cursor: pointer; border: none; font-family:monospace; font-size:12px; }
.mail-link:hover { background: #1d4ed8; }

/* 3. HACKER & DEVTOOLS */
.exploit-window { display: flex; flex-direction: column; gap: 15px; animation: fadeIn 0.5s; }
.hacker-terminal { background: #050505; border-radius: 12px; border: 1px solid #334155; overflow: hidden; height: 180px; display: flex; flex-direction: column; }
.term-header { background: #1e293b; padding: 8px 15px; font-size: 11px; color: #f59e0b; font-weight: bold; border-bottom: 1px solid #000; display: flex; justify-content: space-between; }
.term-body { padding: 15px; flex-grow: 1; overflow-y: auto; color: #22c55e; font-family: "Consolas", monospace; font-size: 13px; line-height: 1.5; }

.devtools-window { background: #1e293b; border-radius: 12px; border: 1px solid #475569; overflow: hidden; margin-top: 15px; animation: fadeIn 0.5s; }
.dev-header { background: #0f172a; padding: 10px 15px; color: #cbd5e1; font-size: 13px; font-family: monospace; border-bottom: 1px solid #334155; display: flex; gap: 15px; }
.dev-tab { color: #94a3b8; cursor: pointer; }
.dev-tab.active { color: #00e5ff; border-bottom: 2px solid #00e5ff; padding-bottom: 5px;}
.dev-body { padding: 20px; }
.dev-table { width: 100%; color: #cbd5e1; font-size: 12px; text-align: left; }
.dev-input { width: 100%; background: transparent; border: 1px solid #00e5ff; color: #00e5ff; padding: 8px; outline: none; font-family: monospace; border-radius:4px;}
.btn-inject { background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; padding: 12px; border-radius: 6px; width: 100%; font-weight: bold; margin-top: 15px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(16,185,129,0.3);}
.btn-inject:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(16,185,129,0.6); }

/* Admin Panel */
.admin-panel-success { background: #050505; padding: 30px; border-radius: 12px; border: 2px solid #ef4444; box-shadow: 0 0 30px rgba(239, 68, 68, 0.2); animation: fadeIn 1s;}
.admin-panel-header { color: #ef4444; font-size: 22px; font-weight: bold; border-bottom: 1px dashed #ef4444; padding-bottom: 15px; margin-bottom: 20px; display: flex; align-items: center; }
.blinking-dot { width: 14px; height: 14px; background: #ef4444; border-radius: 50%; margin-right: 12px; animation: blink 1s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.admin-desc-txt { font-size: 15px; color: #fca5a5; margin-bottom:25px; line-height:1.6; }
.admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.admin-card { background: #111827; padding: 20px; border-radius: 8px; border: 1px solid #374151; }
.admin-card code { display: block; background: #000; color: #10b981; padding: 8px; border-radius: 4px; font-size: 11px; margin-top: 10px; }

/* Eğitim Adımı */
.edu-card { background: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155; }
.logic-box { border-left: 4px solid #38bdf8; }
.edu-desc-txt { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 0; margin-bottom: 25px; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 14px; color: #0f172a; }
.step-blue { background: #38bdf8; }
.step-yellow { background: #fbbf24; }
.step-red { background: #ef4444; color: #fff; }
.step-heading { font-size: 16px; display: block; margin-bottom: 5px; }
.blue-text { color: #38bdf8; }
.yellow-text { color: #fbbf24; }
.red-text { color: #ef4444; }
.step-info { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
.code-red { color: #fca5a5; background: #000; padding: 2px 4px; border-radius: 4px; font-family: monospace;}
.code-green { color: #10b981; background: #000; padding: 2px 4px; border-radius: 4px; font-family: monospace;}
.solution-box { background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); margin-top: 35px; border-left: 5px solid #10b981; }
.solution-title-text { color: #10b981; font-size: 16px; display: block; margin-bottom: 10px; }
.solution-info { margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5e1; }

/* Butonlar & Utils */
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; }
.action-footer.space-between { justify-content: space-between; }
.btn-primary { background: #0284c7; color: #fff; padding: 12px 28px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; transition: 0.3s;}
.btn-primary:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(2, 132, 199, 0.4); }
.btn-secondary { background: #334155; color: #fff; padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer; transition: 0.3s;}
.btn-secondary:hover { background: #475569; }
.btn-success { background: #059669; color: #fff; padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer; transition: 0.3s; width: auto;}
.btn-success:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(5, 150, 105, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; padding: 12px 28px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; transition: 0.3s;}
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(0, 229, 255, 0.2); border-top-color: #00e5ff; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
.fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
</style>