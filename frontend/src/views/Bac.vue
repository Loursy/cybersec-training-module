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
        <p>{{ currentText.loading }}</p>
      </div>

      <div v-else class="module-content fade-in">
        <h1 class="mod-title">{{ currentText.modTitle }}</h1>
        <p class="mod-desc">{{ currentText.modDesc }}</p>
        <div class="neon-divider"></div>

        <div v-if="currentStep === 1" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? '🔍 İnceleme Modu: Ön-Test Analizi' : currentText.preTitle }}
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
              {{ isReviewMode ? 'Sonraki Aşama (Simülasyon)' : currentText.btnPre }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? '🔍 İnceleme Modu: Simülasyon' : currentText.simTitle }}
          </h2>
          <p class="sim-desc" v-html="currentText.simDesc"></p>

          <div class="mock-browser">
            <div class="browser-header">
              <div class="browser-dots">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <div class="url-bar">
                <span class="url-protocol">🔒 https://intranet.sirket.com/api/profile/</span>
                <input type="text" v-model="targetId" class="url-input" autocomplete="off" @keydown.enter="loadProfile" />
              </div>
            </div>
            
            <div class="browser-content">
              <div v-if="isSimLoading" class="sim-loading">{{ currentText.loading }}</div>
              
              <div v-else-if="profileData" class="profile-card fade-in">
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
                  <div class="secret-header"><span>🔒</span> <b>{{ currentText.secMsg }}</b></div>
                  {{ profileData.displaySecretMsg }}
                </div>
              </div>

              <div v-else-if="simError" class="sim-error fade-in">
                <b>{{ currentText.notFound }}</b> {{ simError }}
              </div>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 1">Önceki</button>
            <button v-if="simulationSuccess || isReviewMode" class="btn-success fade-in" @click="currentStep = 3">
              {{ currentText.btnToTrn }}
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? '🔍 İnceleme Modu: Eğitim Materyali' : currentText.trnTitle }}
          </h2>

          <div class="info-box logic-box">
            <h3>{{ currentText.trnH1 }}</h3>
            <p v-html="currentText.trnP1"></p>
          </div>

          <div class="info-box solution-box">
            <h3>{{ currentText.trnH2 }}</h3>
            <p v-html="currentText.trnP2"></p>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 2">Önceki</button>
            <button class="btn-primary" @click="currentStep = 4">{{ currentText.btnToPost }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? '🔍 İnceleme Modu: Son-Test Analizi' : currentText.postTitle }}
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

// JWT Token ve User Email
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// Simülasyon Değişkenleri
const targetId = ref('2'); 
const isSimLoading = ref(false);
const profileData = ref(null);
const simError = ref('');
const simulationSuccess = ref(false);

const answerKeys = {
  pre: { q1: "b", q2: "c", q3: "b" },
  post: { q1: "b", q2: "a", q3: "c" }, 
};

