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

        <!-- ─── ADIM 1: ÖN-TEST ─── -->
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

        <!-- ─── ADIM 2: SİMÜLASYON ─── -->
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
                  <div class="guide-step" :class="{ current: currentMission === 1, done: currentMission > 1 }">
                    <b>{{ currentText.gs1T }}</b>
                    <p v-html="currentText.gs1D"></p>
                  </div>
                  <div class="guide-step" :class="{ current: currentMission === 2, done: currentMission > 2 }">
                    <b>{{ currentText.gs2T }}</b>
                    <p v-html="currentText.gs2D"></p>
                  </div>
                  <div class="guide-step" :class="{ current: currentMission === 3, done: currentMission > 3 }">
                    <b>{{ currentText.gs3T }}</b>
                    <p v-html="currentText.gs3D"></p>
                  </div>
                  <div class="guide-step" :class="{ current: currentMission === 4, done: currentMission > 4 }">
                    <b>{{ currentText.gs4T }}</b>
                    <p v-html="currentText.gs4D"></p>
                  </div>
                </div>
              </div>
            </div>

            <div class="app-container">
              <div class="crypto-window fade-in" v-if="activeWindow === 'crypto'">
                <div class="crypto-header">🪙 NovaCrypto</div>
                <div class="crypto-body">
                  <p class="crypto-desc" v-html="currentText.authDesc"></p>
                  <div class="pin-box">
                    <input type="text" class="pin-input" maxlength="1" v-model="pin1" ref="refP1" @input="moveFocus($event, 'refP2', null)" @keydown.delete="handleDelete($event, null)" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin2" ref="refP2" @input="moveFocus($event, 'refP3', 'refP1')" @keydown.delete="handleDelete($event, 'refP1')" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin3" ref="refP3" @input="moveFocus($event, 'refP4', 'refP2')" @keydown.delete="handleDelete($event, 'refP2')" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin4" ref="refP4" @input="moveFocus($event, null, 'refP3')" @keydown.delete="handleDelete($event, 'refP3')" @keyup.enter="verifyPin" />
                  </div>
                  <button class="btn-verify" @click="verifyPin">{{ currentText.btnVerify }}</button>
                  <div v-if="simWarning" class="warning-msg fade-in">{{ simWarning }}</div>
                  <button v-if="currentMission >= 2" class="btn-hacker-tool fade-in" @click="openHackerTool">
                    >_ {{ currentText.btnOpenTool }}
                  </button>
                </div>
              </div>

              <div class="bruteforce-window fade-in" v-if="activeWindow === 'hacker'">
                <div class="bf-header">
                  <span>[x] HYDRA BRUTE-FORCER v9.4</span>
                  <span class="bf-target-txt">{{ currentText.bfTarget }}</span>
                </div>
                <div class="bf-terminal" ref="terminalContainer">
                  <div v-html="terminalLogs"></div>
                </div>
                <div class="bf-cmd-line">
                  <span class="prompt-user">root@kali:</span><span class="prompt-dir">~#</span>
                  <input type="text" v-model="hackerCmd" :placeholder="currentText.inputCmd" @keyup.enter="checkHackerCmd" :disabled="isAttacking || isCracked" autocomplete="off" spellcheck="false" />
                  <button v-if="!isAttacking && !isCracked" class="btn-attack" @click="checkHackerCmd">{{ currentText.btnAttack }}</button>
                  <button v-if="isCracked" class="btn-attack btn-success-override fade-in" @click="backToTarget">{{ currentText.btnBackTarget }}</button>
                </div>
              </div>

              <div class="vault-panel fade-in" v-if="activeWindow === 'vault'">
                <h2 class="vault-title">{{ currentText.vaultTitle }}</h2>
                <p class="vault-desc">{{ currentText.vaultDesc }}</p>
                <div class="balance-box">
                  <div class="vault-lbl">{{ currentText.vaultLbl }}</div>
                  <div class="balance-amount">142.508,00 USDT</div>
                  <div class="vault-auth">{{ currentText.vaultAuth }}</div>
                </div>
              </div>

              <div class="action-footer" style="margin-top: 25px; justify-content: center;">
                <button class="btn-success" @click="currentStep = 3" v-if="activeWindow === 'vault' || isReviewMode">
                  {{ currentText.btnNext2 }}
                </button>
              </div>
            </div>
          </div>

          <div class="action-footer space-between" style="margin-top: 15px;">
            <button class="btn-secondary" @click="currentStep = 1">{{ currentLang === 'tr' ? 'Önceki' : 'Previous' }}</button>
          </div>
        </div>

        <!-- ─── ADIM 3: EĞİTİM ─── -->
        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material') : currentText.s3Title }}
          </h2>

          <div class="edu-card">
            <h3 class="edu-heading amber-text">{{ currentText.trnH1 }}</h3>
            <p class="edu-desc" v-html="currentText.trnP1"></p>

            <h3 class="edu-heading red-text" style="margin-top: 25px;">{{ currentText.trnH2 }}</h3>
            <p class="edu-desc" v-html="currentText.trnP2"></p>

            <div class="neon-divider" style="margin: 30px 0; background: linear-gradient(90deg, #1e293b, #334155, #1e293b);"></div>

            <h3 class="edu-heading blue-text">{{ currentText.trnH4 }}</h3>
            <p class="edu-desc" v-html="currentText.trnP4"></p>

            <div class="neon-divider" style="margin: 30px 0; background: linear-gradient(90deg, #1e293b, #334155, #1e293b);"></div>

            <h3 class="edu-heading green-text">{{ currentText.trnH3 }}</h3>
            <p class="edu-desc" v-html="currentText.trnP3"></p>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 2">{{ currentLang === 'tr' ? 'Önceki' : 'Previous' }}</button>
            <button class="btn-primary" @click="currentStep = 4">{{ currentText.btnNext3 }}</button>
          </div>
        </div>

        <!-- ─── ADIM 4: SON-TEST ─── -->
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
            <button class="btn-secondary" @click="currentStep = 3">{{ currentLang === 'tr' ? 'Önceki' : 'Previous' }}</button>
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const currentLang = ref('tr');
const currentStep = ref(1);
const isSaving = ref(false);
const isLoading = ref(true);

