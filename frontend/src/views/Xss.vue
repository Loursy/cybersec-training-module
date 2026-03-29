<template>
  <div class="module-wrapper">
    <div class="container">
      <button class="lang-btn" @click="toggleLanguage">
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>

      <div v-if="isLoading" style="text-align: center; padding: 50px 0;">
        <span class="spinner"></span>
        <p style="color: #00e5ff; margin-top: 20px;">{{ currentLang === 'tr' ? 'Veriler Çekiliyor...' : 'Fetching Data...' }}</p>
      </div>

      <div v-else>
        <h1 id="mod-title">{{ currentText.modTitle }}</h1>
        <hr style="border-color: #1e293b; margin-bottom: 30px" />

        <div v-if="currentStep === 1" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">{{ currentLang === 'tr' ? '🔍 İnceleme Modu: Ön-Test Analizi' : '🔍 Review Mode: Pre-Test Analysis' }}</h2>
          <h2 v-else>{{ currentText.preTitle }}</h2>

          <div class="question">
            <p><b v-html="currentText.qPre1"></b></p>
            <div class="options">
              <label :class="getLabelClass('pre', 'q1', 'a')"><input type="radio" v-model="answers.preQ1" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPre1_1 }}</span></label>
              <label :class="getLabelClass('pre', 'q1', 'b')"><input type="radio" v-model="answers.preQ1" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPre1_2 }}</span></label>
              <label :class="getLabelClass('pre', 'q1', 'c')"><input type="radio" v-model="answers.preQ1" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPre1_3 }}</span></label>
            </div>
          </div>

          <div class="question">
            <p><b v-html="currentText.qPre2"></b></p>
            <div class="options">
              <label :class="getLabelClass('pre', 'q2', 'a')"><input type="radio" v-model="answers.preQ2" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPre2_1 }}</span></label>
              <label :class="getLabelClass('pre', 'q2', 'b')"><input type="radio" v-model="answers.preQ2" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPre2_2 }}</span></label>
              <label :class="getLabelClass('pre', 'q2', 'c')"><input type="radio" v-model="answers.preQ2" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPre2_3 }}</span></label>
            </div>
          </div>

          <div class="question">
            <p><b v-html="currentText.qPre3"></b></p>
            <div class="options">
              <label :class="getLabelClass('pre', 'q3', 'a')"><input type="radio" v-model="answers.preQ3" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPre3_1 }}</span></label>
              <label :class="getLabelClass('pre', 'q3', 'b')"><input type="radio" v-model="answers.preQ3" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPre3_2 }}</span></label>
              <label :class="getLabelClass('pre', 'q3', 'c')"><input type="radio" v-model="answers.preQ3" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPre3_3 }}</span></label>
            </div>
          </div>

          <button class="action-btn" @click="finishPreTest" style="float: right; width: auto;">
            {{ isReviewMode ? (currentLang === 'tr' ? 'Sonraki Aşama (Simülasyon)' : 'Next Step (Simulation)') : currentText.btnPre }}
          </button>
          <div style="clear: both;"></div>
        </div>

        <div v-else-if="currentStep === 2" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">{{ currentLang === 'tr' ? '🔍 İnceleme Modu: Simülasyon' : '🔍 Review Mode: Simulation' }}</h2>
          <h2 v-else style="margin-bottom: 5px">{{ currentText.simTitle }}</h2>
          
          <div class="mission-layout">
            <div class="guide-panel">
              <h3 style="margin-top: 0; color: #f8fafc">{{ currentText.gTitle }}</h3>
              <p style="font-size: 13.5px; margin-bottom: 20px; color: #cbd5e1" v-html="currentText.gDesc"></p>

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
              
              <div class="browser-window" v-if="activeWindow === 'browser'">
                <div class="browser-header">
                  <div class="browser-dots">
                    <div class="dot dot-r"></div>
                    <div class="dot dot-y"></div>
                    <div class="dot dot-g"></div>
                  </div>
                  <div class="browser-url">{{ simulatedUrl }}</div>
                </div>
                <div class="browser-body">
                  <h2 style="color: #0284c7; margin-top:0; text-align:center;">{{ currentText.searchLogo }}</h2>
                  <div class="search-bar">
                    <input type="text" v-model="searchInput" :placeholder="currentText.inputSearch" @keyup.enter="executeSearch" autocomplete="off" />
                    <button @click="executeSearch" v-if="currentMission <= 2">{{ currentText.btnSearch }}</button>
                    <button @click="executeSearch" v-if="currentMission === 3" style="background: #8b5cf6;">{{ currentText.btnPhish }}</button>
                  </div>
                  
                  <div v-if="simWarning" class="warning-msg">{{ simWarning }}</div>
                  
                  <div class="result-area" v-if="searchResultHtml">
                    <div v-html="searchResultHtml"></div>
                  </div>
                  <div class="result-area" v-else>
                    <span style="color: #94a3b8; font-style: italic">{{ currentText.resWait }}</span>
                  </div>
                </div>
              </div>

              <div class="mail-window" v-if="activeWindow === 'mail'">
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

              <div class="exploit-window" v-if="activeWindow === 'hacker'">
                <div class="hacker-terminal">
                  <div class="term-header">
                    <span>{{ currentText.termHeader }}</span>
                    <span style="color: #22c55e">● PORT: 4444 AÇIK</span>
                  </div>
                  <div class="term-body">
                    <div v-html="terminalLogs"></div>
                  </div>
                </div>

                <div class="devtools-window" v-if="showDevTools">
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

              <div class="admin-panel" v-if="activeWindow === 'admin'">
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

              <div style="display: flex; justify-content: flex-end;">
                <button v-if="activeWindow === 'admin' || isReviewMode" class="action-btn" style="background: #10b981; margin-top: 15px; width:auto;" @click="currentStep = 3">
                  {{ currentText.btnToTrn }}
                </button>
              </div>

            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">{{ currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material' }}</h2>
          <h2 v-else>{{ currentText.trnTitle }}</h2>
          
          <div class="edu-card">
            <p style="font-size: 15.5px; line-height: 1.6; color: #cbd5e1">{{ currentText.trnDesc }}</p>

            <div class="flow-step">
              <div class="flow-num" style="background: #00e5ff; color: #0b1120">1</div>
              <div>
                <b style="color: #00e5ff; font-size: 16px">{{ currentText.trnH1 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;" v-html="currentText.trnP1"></p>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num" style="background: #f59e0b; color: #0b1120">2</div>
              <div>
                <b style="color: #f59e0b; font-size: 16px">{{ currentText.trnH2 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;" v-html="currentText.trnP2"></p>
              </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-top: 35px;">
              <b style="color: #10b981; font-size: 16px; display: block; margin-bottom: 10px;">{{ currentText.trnH3 }}</b>
              <p style="margin: 0; font-size: 14.5px; line-height: 1.7; color: #cbd5e1;" v-html="currentText.trnP3"></p>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 25px;">
            <button class="action-btn" style="width:auto;" @click="currentStep = 4">{{ currentText.btnToPost }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">{{ currentLang === 'tr' ? '🔍 İnceleme Modu: Son-Test Analizi' : '🔍 Review Mode: Post-Test Analysis' }}</h2>
          <h2 v-else>{{ currentText.postTitle }}</h2>

          <div class="question">
            <p><b v-html="currentText.qPost1"></b></p>
            <div class="options">
              <label :class="getLabelClass('post', 'q1', 'a')"><input type="radio" v-model="answers.postQ1" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPost1_1 }}</span></label>
              <label :class="getLabelClass('post', 'q1', 'b')"><input type="radio" v-model="answers.postQ1" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPost1_2 }}</span></label>
              <label :class="getLabelClass('post', 'q1', 'c')"><input type="radio" v-model="answers.postQ1" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPost1_3 }}</span></label>
            </div>
          </div>

          <div class="question">
            <p><b v-html="currentText.qPost2"></b></p>
            <div class="options">
              <label :class="getLabelClass('post', 'q2', 'a')"><input type="radio" v-model="answers.postQ2" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPost2_1 }}</span></label>
              <label :class="getLabelClass('post', 'q2', 'b')"><input type="radio" v-model="answers.postQ2" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPost2_2 }}</span></label>
              <label :class="getLabelClass('post', 'q2', 'c')"><input type="radio" v-model="answers.postQ2" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPost2_3 }}</span></label>
            </div>
          </div>

          <div class="question">
            <p><b v-html="currentText.qPost3"></b></p>
            <div class="options">
              <label :class="getLabelClass('post', 'q3', 'a')"><input type="radio" v-model="answers.postQ3" value="a" :disabled="isReviewMode" /> <span>{{ currentText.optPost3_1 }}</span></label>
              <label :class="getLabelClass('post', 'q3', 'b')"><input type="radio" v-model="answers.postQ3" value="b" :disabled="isReviewMode" /> <span>{{ currentText.optPost3_2 }}</span></label>
              <label :class="getLabelClass('post', 'q3', 'c')"><input type="radio" v-model="answers.postQ3" value="c" :disabled="isReviewMode" /> <span>{{ currentText.optPost3_3 }}</span></label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 25px;">
            <button class="action-btn" @click="finishPostTest" :disabled="isSaving" style="background: #10b981; width:auto;">
              <span v-if="isSaving" class="spinner" style="display:inline-block; vertical-align:middle; margin-right:8px; width: 16px; height: 16px; border-width: 2px;"></span>
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