// Çeviriler (Aynı bırakıldı)
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
    loading: "Sunucu ile iletişim kuruluyor...",
    notFound: "404 Bulunamadı:",
    errConn: "Sunucu bağlantı hatası!",
    email: "E-posta",
    phone: "Telefon",
    secMsg: "Gizli Sistem Mesajı",
    trnH1: "🛎️ Otel Resepsiyonu Analojisi",
    trnP1: 'Düşünün ki bir otele gittiniz ve resepsiyona <b>"Bana 1 numaralı odanın anahtarını verin"</b> dediniz. Resepsiyonist sizin kim olduğunuza bakmadan, o odanın size ait olup olmadığını kontrol etmeden anahtarı direkt elinize verdi.<br><br>İşte az önce adres çubuğundaki ID\'yi değiştirdiğinizde sistemin yaptığı tam olarak buydu! Sistem sadece "1 numaralı profil var mı?" diye sordu, "Bu veriyi isteyen kişinin o profili görme yetkisi var mı?" diye sormadı. Bu zafiyete <b>IDOR (Insecure Direct Object Reference)</b> denir.',
    trnH2: "🛡️ Çözüm: Nasıl Önlenir?",
    trnP2: 'Yazılımcılar sadece arayüzdeki butonları gizleyerek sistemi koruduklarını sanmamalıdır. Sunucu (Backend), gelen her veri isteğinde mutlaka kullanıcının kimliğini (Oturum veya Token ile) doğrulamalı ve <b>"Bu veriye erişim hakkı var mı?"</b> kontrolünü yapmalıdır.',
    qPre1: '1. "Broken Access Control" kavramı temelde hangi ihlali ifade eder?',
    optPre1_1: "A) Uygulamanın şifreleme zayıflıkları nedeniyle verilerin sızdırılmasıdır.",
    optPre1_2: "B) Kullanıcıların kendilerine atanmamış kaynaklar üzerinde işlem yapabilmesidir.",
    optPre1_3: "C) Sunucu trafiğinin dinlenmesi ve yetkilerin kopyalanmasıdır.",
    qPre2: "2. Güvenli Olmayan Doğrudan Nesne Başvurusu (IDOR) nedir?",
    optPre2_1: "A) Veritabanına doğrudan yetkisiz erişim sağlayarak tabloları silmedir.",
    optPre2_2: "B) Zararlı bir script kodunun sunucuya enjekte edilmesidir.",
    optPre2_3: "C) Sistemin, kullanıcıdan gelen bir parametreyi (ID) doğrulamadan kullanmasıdır.",
    qPre3: "3. Uygulamalarda yetki kontrolleri (Access Control) nerede yapılmalıdır?",
    optPre3_1: "A) Sadece İstemci (Frontend) tarafında.",
    optPre3_2: "B) Sunucu (Backend) tarafında.",
    optPre3_3: "C) Sadece veritabanının içinde.",
    qPost1: '1. "Otel Resepsiyonu" analojisinde sistemin temel hatası neydi?',
    optPost1_1: "A) Otelin kapılarını kilitlemeyi unutması.",
    optPost1_2: "B) Anahtarı isteyen kişinin o odanın gerçek sahibi olup olmadığını kontrol etmemesi.",
    optPost1_3: "C) Yanlış anahtar vermesi.",
    qPost2: "2. Simülasyonda CEO'nun gizli mesajını okumak için hangi yöntemi kullandık?",
    optPost2_1: "A) Adres çubuğundaki kendi ID numaramızı (2) silip, CEO'nun ID'sini (1) yazdık.",
    optPost2_2: "B) Sisteme zararlı bir yazılım (virüs) yükledik.",
    optPost2_3: "C) CEO'nun e-posta şifresini tahmin ettik.",
    qPost3: "3. Geliştiriciler bu zafiyeti önlemek için ne yapmalıdır?",
    optPost3_1: "A) Arayüzdeki (Frontend) menüleri kullanıcılardan gizlemek.",
    optPost3_2: "B) Kullanıcıların şifrelerini daha karmaşık yapmalarını zorunlu kılmak.",
    optPost3_3: "C) Gelen her istekte, arka planda (Backend) kullanıcının yetkisini doğrulamak.",
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
    optPre1_2: "B) The ability of users to perform actions on resources not allocated to them.",
    optPre1_3: "C) The interception of traffic between the server and client.",
    qPre2: "2. Which of the following best describes Insecure Direct Object Reference (IDOR)?",
    optPre2_1: "A) Gaining direct unauthorized access to the database server.",
    optPre2_2: "B) Injecting a malicious script code on the server.",
    optPre2_3: "C) The system's use of a user-supplied parameter (e.g., ID) without validation.",
    qPre3: "3. Where MUST access control checks be strictly enforced?",
    optPre3_1: "A) Only on the Client-side (Frontend).",
    optPre3_2: "B) On the Server-side (Backend).",
    optPre3_3: "C) Only inside the database.",
    qPost1: '1. In the "Hotel Receptionist" analogy, what was the system\'s main mistake?',
    optPost1_1: "A) Forgetting to lock the hotel doors.",
    optPost1_2: "B) Not checking if the person asking for the key was the actual owner.",
    optPost1_3: "C) Giving the wrong key.",
    qPost2: "2. During the simulation, how did we manage to read the CEO's secret message?",
    optPost2_1: "A) By replacing our own ID (2) in the URL bar with the CEO's ID (1).",
    optPost2_2: "B) By uploading malicious software to the system.",
    optPost2_3: "C) By guessing the CEO's email password.",
    qPost3: "3. What should developers do to prevent this vulnerability?",
    optPost3_1: "A) Hide menus and buttons on the interface.",
    optPost3_2: "B) Force users to create more complex passwords.",
    optPost3_3: "C) Verify the user's authorization in the background (Backend) on every request.",
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
  if (!isReviewMode.value) localStorage.setItem('bac_draft_answers', JSON.stringify(newAnswers));
}, { deep: true });