watch(currentStep, () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

const isReviewMode = computed(() => route.query.review === 'true');

const answers = reactive({
  preQ1: '', preQ2: '', preQ3: '',
  postQ1: '', postQ2: '', postQ3: ''
});

const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

const currentMission = ref(1);
const activeWindow = ref('crypto');
const targetPin = '8427';
const simWarning = ref('');

const pin1 = ref(''); const pin2 = ref(''); const pin3 = ref(''); const pin4 = ref('');
const refP1 = ref(null); const refP2 = ref(null); const refP3 = ref(null); const refP4 = ref(null);

const hackerCmd = ref('');
const isAttacking = ref(false);
const isCracked = ref(false);
const terminalLogs = ref('');
const terminalContainer = ref(null);

let attackIntervalRef = null;

const answerKeys = {
  pre:  { q1: 'b', q2: 'a', q3: 'c' },
  post: { q1: 'b', q2: 'b', q3: 'c' },
};

const translations = {
  tr: {
    modTitle: 'A07: Authentication Failures',
    warnEmpty: 'Lütfen ilerlemeden önce tüm soruları yanıtlayın.',
    alertResult: (pre, post) => `Modül tamamlandı!\n\n📋 Ön-Test Başarınız: ${pre}/100\n🏆 Son-Test Başarınız: ${post}/100\n\nDashboard'a yönlendiriliyorsunuz.`,

    s1Title: 'Adım 1: Ön-Test (Bilgi Ölçümü)',
    s1Desc: 'Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.',
    preQ1Text: "Soru 1: 'Rate Limiting' mekanizmasının temel güvenlik işlevi nedir?",
    preQ1a: 'A) Sunucunun çökmemesi için çok hızlı veri trafiğini filtrelemek.',
    preQ1b: 'B) Belirli bir zaman diliminde aynı IP veya kullanıcıdan gelen maksimum istek sayısını kısıtlamak.',
    preQ1c: 'C) Sunucuya gelen paketlerin boyutunu limitlemek.',
    preQ1d: 'D) Ağ katmanındaki yetkisiz port taramalarını tespit edip engellemek.',
    preQ2Text: 'Soru 2: Bir sistemde Rate Limiting BULUNMAMASI durumunda ne olur?',
    preQ2a: 'A) Sistem, Brute-Force saldırılarına açık hale gelir.',
    preQ2b: 'B) Büyük boyutlu paketlerin girişi engellenemez.',
    preQ2c: 'C) Kullanıcı oturumları otomatik olarak başkası tarafından ele geçirilebilir.',
    preQ2d: 'D) Veritabanı şifreleme algoritmaları çözülebilir hale gelir.',
    preQ3Text: 'Soru 3: 4 veya 6 haneli doğrulama ekranlarında hız sınırlandırması neden kritiktir?',
    preQ3a: 'A) Sınırlandırma eksikliği sistemin bellek sızıntısı yaşamasına neden olur.',
    preQ3b: 'B) Çoklu istekler rastgele sayı üretecini manipüle edilebilir hale getirir.',
    preQ3c: 'C) İhtimal havuzunun dar olması sebebiyle sınırsız deneme imkânı şifre uzayını hızla tüketir.',
    preQ3d: 'D) Doğrulama sunucuları eşzamanlı bağlantılarda asimetrik şifrelemeyi desteklemez.',
    btnNext1: 'Testi Bitir ve Simülasyona Geç',

    s2Title: 'Adım 2: Zafiyet Simülasyonu',
    s2Summary: "A07 – Identification and Authentication Failures, kimlik doğrulama mekanizmalarındaki zayıflıkları kapsar. Bu simülasyonda Rate Limiting eksikliğini pratik olarak göreceksiniz: Bir kripto borsasının SMS doğrulama ekranına gerçek bir Brute-Force saldırısı düzenleyeceksiniz.",
    gTitle: 'OPERASYON BRİFİNGİ',
    gs1T: '1. Keşif: Sınırları Test Et',
    gs1D: "Önce sistemi manuel test et. Rastgele bir kod (örn: 1234) girip 'Doğrula' de. Hata mesajını oku. Sistem bizi 'Çok fazla hatalı deneme' diyerek engelliyor mu?",
    gs2T: '2. Silahlanma (Hacker Aracını Aç)',
    gs2D: 'Sistem engellemedi! Manuel binlerce ihtimali deneyemeyiz. Aşağıda beliren <b>">_ Hacker Aracını Aç"</b> butonuna tıkla.',
    gs3T: '3. Kaba Kuvvet Saldırısı',
    gs3D: "Siber güvenliğin meşhur aracı Hydra'yı kullanacağız. Terminale şu komutu yapıştır ve Enter'a bas:<br><code class='glitch-payload' style='font-size:13px; margin:8px 0; display:inline-block;'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: '4. Kripto Kasasına Sız',
    gs4D: 'Terminal bulduğu yeşil doğru PIN\'i gösterecek. <b>"Hedefe Dön"</b> butonuna bas, kodu girerek cüzdanı ele geçir!',

    authDesc: 'Giriş için telefonunuza gelen <b>4 haneli onay kodunu</b> giriniz.',
    btnVerify: 'Doğrula ve Giriş Yap',
    msgWarnMan: 'Hatalı Kod! Sistemde sınırlandırma YOK. Sonsuz deneme yapabilirsiniz.',
    msgWarnShort: 'Lütfen 4 haneli bir kod girin.',
    btnOpenTool: 'Hacker Aracını Aç',
    bfTarget: 'Hedef: api.novacrypto.com',
    inputCmd: 'hydra -l admin ...',
    btnAttack: 'Çalıştır',
    btnBackTarget: 'Hedefe Dön & Kodu Gir',
    bfTermReady: 'Hydra v9.4 (c) 2023 by van Hauser/THC<br>[INFO] Starting Brute-Force environment...<br><br>',
    cmdError: "Hatalı komut! Görev rehberindeki 'hydra' komutunu tam olarak kopyalayıp yapıştırın.",
    vaultTitle: '🔓 ERİŞİM ONAYLANDI',
    vaultDesc: 'Hoş geldiniz. 2FA doğrulaması başarıyla aşıldı.',
    vaultLbl: 'Kullanılabilir Bakiye',
    vaultAuth: 'Transfer yetkisi aktif.',
    btnNext2: 'Saldırıyı Analiz Et (Eğitime Geç)',

    s3Title: 'Adım 3: Zafiyet Analizi ve Çözümü',
    trnH1: 'A07 Nedir? (Identification and Authentication Failures)',
    trnP1: "A07 kategorisi, bir uygulamanın kimlik doğrulama ve oturum yönetimi işlevlerini hatalı uygulamasından doğan güvenlik açıklarını kapsar. Bu simülasyondaki kırılganlık kategorinin klasik bir örneğidir: SMS doğrulama API'sini geliştiren kişi, 'Bu uç noktaya saniyede kaç istek yapılabilir?' sorusunu hiç sormamıştır. Bu temel kimlik doğrulama güvenlik önleminin ihmal edilmesi, sistemi Brute-Force saldırılarına karşı savunmasız bırakmıştır.",
    trnH2: 'Kaba Kuvvet Nasıl Çalıştı? (Brute-Force)',
    trnP2: "Otomatik bir script, API'ye saldırdı. 0000'dan başlayarak her milisaniyede yeni bir PIN denedi. Sistem yorulmadı, engellemedi ve sadece 'Yanlış' döndü — ta ki doğru kodu (8427) bulana kadar. 4 haneli bir PIN yalnızca 10.000 ihtimal barındırır. Rate limiting olmadan bir bilgisayar bunu saniyeler içinde tüketir.",
    trnH4: 'Terminale Ne Yazdık?',
    trnP4: "Yazdığımız <code class='code-accent'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code> komutu araca verdiğimiz basit bir talimattı:<br><br>• <b>hydra:</b> Siber güvenlikte kullanılan meşhur şifre deneme aracı.<br>• <b>-l admin:</b> Hedefimizdeki kullanıcının adı (login).<br>• <b>-P pins.txt:</b> 0000'dan 9999'a kadar tüm ihtimallerin bulunduğu metin dosyası.<br>• <b>api.novacrypto...:</b> Saldıracağımız API adresi.<br><br><i>'Al bu 10 bin ihtimali, doğru olanı bulana kadar o adreste teker teker dene!'</i>",
    trnH3: 'Kesin Çözüm: Rate Limiting ve Account Lockout',
    trnP3: 'Brute-Force saldırılarını durdurmanın yolu API seviyesinde kısıtlamaktır — bu da doğru bir <b>kimlik doğrulama güvenlik</b> kararıdır:<br><br><b>1. Rate Limiting:</b> Bir IP adresi 1 dakikada en fazla 5 istek yapabilir. Fazlasında sistem <b>HTTP 429 (Too Many Requests)</b> hatası döndürmelidir.<br><b>2. Account Lockout:</b> Arka arkaya 3 hatalı girişten sonra oturum 15 dakikalığına dondurulmalıdır.',
    btnNext3: 'Öğrendiklerini Test Et (Son-Test)',

    s4Title: 'Adım 4: Son-Test',
    s4Desc: 'Bu modülde öğrendiklerinizi pekiştirelim.',
    postQ1Text: "Soru 1: Simülasyonda 'NovaCrypto' borsasının 4 haneli onay ekranını aşmak için kullandığımız 'Hydra' aracı hangi saldırı türünü gerçekleştirdi?",
    postQ1a: 'A) SQL Injection (SQLi)',
    postQ1b: 'B) Brute-Force (Kaba Kuvvet)',
    postQ1c: 'C) Cross-Site Scripting (XSS)',
    postQ1d: 'D) Man-in-the-Middle (MitM)',
    postQ2Text: '2. 4 haneli PIN kodunun saniyeler içinde kırılabilmesinin ardındaki temel güvenlik zafiyeti neydi?',
    postQ2a: 'A) PIN kodunun çok kısa olması sebebiyle şifreleme algoritmalarının yetersiz kalması.',
    postQ2b: "B) API'nin ardışık hatalı denemeleri saymayarak sınırsız isteğe izin vermesi.",
    postQ2c: 'C) SMS doğrulama kodlarının ağ üzerinde düz metin olarak iletilmesi.',
    postQ2d: 'D) Sistemin hatalı girişlerde HTTP 404 hatası döndürmemesi.',
    postQ3Text: "3. 'Rate Limiting' uygulayan bir sunucu, sınırı aşan saldırgana hangi HTTP yanıt kodunu döndürmelidir?",
    postQ3a: 'A) HTTP 200 (OK)',
    postQ3b: 'B) HTTP 403 (Forbidden)',
    postQ3c: 'C) HTTP 429 (Too Many Requests)',
    postQ3d: 'D) HTTP 500 (Internal Server Error)',
    btnFinish: 'Modülü Tamamla',
  },
  en: {
    modTitle: 'A07: Authentication Failures',
    warnEmpty: 'Please answer all questions before proceeding.',
    alertResult: (pre, post) => `Module completed!\n\n📋 Pre-Test: ${pre}/100\n🏆 Post-Test: ${post}/100\n\nRedirecting to Dashboard...`,

    s1Title: 'Step 1: Pre-Test (Knowledge Assessment)',
    s1Desc: "Let's measure your current knowledge level.",
    preQ1Text: "Question 1: What is the primary security function of a 'Rate Limiting' mechanism?",
    preQ1a: 'A) To filter fast data traffic to prevent the server from crashing.',
    preQ1b: 'B) To restrict the maximum number of requests from the same IP within a timeframe.',
    preQ1c: 'C) To limit the size of incoming packets to the server.',
    preQ1d: 'D) To detect and block unauthorized port scans at the network layer.',
    preQ2Text: '2. If a system LACKS a Rate Limiting mechanism, which of the following occurs?',
    preQ2a: 'A) It becomes vulnerable to Brute-Force attacks.',
    preQ2b: 'B) It fails to block the entry of large-sized packets.',
    preQ2c: 'C) User sessions can be automatically hijacked by others.',
    preQ2d: 'D) Database encryption algorithms become solvable.',
    preQ3Text: '3. Why is rate limiting critical on 4 or 6-digit verification screens?',
    preQ3a: 'A) The lack of limitation causes memory leaks.',
    preQ3b: 'B) Multiple requests make the random number generator susceptible to manipulation.',
    preQ3c: 'C) Due to the narrow probability pool, unlimited tries rapidly exhaust the password space.',
    preQ3d: 'D) Verification servers do not support asymmetric encryption.',
    btnNext1: 'Finish Test & Go to Simulation',

    s2Title: 'Step 2: Vulnerability Simulation',
    s2Summary: "A07 – Identification and Authentication Failures covers weaknesses in authentication mechanisms. In this simulation you will experience a Rate Limiting failure firsthand: you'll launch a real Brute-Force attack on a crypto exchange's SMS verification screen.",
    gTitle: 'MISSION BRIEFING',
    gs1T: '1. Recon: Test the Limits',
    gs1D: "Test the system manually. Enter a random code (e.g., 1234) and click Verify. Does the system block us with 'Too many failed attempts'?",
    gs2T: '2. Arming (Open Hacker Tool)',
    gs2D: "The system didn't block us! We can't manually try all possibilities. Click the <b>\">_ Open Hacker Tool\"</b> button that appears below.",
    gs3T: '3. Brute-Force Attack',
    gs3D: "We'll use Hydra. Paste this command in the terminal and hit Enter:<br><code class='glitch-payload' style='font-size:13px; margin:8px 0; display:inline-block;'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: '4. Breach the Crypto Vault',
    gs4D: "The terminal will display the cracked PIN in green. Click <b>\"Return to Target\"</b>, enter the code, and hijack the wallet!",

    authDesc: 'Enter the <b>4-digit verification code</b> sent to your phone.',
    btnVerify: 'Verify and Log In',
    msgWarnMan: 'Invalid Code! NO rate limit detected. You can try infinitely.',
    msgWarnShort: 'Please enter a 4-digit code.',
    btnOpenTool: 'Open Hacker Tool',
    bfTarget: 'Target: api.novacrypto.com',
    inputCmd: 'hydra -l admin ...',
    btnAttack: 'Execute',
    btnBackTarget: 'Return to Target & Enter Code',
    bfTermReady: 'Hydra v9.4 (c) 2023 by van Hauser/THC<br>[INFO] Starting Brute-Force environment...<br><br>',
    cmdError: "Invalid command! Copy the exact 'hydra' command from the guide.",
    vaultTitle: '🔓 ACCESS GRANTED',
    vaultDesc: 'Welcome. 2FA verification bypassed successfully.',
    vaultLbl: 'Available Balance',
    vaultAuth: 'Transfer authorization active.',
    btnNext2: 'Analyze Attack (Go to Training)',

    s3Title: 'Step 3: Vulnerability Analysis',
    trnH1: 'What is A07? (Identification and Authentication Failures)',
    trnP1: "A07 covers vulnerabilities arising from incorrect implementation of authentication and session management functions. The flaw in the simulation is a textbook example of this category: The developer who built the SMS verification API never asked 'How many requests per second should this endpoint allow?' Neglecting this basic authentication security control left the system vulnerable to Brute-Force attacks.",
    trnH2: 'How Did Brute-Force Work?',
    trnP2: "An automated script attacked the API, trying a new PIN every millisecond starting from 0000. The system never got tired, never blocked, and simply returned 'Wrong' — until it found the correct code (8427). A 4-digit PIN has only 10,000 possibilities. Without rate limiting a computer exhausts that in seconds.",
    trnH4: 'What Did We Type in the Terminal?',
    trnP4: "The command <code class='code-accent'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code> was a simple instruction:<br><br>• <b>hydra:</b> A famous password-cracking tool used in cybersecurity.<br>• <b>-l admin:</b> The username of our target (login).<br>• <b>-P pins.txt:</b> A wordlist file with all possibilities from 0000 to 9999.<br>• <b>api.novacrypto...:</b> The address of the API we are attacking.<br><br><i>'Take these 10,000 possibilities and try them one by one until you find the right one!'</i>",
    trnH3: 'The Fix: Rate Limiting and Account Lockout',
    trnP3: 'Stopping Brute-Force requires API-level restriction — which is the right <b>authentication security</b> decision:<br><br><b>1. Rate Limiting:</b> Return an <b>HTTP 429 (Too Many Requests)</b> error after exceeding 5 requests per minute from one IP.<br><b>2. Account Lockout:</b> After 3 consecutive invalid codes, freeze the login process for 15 minutes.',
    btnNext3: 'Test Your Knowledge',

    s4Title: 'Step 4: Post-Test',
    s4Desc: "Let's reinforce what you learned.",
    postQ1Text: "Question 1: What type of attack did the 'Hydra' tool perform to bypass NovaCrypto's 4-digit verification?",
    postQ1a: 'A) SQL Injection (SQLi)',
    postQ1b: 'B) Brute-Force',
    postQ1c: 'C) Cross-Site Scripting (XSS)',
    postQ1d: 'D) Man-in-the-Middle (MitM)',
    postQ2Text: '2. What was the fundamental security flaw that allowed the PIN to be cracked in seconds?',
    postQ2a: 'A) The encryption algorithms being insufficient due to the short PIN.',
    postQ2b: 'B) The API allowing unlimited requests without tracking failed attempts from an IP.',
    postQ2c: 'C) SMS codes being transmitted as plaintext over the network.',
    postQ2d: 'D) The system failing to return an HTTP 404 error on incorrect entries.',
    postQ3Text: "3. Which HTTP status code should a Rate Limiting server return to an attacker exceeding the limit?",
    postQ3a: 'A) HTTP 200 (OK)',
    postQ3b: 'B) HTTP 403 (Forbidden)',
    postQ3c: 'C) HTTP 429 (Too Many Requests)',
    postQ3d: 'D) HTTP 500 (Internal Server Error)',
    btnFinish: 'Complete Module',
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
    localStorage.setItem(`cf_draft_answers_${userEmail}`, JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  if (!userEmail || !token) { router.push('/'); return; }

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data && result.data.cf_answers) {
        Object.assign(answers, result.data.cf_answers);
      }
    } catch (_) {}
  } else {
    const savedDraft = localStorage.getItem(`cf_draft_answers_${userEmail}`);
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }

  terminalLogs.value = currentText.value.bfTermReady;
  isLoading.value = false;
});

