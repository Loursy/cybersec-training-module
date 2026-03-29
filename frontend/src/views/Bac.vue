<template>
  <div class="module-wrapper">
    <div class="container">
      <button class="lang-btn" @click="toggleLanguage">
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>

      <div v-if="isLoading" style="text-align: center; padding: 50px 0;">
        <span class="spinner" style="display:inline-block; border-color: #f59e0b; border-top-color: transparent; width: 40px; height: 40px;"></span>
        <p style="color: #f59e0b; margin-top: 20px;">{{ currentText.loading }}</p>
      </div>

      <div v-else>
        <h1 id="mod-title">{{ currentText.modTitle }}</h1>
        <p id="mod-desc">{{ currentText.modDesc }}</p>
        <hr style="border-color: #374151; margin-bottom: 30px" />

        <div v-if="currentStep === 1" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Ön-Test Analizi</h2>
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

          <button class="action-btn" @click="finishPreTest" style="float: right;">
            {{ isReviewMode ? 'Sonraki Aşama (Simülasyon)' : currentText.btnPre }}
          </button>
        </div>

        <div v-else-if="currentStep === 2" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Simülasyon</h2>
          <h2 v-else>{{ currentText.simTitle }}</h2>
          <p v-html="currentText.simDesc" style="line-height: 1.6"></p>

          <div class="mock-browser">
            <div class="browser-header">
              <div class="browser-dots">
                <span class="dot" style="background: #ef4444"></span>
                <span class="dot" style="background: #f59e0b"></span>
                <span class="dot" style="background: #10b981"></span>
              </div>
              <div class="url-bar">
                <span class="url-text">🔒 https://intranet.sirket.com/api/profile/</span>
                <input type="text" v-model="targetId" class="url-input" autocomplete="off" @keydown.enter="loadProfile" />
              </div>
            </div>
            
            <div class="browser-content">
              <p v-if="isSimLoading" style="color: #64748b;">{{ currentText.loading }}</p>
              
              <div v-else-if="profileData" class="profile-card">
                <div class="profile-header">
                  <div class="avatar" :style="{ background: profileData.avatarColor }">{{ profileData.initial }}</div>
                  <div class="profile-info">
                    <h3>{{ profileData.name }}</h3>
                    <span class="badge badge-role">{{ profileData.displayRole }}</span>
                    <span class="badge badge-dept">{{ profileData.displayDept }}</span>
                  </div>
                </div>
                <div class="profile-details">
                  <p>📧 <b>{{ currentText.email }}:</b> {{ profileData.email || 'Belirtilmedi' }}</p>
                  <p>📞 <b>{{ currentText.phone }}:</b> {{ profileData.phone || 'Belirtilmedi' }}</p>
                </div>
                <div class="secret-alert">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <span style="font-size:18px;">🔒</span> <b>{{ currentText.secMsg }}</b>
                  </div>
                  {{ profileData.displaySecretMsg }}
                </div>
              </div>

              <div v-else-if="simError" style="color: #ef4444; padding: 20px; text-align: center;">
                <b>{{ currentText.notFound }}</b> {{ simError }}
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 25px;">
            <button class="action-btn" style="background: #374151;" @click="currentStep = 1">Önceki</button>
            <button v-if="simulationSuccess || isReviewMode" class="action-btn" style="background-color: #10b981;" @click="currentStep = 3">
              {{ currentText.btnToTrn }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Eğitim Materyali</h2>
          <h2 v-else>{{ currentText.trnTitle }}</h2>

          <div class="info-box">
            <h3>{{ currentText.trnH1 }}</h3>
            <p v-html="currentText.trnP1"></p>
          </div>

          <div class="info-box solution">
            <h3>{{ currentText.trnH2 }}</h3>
            <p v-html="currentText.trnP2"></p>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 25px;">
            <button class="action-btn" style="background: #374151;" @click="currentStep = 2">Önceki</button>
            <button class="action-btn" @click="currentStep = 4">{{ currentText.btnToPost }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step active-step">
          <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Son-Test Analizi</h2>
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

          <div style="display: flex; justify-content: space-between; margin-top: 25px;">
            <button class="action-btn" style="background: #374151;" @click="currentStep = 3">Önceki</button>
            
            <button class="action-btn" @click="finishPostTest" :disabled="isSaving" style="background: #f59e0b; color: #111827;">
              <span v-if="isSaving" class="spinner" style="display:inline-block; vertical-align:middle; margin-right:8px; border-color:#111827; border-top-color:transparent; width: 16px; height: 16px; border-width: 2px;"></span>
              {{ isReviewMode ? 'İncelemeyi Bitir ve Dön' : (isSaving ? 'Kaydediliyor...' : currentText.btnPost) }}
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

// Simülasyon Değişkenleri
const targetId = ref('2'); // Başlangıçta kendi ID'miz
const isSimLoading = ref(false);
const profileData = ref(null);
const simError = ref('');
const simulationSuccess = ref(false);

// Doğru Cevap Anahtarları (a, b, c formatına uyarlandı)
const answerKeys = {
  pre: { q1: "b", q2: "c", q3: "b" },
  post: { q1: "b", q2: "a", q3: "c" }, 
};

// Çeviriler (Tüm yapı korundu)
const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 2: Broken Access Control",
    modDesc: "Sistemin yetkilendirme (authorization) açıklarını keşfedin.",
    preTitle: "Adım 1: Ön-Test",
    simTitle: "Adım 2: Zafiyet Simülasyonu",
    trnTitle: "Adım 3: Az Önce Ne Yaşandı?",
    postTitle: "Adım 4: Son-Test",
    btnPre: "Simülasyona Geç",
    btnToTrn: "Zafiyeti Buldun! Eğitime Geç",
    btnToPost: "Son-Test'e Geç",
    btnPost: "Eğitimi Tamamla & Karneme Git",
    simDesc: "Şirketin İntranet portalına <b>YBS Uzmanı</b> olarak giriş yaptın. Aşağıdaki tarayıcıda kendi profilini görüyorsun. <br><br>Acaba adres çubuğundaki (URL) <b>ID numaranı</b> silip yerine yöneticilerin ID'sini (Örn: 1 veya 3) yazıp Enter'a basarsan sistem seni engeller mi?",
    loading: "Sunucuya bağlanılıyor...",
    notFound: "404 Bulunamadı:",
    errConn: "Sunucu bağlantı hatası!",
    email: "E-posta",
    phone: "Telefon",
    secMsg: "Gizli Sistem Mesajı",

    trnH1: "🛎️ Otel Resepsiyonu Analojisi",
    trnP1: 'Düşünün ki bir otele gittiniz ve resepsiyona <b>"Bana 1 numaralı odanın anahtarını verin"</b> dediniz. Resepsiyonist sizin kim olduğunuza bakmadan, o odanın size ait olup olmadığını kontrol etmeden anahtarı direkt elinize verdi.<br><br>İşte az önce adres çubuğundaki ID\'yi değiştirdiğinizde sistemin yaptığı tam olarak buydu! Sistem sadece "1 numaralı profil var mı?" diye sordu, "Bu veriyi isteyen kişinin o profili görme yetkisi var mı?" diye sormadı. Bu zafiyete <b>IDOR (Insecure Direct Object Reference)</b> denir.',
    trnH2: "🛡️ Çözüm: Nasıl Önlenir?",
    trnP2: 'Yazılımcılar sadece arayüzdeki butonları gizleyerek sistemi koruduklarını sanmamalıdır. Sunucu (Backend), gelen her veri isteğinde mutlaka kullanıcının kimliğini (Oturum veya Token ile) doğrulamalı ve <b>"Bu veriye erişim hakkı var mı?"</b> kontrolünü yapmalıdır.',

    qPre1: '1. "Broken Access Control" kavramı temelde hangi güvenlik ihlalini ifade eder?',
    optPre1_1: "A) Uygulamanın şifreleme algoritmalarındaki zayıflıklar nedeniyle verilerin düz metin olarak sızdırılmasıdır.",
    optPre1_2: "B) Kullanıcıların, oturum açmış olsalar dahi kendilerine atanmamış kaynaklar üzerinde işlem yapabilmesidir.",
    optPre1_3: "C) Sunucu ile istemci arasındaki trafiğin araya girilerek dinlenmesi ve yetkilerin kopyalanmasıdır.",

    qPre2: "2. Güvenli Olmayan Doğrudan Nesne Başvurusu (IDOR) nedir?",
    optPre2_1: "A) Veritabanı sunucusuna doğrudan yetkisiz erişim sağlayarak tabloları silme işlemidir.",
    optPre2_2: "B) Zararlı bir script kodunun girdi alanları üzerinden sunucuya enjekte edilerek çalıştırılmasıdır.",
    optPre2_3: "C) Sistemin, kullanıcıdan gelen bir parametreyi (örn. ID) doğrulama yapmadan iç nesnelere erişimde doğrudan kullanmasıdır.",

    qPre3: "3. Uygulamalarda yetki kontrolleri (Access Control) kesin olarak nerede yapılmalıdır?",
    optPre3_1: "A) Sadece İstemci (Frontend) tarafında.",
    optPre3_2: "B) Sunucu (Backend) tarafında.",
    optPre3_3: "C) Sadece veritabanının içinde.",

    qPost1: '1. "Otel Resepsiyonu" analojisinde resepsiyonistin (sistemin) temel hatası neydi?',
    optPost1_1: "A) Otelin kapılarını kilitlemeyi unutması.",
    optPost1_2: "B) Oda anahtarını isteyen kişinin o odanın gerçek sahibi olup olmadığını kontrol etmemesi.",
    optPost1_3: "C) Yanlış anahtar vermesi.",

    qPost2: "2. Simülasyonda CEO'nun gizli mesajını okumak için hangi yöntemi kullandık?",
    optPost2_1: "A) Adres çubuğundaki kendi ID numaramızı (2) silip, CEO'nun ID'sini (1) yazarak istek atmak.",
    optPost2_2: "B) Sisteme zararlı bir yazılım (virüs) yüklemek.",
    optPost2_3: "C) CEO'nun e-posta şifresini tahmin etmek.",

    qPost3: "3. Geliştiriciler bu zafiyeti önlemek için ne yapmalıdır?",
    optPost3_1: "A) Arayüzdeki (Frontend) menüleri ve butonları kullanıcılardan gizlemek.",
    optPost3_2: "B) Kullanıcıların şifrelerini daha karmaşık yapmalarını zorunlu kılmak.",
    optPost3_3: "C) Gelen her istekte, isteği yapanın o veriye yetkisi olup olmadığını arka planda (Backend) doğrulamak.",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test Score: ${pre}%\nPost-Test Score: ${post}%\n\nRedirecting to your stats...`,
    modTitle: "Module 2: Broken Access Control",
    modDesc: "Discover the authorization vulnerabilities of the system.",
    preTitle: "Step 1: Pre-Test",
    simTitle: "Step 2: Vulnerability Simulation",
    trnTitle: "Step 3: What Just Happened?",
    postTitle: "Step 4: Post-Test",
    btnPre: "Start Simulation",
    btnToTrn: "Vulnerability Found! Go to Training",
    btnToPost: "Go to Post-Test",
    btnPost: "Complete Training & Go to Stats",
    simDesc: "You logged into the company Intranet as an <b>MIS Specialist</b>. You see your profile in the browser below. <br><br>What if you delete your <b>ID number</b> in the URL bar and enter managers' IDs (e.g. 1 or 3) and press Enter? Will the system block you?",
    loading: "Connecting to server...",
    notFound: "404 Not Found:",
    errConn: "Server connection error!",
    email: "Email",
    phone: "Phone",
    secMsg: "Secret System Message",

    trnH1: "🛎️ The Hotel Receptionist Analogy",
    trnP1: 'Imagine you walk into a hotel and say to the receptionist, <b>"Give me the key to room 1."</b> The receptionist hands you the key directly without checking your ID or verifying if that room belongs to you.<br><br>That\'s exactly what the system did when you changed the ID in the URL bar! The system only asked "Does profile 1 exist?" but never asked "Does the user requesting this data have the authority to view it?". This vulnerability is called <b>IDOR (Insecure Direct Object Reference)</b>.',
    trnH2: "🛡️ Solution: How to Prevent It?",
    trnP2: 'Developers shouldn\'t assume the system is secure just by hiding buttons on the interface. The server (Backend) MUST verify the user\'s identity (via Session or Token) on every data request and check: <b>"Does this user have the right to access this specific data?"</b>.',

    qPre1: '1. What is the core mechanism of a "Broken Access Control" vulnerability?',
    optPre1_1: "A) The leakage of plaintext data due to weaknesses in the application's encryption algorithms.",
    optPre1_2: "B) The ability of users to perform actions on resources not allocated to them, regardless of their authentication status.",
    optPre1_3: "C) The interception of traffic between the server and client (MitM) to duplicate privileges.",

    qPre2: "2. Which of the following best describes Insecure Direct Object Reference (IDOR)?",
    optPre2_1: "A) Gaining direct unauthorized access to the database server to delete tables.",
    optPre2_2: "B) Injecting and executing a malicious script code on the server through input fields.",
    optPre2_3: "C) The system's use of a user-supplied parameter (e.g., ID) to directly access internal objects without validation.",

    qPre3: "3. Where MUST access control checks be strictly enforced in an application?",
    optPre3_1: "A) Only on the Client-side (Frontend).",
    optPre3_2: "B) On the Server-side (Backend).",
    optPre3_3: "C) Only inside the database.",

    qPost1: '1. In the "Hotel Receptionist" analogy, what was the system\'s main mistake?',
    optPost1_1: "A) Forgetting to lock the hotel doors.",
    optPost1_2: "B) Not checking if the person asking for the key was the actual owner of that room.",
    optPost1_3: "C) Giving the wrong key.",

    qPost2: "2. During the simulation, how did we manage to read the CEO's secret message?",
    optPost2_1: "A) By deleting our own ID (2) in the URL bar and replacing it with the CEO's ID (1).",
    optPost2_2: "B) By uploading malicious software (virus) to the system.",
    optPost2_3: "C) By guessing the CEO's email password.",

    qPost3: "3. What should developers do to prevent this vulnerability?",
    optPost3_1: "A) Hide menus and buttons on the interface (Frontend) from users.",
    optPost3_2: "B) Force users to create more complex passwords.",
    optPost3_3: "C) Verify in the background (Backend) on every request if the user has authorization for that data.",
  },
  dbTranslations: {
    "YBS Uzmanı": "MIS Specialist",
    "İK Müdürü": "HR Manager",
    "Yönetim Kurulu": "Board of Directors",
    "Bilişim Teknolojileri": "Information Technology",
    "İnsan Kaynakları": "Human Resources",
    "Belirtilmedi": "Not Specified",
    "GİZLİ KARAR: Şirketin satılma planları başladı. Hedef 2027.": "SECRET DECISION: Company sale plans have started. Target 2027.",
    "Sistem güncelleme notu: Sunucu şifreleri yarın sıfırlanacak.": "System update note: Server passwords will be reset tomorrow.",
    "DİKKAT: IT departmanındaki küçülme planı onaylandı.": "ATTENTION: The downsizing plan in the IT department is approved."
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  if (currentStep.value === 2 && profileData.value) {
    loadProfile(); // Dil değişince veritabanı verisini de çevir
  }
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
    localStorage.setItem('bac_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`);
      const result = await response.json();
      if (result.success && result.data && result.data.bac_answers) {
        Object.assign(answers, result.data.bac_answers);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    const savedDraft = localStorage.getItem('bac_draft_answers');
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
    // Modül yeni açıldığında otomatik olarak kendi profilini (2) yüklesin
    loadProfile();
  }
  isLoading.value = false; 
});