onMounted(async () => {
  if (!userEmail || !token) return router.push('/'); // Token yoksa Login'e şutla!

  if (isReviewMode.value) {
    try {
      // 🚀 JWT ENTEGRASYONU ve LOCALHOST TEMİZLİĞİ
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data?.bac_answers) {
        Object.assign(answers, result.data.bac_answers);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    const savedDraft = localStorage.getItem('bac_draft_answers');
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
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
    // 🚀 JWT ENTEGRASYONU ve LOCALHOST TEMİZLİĞİ
    const response = await fetch(`/api/vuln/bac/profile/${targetId.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
  
  isSaving.value = true;
  const preScore = calculateScore("pre");
  const postScore = calculateScore("post");
  
  try {
    // 🚀 JWT ENTEGRASYONU ve LOCALHOST TEMİZLİĞİ
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
/* Genel Temel */
.module-wrapper { background-color: #0b0f19; color: #cbd5e1; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.container { max-width: 850px; width: 100%; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #3b82f6; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 10px; }
.mod-desc { color: #94a3b8; font-size: 16px; margin-bottom: 25px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #3b82f6, transparent); margin-bottom: 35px; }

.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #3b82f6; padding-left: 15px; margin-bottom: 25px; }
.review-mode-title { color: #10b981; border-left-color: #10b981; }
.sim-desc { font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #cbd5e1; }

/* Sorular ve Seçenekler */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #3b82f6; }
.options label input:disabled { cursor: not-allowed; }

/* İnceleme Modu Renkleri */
.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* Simülasyon Tarayıcısı */
.mock-browser { background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); }
.browser-header { background: #0f172a; padding: 12px 20px; display: flex; align-items: center; border-bottom: 1px solid #334155; }
.browser-dots { display: flex; gap: 8px; margin-right: 20px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }
.url-bar { flex-grow: 1; background: #0b1120; border-radius: 6px; padding: 10px 15px; display: flex; align-items: center; border: 1px solid #1e293b; font-family: monospace; font-size: 14px; }
.url-protocol { color: #64748b; }
.url-input { background: transparent; border: none; color: #38bdf8; font-weight: bold; font-family: monospace; font-size: 15px; flex-grow: 1; outline: none; margin-left: 2px; }
.browser-content { padding: 30px; min-height: 250px; background: #f8fafc; color: #1e293b; }

/* Profil Kartı */
.profile-card { background: #ffffff; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 25px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
.profile-info h3 { margin: 0 0 10px 0; color: #0f172a; font-size: 24px; }
.badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 700; margin-right: 8px; }
.badge-role { background: #dbeafe; color: #1e40af; }
.badge-dept { background: #f1f5f9; color: #475569; }
.profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px dashed #cbd5e1; }
.profile-details p { margin: 0; color: #334155; font-size: 15px; }
.secret-alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; color: #991b1b; font-size: 15px; border-radius: 6px; line-height: 1.6; }
.secret-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 16px; }

/* Bilgi Kutuları */
.info-box { padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #334155; line-height: 1.7; color: #cbd5e1; background: #1e293b; }
.info-box h3 { color: #f8fafc; margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
.logic-box { border-left: 4px solid #f59e0b; }
.solution-box { border-left: 4px solid #10b981; }

/* Butonlar & Aksiyonlar */
.action-footer { margin-top: 30px; display: flex; justify-content: flex-end; }
.action-footer.space-between { justify-content: space-between; }
button { font-family: inherit; }
.btn-primary { background: #0284c7; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(2, 132, 199, 0.4); }
.btn-secondary { background: #334155; color: #f8fafc; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-secondary:hover { background: #475569; }
.btn-success { background: #059669; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-success:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(5, 150, 105, 0.4); }
.btn-warning { background: #f59e0b; color: #0f172a; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* Animasyonlar ve Yükleyiciler */
.fade-in { animation: fadeIn 0.5s ease-out; }
.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(59, 130, 246, 0.3); border-top-color: #3b82f6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
.sim-loading, .sim-error { text-align: center; padding: 40px; font-size: 16px; }
.sim-error { color: #ef4444; }
</style>