onBeforeUnmount(() => {
  if (attackIntervalRef) clearInterval(attackIntervalRef);
});

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    alert(currentText.value.warnEmpty);
    return;
  }
  currentStep.value = 2;
};

const moveFocus = (e, nextId, prevId) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
  if (e.target.value && nextId) {
    if (nextId === 'refP2') refP2.value.focus();
    else if (nextId === 'refP3') refP3.value.focus();
    else if (nextId === 'refP4') refP4.value.focus();
  }
};

const handleDelete = (e, prevId) => {
  if (e.key === 'Backspace' && e.target.value === '' && prevId) {
    if (prevId === 'refP1') refP1.value.focus();
    else if (prevId === 'refP2') refP2.value.focus();
    else if (prevId === 'refP3') refP3.value.focus();
  }
};

const verifyPin = () => {
  const currentPin = pin1.value + pin2.value + pin3.value + pin4.value;
  if (currentPin.length < 4) {
    simWarning.value = currentText.value.msgWarnShort;
    return;
  }
  if (currentPin === targetPin) {
    activeWindow.value = 'vault';
    currentMission.value = 5;
  } else {
    simWarning.value = currentText.value.msgWarnMan;
    if (currentMission.value === 1) currentMission.value = 2;
  }
};

const openHackerTool = () => {
  activeWindow.value = 'hacker';
  if (currentMission.value === 2) currentMission.value = 3;
};

