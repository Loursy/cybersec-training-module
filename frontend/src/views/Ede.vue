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
            </div>

            <div class="app-container">
              <div class="app-box" :class="{ 'hacked-box': isExploitSuccess }">
                
                <div class="app-header" v-if="!isExploitSuccess">
                  <button class="tab-btn" :class="{ 'active': currentTab === 'web' }" @click="switchTab('web')">
                    {{ currentText.tabWeb }}
                  </button>
                  <button class="tab-btn" :class="{ 'active': currentTab === 'net' }" @click="switchTab('net')">
                    {{ currentText.tabNet }}
                  </button>
                </div>
                <div class="app-header hacked-header" v-else>
                  <span class="blinking-dot"></span> {{ currentText.hackedHeader }}
                </div>
                
                <div class="app-body" :class="{ 'light-mode': currentTab === 'web' && !isExploitSuccess, 'hacked-mode': isExploitSuccess }">
                  
                  <div v-if="isExploitSuccess" class="admin-dashboard">
                    <h2 class="glitch-text">{{ currentText.adminWelcome }}</h2>
                    <p class="admin-desc">{{ currentText.adminWarning }}</p>

                    <div class="admin-grid">
                      <div class="admin-card">
                        <h4>🗄️ {{ currentText.adminDb }}</h4>
                        <code>DB_PASS: R00t!_S3cr3t_99</code>
                        <code>API_KEY: ak_live_77298jf82</code>
                        <code>BACKUP_IP: 192.168.1.104</code>
                      </div>
                      <div class="admin-card">
                        <h4>💰 {{ currentText.adminFinance }}</h4>
                        <code>CEO Maaş: $250,000</code>
                        <code>Gizli Fon: $1.2M</code>
                        <code>M&A Planı: "Project Titan"</code>
                      </div>
                    </div>
                    
                    <div class="hacker-watermark">
                      ACCESS GRANTED // SYSTEM COMPROMISED
                    </div>
                  </div>

                  <div v-else-if="currentTab === 'web'" class="corporate-portal">
                    <div class="portal-header">
                      <span class="logo">{{ currentText.corpLogo }}</span>
                      <span class="user-badge">{{ currentText.corpUser }}</span>
                    </div>
                    
                    <div class="portal-content">
                      <h3 style="margin-top:0; color:#1e293b;">{{ currentText.corpTitle }}</h3>
                      <p style="font-size: 13px; color:#64748b; margin-bottom:15px;">{{ currentText.corpDesc }}</p>
                      
                      <div class="search-bar-modern">
                        <input type="text" v-model="searchInput" :placeholder="currentText.inputSearch" @keyup.enter="searchUser" autocomplete="off" />
                        <button @click="searchUser">{{ currentText.corpBtn }}</button>
                      </div>
                      
                      <div v-if="simError" style="color: #ef4444; font-size: 14px; margin-top:10px;">{{ simError }}</div>

                      <div v-if="simUser" class="id-card">
                        <div class="id-header">{{ currentText.corpCardHeader }}</div>
                        <div class="id-body">
                          <div class="id-avatar">👤</div>
                          <div class="id-info">
                            <h2>{{ simUser.full_name }}</h2>
                            <p><strong>{{ currentText.corpDept }}</strong> <span class="tag">{{ currentText.simRoleTranslated }}</span></p>
                            <p><strong>{{ currentText.corpStatus }}</strong> <span style="color:#10b981; font-weight:bold;">{{ currentText.corpActive }}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="currentTab === 'net'" class="network-monitor">
                    <div v-if="simNetworkData">
                      <div class="net-request">GET /api/vuln/ede/search?username={{ searchInput }}</div>
                      <div class="net-status">HTTP/1.1 200 OK</div>
                      <div class="net-response" v-html="highlightedJson"></div>
                    </div>
                    <div v-else style="color:#64748b;">
                      {{ currentText.netWaiting }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="currentMission >= 3 && !isExploitSuccess" class="exploit-area">
                <b style="color: #ef4444">🏴‍☠️ {{ currentText.expTitle }}</b>
                <p style="margin: 5px 0; font-size: 13px; color: #fca5a5">{{ currentText.expDesc }}</p>
                <input type="text" v-model="exploitTokenInput" :placeholder="currentText.inputToken" autocomplete="off" />
                <button class="action-btn" style="margin-top: 10px; background: #ef4444" @click="verifyExploit">
                  {{ currentText.btnExp }}
                </button>
              </div>

              <button v-if="isExploitSuccess || isReviewMode" class="action-btn" style="background: #10b981; margin-top: 15px;" @click="currentStep = 3">
                {{ currentText.btnToTrn }}
              </button>
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
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;">{{ currentText.trnP1 }}</p>
                <div class="code-block">res.json( user_data ); <span style="color:#6b7280;">// {{ currentLang === 'tr' ? 'İçinde şifre, ev adresi, her şey var!' : 'Contains password, home address, everything!' }}</span></div>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num" style="background: #f59e0b; color: #0b1120">2</div>
              <div>
                <b style="color: #f59e0b; font-size: 16px">{{ currentText.trnH2 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;">{{ currentText.trnP2 }}</p>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num" style="background: #ef4444; color: #fff">3</div>
              <div>
                <b style="color: #ef4444; font-size: 16px">{{ currentText.trnH3 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;">{{ currentText.trnP3 }}</p>
              </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-top: 35px;">
              <b style="color: #10b981; font-size: 16px; display: block; margin-bottom: 10px;">{{ currentText.trnH4 }}</b>
              <p style="margin: 0; font-size: 14.5px; line-height: 1.7; color: #cbd5e1;" v-html="currentText.trnP4"></p>
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
const currentTab = ref('web');
const searchInput = ref('');
const simUser = ref(null);
const simNetworkData = ref(null);
const simError = ref('');
const exploitTokenInput = ref('');
const isExploitSuccess = ref(false);

const targetToken = "X7F9-ADMIN-SECURE-KEY";

const answerKeys = {
  pre: { q1: "b", q2: "b", q3: "a" },
  post: { q1: "b", q2: "b", q3: "b" },
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 3: Excessive Data Exposure",
    preTitle: "Ön-Test",
    qPre1: "1. Excessive Data Exposure zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPre1_1: "A) İstemci tarafında çalışan zararlı betiklerin sunucu bellek alanını taşırarak sistemi durdurması.",
    optPre1_2: "B) API'nin, istemcinin ihtiyacı olandan çok daha fazla ve hassas veriyi ağ üzerinden tarayıcıya göndermesi.",
    optPre1_3: "C) Web uygulamasının dosya dizin yollarının manipüle edilerek yetkisiz sistem konfigürasyonlarının okunması.",
    qPre2: "2. Bu zafiyetin tespit edilmesi geleneksel arayüz (UI) testlerinde neden zordur?",
    optPre2_1: "A) Çünkü sızdırılan veriler veritabanında her zaman 256-bit askeri düzey şifreleme ile korunmaktadır.",
    optPre2_2: "B) Çünkü sızdırılan veriler web arayüzünde görünmez, yalnızca arka plandaki API ağ trafiğinde bulunur.",
    optPre2_3: "C) Çünkü sunucu yalnızca yetkilendirilmiş hesaplara veri gönderimi yaparak sıradan kullanıcıları reddeder.",
    qPre3: "3. Ön yüz (Frontend) geliştiricilerinin hassas verileri CSS ile gizlemesi neden güvenli DEĞİLDİR?",
    optPre3_1: "A) Çünkü veri sunucudan tarayıcıya çoktan ulaşmıştır ve ağ izleme araçlarıyla kolayca okunabilir.",
    optPre3_2: "B) Çünkü CSS kodları sayfanın yüklenme hızını yavaşlatır ve arama motorları tarafından engellenir.",
    optPre3_3: "C) Çünkü bu yöntem sadece SQL tabanlı veritabanlarında çalışır.",
    btnPre: "Simülasyona Başla",

    simTitle: "Adım 2: Simülasyon",
    gTitle: "📋 Şirket Görev Dosyası",
    gDesc: "Şirketin <b>'Çalışan Arama Portalı'</b> yayına alındı. Yazılımcı, \"Ekranda sadece isim ve departman görünüyor, sistem çok güvenli\" diyor. <br><br>Siber Güvenlik Analisti olarak görevin: <b>Sistem yöneticisinin (admin)</b> hesabına ait gizli kurtarma şifresini bulmak.",
    gs1T: "1. Keşif: Arayüzü Test Et",
    gs1D: "Önce sistemi normal bir kullanıcı gibi kullan. Arama kutusuna <code class='highlight'>admin</code> yazıp arat. Ekrana gelen masum çalışan kartını incele.",
    gs2T: "2. Sızma: Trafiği Dinle",
    gs2D: "Şimdi hacker şapkanı tak! Yukarıdaki sekmelerden <b>\"Ağ Dinleyicisi\"</b> paneline geç. API'nin tarayıcıya gönderdiği ham veri paketini (JSON) oku. Yazılımcının neleri açık unuttuğunu bul!",
    gs3T: "3. Veri İfşası: Sömürü",
    gs3D: "Ağ trafiğinde bulduğun <b>recovery_token (Kurtarma Şifresi)</b> değerini kopyala. Aşağıda açılan kırmızı sömürü kutusuna bu şifreyi girerek yönetici hesabını ele geçir!",

    tabWeb: "🌐 Web Arayüzü",
    tabNet: "📡 Ağ Dinleyicisi (JSON)",
    btnSearch: "Ara",
    inputSearch: "Kimi arıyorsunuz? (örn: admin)",
    expTitle: "Yönetici Hesabına Sız",
    expDesc: "Ağ trafiğinde bulduğun 'recovery_token' değerini buraya yapıştır:",
    inputToken: "Gizli Token'ı Yapıştır...",
    btnExp: "Hesabı Ele Geçir",
    wrongToken: "Hatalı Token! Lütfen JSON ağ trafiğini daha dikkatli inceleyin.",
    btnToTrn: "TÜM GÖREVLER BAŞARILI - EĞİTİME GEÇ",

    // YENİ: ADMIN PANEL ÇEVİRİLERİ (TR)
    hackedHeader: "🔴 ROOT YETKİSİ ONAYLANDI",
    adminWelcome: "Sistem Yöneticisi Paneli",
    adminWarning: "Tebrikler! Kurtarma token'ı ile en üst düzey (Root) yetkileri elde ettiniz. Artık şirketin en gizli verilerine erişiminiz var.",
    adminDb: "Kritik Sunucu Şifreleri",
    adminFinance: "Gizli Finansal Veriler",

    trnTitle: "Adım 3: Eğitim ve Teknik Analiz",
    trnDesc: "Arayüzde sadece İsim ve Departman görünmesine rağmen, API arka planda kullanıcının maaşını, ev adresini ve hatta şifresini gönderiyordu. İşte arka planda yaşananlar:",
    trnH1: "Tembel Geliştirici (Backend)",
    trnP1: "Yazılımcı veritabanındaki tüm kolonları `SELECT * FROM users` mantığıyla çekip filtrelemeden Frontend'e yolladı:",
    trnH2: "Yanılsama (Frontend)",
    trnP2: "Arayüz (Vue/React) yalnızca gelen verinin içinden `isim` ve `departman` alanlarını seçip ekrana bastı. Kalan veriler ekranda görünmese de tarayıcının belleğinde (Network trafiğinde) saklanıyordu.",
    trnH3: "Kaçınılmaz Son (Sızıntı)",
    trnP3: "Saldırganlar ekrana bakmaz, tarayıcının ağ (Network) sekmesine bakarlar. Araya giren bir saldırgan gönderilen tüm ham JSON paketini okudu ve gizli verileri çaldı.",
    trnH4: "🛡️ Kesin Çözüm: DTO (Data Transfer Object) Kullanımı",
    trnP4: "Güvenlik Frontend'e bırakılamaz. Backend, veritabanından çektiği veriyi <b>olduğu gibi göndermemelidir.</b> Sadece arayüzün ihtiyaç duyduğu verileri içeren yeni, temiz bir obje (DTO) oluşturmalı ve ağ üzerinden yalnızca bunu iletmelidir.",
    btnToPost: "Tüm Detayları Anladım -> Son Teste Geç",

    postTitle: "Son-Test",
    qPost1: "1. Excessive Data Exposure zafiyetine karşı API'leri korumak için kullanılması gereken en etkili mimari desen hangisidir?",
    optPost1_1: "A) Gelen istekleri sınırlandıran Rate Limiting (Hız Sınırlandırma) mekanizması kullanmak.",
    optPost1_2: "B) İstemciye sadece yetkisi olan ve ihtiyaç duyduğu alanları gönderen DTO (Data Transfer Object) mimarisi kullanmak.",
    optPost1_3: "C) Frontend tarafında kritik değişkenleri CSS dosyasında kalıcı olarak gizlemek.",
    qPost2: "2. Ön yüz (Frontend) kodlamasında hassas verileri ekrana yazdırmamak güvenlik için neden yeterli DEĞİLDİR?",
    optPost2_1: "A) Çünkü JavaScript kapatıldığında tüm veritabanı yapısı ekranda listelenir.",
    optPost2_2: "B) Çünkü veri sunucudan tarayıcıya iletildiğinde, sayfa render edilmese bile ağ trafiği izlenerek çalınabilir.",
    optPost2_3: "C) Çünkü modern tarayıcılar ön yüzdeki gizli verileri otomatik olarak arama motorlarına kaydeder.",
    qPost3: "3. Aşırı Veri İfşası zafiyetinin temel nedeni aşağıdakilerden hangisidir?",
    optPost3_1: "A) Sunucuya gönderilen aşırı yüklü paketlerin veritabanında bellek taşmasına yol açması.",
    optPost3_2: "B) API'nin, istemcinin ihtiyacı olandan çok daha fazla ve hassas veriyi ağ üzerinden göndermesi.",
    optPost3_3: "C) Kötü niyetli kişilerin uygulamanın yönetici paneline ait URL yollarını tahmin ederek içeriye sızması.",
    btnPost: "Eğitimi Bitir",

    corpLogo: "🏢 GlobalCorp İnsan Kaynakları",
    corpUser: "👤 Giriş: YBS Uzmanı",
    corpTitle: "Çalışan Rehberi",
    corpDesc: "İletişim kurmak istediğiniz personelin kullanıcı adını giriniz.",
    corpBtn: "🔍 Ara",
    corpCardHeader: "PERSONEL KİMLİK KARTI",
    corpDept: "Departman:",
    corpStatus: "Durum:",
    corpActive: "● Aktif",
    netWaiting: "⏳ Dinleniyor... Ağ trafiği bekleniyor. Lütfen önce Web Arayüzünden bir arama yapın.",
    simRoleTranslated: computed(() => simUser.value ? simUser.value.role : '')
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 3: Excessive Data Exposure",
    preTitle: "Pre-Test",
    qPre1: "1. What is the fundamental mechanism of an Excessive Data Exposure vulnerability?",
    optPre1_1: "A) Overflowing the server's memory space by executing malicious client-side scripts to halt the system.",
    optPre1_2: "B) The API transmitting significantly more sensitive data over the network than the client actually needs.",
    optPre1_3: "C) Manipulating the web application's file directory paths to unauthorizedly read system configurations.",
    qPre2: "2. Why is this vulnerability difficult to detect during traditional UI testing?",
    optPre2_1: "A) Because the leaked data is always protected by 256-bit military-grade encryption in the database.",
    optPre2_2: "B) Because the leaked data does not appear on the web interface, it exists only in the background API network traffic.",
    optPre2_3: "C) Because the server strictly routes data only to authorized accounts, rejecting standard users.",
    qPre3: "3. Why is it NOT secure for Frontend developers to hide sensitive data using CSS?",
    optPre3_1: "A) Because the data has already reached the browser from the server and can be easily read via Developer Tools.",
    optPre3_2: "B) Because CSS codes slow down the page loading speed and are permanently penalized by search engines.",
    optPre3_3: "C) Because this method only works on SQL-based databases.",
    btnPre: "Start Simulation",

    simTitle: "Step 2: Simulation",
    gTitle: "📋 Company Mission File",
    gDesc: "The company's <b>'Employee Search Portal'</b> is live. The developer claims, \"Only name and department are visible, it's very secure.\" <br><br>As a Cybersecurity Analyst, your mission is: <b>Find the secret recovery password belonging to the system administrator (admin).</b>",
    gs1T: "1. Recon: Test the UI",
    gs1D: "First, use the system like a normal user. Type <code class='highlight'>admin</code> into the search box. Inspect the innocent employee card that appears.",
    gs2T: "2. Infiltrate: Sniff the Network",
    gs2D: "Now put on your hacker hat! Switch to the <b>\"Network Sniffer\"</b> tab above. Read the raw data packet (JSON) the API sent to the browser. Find out what the developer exposed!",
    gs3T: "3. Data Leak: Exploit",
    gs3D: "Copy the secret <b>recovery_token</b> you found in the network traffic. Paste it into the red exploit box below to take over the admin account!",

    tabWeb: "🌐 Web Interface",
    tabNet: "📡 Network Sniffer (JSON)",
    btnSearch: "Search",
    inputSearch: "Who are you looking for? (e.g. admin)",
    expTitle: "Breach Admin Account",
    expDesc: "Paste the 'recovery_token' you found in the network traffic here:",
    inputToken: "Paste the Secret Token...",
    btnExp: "Takeover Account",
    wrongToken: "Invalid Token! Please inspect the JSON network traffic more carefully.",
    btnToTrn: "ALL MISSIONS SUCCESSFUL - GO TO TRAINING",

    // YENİ: ADMIN PANEL ÇEVİRİLERİ (EN)
    hackedHeader: "🔴 ROOT ACCESS ESTABLISHED",
    adminWelcome: "System Administrator Panel",
    adminWarning: "Congratulations! You've gained top-level (Root) privileges using the recovery token. You now have access to the company's most classified data.",
    adminDb: "Critical Server Passwords",
    adminFinance: "Classified Financial Data",

    trnTitle: "Step 3: Training & Technical Analysis",
    trnDesc: "Although only Name and Department appeared on the UI, the API was silently transmitting the user's salary, home address, and even password in the background. Here is what happened:",
    trnH1: "The Lazy Developer (Backend)",
    trnP1: "The developer fetched all columns from the database using a `SELECT * FROM users` logic and sent them to the Frontend without filtering:",
    trnH2: "The Illusion (Frontend)",
    trnP2: "The interface (Vue/React) selectively picked only the `name` and `department` fields from the incoming data to display. Even though the rest wasn't on screen, it was stored in the browser's memory (Network traffic).",
    trnH3: "The Inevitable End (Leakage)",
    trnP3: "Attackers don't look at the screen; they look at the browser's Network tab. An intercepting attacker read the raw JSON packet and stole the hidden data.",
    trnH4: "🛡️ Ultimate Solution: Utilizing DTOs (Data Transfer Objects)",
    trnP4: "Security cannot be left to the Frontend. The Backend <b>must not send</b> the data exactly as fetched from the database. It must construct a new, clean object (DTO) containing ONLY the fields the interface explicitly needs, and transmit only that object over the network.",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    qPost1: "1. Which architectural pattern is the most effective defense against Excessive Data Exposure vulnerabilities in APIs?",
    optPost1_1: "A) Implementing a Rate Limiting mechanism to restrict incoming requests.",
    optPost1_2: "B) Utilizing a DTO (Data Transfer Object) architecture to send only the fields the client needs and is authorized to see.",
    optPost1_3: "C) Permanently hiding critical variables on the frontend side by using CSS.",
    qPost2: "2. Why is merely refraining from displaying sensitive data on the screen insufficient for security in Frontend development?",
    optPost2_1: "A) Because when JavaScript is disabled, the entire database structure is listed on the screen.",
    optPost2_2: "B) Because once the data is transmitted from server to browser, it can be stolen by monitoring network traffic, even if not rendered.",
    optPost2_3: "C) Because modern browsers automatically save hidden data from the frontend interface into search engine indices.",
    qPost3: "3. What is the primary cause of the Excessive Data Exposure vulnerability?",
    optPost3_1: "A) Overloaded packets sent to the server causing a Buffer Overflow in the database.",
    optPost3_2: "B) The API transmitting significantly more sensitive data over the network than the client actually needs.",
    optPost3_3: "C) Malicious actors predicting the URL paths of the application's admin panel to infiltrate the system.",
    btnPost: "Finish Training",

    corpLogo: "🏢 GlobalCorp Human Resources",
    corpUser: "👤 Logged in: MIS Specialist",
    corpTitle: "Employee Directory",
    corpDesc: "Enter the username of the personnel you want to contact.",
    corpBtn: "🔍 Search",
    corpCardHeader: "PERSONNEL ID CARD",
    corpDept: "Department:",
    corpStatus: "Status:",
    corpActive: "● Active",
    netWaiting: "⏳ Listening... Waiting for network traffic. Please perform a search from the Web Interface first.",
    simRoleTranslated: computed(() => {
      if(!simUser.value) return '';
      if(simUser.value.role === 'IT Departmanı') return 'IT Department';
      return simUser.value.role;
    })
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
    localStorage.setItem('ede_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`http://localhost:3000/api/get-user-stats/${userEmail}`);
      const result = await response.json();
      if (result.success && result.data && result.data.ede_answers) {
        Object.assign(answers, result.data.ede_answers);
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem('ede_draft_answers');
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }
  isLoading.value = false;
});

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    return alert(currentText.value.warnEmpty);
  }
  currentStep.value = 2; 
};

// --- SIMULATION LOGIC ---

const highlightedJson = computed(() => {
  if (!simNetworkData.value) return '';
  let jsonStr = JSON.stringify(simNetworkData.value, null, 4);
  jsonStr = jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'val-number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'val-key'; 
          } else {
              cls = 'val-string'; 
          }
      } else if (/true|false/.test(match)) {
          cls = 'val-boolean';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
  return jsonStr;
});

const searchUser = async () => {
  const input = searchInput.value.trim().toLowerCase();
  if (!input) return;

  try {
    const response = await fetch("http://localhost:3000/api/vuln/ede/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: input }),
    });
    const data = await response.json();

    simNetworkData.value = data; 

    if (data.success) {
      simError.value = '';
      simUser.value = data.user;
      if (currentMission.value === 1) currentMission.value = 2; 
    } else {
      simError.value = currentLang.value === 'tr' ? 'Kullanıcı bulunamadı.' : 'User not found.';
      simUser.value = null;
    }
  } catch (error) {
    simError.value = "API Connection Error";
  }
};