const loadProfile = async () => {
  if (!targetId.value) return;
  
  isSimLoading.value = true;
  profileData.value = null;
  simError.value = '';
  
  try {
    const response = await fetch(`http://localhost:3000/api/vuln/bac/profile/${targetId.value}`);
    const result = await response.json();

    if (result.success) {
      let avatarColor = "linear-gradient(135deg, #64748b, #475569)";
      if (targetId.value === "1") avatarColor = "linear-gradient(135deg, #ef4444, #b91c1c)";
      else if (targetId.value === "2") avatarColor = "linear-gradient(135deg, #3b82f6, #2563eb)";
      else if (targetId.value === "3") avatarColor = "linear-gradient(135deg, #8b5cf6, #6d28d9)";

      let role = result.data.role;
      let dept = result.data.department || "Belirtilmedi";
      let secMsg = result.data.secret_message;

      if (currentLang.value === 'en') {
        const dbT = translations.dbTranslations;
        role = dbT[role] || role;
        dept = dbT[dept] || dept;
        secMsg = dbT[secMsg] || secMsg;
      }

      profileData.value = {
        initial: result.data.name.charAt(0),
        avatarColor,
        name: result.data.name,
        displayRole: role,
        displayDept: dept,
        email: result.data.email,
        phone: result.data.phone,
        displaySecretMsg: secMsg
      };

      // Kendi profili (2) hariç birine sızarsa eğitim butonu açılır
      simulationSuccess.value = (targetId.value !== "2");
    } else {
      simError.value = result.message;
      simulationSuccess.value = false;
    }
  } catch (error) {
    simError.value = currentText.value.errConn;
  } finally {
    isSimLoading.value = false;
  }
};