const checkHackerCmd = () => {
  const cmd = hackerCmd.value.trim().toLowerCase();
  if (cmd.includes('hydra') && cmd.includes('pins.txt')) {
    startAttack();
  } else {
    alert(currentText.value.cmdError);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalContainer.value) {
      terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
    }
  });
};

const startAttack = () => {
  if (isAttacking.value) return;
  isAttacking.value = true;

  terminalLogs.value = `Hydra (https://github.com/vanhauser-thc/thc-hydra) starting...<br>`;
  terminalLogs.value += `[WARNING] Many servers use rate limiting or lockout. Testing...<br>`;
  terminalLogs.value += `[DATA] max 16 tasks per 1 server, overall 16 tasks, 10000 login tries (l:1/p:10000)<br>`;
  terminalLogs.value += `[DATA] attacking api.novacrypto.com:443/verify<br><br>`;

  let currentGuess = 8400;
  const targetInt = parseInt(targetPin);

  attackIntervalRef = setInterval(() => {
    const pinStr = currentGuess.toString().padStart(4, '0');
    if (currentGuess === targetInt) {
      clearInterval(attackIntervalRef);
      attackIntervalRef = null;
      terminalLogs.value += `[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}<br>`;
      terminalLogs.value += `<span style="color:#22c55e; font-weight:bold;">[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}  [SUCCESS]</span><br><br>`;
      terminalLogs.value += `1 of 1 target successfully completed, 1 valid password found<br>`;
      terminalLogs.value += `Hydra (https://github.com/vanhauser-thc/thc-hydra) finished.<br>`;
      scrollToBottom();
      setTimeout(() => {
        isCracked.value = true;
        isAttacking.value = false;
        currentMission.value = 4;
      }, 1000);
    } else {
      terminalLogs.value += `<span style="color:#4b5563;">[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}</span><br>`;
      scrollToBottom();
      currentGuess++;
    }
  }, 40);
};