// Simülasyon Değişkenleri
const currentMission = ref(1);
const activeWindow = ref('browser'); // browser, mail, hacker, admin
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

    // YENİ ADMIN PANEL ÇEVİRİLERİ
    adminTitle: "🔴 ROOT YETKİSİ: SİSTEM ELE GEÇİRİLDİ",
    adminDesc: "Hedef sisteme başarıyla sızıldı. Yönetici (Admin) ayrıcalıklarıyla giriş yapıldı.",
    adminData1: "Müşteri Kredi Kartları [ŞİFRESİZ]",
    adminData2: "Kritik Sunucu Şifreleri [AÇIK]",

    btnToTrn: "GÖREVLER BAŞARILI - ANALİZE GEÇ",
    trnTitle: "Adım 3: Teknik Analiz - Sistem Nasıl Çöktü?",
    trnDesc: "Arama çubuğuna yazdığın basit bir metin, nasıl oldu da bir kod parçası gibi çalıştırılıp sistemi ele geçirdi? İşte Front-end geliştiricisinin yaptığı ölümcül hatalar:",
    trnH1: "Ölümcül Hata: innerHTML Kullanımı",
    trnP1: "Geliştirici, URL'deki arama terimini alıp web sayfasına yazdırırken tehlikeli olan <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>innerHTML</code> fonksiyonunu kullandı. Bu fonksiyon, gelen metnin içindeki her şeyi saf HTML komutu olarak kabul eder.",
    trnH2: "Oltalama ve Tarayıcının Kandırılması",
    trnP2: "Admin senin gönderdiğin (kendi şirketinin) zararlı linkine tıkladığında, tarayıcısı sayfayı açarken URL'deki <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>&lt;img src=\"x\" onerror=\"...\"&gt;</code> kodunu da DOM'a bastı. Tarayıcı bunu gerçek resim sandı. Bulamayınca <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>onerror</code> olayını tetikledi ve kodu çalıştırıp çerezi senin sunucuna fırlattı.",
    trnH3: "🛡️ Kesin Çözüm: Output Encoding ve HttpOnly Çerezler",
    trnP3: "XSS'i önlemenin tek yolu, kullanıcıdan alınan metinleri ekrana basmadan önce <b>Kodlamaktır (Output Encoding)</b>. Yani <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>&lt;</code> işaretini <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>&amp;lt;</code> formatına çevirmektir. Modern JS'de <code style='color:#ef4444; background:#000; padding:2px 4px; border-radius:4px;'>innerHTML</code> yerine <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>textContent</code> kullanılmalıdır.<br><br>Ayrıca oturum çerezleri oluşturulurken mutlaka <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>HttpOnly</code> bayrağı eklenmelidir. Bu bayrak, çerezlerin JavaScript tarafından okunmasını tamamen engeller!",
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

    // YENİ ADMIN PANEL ÇEVİRİLERİ (EN)
    adminTitle: "🔴 ROOT ACCESS: SYSTEM BREACHED",
    adminDesc: "Successfully infiltrated target system. Logged in with Administrator privileges.",
    adminData1: "Customer Credit Cards [UNENCRYPTED]",
    adminData2: "Critical Server Passwords [EXPOSED]",

    btnToTrn: "MISSIONS SUCCESSFUL - GO TO ANALYSIS",
    trnTitle: "Step 3: Technical Analysis - How the System Crashed?",
    trnDesc: "How did a simple text typed into a search bar act like a piece of code and hijack the system? Here are the fatal flaws:",
    trnH1: "Fatal Flaw: Using innerHTML",
    trnP1: "When rendering the search term from the URL to the web page, the developer used the dangerous <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>innerHTML</code> function. This function interprets everything inside the incoming text as raw HTML commands.",
    trnH2: "Phishing and Fooling the Browser",
    trnP2: "When the Admin clicked your malicious link, their browser embedded the <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>&lt;img src=\"x\" onerror=\"...\"&gt;</code> code into the DOM. The browser saw this as a real image. Since it couldn't find image 'x', it triggered the <code style='color:#fca5a5; background:#000; padding:2px 4px; border-radius:4px;'>onerror</code> event, executed the code, and hurled the cookie to your server.",
    trnH3: "🛡️ Ultimate Solution: Output Encoding and HttpOnly",
    trnP3: "The only way to prevent XSS is to <b>Encode</b> user inputs before rendering them. In modern JS, <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>textContent</code> should be used instead of <code style='color:#ef4444; background:#000; padding:2px 4px; border-radius:4px;'>innerHTML</code>.<br><br>Furthermore, when creating session cookies, the <code style='color:#10b981; background:#000; padding:2px 4px; border-radius:4px;'>HttpOnly</code> flag must be added. This flag completely blocks JavaScript from reading the cookies!",
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
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`http://localhost:3000/api/get-user-stats/${userEmail}`);
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
      searchResultHtml.value = `<span style="color:#94a3b8;">${currentLang.value==='tr'?'Sonuç bulunamadı:':'No results for:'}</span> <br> ${val}`;
      currentMission.value = 2;
    } else {
      simWarning.value = currentText.value.warningWord;
    }
  } 
  else if (currentMission.value === 2) {
    if (lowerVal.includes("<h1>") && lowerVal.includes("</h1>")) {
      searchResultHtml.value = `<span style="color:#94a3b8;">${currentLang.value==='tr'?'Sonuç bulunamadı:':'No results for:'}</span> <br> <h1 style="color:#ef4444; font-size:40px; margin:10px 0; border-bottom:2px solid #ef4444;">Test</h1>`;
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
  
  const userEmail = localStorage.getItem("userEmail");
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
    await fetch(`/api/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
.correct-answer { background: rgba(16, 185, 129, 0.15) !important; border-color: #10b981 !important; color: #10b981 !important; }
.wrong-answer { background: rgba(239, 68, 68, 0.15) !important; border-color: #ef4444 !important; color: #ef4444 !important; }

.module-wrapper { background-color: #0b1120; color: #94a3b8; min-height: 100vh; padding: 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center;}
.container { width: 100%; max-width: 1150px; background: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border-top: 3px solid #00e5ff; position: relative;}
h1, h2, h3 { color: #f8fafc; }
.lang-btn { position: absolute; top: 20px; right: 20px; background: transparent; color: #00e5ff; border: 1px solid #00e5ff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.lang-btn:hover { background: rgba(0, 229, 255, 0.15); box-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
.step { animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.question { background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0284c7; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #e2e8f0; padding: 10px; border-radius: 6px; transition: 0.3s; line-height: 1.5; border: 1px solid transparent;}
.options label:hover:not(.correct-answer):not(.wrong-answer) { background: #334155; }
.options label input:disabled { cursor: not-allowed; }

button.action-btn { background: linear-gradient(135deg, #0284c7, #2563eb); color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; transition: 0.3s; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
button.action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
button.action-btn:disabled { opacity: 0.7; cursor: wait; }

/* GÖREV REHBERİ (SOL PANEL) */
.mission-layout { display: grid; grid-template-columns: 400px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-step { padding: 15px; border-radius: 6px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; }
.guide-step.current { opacity: 1; background: rgba(0, 229, 255, 0.05); border: 1px solid #00e5ff; box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #00e5ff; margin-bottom: 8px; font-size: 15px; }
.guide-step p { margin: 0; font-size: 13.5px; line-height: 1.6; }
code.highlight { background: #000; color: #f59e0b; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }

/* UYGULAMA EKRANLARI (SAĞ PANEL) */
.app-container { display: flex; flex-direction: column; gap: 15px; position: relative; }

/* 1. BROWSER */
.browser-window { background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden; display: flex; flex-direction: column; color: #334155; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); animation: fadeIn 0.5s; }
.browser-header { background: #e2e8f0; padding: 10px 15px; border-bottom: 1px solid #cbd5e1; display: flex; align-items: center; gap: 15px; }
.browser-dots { display: flex; gap: 6px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot-r { background: #ef4444; } .dot-y { background: #f59e0b; } .dot-g { background: #10b981; }
.browser-url { background: #ffffff; padding: 6px 15px; border-radius: 20px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 13px; flex-grow: 1; color: #64748b; }
.browser-body { padding: 30px; min-height: 250px; }

.search-bar { display: flex; gap: 10px; margin-bottom: 15px; }
.search-bar input { flex-grow: 1; padding: 12px; border-radius: 6px; border: 1px solid #94a3b8; outline: none; font-size: 14px; font-family: monospace; }
.search-bar button { padding: 12px 20px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; }

.result-area { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; min-height: 60px; font-size: 14px; overflow: hidden; color: #334155; margin-top: 15px; }
.warning-msg { color: #ef4444; font-size: 13px; font-style: italic; margin-top: 10px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-left: 3px solid #ef4444; }

/* 2. MAIL */
.mail-window { background: #f8fafc; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden; display: flex; flex-direction: column; color: #1e293b; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); animation: fadeIn 0.5s; }
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
.hacker-terminal { background: #050505; border-radius: 8px; border: 1px solid #334155; overflow: hidden; height: 160px; display: flex; flex-direction: column; }
.term-header { background: #1e293b; padding: 8px 15px; font-size: 12px; color: #f59e0b; font-weight: bold; border-bottom: 1px solid #000; display: flex; justify-content: space-between; }
.term-body { padding: 15px; flex-grow: 1; overflow-y: auto; color: #22c55e; font-family: "Consolas", monospace; font-size: 13px; line-height: 1.5; }

.devtools-window { background: #1e293b; border-radius: 8px; border: 1px solid #475569; overflow: hidden; animation: fadeIn 0.5s; }
.dev-header { background: #0f172a; padding: 10px 15px; color: #cbd5e1; font-size: 13px; font-family: monospace; border-bottom: 1px solid #334155; display: flex; gap: 15px; }
.dev-tab { color: #94a3b8; cursor: pointer; }
.dev-tab.active { color: #00e5ff; border-bottom: 2px solid #00e5ff; }
.dev-body { padding: 20px; }
.dev-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-family: monospace; font-size: 13px; }
.dev-table th, .dev-table td { padding: 10px; text-align: left; border-bottom: 1px solid #334155; color: #cbd5e1; }
.dev-table th { color: #94a3b8; font-weight: normal; }
.dev-input { width: 100%; background: transparent; border: 1px solid #00e5ff; color: #00e5ff; padding: 8px; outline: none; font-family: monospace; border-radius:4px;}

/* YENİ: HAVALI HACK BUTONU */
.btn-inject { background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; padding: 12px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; font-size:15px; display:flex; align-items:center; justify-content:center; gap:10px; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(16,185,129,0.3);}
.btn-inject:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(16,185,129,0.6); }

/* YENİ: ADMIN PANEL (BAŞARI HİSSİYATI) */
.admin-panel { background: #050505; padding: 30px; border-radius: 8px; color: white; border: 2px solid #ef4444; animation: fadeIn 1s; box-shadow: 0 0 30px rgba(239, 68, 68, 0.2); }
.admin-panel-header { display:flex; align-items:center; border-bottom: 1px dashed #ef4444; padding-bottom:15px; margin-bottom:20px; font-size: 22px; font-weight:bold; color: #ef4444; text-transform: uppercase; letter-spacing: 2px;}
.blinking-dot { display:inline-block; width:14px; height:14px; background:#ef4444; border-radius:50%; margin-right:12px; animation: blink 1s infinite; }
@keyframes blink { 0% {opacity:1;} 50% {opacity:0;} 100% {opacity:1;} }
.admin-desc { font-size: 15px; color: #fca5a5; margin-bottom:25px; line-height:1.6; }
.admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap:20px; }
.admin-card { background: #111827; border: 1px solid #374151; padding: 20px; border-radius: 6px; }
.admin-card h4 { margin: 0 0 15px 0; color: #f8fafc; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom:10px; }
.admin-card code { display: block; background: #000; color: #10b981; padding: 8px; margin-bottom: 8px; border-radius: 4px; font-size: 13px; border-left: 3px solid #10b981; }
.hacker-watermark { text-align: center; margin-top: 30px; font-family: monospace; color: #374151; letter-spacing: 5px; font-weight: bold; font-size: 16px; }

/* Eğitim Adımı */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border-left: 6px solid #00e5ff; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 16px; }
.code-block { background: #000; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; margin: 10px 0; border: 1px solid #334155; font-size: 13.5px; }

.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 229, 255, 0.1); border-radius: 50%; border-top-color: #00e5ff; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>