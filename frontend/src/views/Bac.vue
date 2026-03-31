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
          
          <div class="guide-panel" style="margin-bottom: 25px;">
            <div class="brief-header" style="margin-bottom: 15px;">
              <span class="pulse-icon"></span> 
              <b>{{ currentText.gTitle }}</b>
            </div>
            <p class="sim-desc" v-html="currentText.simDesc"></p>
          </div>

          <div class="mock-browser fade-in">
            <div class="browser-header">
              <div class="browser-dots">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <div class="url-bar">
                <span class="url-protocol">🔒 https://intranet.globalcorp.local/api/profile/</span>
                <input type="text" v-model="targetId" class="url-input" autocomplete="off" @keydown.enter="loadProfile" />
                <button class="url-btn" @click="loadProfile">ENTER</button>
              </div>
            </div>
            
            <div class="browser-content">
              <div v-if="isSimLoading" class="sim-loading">
                <span class="spinner-small"></span> {{ currentText.loading }}
              </div>
              
              <div v-else-if="profileData" class="profile-card fade-in" :class="{'admin-profile': profileData.displayRole.includes('CEO') || profileData.displayRole.includes('Manager') || profileData.displayRole.includes('Müdür')}">
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
                <div class="secret-alert" v-if="profileData.displaySecretMsg">
                  <div class="secret-header"><span>🔒</span> <b>{{ currentText.secMsg }}</b></div>
                  {{ profileData.displaySecretMsg }}
                </div>
              </div>

              <div v-else-if="simError" class="sim-error fade-in">
                <b>{{ currentText.notFound }}</b> {{ simError }}
              </div>
            </div>
          </div>

          <div class="action-footer" style="justify-content: center;">
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
          
          <div style="margin-top: 20px; margin-bottom: 30px; text-align: center;">
             
          </div>

          <div class="neon-divider" style="margin: 30px 0; background: linear-gradient(90deg, #1e293b, #334155, #1e293b);"></div>

          <div class="info-box solution-box">
            <h3>{{ currentText.trnH2 }}</h3>
            <p v-html="currentText.trnP2"></p>
          </div>
          
          <div style="margin-top: 25px; margin-bottom: 30px; text-align: center;">
            
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

const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// BAC Simülasyon Değişkenleri
const targetId = ref('2'); 
const isSimLoading = ref(false);
const profileData = ref(null);
const simError = ref('');
const exploitStatus = ref('idle'); 
const simulationSuccess = ref(false);