const calculateScore = (testPrefix) => {
  let score = 0;
  if (answers[`${testPrefix}Q1`] === answerKeys[testPrefix].q1) score += 33.33;
  if (answers[`${testPrefix}Q2`] === answerKeys[testPrefix].q2) score += 33.33;
  if (answers[`${testPrefix}Q3`] === answerKeys[testPrefix].q3) score += 33.34;
  return Math.round(score);
};

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    return alert(currentText.value.warnEmpty);
  }
  currentStep.value = 2; 
};

const finishPostTest = async () => {
  if (isReviewMode.value) return router.push("/stats");

  if (!answers.postQ1 || !answers.postQ2 || !answers.postQ3) {
    return alert(currentText.value.warnEmpty);
  }
  
  const userEmail = localStorage.getItem("userEmail");
  isSaving.value = true;
  
  const preScore = calculateScore("pre");
  const postScore = calculateScore("post");
  
  try {
    await fetch(`http://localhost:3000/api/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        module: "bac",
        preScore: preScore,
        postScore: postScore,
        answers: answers
      }),
    });
    
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem('bac_draft_answers'); 
    router.push("/stats");
  } catch (err) {
    alert("Hata oluştu!");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.correct-answer {
  background: rgba(16, 185, 129, 0.15) !important;
  border-color: #10b981 !important;
  color: #10b981 !important;
}
.wrong-answer {
  background: rgba(239, 68, 68, 0.15) !important;
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

.module-wrapper { background-color: #0b0f19; color: #a1a1aa; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
.container { max-width: 800px; width: 100%; margin: 0 auto; background: #111827; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border-top: 3px solid #f59e0b; position: relative; }
h1, h2, h3 { color: #f8fafc; }
.lang-btn { position: absolute; top: 20px; right: 20px; background: transparent; color: #00e5ff; border: 1px solid #00e5ff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; }
.lang-btn:hover { background: rgba(0, 229, 255, 0.15); box-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }

.step { animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.question { background: #1f2937; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
.question p { margin-top: 0; font-size: 16px; }
.options label { display: block; margin: 12px 0; cursor: pointer; color: #d1d5db; transition: color 0.2s; padding: 10px; border-radius: 4px; border: 1px solid transparent; }
.options label:hover { color: #00e5ff; background: rgba(0, 229, 255, 0.05); border-color: #374151; }
.options label input:disabled { cursor: not-allowed; }

button.action-btn { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 15px; transition: 0.3s; }
button.action-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.4); }
button.action-btn:disabled { opacity: 0.7; cursor: wait; }

/* Simülasyon Tarayıcısı */
.mock-browser { background: #1f2937; border-radius: 8px; border: 1px solid #374151; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); }
.browser-header { background: #111827; padding: 10px 15px; display: flex; align-items: center; border-bottom: 1px solid #374151; }
.browser-dots { display: flex; gap: 6px; margin-right: 15px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.url-bar { flex-grow: 1; background: #0b0f19; border-radius: 4px; padding: 8px 12px; display: flex; align-items: center; border: 1px solid #374151; font-family: monospace; font-size: 15px; cursor: text; }
.url-text { color: #9ca3af; letter-spacing: 0.5px; }
.url-input { background: transparent; border: none; color: #fff; font-weight: bold; font-family: monospace; font-size: 16px; flex-grow: 1; outline: none; padding: 0 4px; caret-color: #10b981; }
.browser-content { padding: 25px; min-height: 200px; background: #f8fafc; color: #1e293b; }

/* Profil Kartı */
.profile-card { border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
.avatar { width: 70px; height: 70px; min-width: 70px; min-height: 70px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }
.profile-info h3 { margin: 0 0 8px 0; color: #0f172a; font-size: 22px; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 5px; }
.badge-role { background: #dbeafe; color: #1e40af; }
.badge-dept { background: #f1f5f9; color: #475569; }
.profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px dashed #cbd5e1; }
.profile-details p { margin: 0; color: #334155; font-size: 14px; }
.secret-alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; color: #991b1b; font-size: 15px; border-radius: 4px; line-height: 1.5; }

/* Bilgi Kutuları */
.info-box { background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b; line-height: 1.6; color: #cbd5e1; }
.info-box h3 { color: #f8fafc; margin-top: 0; margin-bottom: 15px; }
.info-box.solution { border-left-color: #10b981; }

.spinner { border-radius: 50%; border: 3px solid; border-top-color: transparent; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>