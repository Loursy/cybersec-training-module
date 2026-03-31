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
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Ön-Test Analizi' : '🔍 Review Mode: Pre-Test Analysis') : currentText.preTitle }}
          </h2>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'pre'+index">
            <p><b v-html="currentText[`qPre${q}`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" :class="getLabelClass('pre', `q${q}`, opt)">
                <input type="radio" v-model="answers[`preQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`optPre${q}_${opt === 'a' ? 1 : opt === 'b' ? 2 : opt === 'c' ? 3 : 4}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer" style="justify-content: flex-end;">
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

              <div class="action-footer" style="justify-content: center;">
                <button v-if="activeWindow === 'vault' || isReviewMode" class="btn-success fade-in" @click="currentStep = 3">
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
            <p class="edu-desc">{{ currentText.trnDesc }}</p>
            
            <div style="margin-top: 20px; margin-bottom: 30px; text-align: center;">
               
            </div>

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

            <div class="flow-step">
              <div class="flow-num step-blue">3</div>
              <div>
                <b class="step-title-text blue-text">{{ currentText.trnH4 }}</b>
                <p class="step-desc-text" v-html="currentText.trnP4"></p>
              </div>
            </div>

            <div class="solution-box">
              <b class="solution-title">{{ currentText.trnH3 }}</b>
              <p class="solution-desc" v-html="currentText.trnP3"></p>
              <div style="margin-top: 25px; text-align: center;">
                 
              </div>
            </div>
          </div>

          <div class="action-footer" style="justify-content: flex-end;">
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
              <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" :class="getLabelClass('post', `q${q}`, opt)">
                <input type="radio" v-model="answers[`postQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`optPost${q}_${opt === 'a' ? 1 : opt === 'b' ? 2 : opt === 'c' ? 3 : 4}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer" style="justify-content: flex-end;">
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
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

const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// Simülasyon Değişkenleri
const currentMission = ref(1);
const activeWindow = ref('crypto'); // crypto, hacker, vault
const targetPin = "8427"; // Hedef kırılacak şifre
const simWarning = ref('');

// PIN Input refs
const pin1 = ref(''); const pin2 = ref(''); const pin3 = ref(''); const pin4 = ref('');
const refP1 = ref(null); const refP2 = ref(null); const refP3 = ref(null); const refP4 = ref(null);

const hackerCmd = ref('');
const isAttacking = ref(false);
const isCracked = ref(false);
const terminalLogs = ref('');
const terminalContainer = ref(null);