const switchTab = (tab) => {
  currentTab.value = tab;
  if (currentMission.value === 2 && tab === "net") {
    currentMission.value = 3; 
  }
};

const verifyExploit = () => {
  if (exploitTokenInput.value.trim() === targetToken) {
    isExploitSuccess.value = true;
    if (currentMission.value === 3) currentMission.value = 4; 
  } else {
    alert(currentText.value.wrongToken);
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
    await fetch(`http://localhost:3000/api/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, module: "ede", preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem('ede_draft_answers'); 
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
.container { width: 100%; max-width: 1050px; background: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border-top: 3px solid #00e5ff; position: relative;}
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

/* GÖREV REHBERİ */
.mission-layout { display: grid; grid-template-columns: 420px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-step { padding: 15px; border-radius: 6px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; }
.guide-step.current { opacity: 1; background: rgba(0, 229, 255, 0.05); border: 1px solid #00e5ff; box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #00e5ff; margin-bottom: 8px; font-size: 15px; }
.guide-step p { margin: 0; font-size: 13.5px; line-height: 1.6; }
code.highlight { background: #000; color: #f59e0b; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }

/* UYGULAMA PANELİ */
.app-container { display: flex; flex-direction: column; gap: 15px; }
.app-box { background: #0f172a; border-radius: 8px; border: 1px solid #334155; overflow: hidden; display: flex; flex-direction: column; transition: all 0.5s ease; }
.app-header { background: #1e293b; display: flex; border-bottom: 1px solid #334155; }
.tab-btn { padding: 12px 20px; background: transparent; color: #94a3b8; border: none; cursor: pointer; font-weight: bold; font-size: 13px; flex-grow: 1; border-bottom: 2px solid transparent; transition: 0.3s; }
.tab-btn.active { color: #00e5ff; border-bottom: 2px solid #00e5ff; background: rgba(0, 229, 255, 0.05); }
.app-body { padding: 20px; min-height: 380px; background: #050505; transition: background 0.3s; }
.app-body.light-mode { background: #f8fafc; } 

/* Şirket Portalı (Light Theme) */
.corporate-portal { color: #1e293b; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
.portal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
.logo { font-size: 18px; font-weight: bold; color: #0f172a; }
.user-badge { font-size: 13px; background: #e2e8f0; padding: 5px 10px; border-radius: 20px; font-weight: bold; color: #475569; }
.search-bar-modern { display: flex; gap: 10px; }
.search-bar-modern input { flex-grow: 1; padding: 12px 15px; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; color: #1e293b; outline: none; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.search-bar-modern button { padding: 12px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
.id-card { background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 20px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.id-header { background: #0f172a; color: #fff; padding: 10px; text-align: center; font-size: 12px; font-weight: bold; letter-spacing: 1px; }
.id-body { padding: 20px; display: flex; gap: 20px; align-items: center; }
.id-avatar { width: 70px; height: 70px; background: #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.id-info h2 { margin: 0 0 10px 0; color: #0f172a; font-size: 22px; }
.id-info p { margin: 5px 0; font-size: 14px; color: #475569; }
.tag { background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }

/* Ağ Dinleyicisi */
.network-monitor { font-family: "Consolas", monospace; font-size: 14px; color: #e2e8f0; white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
.net-request { color: #38bdf8; font-weight: bold; margin-bottom: 5px; }
.net-status { color: #10b981; margin-bottom: 15px; border-bottom: 1px dashed #334155; padding-bottom: 10px; }
.net-response { padding: 10px; background: #0b0f19; border-radius: 6px; border: 1px solid #1e293b; }
:deep(.val-key) { color: #7dd3fc; } 
:deep(.val-string) { color: #a3e635; } 
:deep(.val-number) { color: #fbbf24; } 
:deep(.val-boolean) { color: #c084fc; } 

/* Hacker Zula */
.exploit-area { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 15px; }
.exploit-area input { width: 100%; padding: 12px; margin-top: 10px; border-radius: 6px; border: 1px solid #ef4444; background: #050505; color: white; box-sizing: border-box; font-family: monospace; font-size: 14px;}

/* YENİ: HACKED ADMIN DASHBOARD CSS */
.hacked-box { border-color: #ef4444; box-shadow: 0 0 25px rgba(239, 68, 68, 0.3); }
.hacked-header { background: #7f1d1d; border-bottom: none; display: flex; align-items: center; padding: 12px 20px; font-family: monospace; letter-spacing: 2px; }
.blinking-dot { display: inline-block; width: 12px; height: 12px; background-color: #ef4444; border-radius: 50%; margin-right: 10px; animation: blink 1s infinite; }
@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
.hacked-mode { background: #000; padding: 30px; }
.admin-dashboard { color: #f8fafc; }
.glitch-text { color: #ef4444; margin-top: 0; font-size: 28px; text-transform: uppercase; border-bottom: 2px dashed #ef4444; padding-bottom: 10px; }
.admin-desc { font-size: 14px; color: #fca5a5; line-height: 1.6; margin-bottom: 25px; }
.admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.admin-card { background: #111827; border: 1px solid #374151; padding: 20px; border-radius: 8px; }
.admin-card h4 { margin: 0 0 15px 0; color: #f8fafc; font-size: 16px; border-bottom: 1px solid #374151; padding-bottom: 10px;}
.admin-card code { display: block; background: #050505; color: #10b981; padding: 8px; margin-bottom: 8px; border-radius: 4px; font-size: 13px; border-left: 3px solid #10b981; }
.hacker-watermark { text-align: center; margin-top: 30px; font-family: monospace; color: #374151; letter-spacing: 5px; font-weight: bold; font-size: 18px; }

/* Eğitim Adımı */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border-left: 6px solid #00e5ff; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 16px; }
.code-block { background: #000; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; margin: 10px 0; border: 1px solid #334155; font-size: 13.5px; }

.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 229, 255, 0.1); border-radius: 50%; border-top-color: #00e5ff; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>