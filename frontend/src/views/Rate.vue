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
              
              <div class="crypto-window" v-if="activeWindow === 'crypto'">
                <div class="crypto-header">🪙 NovaCrypto</div>
                <div class="crypto-body">
                  <p style="color: #94a3b8; margin: 0" id="auth-desc" v-html="currentText.authDesc"></p>

                  <div class="pin-box">
                    <input type="text" class="pin-input" maxlength="1" v-model="pin1" ref="refP1" @input="moveFocus($event, 'refP2', null)" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin2" ref="refP2" @input="moveFocus($event, 'refP3', 'refP1')" @keydown.delete="handleDelete($event, 'refP1')" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin3" ref="refP3" @input="moveFocus($event, 'refP4', 'refP2')" @keydown.delete="handleDelete($event, 'refP2')" />
                    <input type="text" class="pin-input" maxlength="1" v-model="pin4" ref="refP4" @input="moveFocus($event, null, 'refP3')" @keydown.delete="handleDelete($event, 'refP3')" @keyup.enter="verifyPin" />
                  </div>

                  <button class="btn-verify" @click="verifyPin">{{ currentText.btnVerify }}</button>
                  <div v-if="simWarning" class="warning-msg" style="display:block;">{{ simWarning }}</div>

                  <button v-if="currentMission >= 2" class="btn-hacker-tool" @click="openHackerTool">
                    >_ {{ currentText.btnOpenTool }}
                  </button>
                </div>
              </div>

              <div class="bruteforce-window" v-if="activeWindow === 'hacker'">
                <div class="bf-header">
                  <span>[x] HYDRA BRUTE-FORCER v4.2</span>
                  <span id="bf-target-txt">{{ currentText.bfTarget }}</span>
                </div>
                <div class="bf-cmd-line">
                  <span>root@kali:~#</span>
                  <input type="text" v-model="hackerCmd" :placeholder="currentText.inputCmd" @keyup.enter="checkHackerCmd" :disabled="isAttacking || isCracked" autocomplete="off" />
                  <button v-if="!isAttacking && !isCracked" class="btn-attack" @click="checkHackerCmd">{{ currentText.btnAttack }}</button>
                  <button v-if="isCracked" class="btn-attack" @click="backToTarget" style="background: #0284c7;">{{ currentText.btnBackTarget }}</button>
                </div>
                <div class="bf-terminal" ref="terminalContainer">
                  <div v-html="terminalLogs"></div>
                </div>
              </div>

              <div class="vault-panel" v-if="activeWindow === 'vault'">
                <h2 id="vault-success-title">{{ currentText.vaultTitle }}</h2>
                <p id="vault-success-desc">{{ currentText.vaultDesc }}</p>
                <div class="balance-box">
                  <div style="color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
                    {{ currentText.vaultLbl }}
                  </div>
                  <div class="balance-amount">142.508,00 USDT</div>
                  <div style="color: #10b981; font-size: 14px">{{ currentText.vaultAuth }}</div>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end;">
                <button v-if="activeWindow === 'vault' || isReviewMode" class="action-btn" style="background: #10b981; margin-top: 15px; width:auto;" @click="currentStep = 3">
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
    qPre1: '1. "Rate Limiting" (Hız Sınırlandırma) mekanizmasının temel güvenlik işlevi aşağıdakilerden hangisidir?',
    optPre1_1: "A) Sunucuya yüklenen yüksek boyutlu medya dosyalarını otomatik olarak sıkıştırıp optimize etmek.",
    optPre1_2: "B) Belirli bir zaman diliminde aynı IP veya kullanıcıdan gelen maksimum istek sayısını kısıtlamak.",
    optPre1_3: "C) Ağ trafiğini şifreleyerek aradaki saldırganların paketleri okumasını engellemek.",
    qPre2: "2. Bir sistemde Rate Limiting mekanizmasının BULUNMAMASI durumunda, aşağıdaki saldırılardan hangisi en kolay şekilde gerçekleştirilir?",
    optPre2_1: "A) Otomatik araçlar kullanarak binlerce şifre kombinasyonunun denendiği Brute-Force saldırıları.",
    optPre2_2: "B) Veritabanına zararlı sorgular gönderilerek gizli tabloların silindiği SQL Injection saldırıları.",
    optPre2_3: "C) Kullanıcıların tarayıcılarında zararlı kodlar çalıştırılarak oturum çerezlerinin çalındığı XSS saldırıları.",
    qPre3: "3. Özellikle 4 veya 6 haneli SMS (OTP) doğrulama kodlarının kullanıldığı ekranlarda neden hız sınırlandırması kritik bir zorunluluktur?",
    optPre3_1: "A) Çünkü sınırlandırma olmazsa SMS sağlayıcı servisler kullanıcının telefonunu virüslü olarak işaretler.",
    optPre3_2: "B) Çünkü SMS kodları genellikle alfabetik harfler içerdiğinden sunucunun işlemci gücünü çok yorar.",
    optPre3_3: "C) Çünkü ihtimal havuzu çok küçüktür (Örn: 10.000 ihtimal) ve sınırsız deneme hakkı kodu anında kırdırır.",
    btnPre: "Simülasyona Başla",

    simTitle: "Adım 2: Zafiyet Sömürüsü (Brute-Force)",
    gTitle: "📋 Operasyon Dosyası",
    gDesc: "Hedef: <b>Nova Kripto Borsası</b>. Kurbanın e-posta şifresini bulup giriş yaptık ancak karşımıza 4 haneli bir SMS Onay Ekranı (2FA) çıktı. Doğru kodu bulmalıyız!",
    gs1T: "1. Keşif: Sınırları Test Et",
    gs1D: "Önce sistemi manuel test et. Rastgele 4 haneli bir kod (örn: 1234) girip doğrula de. Hata mesajını oku. Acaba sistem bizi \"Çok fazla hatalı deneme\" diyerek engelleyecek mi?",
    gs2T: "2. Silahlanma (Hacker Aracı)",
    gs2D: "Sistem bizi engellemedi! Manuel olarak binlerce ihtimali deneyemeyiz. Aşağıda yeni beliren <b>\">_ Hacker Aracını Aç\"</b> butonuna tıkla ve saldırı konsoluna geç.",
    gs3T: "3. Kaba Kuvvet (Brute-Force) Saldırısı",
    gs3D: "Saldırıyı başlatmak için siber güvenlik dünyasının meşhur aracı Hydra'yı kullanacağız. Terminale şu komutu yapıştır ve Enter'a bas:<br><br><code class='highlight'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: "4. Kripto Kasasına Sız",
    gs4D: "Terminal saniyeler içinde binlerce istek atacak. Bulduğu yeşil renkli doğru PIN kodunu aklında tut. <b>\"Hedefe Dön\"</b> butonuna basıp o kodu manuel olarak girerek cüzdanı ele geçir!",

    authDesc: "Giriş yapmak için telefonunuza gelen <b>4 haneli SMS kodunu</b> giriniz.",
    btnVerify: "Doğrula ve Giriş Yap",
    msgWarnMan: "Hatalı Kod! Sistemde sınırlandırma YOK. Sonsuz deneme yapabilirsiniz.",
    msgWarnShort: "Lütfen 4 haneli bir kod girin.",
    btnOpenTool: "Hacker Aracını Aç",

    bfTarget: "Hedef: api.novacrypto.com",
    inputCmd: "Saldırı komutunu buraya yapıştırın ve Enter'a basın...",
    btnAttack: "Çalıştır",
    btnBackTarget: "Hedefe Dön & Kodu Gir",
    bfTermReady: "Sistem hazır. Brute-Force işlemini başlatmak için geçerli bir Hydra komutu bekleniyor...<br>",
    cmdError: "Hatalı komut! Lütfen görev rehberindeki 'hydra' komutunu tam olarak kopyalayıp yapıştırın.",

    vaultTitle: "🔓 ERİŞİM ONAYLANDI",
    vaultDesc: "Hoş geldiniz. 2FA doğrulaması başarıyla aşıldı.",
    vaultLbl: "Kullanılabilir Bakiye",
    vaultAuth: "Transfer yetkisi aktif.",

    btnToTrn: "GÖREVLER BAŞARILI - ANALİZE GEÇ",
    trnTitle: "Adım 3: Teknik Analiz - Sistem Nasıl Çöktü?",
    trnDesc: "4 haneli bir şifrenin güvenli olmasının tek sebebi, insanın 10.000 ihtimali elle deneyemeyecek olmasıdır. Ancak karşımızda bir insan değil, bilgisayar programı vardı. İşte arka planda yaşananlar:",
    trnH1: "Sınırların Olmaması (Lack of Rate Limiting)",
    trnP1: "Yazılımcı, kullanıcının girdiği kodun doğru olup olmadığını kontrol eden bir API yazdı ama bir kullanıcının o API'ye 1 saniyede kaç kere istek atabileceğini kontrol etmedi.",
    trnH2: "Kaba Kuvvetin Gücü (Brute-Force)",
    trnP2: "Otomatik bir script, API'ye saldırdı. 0000'dan başlayarak her milisaniyede yeni bir kod denedi. Sistem yorulmadı, engellemedi ve sadece \"Yanlış\" yanıtı döndü. Ta ki <b>HTTP 200 OK (Başarılı)</b> kodunu görene kadar.",
    trnH3: "🛡️ Kesin Çözüm: Rate Limiting ve Account Lockout",
    trnP3: "Brute-Force saldırılarını durdurmanın en kesin yolu API seviyesinde kısıtlama yapmaktır.<br><br><b>1. Rate Limiting:</b> Bir IP adresi 1 dakikada sadece 5 istek yapabilir. Fazlasında sistem <b>HTTP 429 (Too Many Requests)</b> hatası vermelidir.<br><b>2. Account Lockout:</b> Arka arkaya 3 hatalı SMS kodundan sonra giriş işlemi 15 dakikalığına tamamen dondurulmalıdır.",
    btnToPost: "Tüm Detayları Anladım -> Son Teste Geç",

    postTitle: "Son-Test",
    qPost1: "1. Rate Limiting koruması uygulandığında, sınırı aşan saldırganlara hangi HTTP durum kodu döndürülmelidir?",
    optPost1_1: "A) HTTP 500 (Internal Server Error) - Sunucu içi geçici çökme hatası.",
    optPost1_2: "B) HTTP 429 (Too Many Requests) - Çok fazla istek yapıldığı hatası.",
    optPost1_3: "C) HTTP 404 (Not Found) - Aranan dizinin bulunamadığı hatası.",
    qPost2: "2. 'Rate Limiting' mekanizmasının temel güvenlik işlevi aşağıdakilerden hangisidir?",
    optPost2_1: "A) Sunucuya yüklenen yüksek boyutlu medya dosyalarını otomatik olarak sıkıştırıp optimize etmek.",
    optPost2_2: "B) Belirli bir zaman diliminde aynı IP veya kullanıcıdan gelen maksimum istek sayısını kısıtlamak.",
    optPost2_3: "C) Ağ trafiğini şifreleyerek aradaki saldırganların paketleri okumasını engellemek.",
    qPost3: "3. Simülasyonda karşılaştığımız, Rate Limiting eksikliğinden faydalanarak doğru şifreyi bulmayı hedefleyen saldırının adı nedir?",
    optPost3_1: "A) Phishing (Oltalama) Saldırısı",
    optPost3_2: "B) Path Traversal (Dizin Atlatma) Saldırısı",
    optPost3_3: "C) Brute-Force (Kaba Kuvvet) Saldırısı",
    btnPost: "Eğitimi Bitir",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 5: Rate Limiting",
    preTitle: "Pre-Test",
    qPre1: '1. What is the primary security function of a "Rate Limiting" mechanism?',
    optPre1_1: "A) Automatically compressing and optimizing large media files uploaded to the server.",
    optPre1_2: "B) Restricting the maximum number of requests coming from the same IP or user within a timeframe.",
    optPre1_3: "C) Encrypting network traffic to prevent Man-in-the-Middle attackers from reading the packets.",
    qPre2: "2. Which of the following attacks is most easily executed when a system LACKS a Rate Limiting mechanism?",
    optPre2_1: "A) Brute-Force attacks where automated tools test thousands of password combinations.",
    optPre2_2: "B) SQL Injection attacks where malicious queries are sent to delete hidden database tables.",
    optPre2_3: "C) XSS attacks where malicious codes are executed in users' browsers to steal session cookies.",
    qPre3: "3. Why is rate limiting a critical necessity, especially on screens using 4 or 6-digit SMS (OTP) verification codes?",
    optPre3_1: "A) Because without limits, SMS provider services will flag the user's phone as infected with a virus.",
    optPre3_2: "B) Because SMS codes generally contain letters, which exhausts the server's CPU power.",
    optPre3_3: "C) Because the pool of possibilities is very small (e.g., 10,000) and unlimited tries break the code instantly.",
    btnPre: "Start Simulation",

    simTitle: "Step 2: Exploit Simulation",
    gTitle: "📋 Operation File",
    gDesc: "Target: <b>Nova Crypto Exchange</b>. We found the victim's password and logged in, but we hit a 4-digit SMS OTP screen (2FA). There are 10,000 possibilities. We must find the right code!",
    gs1T: "1. Recon: Test the Limits",
    gs1D: "First, manually test the system. Enter a random 4-digit code (e.g., 1234) and click Verify. Does the system block us saying 'Too many failed attempts', or does it allow infinite tries?",
    gs2T: "2. Arming (Hacker Tool)",
    gs2D: "The system didn't block us! We can't manually try 10,000 possibilities. Click the newly appeared <b>\">_ Open Hacker Tool\"</b> button below to access the terminal.",
    gs3T: "3. Brute-Force Attack",
    gs3D: "To launch the attack, we will use Hydra. Copy this command into the terminal and hit Enter:<br><br><code class='highlight'>hydra -l admin -P pins.txt api.novacrypto.com/verify</code>",
    gs4T: "4. Breach the Crypto Vault",
    gs4D: "The terminal will blast thousands of requests in seconds. Memorize the green correct PIN code it finds. Click <b>\"Return to Target\"</b> and enter that code manually to hijack the wallet!",

    authDesc: "Please enter the <b>4-digit SMS code</b> sent to your phone to log in.",
    btnVerify: "Verify and Log In",
    msgWarnMan: "Invalid Code! NO rate limit detected. You can try infinitely.",
    msgWarnShort: "Please enter a 4-digit code.",
    btnOpenTool: "Open Hacker Tool",

    bfTarget: "Target: api.novacrypto.com",
    inputCmd: "Paste the attack command here and press Enter...",
    btnAttack: "Execute",
    btnBackTarget: "Return to Target & Enter Code",
    bfTermReady: "System ready. Waiting for a valid Hydra command to start the Brute-Force process...<br>",
    cmdError: "Invalid command! Please exactly copy and paste the 'hydra' command from the guide.",

    vaultTitle: "🔓 ACCESS GRANTED",
    vaultDesc: "Welcome. 2FA verification bypassed successfully.",
    vaultLbl: "Available Balance",
    vaultAuth: "Transfer authorization active.",

    btnToTrn: "MISSIONS SUCCESSFUL - GO TO ANALYSIS",
    trnTitle: "Step 3: Technical Analysis - How the System Crashed?",
    trnDesc: "The only reason a 4-digit password is secure is that a human cannot manually try 10,000 possibilities. But we used a computer program. Here is what happened in the background:",
    trnH1: "Lack of Rate Limiting",
    trnP1: "The developer wrote an API that checks if the entered code is correct, but failed to check how many requests a user can send to that API in 1 second.",
    trnH2: "The Power of Brute-Force",
    trnP2: "An automated script attacked the API. Starting from 0000, it tried a new code every millisecond. The system didn't get tired, didn't block it, and just returned \"Invalid\". Until it saw the <b>HTTP 200 OK (Success)</b> code.",
    trnH3: "🛡️ Ultimate Solution: Rate Limiting and Account Lockout",
    trnP3: "The most definitive way to stop Brute-Force attacks is API-level restriction.<br><br><b>1. Rate Limiting:</b> An IP address can only make 5 requests per minute. Beyond that, the system must return an <b>HTTP 429 (Too Many Requests)</b> error.<br><b>2. Account Lockout:</b> After 3 consecutive invalid SMS codes, the login process must be completely frozen for 15 minutes.",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    qPost1: "1. When Rate Limiting protection is applied to a web application's API endpoints, which HTTP status code should be returned to attackers exceeding the limit?",
    optPost1_1: "A) HTTP 500 (Internal Server Error) - Temporary internal server crash error.",
    optPost1_2: "B) HTTP 429 (Too Many Requests) - Error indicating too many requests have been made.",
    optPost1_3: "C) HTTP 404 (Not Found) - Error indicating the requested directory was not found.",
    qPost2: "2. What is the primary security function of a 'Rate Limiting' mechanism?",
    optPost2_1: "A) Automatically compressing and optimizing large media files uploaded to the server.",
    optPost2_2: "B) Restricting the maximum number of requests coming from the same IP or user within a timeframe.",
    optPost2_3: "C) Encrypting network traffic to prevent Man-in-the-Middle attackers from reading the packets.",
    qPost3: "3. What is the literature name for the attack type we encountered in the simulation that aims to find the correct password by exploiting the lack of Rate Limiting?",
    optPost3_1: "A) Phishing Attack",
    optPost3_2: "B) Path Traversal Attack",
    optPost3_3: "C) Brute-Force Attack",
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
    localStorage.setItem('rate_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`http://localhost:3000/api/get-user-stats/${userEmail}`);
      const result = await response.json();
      if (result.success && result.data && result.data.rate_answers) {
        Object.assign(answers, result.data.rate_answers);
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem('rate_draft_answers');
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
  if (e.target.value === '' && prevId) {
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
    // BAŞARILI!
    activeWindow.value = 'vault';
    currentMission.value = 5;
  } else {
    // HATALI GİRİŞ
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

const startAttack = () => {
  if (isAttacking.value) return;
  isAttacking.value = true;
  terminalLogs.value = "";
  
  let currentGuess = 8350; 
  const targetInt = parseInt(targetPin);

  const attackInterval = setInterval(() => {
    const pinStr = currentGuess.toString().padStart(4, "0");

    if (currentGuess === targetInt) {
      clearInterval(attackInterval);
      terminalLogs.value += `<div class="log-req">POST /api/verify {"otp": "${pinStr}"}</div>`;
      terminalLogs.value += `<div class="log-success">[HTTP 200 OK] PIN FOUND: ${pinStr}</div><br>`;
      
      scrollToBottom();
      
      setTimeout(() => {
        isCracked.value = true;
        isAttacking.value = false;
        currentMission.value = 4;
      }, 1000);
    } else {
      terminalLogs.value += `<div class="log-req">POST /api/verify {"otp": "${pinStr}"}</div>`;
      terminalLogs.value += `<div class="log-res">[HTTP 401] Unauthorized</div>`;
      scrollToBottom();
      currentGuess++;
    }
  }, 30); 
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
      body: JSON.stringify({ email: userEmail, module: "rate", preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem('rate_draft_answers'); 
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

/* GÖREV REHBERİ */
.mission-layout { display: grid; grid-template-columns: 440px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-step { padding: 15px; border-radius: 6px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; }
.guide-step.current { opacity: 1; background: rgba(0, 229, 255, 0.05); border: 1px solid #00e5ff; box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #00e5ff; margin-bottom: 8px; font-size: 15px; }
.guide-step p { margin: 0; font-size: 13.5px; line-height: 1.6; }
code.highlight { background: #000; color: #f59e0b; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }

/* UYGULAMA PANELİ */
.app-container { display: flex; flex-direction: column; gap: 15px; position: relative; }

/* 1. HEDEF: Kripto Cüzdan 2FA Ekranı */
.crypto-window { background: #111827; border-radius: 8px; border: 1px solid #374151; overflow: hidden; display: flex; flex-direction: column; color: #f8fafc; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4); text-align: center; animation: fadeIn 0.5s;}
.crypto-header { background: #1f2937; padding: 15px; border-bottom: 1px solid #374151; font-weight: bold; font-size: 18px; color: #f59e0b; display: flex; justify-content: center; align-items: center; gap: 10px; }
.crypto-body { padding: 40px 30px; display: flex; flex-direction: column; align-items: center; }

.pin-box { display: flex; gap: 10px; margin: 25px 0; justify-content: center; }
.pin-input { width: 50px; height: 60px; font-size: 28px; text-align: center; border-radius: 8px; border: 2px solid #4b5563; background: #1f2937; color: white; outline: none; font-weight: bold; transition: 0.3s; }
.pin-input:focus { border-color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }

.btn-verify { padding: 15px 40px; background: #f59e0b; color: #111827; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.3s; width: 100%; max-width: 300px; text-transform: uppercase;}
.btn-verify:hover { background: #fbbf24; transform: translateY(-2px); }

.warning-msg { color: #ef4444; font-size: 14px; font-weight: bold; margin-top: 15px; display: none; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 6px; width: 100%; max-width: 300px; }

/* YENİ HACKER ARACI BUTONU (Estetik ve Havalı) */
.btn-hacker-tool {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  transition: 0.3s;
  margin-top: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Consolas", monospace;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.1);
}
.btn-hacker-tool:hover {
  background: rgba(239, 68, 68, 0.15);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

/* 2. HACKER ARACI (Hydra) */
.bruteforce-window { background: #050505; border-radius: 8px; border: 1px solid #ef4444; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 30px rgba(239, 68, 68, 0.2); animation: fadeIn 0.5s; }
.bf-header { background: #450a0a; padding: 15px; color: #fca5a5; font-weight: bold; display: flex; justify-content: space-between; font-family: monospace; }
.bf-cmd-line { padding: 15px; background: #171717; border-bottom: 1px solid #450a0a; display: flex; gap: 10px; align-items: center; }
.bf-cmd-line span { color: #10b981; font-weight: bold; font-family: monospace; font-size: 14px; }
.bf-cmd-line input { flex-grow: 1; background: transparent; border: none; color: #f8fafc; font-family: monospace; font-size: 14px; outline: none; caret-color: #ef4444; }
.btn-attack { background: #ef4444; color: white; border: none; padding: 8px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
.btn-attack:hover { background: #dc2626; }

.bf-terminal { padding: 15px; height: 250px; overflow-y: auto; color: #94a3b8; font-family: "Consolas", monospace; font-size: 13px; line-height: 1.6; }
:deep(.log-req) { color: #fca5a5; }
:deep(.log-res) { color: #ef4444; }
:deep(.log-success) { color: #10b981; font-weight: bold; font-size: 15px; background: rgba(16, 185, 129, 0.1); padding: 5px; border-radius: 4px; margin-top: 10px; display: inline-block; }

/* 3. KASA (Başarı) */
.vault-panel { background: #0f172a; padding: 40px 30px; border-radius: 8px; color: white; text-align: center; border: 2px solid #10b981; animation: fadeIn 1s; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);}
.vault-panel h2 { color: #10b981; margin-top: 0; font-size: 28px; }
.balance-box { background: #1e293b; padding: 25px; border-radius: 8px; margin-top: 20px; text-align: center; }
.balance-amount { font-size: 42px; font-weight: bold; color: #f59e0b; margin: 10px 0; font-family: monospace; }

/* Eğitim Adımı */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border-left: 6px solid #00e5ff; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 16px; }
.code-block { background: #000; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; margin: 10px 0; border: 1px solid #334155; word-break: break-all; font-size:13.5px;}

.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 229, 255, 0.1); border-radius: 50%; border-top-color: #00e5ff; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>