const answerKeys = {
  pre: { q1: "b", q2: "a", q3: "c" },
  post: { q1: "b", q2: "b", q3: "c" },
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 5: Rate Limiting (Hız Sınırlandırma)",
    preTitle: "Ön-Test",
    
    qPre1: "1. 'Rate Limiting' mekanizmasının temel güvenlik işlevi aşağıdakilerden hangisidir?",
    optPre1_1: "A) Sunucunun çökmemesi adına çok hızlı veri trafiğini filtrelemek veya yavaşlatmak.",
    optPre1_2: "B) Belirli bir zaman diliminde aynı IP veya kullanıcıdan gelen maksimum istek sayısını kısıtlamak.",
    optPre1_3: "C) Sunucuya gelen paketlerin boyutunu limitlemek.",
    optPre1_4: "D) Ağ katmanındaki yetkisiz port taramalarını tespit edip engellemek.",
    
    qPre2: "2. Bir sistemde Rate Limiting mekanizmasının BULUNMAMASI durumunda, aşağıdakilerden hangisi gerçekleşir?",
    optPre2_1: "A) Sistem, Brute-Force saldırılarına açık hale gelir.",
    optPre2_2: "B) Büyük boyutlu paketlerin girişi engellenemez.",
    optPre2_3: "C) Kullanıcı oturumları (session) otomatik olarak başkası tarafından ele geçirilebilir.",
    optPre2_4: "D) Veritabanı şifreleme algoritmaları çözülebilir hale gelir.",
    
    qPre3: "3. Özellikle 4 veya 6 haneli doğrulama ekranlarında hız sınırlandırması neden kritik bir zorunluluktur?",
    optPre3_1: "A) Sınırlandırma eksikliği, sistemin bellek sızıntısı (memory leak) yaşamasına neden olur.",
    optPre3_2: "B) Çoklu isteklerin, rastgele sayı üretecini (RNG) manipüle edilebilir duruma getirmesi.",
    optPre3_3: "C) İhtimal havuzunun dar olması sebebiyle, sınırsız deneme imkanının şifre uzayını hızla tüketmesi.",
    optPre3_4: "D) Doğrulama sunucularının eşzamanlı bağlantılarda asimetrik şifrelemeyi desteklememesi.",
    
    btnPre: "Simülasyona Başla",

    simTitle: "Adım 2: Zafiyet Sömürüsü (Brute-Force)",
    gTitle: "📋 Operasyon Dosyası",
    gDesc: "Hedef: <b>Nova Kripto Borsası</b>. Kurbanın şifresini bulduk ancak karşımıza 4 haneli bir SMS Onay Ekranı (2FA) çıktı. Doğru kodu bulmalıyız!",
    gs1T: "1. Keşif: Sınırları Test Et",
    gs1D: "Önce sistemi manuel test et. Rastgele 4 haneli bir kod (örn: 1234) girip doğrula de. Hata mesajını oku. Acaba sistem bizi 'Çok fazla hatalı deneme' diyerek engelleyecek mi?",
    gs2T: "2. Silahlanma (Hacker Aracı)",
    gs2D: "Sistem engellemedi! Manuel olarak binlerce ihtimali deneyemeyiz. Aşağıda yeni beliren <b>\">_ Hacker Aracını Aç\"</b> butonuna tıkla.",
    gs3T: "3. Kaba Kuvvet (Brute-Force)",
    gs3D: "Saldırıyı başlatmak için siber güvenlik dünyasının meşhur aracı Hydra'yı kullanacağız. Terminale şu komutu yapıştır ve Enter'a bas:<br><br><code class='highlight'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: "4. Kripto Kasasına Sız",
    gs4D: "Terminal saniyeler içinde binlerce istek atacak. Bulduğu yeşil renkli doğru PIN kodunu aklında tut. <b>\"Hedefe Dön\"</b> butonuna basıp kodu manuel girerek cüzdanı ele geçir!",

    authDesc: "Giriş yapmak için telefonunuza gelen <b>4 haneli onay kodunu</b> giriniz.",
    btnVerify: "Doğrula ve Giriş Yap",
    msgWarnMan: "Hatalı Kod! Sistemde sınırlandırma YOK. Sonsuz deneme yapabilirsiniz.",
    msgWarnShort: "Lütfen 4 haneli bir kod girin.",
    btnOpenTool: "Hacker Aracını Aç",

    bfTarget: "Hedef: api.novacrypto.com",
    inputCmd: "hydra -l admin ...",
    btnAttack: "Çalıştır",
    btnBackTarget: "Hedefe Dön & Kodu Gir",
    bfTermReady: "Hydra v9.4 (c) 2023 by van Hauser/THC<br>[INFO] Starting Brute-Force environment...<br><br>",
    cmdError: "Hatalı komut! Lütfen görev rehberindeki 'hydra' komutunu tam olarak kopyalayıp yapıştırın.",

    vaultTitle: "🔓 ERİŞİM ONAYLANDI",
    vaultDesc: "Hoş geldiniz. 2FA doğrulaması başarıyla aşıldı.",
    vaultLbl: "Kullanılabilir Bakiye",
    vaultAuth: "Transfer yetkisi aktif.",

    btnToTrn: "GÖREVLER BAŞARILI - ANALİZE GEÇ",
    trnTitle: "Adım 3: Teknik Analiz - Sistem Nasıl Çöktü?",
    trnDesc: "4 haneli bir şifrenin güvenli olmasının tek sebebi, insanın 10.000 ihtimali elle deneyemeyecek olmasıdır. Ancak karşımızda bilgisayar programı vardı. İşte arka planda yaşananlar:",
    trnH1: "Sınırların Olmaması (Lack of Rate Limiting)",
    trnP1: "Yazılımcı, girilen kodun doğruluğunu kontrol eden bir API yazdı ama bir kullanıcının o API'ye 1 saniyede kaç kere istek atabileceğini kontrol etmedi.",
    trnH2: "Kaba Kuvvetin Gücü (Brute-Force)",
    trnP2: "Otomatik bir script API'ye saldırdı. 0000'dan başlayarak her milisaniyede yeni kod denedi. Sistem yorulmadı, engellemedi ve sadece 'Yanlış' döndü. Ta ki doğru kodu görene kadar.",
    
    trnH4: "Peki O Siyah Ekrana Ne Yazdık?",
    trnP4: "Terminale yazdığımız <code class='code-yellow'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code> komutu aslında araca verdiğimiz çok basit bir talimattı:<br><br>• <b>hydra:</b> Siber güvenlikte kullanılan meşhur şifre deneme aracının adı.<br>• <b>-l admin:</b> Hedefimizdeki kullanıcının adı (login).<br>• <b>-P pins.txt:</b> İçinde 0000'dan 9999'a kadar tüm ihtimallerin olduğu bir metin dosyası.<br>• <b>api.novacrypto...:</b> Saldıracağımız kapının adresi.<br><br>Kısacası araca dedik ki: <i>'Al bu 10 bin ihtimali, doğru olanı bulana kadar o adreste teker teker dene!'</i>",

    trnH3: "🛡️ Kesin Çözüm: Rate Limiting ve Account Lockout",
    trnP3: "Brute-Force saldırılarını durdurmanın en kesin yolu API seviyesinde kısıtlamaktır.<br><br><b>1. Rate Limiting:</b> Bir IP adresi 1 dakikada sadece 5 istek yapabilir. Fazlasında sistem <b>HTTP 429 (Too Many Requests)</b> hatası vermelidir.<br><b>2. Account Lockout:</b> Arka arkaya 3 hatalı koddan sonra giriş işlemi 15 dakikalığına tamamen dondurulmalıdır.",
    btnToPost: "Tüm Detayları Anladım -> Son Teste Geç",

    postTitle: "Son-Test",
    
    qPost1: "1. Simülasyonda 'NovaCrypto' borsasının 4 haneli onay ekranını aşmak için kullandığımız 'Hydra' aracı hangi saldırı türünü gerçekleştirmiştir?",
    optPost1_1: "A) SQL Injection (SQLi)",
    optPost1_2: "B) Brute-Force (Kaba Kuvvet)",
    optPost1_3: "C) Cross-Site Scripting (XSS)",
    optPost1_4: "D) Man-in-the-Middle (MitM)",
    
    qPost2: "2. 4 haneli bir PIN kodunun (10.000 ihtimal) saniyeler içinde kırılabilmesinin ardındaki temel güvenlik zafiyeti neydi?",
    optPost2_1: "A) PIN kodunun çok kısa olması sebebiyle şifreleme algoritmalarının yetersiz kalması.",
    optPost2_2: "B) API'nin, bir IP adresinden gelen ardışık hatalı denemeleri saymayarak sınırsız isteğe izin vermesi.",
    optPost2_3: "C) SMS doğrulama kodlarının ağ üzerinde düz metin (plaintext) olarak iletilmesi.",
    optPost2_4: "D) Sistemin hatalı girişlerde HTTP 404 (Not Found) hatası döndürmemesi.",
    
    qPost3: "3. Bu zafiyeti gidermek için 'Rate Limiting' uygulayan bir sunucu, sınırı aşan saldırgana hangi HTTP yanıt kodunu döndürmelidir?",
    optPost3_1: "A) HTTP 200 (OK)",
    optPost3_2: "B) HTTP 403 (Forbidden)",
    optPost3_3: "C) HTTP 429 (Too Many Requests)",
    optPost3_4: "D) HTTP 500 (Internal Server Error)",
    
    btnPost: "Eğitimi Bitir",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 5: Rate Limiting",
    preTitle: "Pre-Test",
    
    qPre1: "1. What is the primary security function of a 'Rate Limiting' mechanism?",
    optPre1_1: "A) To filter or slow down very fast data traffic to prevent the server from crashing.",
    optPre1_2: "B) To restrict the maximum number of requests coming from the same IP or user within a specific timeframe.",
    optPre1_3: "C) To limit the size of incoming packets to the server.",
    optPre1_4: "D) To detect and block unauthorized port scans at the network layer.",
    
    qPre2: "2. If a system LACKS a Rate Limiting mechanism, which of the following occurs?",
    optPre2_1: "A) It becomes vulnerable to Brute-Force attacks.",
    optPre2_2: "B) It fails to block the entry of large-sized packets.",
    optPre2_3: "C) User sessions can be automatically hijacked by others.",
    optPre2_4: "D) Database encryption algorithms become solvable.",
    
    qPre3: "3. Why is rate limiting a critical necessity on 4 or 6-digit verification screens?",
    optPre3_1: "A) The lack of limitation causes the system to experience memory leaks.",
    optPre3_2: "B) Multiple requests make the random number generator (RNG) susceptible to manipulation.",
    optPre3_3: "C) Due to the narrow probability pool, unlimited trial opportunities rapidly exhaust the password space.",
    optPre3_4: "D) Verification servers do not support asymmetric encryption during concurrent connections.",
    
    btnPre: "Start Simulation",

    simTitle: "Step 2: Exploit Simulation",
    gTitle: "📋 Operation File",
    gDesc: "Target: <b>Nova Crypto Exchange</b>. We found the victim's password but hit a 4-digit verification screen (2FA). There are 10,000 possibilities. Find the right code!",
    gs1T: "1. Recon: Test the Limits",
    gs1D: "First, manually test the system. Enter a random 4-digit code (e.g., 1234) and click Verify. Does the system block us saying 'Too many failed attempts'?",
    gs2T: "2. Arming (Hacker Tool)",
    gs2D: "The system didn't block us! We can't manually try 10,000 possibilities. Click the <b>\">_ Open Hacker Tool\"</b> button below to access the terminal.",
    gs3T: "3. Brute-Force Attack",
    gs3D: "To launch the attack, copy this Hydra command into the terminal and hit Enter:<br><br><code class='highlight'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: "4. Breach the Crypto Vault",
    gs4D: "The terminal will blast thousands of requests. Memorize the green correct PIN code. Click <b>\"Return to Target\"</b> and enter that code manually to hijack the wallet!",

    authDesc: "Please enter the <b>4-digit verification code</b> sent to your phone.",
    btnVerify: "Verify and Log In",
    msgWarnMan: "Invalid Code! NO rate limit detected. You can try infinitely.",
    msgWarnShort: "Please enter a 4-digit code.",
    btnOpenTool: "Open Hacker Tool",

    bfTarget: "Target: api.novacrypto.com",
    inputCmd: "hydra -l admin ...",
    btnAttack: "Execute",
    btnBackTarget: "Return to Target & Enter Code",
    bfTermReady: "Hydra v9.4 (c) 2023 by van Hauser/THC<br>[INFO] Starting Brute-Force environment...<br><br>",
    cmdError: "Invalid command! Please copy the exact 'hydra' command from the guide.",

    vaultTitle: "🔓 ACCESS GRANTED",
    vaultDesc: "Welcome. 2FA verification bypassed successfully.",
    vaultLbl: "Available Balance",
    vaultAuth: "Transfer authorization active.",

    btnToTrn: "MISSIONS SUCCESSFUL - GO TO ANALYSIS",
    trnTitle: "Step 3: Technical Analysis - How the System Crashed?",
    trnDesc: "A 4-digit password is only secure because a human cannot try 10,000 possibilities. We used a computer. Here is what happened:",
    trnH1: "Lack of Rate Limiting",
    trnP1: "The developer wrote an API that checks the code, but failed to check how many requests a user can send to that API in 1 second.",
    trnH2: "The Power of Brute-Force",
    trnP2: "An automated script attacked the API, trying a new code every millisecond. The system didn't block it, until it saw the correct code.",
    
    trnH4: "What Exactly Did We Type in the Terminal?",
    trnP4: "The command <code class='code-yellow'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code> was actually a very simple instruction given to the tool:<br><br>• <b>hydra:</b> The name of a famous password-cracking tool used in cybersecurity.<br>• <b>-l admin:</b> The username of our target (login).<br>• <b>-P pins.txt:</b> A text file (wordlist) containing all possibilities from 0000 to 9999.<br>• <b>api.novacrypto...:</b> The address of the door we are attacking.<br><br>In short, we told the tool: <i>'Take these 10,000 possibilities and try them one by one at that address until you find the right one!'</i>",

    trnH3: "🛡️ Ultimate Solution: Rate Limiting and Account Lockout",
    trnP3: "The definitive way to stop Brute-Force is API-level restriction.<br><br><b>1. Rate Limiting:</b> Return an <b>HTTP 429 (Too Many Requests)</b> error if limits are exceeded.<br><b>2. Account Lockout:</b> After 3 invalid codes, freeze the login process for 15 minutes.",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    
    qPost1: "1. What type of attack did we perform using the 'Hydra' tool to bypass NovaCrypto's 4-digit SMS verification screen in the simulation?",
    optPost1_1: "A) SQL Injection (SQLi)",
    optPost1_2: "B) Brute-Force",
    optPost1_3: "C) Cross-Site Scripting (XSS)",
    optPost1_4: "D) Man-in-the-Middle (MitM)",
    
    qPost2: "2. What was the fundamental security flaw that allowed a 4-digit PIN (10,000 possibilities) to be cracked in seconds?",
    optPost2_1: "A) The encryption algorithms being insufficient due to the PIN being too short.",
    optPost2_2: "B) The API allowing unlimited requests without tracking consecutive failed attempts from an IP.",
    optPost2_3: "C) SMS verification codes being transmitted as plaintext over the network.",
    optPost2_4: "D) The system failing to return an HTTP 404 (Not Found) error on incorrect entries.",
    
    qPost3: "3. To mitigate this vulnerability, which HTTP status code should a server implementing 'Rate Limiting' return to an attacker exceeding the limit?",
    optPost3_1: "A) HTTP 200 (OK)",
    optPost3_2: "B) HTTP 403 (Forbidden)",
    optPost3_3: "C) HTTP 429 (Too Many Requests)",
    optPost3_4: "D) HTTP 500 (Internal Server Error)",
    
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

// DİKKAT: KAYDEDERKEN E-POSTA EKLENDİ
watch(answers, (newAnswers) => {
  if (!isReviewMode.value && userEmail) {
    localStorage.setItem(`rate_draft_answers_${userEmail}`, JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  if (!userEmail || !token) return router.push('/'); // Güvenlik Kalkanı

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data && result.data.rate_answers) {
        Object.assign(answers, result.data.rate_answers);
      }
    } catch (error) {}
  } else {
    // DİKKAT: YÜKLERKEN E-POSTA EKLENDİ
    const savedDraft = localStorage.getItem(`rate_draft_answers_${userEmail}`);
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }
  
  terminalLogs.value = currentText.value.bfTermReady;
  isLoading.value = false;
});

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    return alert(currentText.value.warnEmpty);
  }
  currentStep.value = 2; 
};