const backToTarget = () => {
  activeWindow.value = 'crypto';
  pin1.value = ''; pin2.value = ''; pin3.value = ''; pin4.value = '';
  simWarning.value = '';
};

const calculateScore = (testPrefix) => {
  let score = 0;
  if (answers[`${testPrefix}Q1`] === answerKeys[testPrefix].q1) score += 33.33;
  if (answers[`${testPrefix}Q2`] === answerKeys[testPrefix].q2) score += 33.33;
  if (answers[`${testPrefix}Q3`] === answerKeys[testPrefix].q3) score += 33.34;
  return Math.round(score);
};

const finishPostTest = async () => {
  if (isReviewMode.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push('/dashboard');
    return;
  }
  if (!answers.postQ1 || !answers.postQ2 || !answers.postQ3) {
    alert(currentText.value.warnEmpty);
    return;
  }

  const preScore = calculateScore('pre');
  const postScore = calculateScore('post');
  isSaving.value = true;

  try {
    await fetch('/api/save-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: userEmail, module: 'cf', preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem(`cf_draft_answers_${userEmail}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push('/dashboard');
  } catch (_) {
    alert('Skor kaydedilirken hata oluştu!');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* ─── GENEL TEMEL ─── */
.module-wrapper { background-color: #0b0f19; color: #cbd5e1; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.container { width: 100%; max-width: 950px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #f59e0b; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* ─── BAŞLIK ─── */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #f59e0b, transparent); margin-bottom: 35px; }
.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #f59e0b; padding-left: 15px; margin-bottom: 10px; }
.step-desc { font-size: 15px; color: #94a3b8; margin-bottom: 25px; }
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* ─── SORULAR ─── */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #f59e0b; }
.options label input:disabled { cursor: not-allowed; }
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* ─── SİMÜLASYON LAYOUT (TEK SÜTUN) ─── */
.mission-layout { display: flex; flex-direction: column; gap: 30px; margin-top: 20px; }

.guide-panel { display: flex; flex-direction: column; gap: 20px; width: 100%; }
.summary-box { background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 0 8px 8px 0; color: #fde68a; }
.summary-box p { margin: 0; font-style: italic; font-size: 15px; line-height: 1.6; }

.mission-briefing { background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; overflow: hidden; }
.brief-header { background: #1e293b; padding: 12px 20px; color: #f8fafc; font-size: 14px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #334155; }
.pulse-icon { width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; box-shadow: 0 0 10px #f59e0b; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
.brief-body { padding: 20px 25px; display: flex; flex-direction: column; gap: 12px; }

.guide-step { padding: 14px 18px; border-radius: 8px; border: 1px solid #334155; background: rgba(15, 23, 42, 0.4); transition: 0.3s; opacity: 0.45; }
.guide-step.current { opacity: 1; border-color: #f59e0b; background: rgba(245, 158, 11, 0.06); box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.05); }
.guide-step.done { opacity: 0.6; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #fcd34d; margin-bottom: 6px; font-size: 14px; }
.guide-step p { margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; }
code.glitch-payload { background: #000; padding: 4px 10px; border-radius: 4px; border: 1px solid #f59e0b; color: #fcd34d; font-family: monospace; font-weight: bold; font-size: 13px; }

/* ─── UYGULAMA PANELİ ─── */
.app-container { display: flex; flex-direction: column; align-items: center; width: 100%; }

.crypto-window { background: #111827; border-radius: 12px; border: 1px solid #374151; overflow: hidden; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 520px; }
.crypto-header { background: #1f2937; padding: 15px; border-bottom: 1px solid #374151; font-weight: bold; font-size: 18px; color: #f59e0b; }
.crypto-body { padding: 40px 30px; display: flex; flex-direction: column; align-items: center; }
.crypto-desc { color: #94a3b8; font-size: 15px; margin: 0 0 20px 0; }
.pin-box { display: flex; gap: 10px; margin: 25px 0; justify-content: center; }
.pin-input { width: 50px; height: 60px; font-size: 28px; text-align: center; border-radius: 8px; border: 2px solid #4b5563; background: #1f2937; color: white; outline: none; font-weight: bold; transition: 0.3s; }
.pin-input:focus { border-color: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
.btn-verify { padding: 14px 30px; background: #f59e0b; color: #111827; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; transition: 0.3s; width: 100%; max-width: 300px; text-transform: uppercase; }
.btn-verify:hover { background: #fbbf24; transform: translateY(-2px); }
.warning-msg { color: #ef4444; font-size: 13px; font-weight: bold; margin-top: 15px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 6px; width: 100%; max-width: 300px; border: 1px solid rgba(239,68,68,0.3); }
.btn-hacker-tool { background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; max-width: 300px; transition: 0.3s; margin-top: 30px; text-transform: uppercase; letter-spacing: 2px; font-family: "Consolas", monospace; }
.btn-hacker-tool:hover { background: rgba(239, 68, 68, 0.1); box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); transform: translateY(-2px); }

.bruteforce-window { background: #000000; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 0 30px rgba(0,0,0,0.5); width: 100%; max-width: 750px; }
.bf-header { background: #1e293b; padding: 8px 15px; color: #94a3b8; font-weight: bold; display: flex; justify-content: space-between; font-family: "Consolas", monospace; font-size: 12px; border-bottom: 1px solid #334155; }
.bf-target-txt { color: #ef4444; }
.bf-terminal { padding: 15px; height: 250px; overflow-y: auto; color: #cbd5e1; font-family: "Consolas", monospace; font-size: 12px; line-height: 1.4; }
.bf-cmd-line { padding: 10px 15px; background: #050505; border-top: 1px solid #334155; display: flex; gap: 8px; align-items: center; }
.prompt-user { color: #ef4444; font-weight: bold; font-family: "Consolas", monospace; font-size: 13px; }
.prompt-dir { color: #f59e0b; font-weight: bold; font-family: "Consolas", monospace; font-size: 13px; margin-right: 5px; }
.bf-cmd-line input { flex-grow: 1; background: transparent; border: none; color: #f8fafc; font-family: "Consolas", monospace; font-size: 13px; outline: none; }
.btn-attack { background: #1e293b; color: white; border: 1px solid #475569; padding: 6px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 11px; transition: 0.2s; }
.btn-attack:hover { background: #334155; }
.btn-success-override { background: #10b981; border-color: #059669; color: #000; }
.btn-success-override:hover { background: #059669; color: #fff; }

.vault-panel { background: #0f172a; padding: 50px 30px; border-radius: 12px; color: white; text-align: center; border: 2px solid #10b981; box-shadow: 0 0 40px rgba(16, 185, 129, 0.2); width: 100%; max-width: 520px; }
.vault-title { color: #10b981; margin-top: 0; font-size: 28px; }
.vault-desc { font-size: 15px; color: #cbd5e1; margin-bottom: 25px; }
.balance-box { background: #1e293b; padding: 25px; border-radius: 8px; margin-top: 20px; border: 1px solid #334155; }
.vault-lbl { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
.balance-amount { font-size: 42px; font-weight: bold; color: #f59e0b; margin: 15px 0; font-family: monospace; }
.vault-auth { color: #10b981; font-size: 14px; font-weight: bold; }

/* ─── EĞİTİM ─── */
.edu-card { background: transparent; }
.edu-heading { margin-top: 0; font-size: 20px; margin-bottom: 15px; }
.edu-desc { font-size: 15px; line-height: 1.7; color: #cbd5e1; margin-bottom: 20px; }
.amber-text { color: #f59e0b; }
.red-text { color: #ef4444; }
.green-text { color: #10b981; }
.blue-text { color: #38bdf8; }
.code-accent { color: #fcd34d; background: #000; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; border: 1px solid #f59e0b; }

/* ─── BUTONLAR ─── */
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; width: 100%; }
.action-footer.space-between { justify-content: space-between; }
button { font-family: inherit; }
.btn-primary { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #d97706; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4); }
.btn-secondary { background: #334155; color: #f8fafc; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-secondary:hover { background: #475569; }
.btn-success { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-success:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* ─── ANİMASYONLAR ─── */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(245, 158, 11, 0.2); border-top-color: #f59e0b; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