const answerKeys = {
  pre: { q1: "d", q2: "c", q3: "b" },
  post: { q1: "c", q2: "b", q3: "b" }, 
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 2: Broken Access Control (BAC)",
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
    simDesc: "Şirketin İntranet portalına <b>YBS Uzmanı Atakan</b> olarak giriş yaptın. Aşağıdaki tarayıcıda adres çubuğunun sonunda senin ID numaran olan <b>2</b> yazıyor ve kendi profilini görüyorsun.<br><br>Acaba sistem adres çubuğundaki (URL) bu sayıya körü körüne güveniyor mu? Kendi ID numaranı silip yerine başka numaralar (Örn: 1 veya 3) yazıp ENTER'a basarsan ne olur? Kimlerin profiline ve gizli verilerine ulaşabileceğini keşfet!",
    btnToTrn: "Zafiyeti Buldun! Eğitime Geç",
    loading: "Sunucu ile iletişim kuruluyor...",
    notFound: "Hata:",
    errConn: "Sunucu bağlantı hatası! Backend sunucunuzu kontrol edin.",
    email: "E-posta",
    phone: "Telefon",
    secMsg: "Sistem Uyarı Mesajı",

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
    alertResult: (pre, post) => `Congratulations!\nPre-Test Score: ${pre}%\nPost-Test Score: ${post}%\n\nRedirecting to your stats...`,
    modTitle: "Module 2: Broken Access Control (BAC)",
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
    simDesc: "You logged into the company Intranet portal as an <b>MIS Specialist named Atakan</b>. In the browser below, you see your profile, and the URL ends with your ID number, <b>2</b>.<br><br>Does the system blindly trust this number in the URL? What happens if you delete your ID and type other numbers (e.g., 1 or 3) and press ENTER? Discover whose profiles and private data you can access!",
    btnToTrn: "Vulnerability Found! Go to Training",
    loading: "Connecting to server...",
    notFound: "Error:",
    errConn: "Server connection error! Check your backend server.",
    email: "Email",
    phone: "Phone",
    secMsg: "Secret System Message",

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
    "İK Müdürü": "HR Manager",
    "CEO": "CEO",
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
  if (currentStep.value === 2 && profileData.value) loadProfile(); 
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
    loadProfile(); 
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

// GERÇEK BACKEND ÜZERİNDEN PROFİL YÜKLEME
const loadProfile = async () => {
  if (!targetId.value) return;
  
  isSimLoading.value = true;
  profileData.value = null;
  simError.value = '';
  
  try {
    const response = await fetch(`/api/vuln/bac/profile/${targetId.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();

    if (result.success) {
      let avatarColor = "linear-gradient(135deg, #64748b, #475569)"; // Default
      if (targetId.value === "1") avatarColor = "linear-gradient(135deg, #ef4444, #b91c1c)"; // Admin/CEO Red
      else if (targetId.value === "2") avatarColor = "linear-gradient(135deg, #3b82f6, #2563eb)"; // User Blue
      else if (targetId.value === "3") avatarColor = "linear-gradient(135deg, #8b5cf6, #6d28d9)"; // HR Purple

      let role = result.data.role;
      let dept = result.data.department || "Belirtilmedi";
      let secMsg = result.data.secret_message;

      // İngilizce çeviri kontrolü
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

      // 2 (Atakan) harici bir profil açıldığında başarılı say!
      exploitStatus.value = 'success';
      simulationSuccess.value = (targetId.value !== "2");
    } else {
      exploitStatus.value = 'error';
      simError.value = result.message || currentText.value.errConn;
      simulationSuccess.value = false;
    }
  } catch (error) {
    exploitStatus.value = 'error';
    simError.value = currentText.value.errConn;
  } finally {
    isSimLoading.value = false;
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
        module: "bac",
        preScore: preScore,
        postScore: postScore,
        answers: answers 
      }),
    });
    
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem(`bac_draft_answers_${userEmail}`); 
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
   SİMÜLASYON TASARIMI (URL MANTIĞI)
   ========================================================= */
.guide-panel { background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: 12px; border: 1px solid #334155; }
.brief-header { color: #f8fafc; font-size: 14px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
.pulse-icon { width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
.sim-desc { font-size: 15px; line-height: 1.6; margin: 0; color: #cbd5e1; }

.mock-browser { background: #0b1120; border-radius: 12px; border: 1px solid #334155; overflow: hidden; margin-bottom: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
.browser-header { background: #1e293b; padding: 12px 20px; display: flex; align-items: center; border-bottom: 1px solid #000; }
.browser-dots { display: flex; gap: 8px; margin-right: 20px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }

.url-bar { flex-grow: 1; background: #050505; border-radius: 6px; padding: 6px 15px; display: flex; align-items: center; border: 1px solid #334155; font-family: monospace; font-size: 14px; }
.url-protocol { color: #64748b; }
.url-input { background: transparent; border: none; color: #38bdf8; font-weight: bold; font-family: monospace; font-size: 16px; flex-grow: 1; outline: none; margin-left: 2px; }
.url-btn { background: #3b82f6; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; margin-left: 10px;}
.url-btn:hover { background: #2563eb; }

.browser-content { padding: 30px; min-height: 280px; background: #0f172a; color: #cbd5e1; }
.sim-loading, .sim-error { text-align: center; padding: 40px; font-size: 16px; color: #94a3b8;}
.sim-error { color: #ef4444; }

/* Profil Kartı */
.profile-card { background: #1e293b; border: 1px solid #334155; padding: 30px; border-radius: 12px; }
.admin-profile { border: 1px solid #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.1); }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid #334155; padding-bottom: 25px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); }
.profile-info h3 { margin: 0 0 10px 0; color: #f8fafc; font-size: 24px; }
.badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 700; margin-right: 8px; }
.badge-role { background: rgba(59, 130, 246, 0.1); color: #38bdf8; border: 1px solid #38bdf8;}
.badge-dept { background: rgba(148, 163, 184, 0.1); color: #cbd5e1; border: 1px solid #64748b;}
.admin-profile .badge-role { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border-color: #ef4444; }

.profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #0b1120; padding: 20px; border-radius: 8px; border: 1px dashed #334155; }
.profile-details p { margin: 0; color: #94a3b8; font-size: 15px; }
.profile-details b { color: #cbd5e1; }
.secret-alert { background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 20px; color: #fca5a5; font-size: 15px; border-radius: 6px; line-height: 1.6; }
.secret-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 16px; color: #ef4444;}

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