// --- SIMULATION LOGIC ---
const moveFocus = (e, nextId, prevId) => {
  const val = e.target.value;
  e.target.value = val.replace(/[^0-9]/g, '');
  
  if (e.target.value && nextId) {
    if(nextId === 'refP2') refP2.value.focus();
    else if(nextId === 'refP3') refP3.value.focus();
    else if(nextId === 'refP4') refP4.value.focus();
  }
};

const handleDelete = (e, prevId) => {
  if (e.key === 'Backspace' && e.target.value === '' && prevId) {
    if(prevId === 'refP1') refP1.value.focus();
    else if(prevId === 'refP2') refP2.value.focus();
    else if(prevId === 'refP3') refP3.value.focus();
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
    if (currentMission.value === 1) {
      currentMission.value = 2;
    }
  }
};

const openHackerTool = () => {
  activeWindow.value = 'hacker';
  if (currentMission.value === 2) currentMission.value = 3;
};

const checkHackerCmd = () => {
  const cmd = hackerCmd.value.trim().toLowerCase();
  if (cmd.includes("hydra") && cmd.includes("pins.txt")) {
    startAttack();
  } else {
    alert(currentText.value.cmdError);
  }
};

// YENİLENMİŞ GERÇEKÇİ HYDRA TERMİNAL SİMÜLASYONU
const startAttack = () => {
  if (isAttacking.value) return;
  isAttacking.value = true;
  
  // Terminal Başlangıç Logları
  terminalLogs.value = `Hydra (https://github.com/vanhauser-thc/thc-hydra) starting...<br>`;
  terminalLogs.value += `[WARNING] Many servers use rate limiting or lockout. Testing...<br>`;
  terminalLogs.value += `[DATA] max 16 tasks per 1 server, overall 16 tasks, 10000 login tries (l:1/p:10000), ~625 tries per task<br>`;
  terminalLogs.value += `[DATA] attacking api.novacrypto.com:443/verify<br><br>`;
  
  let currentGuess = 8400; // Simülasyonu hızlandırmak için hedefe (8427) yakın başlattık
  const targetInt = parseInt(targetPin);

  const attackInterval = setInterval(() => {
    const pinStr = currentGuess.toString().padStart(4, "0");

    if (currentGuess === targetInt) {
      clearInterval(attackInterval);
      // Başarılı deneme logu (Gerçekçi Hydra formatı)
      terminalLogs.value += `[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}<br>`;
      terminalLogs.value += `<span style="color:#22c55e; font-weight:bold; font-size:14px;">[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}  [SUCCESS]</span><br><br>`;
      terminalLogs.value += `1 of 1 target successfully completed, 1 valid password found<br>`;
      terminalLogs.value += `Hydra (https://github.com/vanhauser-thc/thc-hydra) finished.<br>`;
      
      scrollToBottom();
      
      setTimeout(() => {
        isCracked.value = true;
        isAttacking.value = false;
        currentMission.value = 4;
      }, 1000);
    } else {
      // Başarısız deneme logu (Gerçekçi Hydra formatı)
      terminalLogs.value += `<span style="color:#cbd5e1;">[443][https-post-form] host: api.novacrypto.com   login: admin   password: ${pinStr}</span><br>`;
      scrollToBottom();
      currentGuess++;
    }
  }, 40); // 40 milisaniyede bir atıyor (Çok hızlı Matrix hissiyatı)
};

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalContainer.value) {
      terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
    }
  });
};

