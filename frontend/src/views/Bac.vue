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

          <div class="mission-brief">
            <div class="brief-top">
              <span class="pulse-icon"></span>
              <b>{{ currentText.gTitle }}</b>
            </div>
            <p class="sim-desc" v-html="currentText.simDesc"></p>
          </div>

          <div class="mock-browser">
            <!-- Top loading progress bar -->
            <div class="browser-progress" :style="{ width: loadProgress + '%', opacity: loadProgress > 0 ? 1 : 0 }"></div>

            <!-- Browser chrome: dots + tab -->
            <div class="browser-chrome">
              <div class="browser-dots">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <div class="browser-tab">
                <span class="tab-icon">🏢</span>
                <span class="tab-label">GlobalCorp Portal</span>
              </div>
            </div>

            <!-- Address bar -->
            <div class="browser-addressbar">
              <div class="addr-pill" @click="addrInput?.focus()">
                <span class="addr-lock-icon">🔒</span>
                <div class="addr-url">
                  <span class="addr-scheme">https://</span><span class="addr-host">intranet.globalcorp.com</span><input
                    ref="addrInput"
                    type="text"
                    class="addr-path-input"
                    v-model="targetPath"
                    @keydown.enter="loadResource"
                    autocomplete="off"
                    spellcheck="false"
                  />
                </div>
              </div>
              <button class="addr-go-btn" @click="loadResource" title="Go">↩</button>
            </div>

            <!-- Page body -->
            <div class="browser-body">
              <div v-if="isSimLoading" class="page-loading">
                <div class="page-spinner"></div>
                <span>{{ currentText.loading }}</span>
              </div>

              <div v-else-if="profileData" class="intranet-page fade-in">
                <div class="intranet-topbar">
                  <span class="intranet-brand">🏢 GlobalCorp İntranet</span>
                  <span class="intranet-breadcrumb">/ {{ currentText.empDir }} / {{ profileData.name }}</span>
                  <span class="intranet-user">{{ currentText.loggedAs }}: <b>Atakan</b></span>
                </div>

                <div class="profile-card">
                  <div class="profile-header">
                    <div class="profile-avatar" :style="{ background: profileData.avatarColor }">{{ profileData.initial }}</div>
                    <div class="profile-meta">
                      <div class="profile-name">{{ profileData.name }}</div>
                      <div class="profile-tags">
                        <span class="role-tag" :style="{ background: profileData.roleBg, color: profileData.roleColor, borderColor: profileData.roleColor }">{{ profileData.displayRole }}</span>
                        <span class="dept-tag">{{ profileData.displayDept }}</span>
                      </div>
                      <span class="profile-empid">{{ profileData.empId }} &nbsp;·&nbsp; <span :style="{ color: profileData.clearanceColor }">{{ profileData.clearance }}</span></span>
                    </div>
                  </div>

                  <div class="profile-divider"></div>

                  <div class="profile-details">
                    <div class="detail-row">
                      <span class="detail-label">📧 {{ currentText.email }}</span>
                      <span class="detail-val">{{ profileData.email }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">📞 {{ currentText.phone }}</span>
                      <span class="detail-val">{{ profileData.phone }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">🗓️ {{ currentText.joinDate }}</span>
                      <span class="detail-val">{{ profileData.joinYear }}</span>
                    </div>
                  </div>

                  <div v-if="profileData.displaySecretMsg" class="profile-docs-section">
                    <div class="docs-section-title">📁 {{ currentText.docsLabel }}</div>
                    <div class="doc-item">
                      <div class="doc-icon">📄</div>
                      <div class="doc-info">
                        <div class="doc-name">{{ currentText.docFileName }}</div>
                        <div class="doc-meta">
                          <span class="doc-clearance-tag" :style="{ color: profileData.clearanceColor, borderColor: profileData.clearanceColor }">{{ profileData.clearance }}</span>
                          <span class="doc-size">TXT · 2 KB</span>
                        </div>
                      </div>
                      <div class="doc-content">{{ profileData.displaySecretMsg }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="adminData" class="admin-page fade-in">
                <div class="intranet-topbar">
                  <span class="intranet-brand">🏢 GlobalCorp İntranet</span>
                  <span class="intranet-breadcrumb">/ {{ currentText.adminPanelLabel }}</span>
                  <span class="intranet-user">{{ currentText.loggedAs }}: <b>Atakan</b></span>
                </div>
                <div class="admin-nav">
                  <span class="admin-nav-item active">{{ currentText.adminNavUsers }}</span>
                  <span class="admin-nav-item">{{ currentText.adminNavLogs }}</span>
                  <span class="admin-nav-item">{{ currentText.adminNavSettings }}</span>
                </div>
                <div class="admin-body">
                  <div class="admin-toolbar">
                    <span class="admin-page-title">{{ currentText.adminUserList }}</span>
                    <span class="admin-count">{{ adminData.totalUsers }} {{ currentText.adminTotalUsers }}</span>
                  </div>
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>{{ currentText.adminColName }}</th>
                        <th>{{ currentText.adminColRole }}</th>
                        <th>{{ currentText.adminColEmail }}</th>
                        <th>{{ currentText.adminColDept }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="u in adminData.users" :key="u.id" :class="{ 'row-self': u.id === 2 }">
                        <td>
                          <div class="admin-user-cell">
                            <div class="admin-avatar">{{ u.name.charAt(0) }}</div>
                            <span>{{ u.name }}</span>
                          </div>
                        </td>
                        <td>{{ u.role }}</td>
                        <td class="admin-email">{{ u.email }}</td>
                        <td>{{ u.department }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="simError" class="sim-404 fade-in">
                <div class="err-num">404</div>
                <div class="err-msg">{{ currentText.notFound }}</div>
                <div class="err-sub">{{ simError }}</div>
              </div>
            </div>
          </div>

          <!-- Discovery log -->
          <div v-if="discoveries.length > 0" class="disc-log fade-in">
            <div class="disc-log-header">
              <span class="disc-log-title">📋 {{ currentText.discTitle }}</span>
              <span class="disc-count">{{ discoveries.filter(d => !d.isOwn).length }} {{ currentText.discBreach }}</span>
            </div>
            <div class="disc-entries">
              <div
                v-for="d in discoveries"
                :key="d.id"
                class="disc-entry"
                :class="d.isOwn ? 'disc-own' : d.isAdmin ? 'disc-admin' : 'disc-breach'"
              >
                <span class="disc-icon">{{ d.isOwn ? '👤' : d.isAdmin ? '🔐' : '🔓' }}</span>
                <span class="disc-info">
                  <b v-if="d.isAdmin">{{ currentText.adminPanelLabel }}</b>
                  <span v-else>ID {{ d.id }} — <b>{{ d.name }}</b> &middot; {{ d.role }} &middot; {{ d.dept }}</span>
                </span>
                <span class="disc-tag" :class="{ 'disc-admin-tag': d.isAdmin }">{{ d.isOwn ? currentText.discOwn : d.isAdmin ? currentText.discAdminTag : currentText.discBreachTag }}</span>
              </div>
            </div>
          </div>

          <div class="action-footer" style="justify-content: center; margin-top: 25px;">
            <button v-if="simulationSuccess || isReviewMode" class="btn-success fade-in" @click="currentStep = 3">
              {{ currentText.btnToTrn }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material') : currentText.s3Title }}
          </h2>

          <div class="info-box logic-box">
            <h3>{{ currentText.trnH1 }}</h3>
            <p v-html="currentText.trnP1"></p>
          </div>
          
          <div class="neon-divider" style="margin: 30px 0; background: linear-gradient(90deg, #1e293b, #334155, #1e293b);"></div>

          <div class="info-box solution-box">
            <h3>{{ currentText.trnH2 }}</h3>
            <p v-html="currentText.trnP2"></p>
          </div>

          <div class="action-footer">
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
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';

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

// BAC Simülasyon Değişkenleri
const addrInput = ref(null);
const targetPath = ref('/employee/profile/2');
const displayedId = ref('2');
const isSimLoading = ref(false);
const profileData = ref(null);
const adminData = ref(null);
const simError = ref('');
const exploitStatus = ref('idle');
const simulationSuccess = ref(false);
const discoveries = ref([]);
const loadProgress = ref(0);

const profileExtras = {
  '1': { empId: 'EMP-0001', clearance: 'ÇOK GİZLİ', clearanceTR: 'ÇOK GİZLİ', clearanceEN: 'TOP SECRET',   clearanceColor: '#ef4444', roleBg: 'rgba(239,68,68,0.12)',   roleColor: '#fca5a5', joinYear: '2018' },
  '2': { empId: 'EMP-0002', clearance: 'STANDART',   clearanceTR: 'STANDART',   clearanceEN: 'STANDARD',     clearanceColor: '#3b82f6', roleBg: 'rgba(59,130,246,0.12)', roleColor: '#93c5fd', joinYear: '2023' },
  '3': { empId: 'EMP-0003', clearance: 'GİZLİ',      clearanceTR: 'GİZLİ',      clearanceEN: 'CONFIDENTIAL', clearanceColor: '#a855f7', roleBg: 'rgba(168,85,247,0.12)', roleColor: '#d8b4fe', joinYear: '2020' },
  '4': { empId: 'EMP-0004', clearance: 'GİZLİ',      clearanceTR: 'GİZLİ',      clearanceEN: 'CONFIDENTIAL', clearanceColor: '#f59e0b', roleBg: 'rgba(245,158,11,0.12)', roleColor: '#fcd34d', joinYear: '2019' },
};

const answerKeys = {
  pre: { q1: "d", q2: "c", q3: "b" },
  post: { q1: "c", q2: "b", q3: "b" }, 
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    // --- YÖNLENDİRME MESAJI DÜZELTİLDİ ---
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nDashboard'a yönlendiriliyorsunuz...`,
    modTitle: "Modül 1: Broken Access Control (A01)",
    s1Title: "Adım 1: Ön-Test (Bilgi Ölçümü)",
    s1Desc: "Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.",
    
    preQ1Text: "Soru 1: 'Broken Access Control' nedir?",
    preQ1a: "A) Uygulamanın şifreleme zayıflıkları nedeniyle verilerin sızdırılmasıdır.",
    preQ1b: "B) Kullanıcıların izinlerinin kırılması sonucu aynı sayfaya ulaşamamasıdır.",
    preQ1c: "C) Sunucu trafiğinin bir hacker tarafından manipüle edilmesiyle kullanıcı yetkilerinin değiştirilmesidir.",
    preQ1d: "D) Kullanıcıların kendilerine atanmamış kaynaklar üzerinde işlem yapabilmesidir.",
    
    preQ2Text: "Soru 2: IDOR (Güvenli olmayan nesne başvurusu) nedir?",
    preQ2a: "A) Veritabanı nesnelerine yetkisiz erişim sağlanmasıdır.",
    preQ2b: "B) Zararlı bir script kodunun sunucuya enjekte edilmesidir.",
    preQ2c: "C) Sistemin kullanıcıdan gelen bir parametreyi doğrudan kullanmasıdır.",
    preQ2d: "D) SSL sertifikası (HTTPS) bulunmayan sitelerdeki güvenlik açığıdır.",
    
    preQ3Text: "Soru 3: Uygulamalarda yetki kontrolleri nerede yapılmalıdır?",
    preQ3a: "A) Frontend",
    preQ3b: "B) Backend",
    preQ3c: "C) Veritabanı",
    preQ3d: "D) Hepsi",
    
    btnNext1: "Testi Bitir ve Simülasyona Geç",

    s2Title: "Adım 2: Zafiyet Simülasyonu (IDOR)",
    gTitle: "OPERASYON BRİFİNGİ: IDOR",
    simDesc: "Şirketin İntranet portalına <b>YBS Uzmanı Atakan (Çalışan ID: 2)</b> olarak giriş yaptın.<br><br>📌 <b>URL'deki sayı ne anlama geliyor?</b><br>Adres çubuğundaki <code>/employee/profile/<b>2</b></code> ifadesinin sonundaki rakam, <u>veritabanındaki çalışan ID'sidir</u>. Sistem bu rakamı alıp direkt veritabanını sorgular — <b>bu ID'ye erişim hakkın var mı diye hiç kontrol etmez.</b><br><br>Aşağıdaki tarayıcının adres çubuğunu kullanarak iki senaryoyu dene:<br><br>⚡ <b>Senaryo 1 — IDOR:</b> Adres çubuğuna <code>/employee/profile/1</code> veya <code>/employee/profile/3</code> yaz, Enter'a bas. Başka çalışanların gizli bilgilerine ulaşabilecek misin?<br><br>🔐 <b>Senaryo 2 — Yetkisiz Admin:</b> Adres çubuğuna <code>/admin</code> yaz, Enter'a bas. Sistem senin admin olup olmadığını kontrol ediyor mu?",
    adminBreach: "<b>YETKİSİZ YÖNETİCİ PANELİ ERİŞİMİ</b> — Admin rolün yok! Sistem JWT token'ını doğruladı ama rolünü hiç kontrol etmedi.",
    adminPanelLabel: "Yönetim Paneli",
    adminTotalUsers: "kullanıcı",
    adminActiveSessions: "Aktif Oturum",
    adminPendingAlerts: "Bekleyen Uyarı",
    adminLastBackup: "Son Yedek",
    adminUserList: "Kullanıcılar",
    adminNavUsers: "Kullanıcılar",
    adminNavLogs: "Güvenlik Logları",
    adminNavSettings: "Ayarlar",
    adminColId: "ID",
    adminColName: "Ad Soyad",
    adminColRole: "Unvan",
    adminColDept: "Departman",
    adminColEmail: "E-posta",
    discAdminTag: "ADMİN ERİŞİMİ ✓",
    btnToTrn: "Zafiyeti Buldun! Eğitime Geç",
    loading: "Sayfa yükleniyor...",
    notFound: "Profil bulunamadı",
    errConn: "Sunucu bağlantı hatası! Backend sunucunuzu kontrol edin.",
    email: "E-posta",
    phone: "Telefon",
    joinDate: "İşe Giriş",
    secMsg: "GİZLİ BELGE",
    docsLabel: "Belgeler",
    docFileName: "dahili_not.txt",
    empDir: "Çalışan Rehberi",
    loggedAs: "Oturum",
    idorAlert: "<b>YETKİSİZ ERİŞİM TESPİT EDİLDİ</b> — Bu profil size ait değil! Sistem yetki kontrolü yapmıyor.",
    discTitle: "Keşif Günlüğü",
    discBreach: "yetkisiz erişim",
    discOwn: "Kendi profiliniz",
    discBreachTag: "YETKİSİZ ERİŞİM ✓",

    s3Title: "Adım 3: Az Önce Ne Yaşandı?",
    trnH1: "🛎️ Otel Resepsiyonu Analojisi (IDOR Nedir?)",
    trnP1: "Düşünün ki bir otele gittiniz ve resepsiyona <b>'Bana 1 numaralı odanın anahtarını verin'</b> dediniz. Resepsiyonist sizin kim olduğunuza bakmadan, o odanın size ait olup olmadığını kontrol etmeden anahtarı direkt elinize verdi.<br><br>İşte az önce adres çubuğundaki ID'yi değiştirdiğinizde sistemin yaptığı tam olarak buydu! Sistem sadece <i>'Belirtilen profil var mı?'</i> diye sordu, <i>'Bu veriyi isteyen kişinin o profili görme yetkisi var mı?'</i> diye sormadı. Kullanıcının adres çubuğundaki bir parametreyi değiştirerek başkasının verisine ulaşmasına <b>IDOR (Insecure Direct Object Reference)</b> denir.",
    trnH2: "🛡️ Çözüm: Token (Kimlik Kartı) ve Backend Kontrolü",
    trnP2: "Geliştiriciler, kullanıcıların adres çubuğuna müdahale edemeyeceğini veya arayüzdeki linkleri gizlemenin yeterli olacağını düşünmemelidir. Güvenli bir sistemde çözüm şu şekilde işler:<br><br><b>1. Dijital Kimlik (Token):</b> Siz sisteme giriş yaptığınızda sistem size güvenli, şifrelenmiş bir dijital kimlik kartı (örneğin JWT - JSON Web Token) verir. Bu kartın içinde sizin gerçekten <b>'Atakan (ID: 2)'</b> olduğunuz yazılıdır.<br><br><b>2. Arka Plan (Backend) Kontrolü:</b> Siz başka bir profili getirmek için istek attığınızda, Backend adres çubuğundaki rakama doğrudan inanmaz. Hemen elinizdeki Token'a bakar: <i>'Senin Token'ında ID: 2 yazıyor ama sen benden başka bir ID'nin verisini istiyorsun. Sen Admin değilsin, bu yüzden bu işlemi reddediyorum!'</i> der ve erişimi engeller.",
    btnNext3: "Öğrendiklerini Test Et (Son-Test)",

    s4Title: "Adım 4: Son-Test",
    s4Desc: "Bu modülde öğrendiklerinizi pekiştirelim.",
    postQ1Text: "Soru 1: IDOR zafiyetinin ana nedeni nedir?",
    postQ1a: "A) Sunucuda SSL sertifikası (HTTPS) olmaması",
    postQ1b: "B) Veritabanı portunun dışarı açık olması sebebiyle linkte değiştirme yapılabilmesi",
    postQ1c: "C) Kullanıcının yetki kontrolü yapılmadan doğrudan veritabanı sorgusu yapabilmesi",
    postQ1d: "D) Kullanıcı şifrelerinin hash'lenmemiş olması",
    postQ2Text: "Soru 2: Broken Access Control zafiyetinin kesin çözümü hangisidir?",
    postQ2a: "A) SSL sertifikası bulundurmak",
    postQ2b: "B) JWT Token kullanarak yetki kontrolü yapmak",
    postQ2c: "C) Kullanıcıya frontend'de verileri gizlemek",
    postQ2d: "D) URL parametresini şifrelemek",
    postQ3Text: "Soru 3: Yetki kontrolü nerede yapılmalıdır?",
    postQ3a: "A) Frontend",
    postQ3b: "B) Backend",
    postQ3c: "C) Database",
    postQ3d: "D) LocalStorage",
    btnFinish: "Modülü Tamamla",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    // --- YÖNLENDİRME MESAJI DÜZELTİLDİ ---
    alertResult: (pre, post) => `Congratulations!\nPre-Test Score: ${pre}%\nPost-Test Score: ${post}%\n\nRedirecting to your Dashboard...`,
    modTitle: "Module 1: Broken Access Control (A01)",
    s1Title: "Step 1: Pre-Test",
    s1Desc: "Let's measure your current knowledge level.",
    
    preQ1Text: "Question 1: What is 'Broken Access Control'?",
    preQ1a: "A) Data leakage due to the application's encryption weaknesses.",
    preQ1b: "B) Users being unable to reach the same page as a result of broken permissions.",
    preQ1c: "C) Changing user permissions by a hacker manipulating server traffic.",
    preQ1d: "D) Users being able to perform actions on resources not assigned to them.",
    
    preQ2Text: "Question 2: What is IDOR (Insecure Direct Object Reference)?",
    preQ2a: "A) Unauthorized access to database objects.",
    preQ2b: "B) Injecting malicious script code into the server.",
    preQ2c: "C) The system directly using a parameter provided by the user without validation.",
    preQ2d: "D) A vulnerability in sites without an SSL certificate (HTTPS).",
    
    preQ3Text: "Question 3: Where should authorization checks be performed in applications?",
    preQ3a: "A) Frontend",
    preQ3b: "B) Backend",
    preQ3c: "C) Database",
    preQ3d: "D) All of them",
    
    btnNext1: "Go to Simulation",

    s2Title: "Step 2: Vulnerability Simulation (IDOR)",
    gTitle: "MISSION BRIEFING: IDOR",
    simDesc: "You are logged into the company Intranet portal as <b>MIS Specialist Atakan (Employee ID: 2)</b>.<br><br>📌 <b>What does the number in the URL mean?</b><br>The number at the end of <code>/employee/profile/<b>2</b></code> is the <u>employee's database ID</u>. The system takes this number directly from the URL and queries the database — <b>it never checks whether you actually have access to that ID.</b><br><br>Use the address bar in the browser below to try both scenarios:<br><br>⚡ <b>Scenario 1 — IDOR:</b> Type <code>/employee/profile/1</code> or <code>/employee/profile/3</code> and press Enter. Can you reach other employees' confidential data?<br><br>🔐 <b>Scenario 2 — Unauthorized Admin:</b> Type <code>/admin</code> and press Enter. Does the system verify that you have admin privileges?",
    adminBreach: "<b>UNAUTHORIZED ADMIN PANEL ACCESS</b> — You have no admin role! The system verified your JWT token but never checked your role.",
    adminPanelLabel: "Admin Panel",
    adminTotalUsers: "users",
    adminActiveSessions: "Active Sessions",
    adminPendingAlerts: "Pending Alerts",
    adminLastBackup: "Last Backup",
    adminUserList: "Users",
    adminNavUsers: "Users",
    adminNavLogs: "Security Logs",
    adminNavSettings: "Settings",
    adminColId: "ID",
    adminColName: "Name",
    adminColRole: "Title",
    adminColDept: "Department",
    adminColEmail: "Email",
    discAdminTag: "ADMIN ACCESS ✓",
    btnToTrn: "Vulnerability Found! Go to Training",
    loading: "Loading page...",
    notFound: "Profile not found",
    errConn: "Server connection error! Check your backend server.",
    email: "Email",
    phone: "Phone",
    joinDate: "Joined",
    secMsg: "CLASSIFIED DOCUMENT",
    docsLabel: "Documents",
    docFileName: "internal_memo.txt",
    empDir: "Employee Directory",
    loggedAs: "Session",
    idorAlert: "<b>UNAUTHORIZED ACCESS DETECTED</b> — This profile does not belong to you! The system performs no authorization check.",
    discTitle: "Discovery Log",
    discBreach: "unauthorized access",
    discOwn: "Your own profile",
    discBreachTag: "UNAUTHORIZED ✓",

    s3Title: "Step 3: What Just Happened?",
    trnH1: "🛎️ The Hotel Receptionist Analogy (What is IDOR?)",
    trnP1: "Imagine you walk into a hotel and say to the receptionist, <b>'Give me the key to room 1.'</b> The receptionist hands you the key directly without checking your ID or verifying if that room actually belongs to you.<br><br>That's exactly what the system did when you changed the ID in the URL bar! The system only asked <i>'Does the requested profile exist?'</i> but never asked <i>'Does the user requesting this data have the authority to view it?'</i>. When a user can access someone else's data simply by changing a parameter in the URL, it is called <b>IDOR (Insecure Direct Object Reference)</b>.",
    trnH2: "🛡️ Solution: Tokens and Backend Validation",
    trnP2: "Developers shouldn't assume users won't manipulate the URL or that hiding links on the interface is enough. In a secure system, the solution works like this:<br><br><b>1. Digital ID (Token):</b> When you log in, the system gives you a secure, encrypted digital ID card (e.g., JWT - JSON Web Token). This card mathematically proves that you are <b>'Atakan (ID: 2)'</b>.<br><br><b>2. Backend Validation:</b> When you send a request to view another profile, the Backend does not blindly trust the number in the URL. It immediately checks your Token: <i>'Your Token says your ID is 2, but you are asking for someone else's data. You are not an Admin, therefore I reject this request!'</i> and blocks the access.",
    btnNext3: "Go to Post-Test",

    s4Title: "Step 4: Post-Test",
    s4Desc: "Let's reinforce what you learned.",
    postQ1Text: "Question 1: What is the main cause of the IDOR vulnerability?",
    postQ1a: "A) Lack of an SSL certificate (HTTPS) on the server.",
    postQ1b: "B) Being able to manipulate the link because the database port is exposed to the outside.",
    postQ1c: "C) A user being able to make a direct database query without an authorization check.",
    postQ1d: "D) User passwords not being hashed.",
    postQ2Text: "Question 2: What is the definitive solution to the Broken Access Control vulnerability?",
    postQ2a: "A) Having an SSL certificate.",
    postQ2b: "B) Performing authorization checks using a JWT Token.",
    postQ2c: "C) Hiding data from the user on the frontend.",
    postQ2d: "D) Encrypting the URL parameter.",
    postQ3Text: "Question 3: Where should authorization checks be performed?",
    postQ3a: "A) Frontend",
    postQ3b: "B) Backend",
    postQ3c: "C) Database",
    postQ3d: "D) LocalStorage",
    btnFinish: "Complete Training",
  },
  dbTranslations: {
    "YBS Uzmanı": "MIS Specialist",
    "Sistem Yöneticisi": "System Administrator",
    "Güvenlik Analisti": "Security Analyst",
    "CFO": "CFO",
    "Bilişim Teknolojileri": "Information Technology",
    "Finans": "Finance",
    "Belirtilmedi": "Not Specified",
    "Root Şifresi: Srv@2026!Master — Üretim sunucusu erişimi. KİMSEYLE PAYLAŞMA.": "Root Password: Srv@2026!Master — Production server access. DO NOT SHARE WITH ANYONE.",
    "Sistem güncelleme notu: Sunucu şifreleri yarın sıfırlanacak.": "System update note: Server passwords will be reset tomorrow.",
    "Pentest Raporu 2026-05: Sistemde 3 kritik zafiyet tespit edildi. Rapor gizli tutulmalıdır.": "Pentest Report 2026-05: 3 critical vulnerabilities detected. Report must remain confidential.",
    "UYARI: Q4 bilanço raporu gizlendi. Belge: finans_2026_gizli.xlsx": "WARNING: Q4 balance sheet concealed. File: finance_2026_classified.xlsx"
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  if (currentStep.value === 2 && profileData.value) loadResource();
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
    localStorage.setItem(`bac_draft_answers_${userEmail}`, JSON.stringify(newAnswers));
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

      if (result.success && result.data && result.data.bac_answers) {
        Object.assign(answers, result.data.bac_answers);
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem(`bac_draft_answers_${userEmail}`);
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
    loadResource();
  }

  isLoading.value = false;
});

// Component zaten mount edilmişken aynı rotaya (redirect ile) gelinirse simülasyonu sıfırla
onBeforeRouteUpdate(() => {
  profileData.value = null;
  adminData.value = null;
  simError.value = '';
  discoveries.value = [];
  simulationSuccess.value = false;
  exploitStatus.value = 'idle';
  targetPath.value = '/employee/profile/2';
  displayedId.value = '2';
  loadResource();
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

const avatarColors = {
  '1': 'linear-gradient(135deg, #ef4444, #b91c1c)',
  '2': 'linear-gradient(135deg, #3b82f6, #2563eb)',
  '3': 'linear-gradient(135deg, #a855f7, #7e22ce)',
  '4': 'linear-gradient(135deg, #f59e0b, #b45309)',
};

const loadResource = async () => {
  const raw = targetPath.value.trim();
  if (!raw) return;
  const path = raw.startsWith('/') ? raw : '/' + raw;
  targetPath.value = path; // adres çubuğunu normalize edilmiş haliyle güncelle

  isSimLoading.value = true;
  profileData.value = null;
  adminData.value = null;
  simError.value = '';

  loadProgress.value = 20;
  const ticker = setInterval(() => {
    if (loadProgress.value < 80) loadProgress.value += 18;
  }, 120);

  try {
    await new Promise(r => setTimeout(r, 350));

    const profileMatch = path.match(/^\/employee\/profile\/(\d+)$/);

    if (profileMatch) {
      const id = profileMatch[1];
      const response = await fetch(`/api/vuln/bac/profile/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      clearInterval(ticker);

      if (result.success) {
        loadProgress.value = 100;
        setTimeout(() => { loadProgress.value = 0; }, 400);

        const extras = profileExtras[id] || {
          empId: `EMP-00${id}`, clearance: 'STANDART', clearanceTR: 'STANDART', clearanceEN: 'STANDARD',
          clearanceColor: '#64748b', roleBg: 'rgba(100,116,139,0.1)', roleColor: '#94a3b8', joinYear: '2022'
        };

        let role = result.data.role;
        let dept = result.data.department || 'Belirtilmedi';
        let secMsg = result.data.secret_message;

        if (currentLang.value === 'en') {
          const dbT = translations.dbTranslations;
          role = dbT[role] || role;
          dept = dbT[dept] || dept;
          secMsg = dbT[secMsg] || secMsg;
        }

        const clearance = currentLang.value === 'en' ? extras.clearanceEN : extras.clearanceTR;

        profileData.value = {
          initial: result.data.name.charAt(0),
          avatarColor: avatarColors[id] || 'linear-gradient(135deg, #64748b, #475569)',
          name: result.data.name,
          displayRole: role,
          displayDept: dept,
          email: result.data.email,
          phone: result.data.phone,
          displaySecretMsg: secMsg,
          empId: extras.empId,
          clearance,
          clearanceColor: extras.clearanceColor,
          roleBg: extras.roleBg,
          roleColor: extras.roleColor,
          joinYear: extras.joinYear,
        };

        if (!discoveries.value.find(d => d.id === id)) {
          discoveries.value.push({ id, name: result.data.name, role, dept, isOwn: id === '2' });
        }

        displayedId.value = id;
        exploitStatus.value = 'success';
        simulationSuccess.value = (id !== '2');
      } else {
        loadProgress.value = 0;
        exploitStatus.value = 'error';
        simError.value = result.message || currentText.value.errConn;
        simulationSuccess.value = false;
      }
    } else if (path === '/admin') {
      const response = await fetch('/api/vuln/bac/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      clearInterval(ticker);

      if (result.success) {
        loadProgress.value = 100;
        setTimeout(() => { loadProgress.value = 0; }, 400);

        adminData.value = result.data;
        displayedId.value = null;
        exploitStatus.value = 'success';
        simulationSuccess.value = true;

        if (!discoveries.value.find(d => d.isAdmin)) {
          discoveries.value.push({ id: 'admin', name: '', role: '', dept: '', isOwn: false, isAdmin: true });
        }
      } else {
        loadProgress.value = 0;
        exploitStatus.value = 'error';
        simError.value = result.message || currentText.value.errConn;
      }
    } else {
      clearInterval(ticker);
      loadProgress.value = 0;
      simError.value = currentText.value.notFound;
    }
  } catch (error) {
    clearInterval(ticker);
    loadProgress.value = 0;
    exploitStatus.value = 'error';
    simError.value = currentText.value.errConn;
  } finally {
    isSimLoading.value = false;
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
        module: "bac",
        preScore: preScore,
        postScore: postScore,
        answers: answers 
      }),
    });
    
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem(`bac_draft_answers_${userEmail}`); 
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
.container { width: 100%; max-width: 950px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #3b82f6; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #3b82f6, transparent); margin-bottom: 35px; }

.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #3b82f6; padding-left: 15px; margin-bottom: 10px; }
.step-desc { font-size: 15px; color: #94a3b8; margin-bottom: 25px;}
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* Sorular ve Seçenekler */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #3b82f6; }
.options label input:disabled { cursor: not-allowed; }
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* =========================================================
   SİMÜLASYON — YENİ TASARIM
   ========================================================= */

/* Mission brief */
.mission-brief { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e293b; border-left: 4px solid #3b82f6; border-radius: 10px; padding: 18px 22px; margin-bottom: 22px; }
.brief-top { display: flex; align-items: center; gap: 10px; color: #f8fafc; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
.pulse-icon { width: 9px; height: 9px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 8px #3b82f6; flex-shrink: 0; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
.sim-desc { font-size: 14.5px; line-height: 1.7; margin: 0; color: #94a3b8; }

/* Mock Browser */
.mock-browser { background: #070b14; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; margin-bottom: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; }

.browser-progress { position: absolute; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #3b82f6, #06b6d4); transition: width 0.15s ease, opacity 0.4s ease; z-index: 10; }

.browser-chrome { background: #111827; padding: 10px 14px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #1a2438; }
.browser-dots { display: flex; gap: 6px; flex-shrink: 0; }
.dot { width: 11px; height: 11px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #22c55e; }
.browser-tab { display: flex; align-items: center; gap: 7px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 5px 14px; font-size: 12px; color: #94a3b8; }
.tab-icon { font-size: 13px; }
.tab-label { white-space: nowrap; }

.browser-addressbar { background: #111827; padding: 8px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #1a2438; }
.addr-pill { flex: 1; background: #1a2438; border: 1px solid #263248; border-radius: 20px; padding: 6px 16px; display: flex; align-items: center; gap: 8px; cursor: text; min-width: 0; }
.addr-lock-icon { font-size: 11px; flex-shrink: 0; }
.addr-url { display: flex; align-items: baseline; font-family: 'Courier New', monospace; font-size: 13px; white-space: nowrap; flex: 1; min-width: 0; }
.addr-scheme { color: #475569; flex-shrink: 0; }
.addr-host { color: #e2e8f0; font-weight: 600; flex-shrink: 0; }
.addr-path { color: #475569; flex-shrink: 0; }
.addr-path-input { background: transparent; border: none; color: #38bdf8; font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700; flex: 1; min-width: 140px; outline: none; caret-color: #38bdf8; padding: 0; cursor: text; }
.addr-go-btn { background: transparent; color: #64748b; border: 1px solid #1e293b; padding: 5px 11px; border-radius: 6px; font-size: 15px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; line-height: 1; }
.addr-go-btn:hover { color: #e2e8f0; border-color: #334155; background: #1e293b; }

/* Browser page body */
.browser-body { min-height: 320px; background: #0e1520; }

.page-loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 80px 20px; color: #475569; font-size: 14px; }
.page-spinner { width: 20px; height: 20px; border: 3px solid rgba(59,130,246,0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }

/* Intranet page inside browser */
.intranet-page { color: #cbd5e1; }

.intranet-topbar { display: flex; align-items: center; gap: 10px; background: #111827; padding: 9px 18px; border-bottom: 1px solid #1a2438; font-size: 12px; flex-wrap: wrap; }
.intranet-brand { color: #f8fafc; font-weight: 700; font-size: 13px; }
.intranet-breadcrumb { color: #475569; flex-grow: 1; }
.intranet-user { color: #64748b; white-space: nowrap; }
.intranet-user b { color: #38bdf8; }

.idor-alert { display: flex; align-items: flex-start; gap: 10px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); border-left: 4px solid #ef4444; padding: 11px 16px; margin: 14px 14px 0 14px; border-radius: 7px; font-size: 13px; color: #fca5a5; line-height: 1.5; }
.idor-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

/* Profile card */
.profile-card { margin: 14px; background: #111827; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; }
.profile-breach { border-color: rgba(239,68,68,0.35); box-shadow: 0 0 20px rgba(239,68,68,0.06); }

.profile-header { display: flex; align-items: center; gap: 18px; padding: 20px 22px; }
.profile-avatar { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 26px; font-weight: 800; box-shadow: 0 4px 14px rgba(0,0,0,0.4); flex-shrink: 0; }
.profile-meta { display: flex; flex-direction: column; gap: 6px; }
.profile-name { color: #f8fafc; font-size: 19px; font-weight: 700; line-height: 1.2; }
.profile-tags { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.role-tag { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 10px; border: 1px solid; }
.dept-tag { font-size: 11px; font-weight: 600; color: #94a3b8; background: rgba(148,163,184,0.08); border: 1px solid #334155; padding: 3px 10px; border-radius: 10px; }
.profile-empid { font-size: 11px; color: #475569; font-family: monospace; }

.profile-divider { height: 1px; background: #1e293b; margin: 0 22px; }

.profile-details { display: flex; flex-direction: column; gap: 0; padding: 6px 22px 16px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #0d1526; }
.detail-row:last-child { border-bottom: none; }
.detail-label { font-size: 12px; color: #475569; }
.detail-val { font-size: 13px; color: #cbd5e1; font-family: monospace; text-align: right; }

/* Documents section */
.profile-docs-section { border-top: 1px solid #1e293b; padding: 14px 22px 18px; }
.docs-section-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
.doc-item { background: #0d1526; border: 1px solid #1e293b; border-radius: 8px; padding: 12px 14px; display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; gap: 4px 12px; }
.doc-icon { font-size: 22px; grid-row: 1 / 3; align-self: center; }
.doc-info { display: flex; align-items: center; gap: 10px; }
.doc-name { font-size: 13px; font-weight: 600; color: #e2e8f0; font-family: monospace; }
.doc-meta { display: flex; align-items: center; gap: 8px; }
.doc-clearance-tag { font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 4px; border: 1px solid; }
.doc-size { font-size: 11px; color: #475569; }
.doc-content { grid-column: 2; font-size: 13px; color: #94a3b8; line-height: 1.6; padding-top: 6px; border-top: 1px solid #1e293b; margin-top: 4px; }

/* 404 page */
.sim-404 { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
.err-num { font-size: 72px; font-weight: 900; color: #1e293b; line-height: 1; }
.err-msg { color: #ef4444; font-size: 16px; font-weight: 700; margin: 8px 0 4px; }
.err-sub { color: #475569; font-size: 13px; }

/* Admin Panel */
.admin-page { color: #cbd5e1; }
.admin-nav { display: flex; gap: 0; background: #0d1526; border-bottom: 1px solid #1e293b; padding: 0 16px; }
.admin-nav-item { font-size: 12px; font-weight: 600; color: #475569; padding: 10px 16px; cursor: default; border-bottom: 2px solid transparent; }
.admin-nav-item.active { color: #38bdf8; border-bottom-color: #38bdf8; }
.admin-body { padding: 14px 16px; }
.admin-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.admin-page-title { font-size: 13px; font-weight: 700; color: #e2e8f0; }
.admin-count { font-size: 11px; color: #475569; }
.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #0d1526; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; }
.admin-table thead { background: #111827; }
.admin-table th { padding: 9px 14px; text-align: left; color: #64748b; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid #1e293b; }
.admin-table td { padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #0b1120; }
.admin-table tbody tr:last-child td { border-bottom: none; }
.admin-table .row-self td { color: #38bdf8; background: rgba(56,189,248,0.04); }
.admin-user-cell { display: flex; align-items: center; gap: 9px; }
.admin-avatar { width: 26px; height: 26px; border-radius: 50%; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.admin-table .row-self .admin-avatar { background: rgba(56,189,248,0.15); color: #38bdf8; }
.admin-email { font-family: monospace; font-size: 12px; }
.disc-admin { background: rgba(245,158,11,0.04); }
.disc-admin-tag { background: rgba(245,158,11,0.12) !important; color: #fcd34d !important; }

/* Discovery log */
.disc-log { background: rgba(15,23,42,0.6); border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
.disc-log-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid #1e293b; background: #0d1526; }
.disc-log-title { font-size: 13px; font-weight: 700; color: #f8fafc; }
.disc-count { font-size: 12px; color: #ef4444; font-weight: 600; }
.disc-entries { display: flex; flex-direction: column; gap: 0; }
.disc-entry { display: flex; align-items: center; gap: 10px; padding: 9px 16px; border-bottom: 1px solid #0d1526; font-size: 13px; }
.disc-entry:last-child { border-bottom: none; }
.disc-icon { font-size: 14px; flex-shrink: 0; }
.disc-info { flex: 1; color: #94a3b8; }
.disc-info b { color: #e2e8f0; }
.disc-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.disc-own .disc-tag { background: rgba(59,130,246,0.1); color: #93c5fd; }
.disc-breach .disc-tag { background: rgba(239,68,68,0.12); color: #fca5a5; }

/* Eğitim Adımı (Adım 3) Bilgi Kutuları */
.edu-card { background: transparent; }
.info-box { padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #334155; line-height: 1.7; color: #cbd5e1; background: #1e293b; }
.info-box h3 { color: #f8fafc; margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 20px;}
.logic-box { border-left: 4px solid #f59e0b; }
.solution-box { border-left: 4px solid #10b981; }

/* Butonlar & Aksiyonlar */
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; width: 100%;}
button { font-family: inherit; }
.btn-primary { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
.btn-success { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; width: auto;}
.btn-success:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* Animasyonlar ve Yükleyiciler */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(59, 130, 246, 0.2); border-top-color: #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(148, 163, 184, 0.3); border-top-color: #94a3b8; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; vertical-align: middle;}
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>