const backToTarget = () => {
  activeWindow.value = 'crypto';
  pin1.value = ''; pin2.value = ''; pin3.value = ''; pin4.value = '';
  simWarning.value = '';
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
    await fetch(`/api/save-score`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: userEmail, module: "rate", preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    // DİKKAT: SİLERKEN E-POSTA EKLENDİ
    localStorage.removeItem(`rate_draft_answers_${userEmail}`); 
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
.container { width: 100%; max-width: 950px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #f59e0b; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #f59e0b, transparent); margin-bottom: 35px; }

.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #f59e0b; padding-left: 15px; margin-bottom: 25px; }
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* Sorular ve Seçenekler */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #f59e0b; }
.options label input:disabled { cursor: not-allowed; }

/* İnceleme Modu Renkleri */
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* GÖREV REHBERİ (Adım 2) */
.mission-layout { display: grid; grid-template-columns: 350px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-title { margin-top: 0; color: #f8fafc; font-size: 18px; margin-bottom: 10px; }
.guide-desc { font-size: 14px; margin-bottom: 20px; color: #94a3b8; line-height: 1.6; }
.guide-step { padding: 15px; border-radius: 8px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; }
.guide-step.current { opacity: 1; background: rgba(245, 158, 11, 0.05); border: 1px solid #f59e0b; box-shadow: inset 0 0 15px rgba(245, 158, 11, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #fcd34d; margin-bottom: 8px; font-size: 14px; }
.guide-step p { margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; }
code.highlight { background: #000; color: #f59e0b; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #334155; }

/* UYGULAMA PANELİ (Adım 2 Sağ Taraf) */
.app-container { display: flex; flex-direction: column; gap: 15px; position: relative; }

/* 1. HEDEF: Kripto Cüzdan 2FA Ekranı */
.crypto-window { background: #111827; border-radius: 12px; border: 1px solid #374151; overflow: hidden; display: flex; flex-direction: column; color: #f8fafc; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center;}
.crypto-header { background: #1f2937; padding: 15px; border-bottom: 1px solid #374151; font-weight: bold; font-size: 18px; color: #f59e0b; display: flex; justify-content: center; align-items: center; gap: 10px; }
.crypto-body { padding: 40px 30px; display: flex; flex-direction: column; align-items: center; }
.crypto-desc { color: #94a3b8; font-size: 15px; margin: 0 0 20px 0; }

.pin-box { display: flex; gap: 10px; margin: 25px 0; justify-content: center; }
.pin-input { width: 50px; height: 60px; font-size: 28px; text-align: center; border-radius: 8px; border: 2px solid #4b5563; background: #1f2937; color: white; outline: none; font-weight: bold; transition: 0.3s; }
.pin-input:focus { border-color: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }

.btn-verify { padding: 14px 30px; background: #f59e0b; color: #111827; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; transition: 0.3s; width: 100%; max-width: 300px; text-transform: uppercase;}
.btn-verify:hover { background: #fbbf24; transform: translateY(-2px); }
.warning-msg { color: #ef4444; font-size: 13px; font-weight: bold; margin-top: 15px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 6px; width: 100%; max-width: 300px; border: 1px solid rgba(239,68,68,0.3);}

/* Hacker Aracı Butonu */
.btn-hacker-tool { background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; max-width: 300px; transition: 0.3s; margin-top: 30px; text-transform: uppercase; letter-spacing: 2px; font-family: "Consolas", monospace; box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }
.btn-hacker-tool:hover { background: rgba(239, 68, 68, 0.15); box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); transform: translateY(-2px); }

/* 2. YENİLENMİŞ HACKER ARACI (Hydra) */
.bruteforce-window { background: #000000; border-radius: 12px; border: 1px solid #334155; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 30px rgba(0, 0, 0, 0.5); }
.bf-header { background: #1e293b; padding: 8px 15px; color: #94a3b8; font-weight: bold; display: flex; justify-content: space-between; font-family: "Consolas", monospace; font-size: 12px; border-bottom: 1px solid #334155;}
.bf-terminal { padding: 15px; height: 250px; overflow-y: auto; color: #cbd5e1; font-family: "Consolas", monospace; font-size: 12px; line-height: 1.4; background: #000000; }
.bf-cmd-line { padding: 10px 15px; background: #050505; border-top: 1px solid #334155; display: flex; gap: 8px; align-items: center; }
.prompt-user { color: #ef4444; font-weight: bold; font-family: "Consolas", monospace; font-size: 13px; }
.prompt-dir { color: #3b82f6; font-weight: bold; font-family: "Consolas", monospace; font-size: 13px; margin-right: 5px;}
.bf-cmd-line input { flex-grow: 1; background: transparent; border: none; color: #f8fafc; font-family: "Consolas", monospace; font-size: 13px; outline: none; caret-color: #f8fafc; }
.btn-attack { background: #1e293b; color: white; border: 1px solid #475569; padding: 6px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 11px; transition: 0.2s;}
.btn-attack:hover { background: #334155; border-color: #64748b;}
.btn-success-override { background: #10b981; border-color: #059669; color: #000; }
.btn-success-override:hover { background: #059669; color: #fff;}

/* 3. KASA (Başarı) */
.vault-panel { background: #0f172a; padding: 50px 30px; border-radius: 12px; color: white; text-align: center; border: 2px solid #10b981; box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);}
.vault-title { color: #10b981; margin-top: 0; font-size: 28px; }
.vault-desc { font-size: 15px; color: #cbd5e1; margin-bottom: 25px; }
.balance-box { background: #1e293b; padding: 25px; border-radius: 8px; margin-top: 20px; text-align: center; border: 1px solid #334155; }
.vault-lbl { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
.balance-amount { font-size: 42px; font-weight: bold; color: #f59e0b; margin: 15px 0; font-family: monospace; }
.vault-auth { color: #10b981; font-size: 14px; font-weight: bold;}

/* Eğitim Adımı (Adım 3) */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #334155; }
.logic-box { border-left: 4px solid #f59e0b; }
.edu-desc { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 0; margin-bottom: 25px; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 14px; color: #0f172a; }
.step-red { background: #ef4444; color: #fff; }
.step-yellow { background: #fbbf24; }
.step-blue { background: #38bdf8; color: #fff; }
.step-title-text { font-size: 16px; display: block; margin-bottom: 5px; }
.red-text { color: #ef4444; }
.yellow-text { color: #fbbf24; }
.blue-text { color: #38bdf8; }
.step-desc-text { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
.code-yellow { color: #f59e0b; background: #000; padding: 2px 4px; border-radius: 4px; font-family: monospace;}
.solution-box { background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); margin-top: 35px; border-left: 4px solid #10b981; }
.solution-title { color: #10b981; font-size: 16px; display: block; margin-bottom: 10px; }
.solution-desc { margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5e1; }

/* Butonlar & Aksiyonlar */
.action-footer { margin-top: 30px; display: flex; }
.btn-primary { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #d97706; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4); }
.btn-secondary { background: #334155; color: #f8fafc; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-secondary:hover { background: #475569; }
.btn-success { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; width: auto;}
.btn-success:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* Animasyonlar ve Yükleyiciler */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(245, 158, 11, 0.2); border-top-color: #f59e0b; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>