<template>
  <div class="module-wrapper">
    <button class="lang-btn" @click="toggleLanguage">
      {{ currentLang === 'tr' ? 'EN' : 'TR' }}
    </button>

    <div class="module-container">
      
      <div v-if="isLoading" style="text-align: center; padding: 50px 0;">
        <span class="spinner" style="display:inline-block; border-color: #00e5ff; border-top-color: transparent; width: 40px; height: 40px;"></span>
        <p style="color: #00e5ff; margin-top: 20px;">Veriler Çekiliyor...</p>
      </div>

      <div v-else-if="currentStep === 1" class="step active">
        <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Ön-Test Analizi</h2>
        <h2 v-else>{{ currentText.s1Title }}</h2>
        <p v-if="!isReviewMode">{{ currentText.s1Desc }}</p>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.preQ1Text }}</b></p>
          <label :class="getLabelClass('pre', 'q1', 'a')"><input type="radio" v-model="answers.preQ1" value="a" :disabled="isReviewMode" /> <span>{{ currentText.preQ1a }}</span></label>
          <label :class="getLabelClass('pre', 'q1', 'b')"><input type="radio" v-model="answers.preQ1" value="b" :disabled="isReviewMode" /> <span>{{ currentText.preQ1b }}</span></label>
          <label :class="getLabelClass('pre', 'q1', 'c')"><input type="radio" v-model="answers.preQ1" value="c" :disabled="isReviewMode" /> <span>{{ currentText.preQ1c }}</span></label>
          <label :class="getLabelClass('pre', 'q1', 'd')"><input type="radio" v-model="answers.preQ1" value="d" :disabled="isReviewMode" /> <span>{{ currentText.preQ1d }}</span></label>
        </div>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.preQ2Text }}</b></p>
          <label :class="getLabelClass('pre', 'q2', 'a')"><input type="radio" v-model="answers.preQ2" value="a" :disabled="isReviewMode" /> <span>{{ currentText.preQ2a }}</span></label>
          <label :class="getLabelClass('pre', 'q2', 'b')"><input type="radio" v-model="answers.preQ2" value="b" :disabled="isReviewMode" /> <span>{{ currentText.preQ2b }}</span></label>
          <label :class="getLabelClass('pre', 'q2', 'c')"><input type="radio" v-model="answers.preQ2" value="c" :disabled="isReviewMode" /> <span>{{ currentText.preQ2c }}</span></label>
          <label :class="getLabelClass('pre', 'q2', 'd')"><input type="radio" v-model="answers.preQ2" value="d" :disabled="isReviewMode" /> <span>{{ currentText.preQ2d }}</span></label>
        </div>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.preQ3Text }}</b></p>
          <label :class="getLabelClass('pre', 'q3', 'a')"><input type="radio" v-model="answers.preQ3" value="a" :disabled="isReviewMode" /> <span>{{ currentText.preQ3a }}</span></label>
          <label :class="getLabelClass('pre', 'q3', 'b')"><input type="radio" v-model="answers.preQ3" value="b" :disabled="isReviewMode" /> <span>{{ currentText.preQ3b }}</span></label>
          <label :class="getLabelClass('pre', 'q3', 'c')"><input type="radio" v-model="answers.preQ3" value="c" :disabled="isReviewMode" /> <span>{{ currentText.preQ3c }}</span></label>
          <label :class="getLabelClass('pre', 'q3', 'd')"><input type="radio" v-model="answers.preQ3" value="d" :disabled="isReviewMode" /> <span>{{ currentText.preQ3d }}</span></label>
        </div>

        <button class="btn-next" @click="finishPreTest">
          {{ isReviewMode ? 'Sonraki Aşama (Simülasyon)' : currentText.btnNext1 }}
        </button>
      </div>

      <div v-else-if="currentStep === 2" class="step active">
        <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Simülasyon</h2>
        <h2 v-else>{{ currentText.s2Title }}</h2>

        <div class="summary-box">
          <p style="margin: 0; color: #e2e8f0; font-size: 16px; font-style: italic; line-height: 1.6;">
            {{ currentText.s2Summary }}
          </p>
        </div>

        <p v-html="currentText.s2Desc"></p>

        <div class="info-box">
          <h4 style="margin-top: 0; color: #00e5ff">{{ currentText.infoTitle }}</h4>
          <ul style="color: #d1d5db; line-height: 1.8">
            <li><b style="color: #00e5ff">' (Tek Tırnak):</b> <span>{{ currentText.expl1 }}</span></li>
            <li><b style="color: #10b981">OR 1=1:</b> <span>{{ currentText.expl2 }}</span></li>
            <li><b style="color: #ef4444">-- (İki Tire):</b> <span>{{ currentText.expl3 }}</span></li>
          </ul>
        </div>

        <div class="simulation-box">
          <h3 style="color: #ef4444; text-align: center; margin-top: 0">{{ currentText.simPanelTitle }}</h3>
          <input type="text" v-model="simEmail" class="sim-input" :placeholder="currentText.emailPlaceholder" />
          <input type="password" v-model="simPass" class="sim-input" :placeholder="currentText.passPlaceholder" />
          <button class="sim-btn" @click="runExploit">{{ currentText.btnHack }}</button>
          
          <div v-if="simResult" v-html="simResult" style="margin-top: 20px;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px;">
          <button class="btn-next" style="background: #374151; float:none;" @click="currentStep = 1">Önceki</button>
          <button class="btn-next" style="background: linear-gradient(135deg, #2563eb, #3b82f6); float:none;" @click="currentStep = 3">
            {{ currentText.btnNext2 }}
          </button>
        </div>
      </div>

      <div v-else-if="currentStep === 3" class="step active">
        <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Eğitim Materyali</h2>
        <h2 v-else>{{ currentText.s3Title }}</h2>

        <h3 style="margin-top: 0; color: #00e5ff">{{ currentText.s3DefTitle }}</h3>
        <p style="margin-bottom: 25px">{{ currentText.s3DefDesc }}</p>

        <h3 style="color: #10b981; border-top: 1px solid #1f2937; padding-top: 20px;">{{ currentText.s3SolTitle }}</h3>
        <p v-html="currentText.s3SolDesc1"></p>

        <h4 style="color: #ef4444; margin-bottom: 5px">{{ currentText.labelVuln }}</h4>
        <pre><code><span class="code-comment">// KÖTÜ KULLANIM: Kullanıcı verisi kodun içine doğrudan gömülüyor</span>
<span class="code-keyword">const</span> <span class="code-var">query</span> = <span class="code-string">`SELECT * FROM users 
               WHERE email = '<span style="color:#ef4444;">${email}</span>' 
               AND password = '${password}'`</span>;</code></pre>

        <p v-html="currentText.s3SolDesc2"></p>

        <h4 style="color: #10b981; margin-bottom: 5px">{{ currentText.labelSec }}</h4>
        <pre><code><span class="code-comment">// GÜVENLİ: Doğrudan koda yapıştırmak yerine parametre (?) kullanımı</span>
<span class="code-keyword">const</span> <span class="code-var">query</span> = <span class="code-string">`SELECT * FROM users 
               WHERE email = <span style="color:#10b981;">?</span> 
               AND password = <span style="color:#10b981;">?</span>`</span>;</code></pre>

        <div style="display: flex; justify-content: space-between; margin-top: 25px;">
          <button class="btn-next" style="background: #374151; float:none;" @click="currentStep = 2">Önceki</button>
          <button class="btn-next" style="float:none;" @click="currentStep = 4">{{ currentText.btnNext3 }}</button>
        </div>
      </div>

      <div v-else-if="currentStep === 4" class="step active">
        <h2 v-if="isReviewMode" style="color: #10b981;">🔍 İnceleme Modu: Son-Test Analizi</h2>
        <h2 v-else>{{ currentText.s4Title }}</h2>
        <p v-if="!isReviewMode">{{ currentText.s4Desc }}</p>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.postQ1Text }}</b></p>
          <label :class="getLabelClass('post', 'q1', 'a')"><input type="radio" v-model="answers.postQ1" value="a" :disabled="isReviewMode" /> <span>{{ currentText.postQ1a }}</span></label>
          <label :class="getLabelClass('post', 'q1', 'b')"><input type="radio" v-model="answers.postQ1" value="b" :disabled="isReviewMode" /> <span>{{ currentText.postQ1b }}</span></label>
          <label :class="getLabelClass('post', 'q1', 'c')"><input type="radio" v-model="answers.postQ1" value="c" :disabled="isReviewMode" /> <span>{{ currentText.postQ1c }}</span></label>
          <label :class="getLabelClass('post', 'q1', 'd')"><input type="radio" v-model="answers.postQ1" value="d" :disabled="isReviewMode" /> <span>{{ currentText.postQ1d }}</span></label>
        </div>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.postQ2Text }}</b></p>
          <label :class="getLabelClass('post', 'q2', 'a')"><input type="radio" v-model="answers.postQ2" value="a" :disabled="isReviewMode" /> <span>{{ currentText.postQ2a }}</span></label>
          <label :class="getLabelClass('post', 'q2', 'b')"><input type="radio" v-model="answers.postQ2" value="b" :disabled="isReviewMode" /> <span>{{ currentText.postQ2b }}</span></label>
          <label :class="getLabelClass('post', 'q2', 'c')"><input type="radio" v-model="answers.postQ2" value="c" :disabled="isReviewMode" /> <span>{{ currentText.postQ2c }}</span></label>
          <label :class="getLabelClass('post', 'q2', 'd')"><input type="radio" v-model="answers.postQ2" value="d" :disabled="isReviewMode" /> <span>{{ currentText.postQ2d }}</span></label>
        </div>

        <div class="question-box">
          <p><b style="color: #00e5ff">{{ currentText.postQ3Text }}</b></p>
          <label :class="getLabelClass('post', 'q3', 'a')"><input type="radio" v-model="answers.postQ3" value="a" :disabled="isReviewMode" /> <span>{{ currentText.postQ3a }}</span></label>
          <label :class="getLabelClass('post', 'q3', 'b')"><input type="radio" v-model="answers.postQ3" value="b" :disabled="isReviewMode" /> <span>{{ currentText.postQ3b }}</span></label>
          <label :class="getLabelClass('post', 'q3', 'c')"><input type="radio" v-model="answers.postQ3" value="c" :disabled="isReviewMode" /> <span>{{ currentText.postQ3c }}</span></label>
          <label :class="getLabelClass('post', 'q3', 'd')"><input type="radio" v-model="answers.postQ3" value="d" :disabled="isReviewMode" /> <span>{{ currentText.postQ3d }}</span></label>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px;">
          <button class="btn-next" style="background: #374151; float:none;" @click="currentStep = 3">Önceki</button>
          
          <button class="btn-next" @click="finishPostTest" :disabled="isSaving" style="float:none;">
            <span v-if="isSaving" class="spinner" style="display:inline-block; vertical-align:middle; margin-right:8px;"></span>
            {{ isReviewMode ? 'İncelemeyi Bitir ve Dön' : (isSaving ? 'Kaydediliyor...' : currentText.btnFinish) }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // URL'deki ?review=true parametresini okumak için
const currentLang = ref('tr');
const currentStep = ref(1); 
const isSaving = ref(false);
const isLoading = ref(true); // Veriler gelene kadar bekletme ekranı

const isReviewMode = computed(() => route.query.review === 'true');

const scores = reactive({ pre: 0, post: 0 });

const answers = reactive({
  preQ1: '', preQ2: '', preQ3: '',
  postQ1: '', postQ2: '', postQ3: ''
});

const simEmail = ref('');
const simPass = ref('');
const simResult = ref('');

const answerKeys = {
  pre: { q1: "b", q2: "c", q3: "b" },
  post: { q1: "b", q2: "c", q3: "b" },
};

// Çeviriler (Aynı bıraktım)
const translations = {
  tr: {
    s1Title: "Adım 1: Ön-Test (Bilgi Ölçümü)",
    s1Desc: "Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.",
    preQ1Text: "Soru 1: SQL Injection (SQLi) nedir?",
    preQ1a: "A) Veritabanı sunucuları arasındaki trafiğin şifrelenmemesinden kaynaklanan bir veri sızıntısı türüdür.",
    preQ1b: "B) Kullanıcı girdilerinin, çalıştırılabilir SQL komutlarının bir parçası olarak yorumlanmasına izin veren bir güvenlik açığıdır.",
    preQ1c: "C) Sistemi kandırmak amacıyla veritabanına sahte bilgiler enjekte etme işlemidir.",
    preQ1d: "D) Web sunucusuna aşırı istek göndererek (DDoS) veritabanını erişilemez hale getirme yöntemidir.",
    preQ2Text: "Soru 2: Siber güvenlikte 'Payload' terimi ne anlama gelir?",
    preQ2a: "A) Veritabanına sızdıktan sonra elde edilen kullanıcı şifrelerinin bütünü",
    preQ2b: "B) Sistemin güvenlik duvarını aşmak için kullanılan şifreleme algoritması",
    preQ2c: "C) Bir zafiyeti tetiklemek için hedefe iletilen zararlı veri veya kod parçası",
    preQ2d: "D) Sunucunun istemciye yanıt olarak gönderdiği HTTP başlıklarının tamamı",
    preQ3Text: "Soru 3: Bir web sitesinde SQL Injection zafiyeti oluşmasına neden olan en riskli programlama hatası aşağıdakilerden hangisidir?",
    preQ3a: "A) Kullanıcı şifrelerinin veritabanına kaydedilmeden önce hashlenmemesi",
    preQ3b: "B) Kullanıcı girdilerinin doğrudan SQL sorgu metniyle birleştirilmesi",
    preQ3c: "C) Web sitesinde SSL sertifikası bulunmadığı için verilerin açık okunabilmesi",
    preQ3d: "D) Sistemin art arda yapılan çok sayıda hatalı giriş denemesini engellememesi",
    btnNext1: "Testi Bitir ve Simülasyona Geç",

    s2Title: "Adım 2: Zafiyet Simülasyonu (Hack Time)",
    s2Summary: "Bu login paneline kullanıcı adı ve şifre gibi istenen verileri girmek yerine bir SQL sorgusu yazıyoruz. Yani bize bırakılan bu boşluktan faydalanarak istediğimiz sorguyu yazıp veritabanını manipüle ediyor ve normalde gizlenmesi gereken bilgilere ulaşıyoruz. :)",
    s2Desc: "Aşağıda güvenlik açığı barındıran zafiyetli bir sistemin giriş paneli bulunmaktadır. Sizden normal bir 'E-posta' bekleniyor. Ancak biz buraya kendi ismimizi yazmak yerine, arka planda çalışan veritabanını kandıracak <b>özel bir metin</b> yazacağız. <br><br>Siber güvenlikte buna <b>'Payload' (Saldırı Yükü)</b> denir. Hedefe gönderdiğimiz bu metni, sistemin masum sanıp içeri aldığı ama aslında kapıları içeriden açan <b>dijital bir Truva Atı 🐴</b> gibi düşünebilirsin!<br><br> Hadi o Truva Atını sisteme yollayalım. E-posta kısmına tam olarak şunu yazın: <b style='color: #ef4444;'>' OR 1=1 --</b>",
    infoTitle: "Peki bu payload ne işe yarayacak? (' OR 1=1 --)",
    expl1: "Geliştiricinin arka planda yazdığı kodu biz erken kapatıyoruz. Böylece sistemin kodunun içine kendi kelimelerimizi ekleyebiliyoruz.",
    expl2: "'Veya 1 eşittir 1' diyoruz. 1 her zaman 1'e eşit olduğu için, veritabanı 'Tamam bu kişi doğru söylüyor' diyerek bizi zorla içeri alıyor.",
    expl3: "Veritabanına 'Bundan sonra yazan şifre kontrol kısmını tamamen görmezden gel, sil gitsin' emrini veriyor.",
    simPanelTitle: "Zafiyetli Yönetici Paneli",
    emailPlaceholder: "E-posta Adresi (Saldırı metnini buraya yazın)",
    passPlaceholder: "Şifre (Rastgele bir şeyler sallayın)",
    btnHack: "Giriş Yapmayı Dene (Hack)",
    btnNext2: "Saldırıyı Analiz Et (Eğitime Geç)",

    s3Title: "Adım 3: Zafiyet Analizi ve Çözümü",
    s3DefTitle: "SQL Injection (SQLi) Nedir?",
    s3DefDesc: "Kötü niyetli kullanıcıların, uygulamanın veritabanına gönderdiği sorgulara müdahale etmesini sağlayan kritik bir güvenlik açığıdır. Geliştirici, kullanıcıdan aldığı veriyi güvenlik süzgecinden geçirmeden doğrudan SQL komutunun içine koyarsa, saldırgan kendi zararlı komutlarını sistemin komutuymuş gibi veritabanına çalıştırttırabilir.",
    s3SolTitle: "Nasıl Çözülür? (Prepared Statements)",
    s3SolDesc1: "Güvenlik açığının temel sebebi, kullanıcının girdiği metnin bir 'veri' olarak değil, çalıştırılabilir bir 'SQL komutu' olarak algılanmasıdır. Bunu kesin olarak çözmek için <b>Parametreli Sorgular (Prepared Statements)</b> kullanmalıyız.",
    s3SolDesc2: "Aşağıdaki güvenli kodda görebileceğiniz gibi, dışarıdan gelen verileri doğrudan SQL metnine yazmak yerine <b>? (soru işareti)</b> koyuyoruz. Veritabanı sürücüsü, bu soru işaretlerinin yerine gelecek verileri otomatik olarak temizler ve sadece düz metin olarak işler.",
    labelVuln: "Hatalı (Zafiyetli) Kod Kullanımı:",
    labelSec: "Güvenli (Doğru) Kod Kullanımı:",
    btnNext3: "Öğrendiklerini Test Et (Son-Test)",

    s4Title: "Adım 4: Son-Test",
    s4Desc: "Bu modülde öğrendiklerinizi pekiştirelim.",
    postQ1Text: "Soru 1: Bir Node.js uygulamasında SQL Injection'ı KESİN olarak önlemek için en iyi yöntem aşağıdakilerden hangisidir?",
    postQ1a: "A) Sunucuya gelen tüm istekleri Base64 formatına çevirerek veritabanına kaydetmek",
    postQ1b: "B) Veritabanı sorgularında Parametreli Sorgular kullanarak kod ve veriyi yalıtmak",
    postQ1c: "C) Veritabanı şifrelerini SHA-256 gibi algoritmalarla hashleyerek saklamak",
    postQ1d: "D) Kullanıcıdan alınan verilerdeki özel işaretleri sadece Frontend'de engellemek",
    postQ2Text: "Soru 2: Simülasyonda kullandığımız ' OR 1=1 -- payload'unun teknik olarak tam işlevi nedir?",
    postQ2a: "A) Veritabanındaki 'admin' tablosunu bulup ilk kaydı yetkilendirir.",
    postQ2b: "B) SQL sunucusunda bellek taşması yaratarak sistemi güvenli moda geçirir.",
    postQ2c: "C) Sorgu koşulunu her zaman doğru yapıp kalan komutları yorum satırına çevirir.",
    postQ2d: "D) Veritabanı bağlantı şifresini güncelleyerek sisteme gizli bir arka kapı bırakır.",
    postQ3Text: "Soru 3: Eğitim adımında gördüğümüz 'Parametreli Sorgular' yöntemi, SQL Injection saldırılarını temel olarak nasıl durdurur?",
    postQ3a: "A) Gelen tüm metinleri veritabanına ulaşmadan önce şifreleyerek",
    postQ3b: "B) Kullanıcı girdisini çalıştırılabilir kod yerine yalnızca salt veri olarak işleyerek",
    postQ3c: "C) İçerisinde zararlı kelimeler geçen tüm girişleri otomatik olarak silerek",
    postQ3d: "D) Veritabanında sadece yöneticilerin işlem yapabilmesi için yetki kontrolleri uygulayarak",
    btnFinish: "Modülü Tamamla",

    msgSuccess: "VERİTABANI SIZINTISI BAŞARILI! <br><span style='font-size:14px; color:#d1d5db;'>Şifre kontrolü atlatıldı ve tüm tablo verileri döküldü:</span>",
    msgError: "SQL Hatası Tetiklendi:",
    msgFail: "Giriş Başarısız.",
    tblEmail: "E-posta",
    tblPass: "Şifre",
    tblSecret: "Gizli Veri",
    warnEmpty: "Lütfen ilerlemeden önce tüm soruları yanıtlayın.",
    alertResult: (pre, post) => `Modül tamamlandı!\n\n📋 Ön-Test Başarınız: ${pre}/100\n🏆 Son-Test Başarınız: ${post}/100\n\nFarkındalık artışınız kaydediliyor... Dashboard'a yönlendiriliyorsunuz.`,
  },
  en: {
    // İngilizce çevirileri satır sayısını şişirmemek için kırptım, sen eklersin :)
    btnNext1: "Finish Test & Go to Simulation",
    btnNext2: "Analyze Attack (Go to Education)",
    btnNext3: "Test Your Knowledge (Post-Test)",
    btnFinish: "Complete Module",
    warnEmpty: "Please answer all questions before proceeding.",
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
};

// YENİ: Dinamik CSS Sınıfı Belirleyici (Doğru/Yanlış Renklendirmesi)
const getLabelClass = (testPrefix, questionKey, option) => {
  if (!isReviewMode.value) return ''; // İnceleme modunda değilsek normal kalsın
  
  const selectedAnswer = answers[`${testPrefix}${questionKey.charAt(0).toUpperCase() + questionKey.slice(1)}`]; // örn: preQ1
  const correctAnswer = answerKeys[testPrefix][questionKey]; // örn: b
  
  if (option === correctAnswer) return 'correct-answer'; // Doğru şık her zaman yeşil yanar
  if (selectedAnswer === option && option !== correctAnswer) return 'wrong-answer'; // Seçilen yanlış şık kırmızı yanar
  
  return '';
};

// YENİ: Kullanıcı cevap işaretledikçe (eğer incelemede değilsek) tarayıcıya taslak olarak kaydet
watch(answers, (newAnswers) => {
  if (!isReviewMode.value) {
    localStorage.setItem('sqli_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

// SAYFA YÜKLENDİĞİNDE: Geçmişi Kontrol Et
onMounted(async () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    router.push('/');
    return;
  }

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.sqli_answers) {
        Object.assign(answers, result.data.sqli_answers); // Veritabanındaki şıkları HTML'e yansıt
      }
    } catch (error) {
      console.error("Geçmiş veriler çekilemedi:", error);
    }
  } else {
    // NORMAL MOD: Yarım kalan bir taslak varsa geri yükle
    const savedDraft = localStorage.getItem('sqli_draft_answers');
    if (savedDraft) {
      Object.assign(answers, JSON.parse(savedDraft));
    }
  }
  
  isLoading.value = false; // Yükleme animasyonunu bitir, sayfayı göster
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
  currentStep.value = 2; // Simülasyona geç veya İleri git
};

const runExploit = async () => {
  simResult.value = `<p style="color:#a1a1aa; text-align:center;">Sunucuya bağlanılıyor...</p>`;
  
  try {
    const baseUrl = "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/vuln/sqli/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: simEmail.value, password: simPass.value }),
    });
    
    const responseData = await response.json();
    
    if (responseData.success) {
      let tableHTML = `<table class="db-table"><thead><tr>
                        <th>ID</th><th>E-posta</th><th>Şifre</th><th>Gizli Veri</th>
                       </tr></thead><tbody>`;
                       
      responseData.data.forEach((user) => {
        tableHTML += `<tr><td>${user.id}</td><td>${user.email}</td><td>${user.password}</td><td style="color:#00e5ff; font-weight:bold;">${user.secret_data}</td></tr>`;
      });
      tableHTML += `</tbody></table>`;
      
      simResult.value = `<h3 style="color:#10b981; text-align:center; margin-top:20px;">VERİTABANI SIZINTISI BAŞARILI!</h3>` + tableHTML;
    } else {
      simResult.value = `<p style="color:#ef4444; text-align:center; font-weight:bold; margin-top:20px;">Başarısız!</p>`;
    }
  } catch (error) {
    simResult.value = `<p style="color:#ef4444; text-align:center;">Sunucuya ulaşılamadı.</p>`;
  }
};

const finishPostTest = async () => {
  // Eğer kullanıcı sadece inceleme modundaysa, kaydetmeden direkt çıkmasını sağla
  if (isReviewMode.value) {
    router.push("/dashboard");
    return;
  }

  if (!answers.postQ1 || !answers.postQ2 || !answers.postQ3) {
    alert(currentText.value.warnEmpty);
    return;
  }
  
  scores.pre = calculateScore("pre");
  scores.post = calculateScore("post");
  const userEmail = localStorage.getItem("userEmail");
  isSaving.value = true;
  
  try {
    const baseUrl = "http://localhost:3000";
    await fetch(`${baseUrl}/api/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        module: "sqli",
        preScore: scores.pre,
        postScore: scores.post,
        answers: answers // YENİ: Tüm işaretlenen şıkları Firebase'e paketleyip yolluyoruz!
      }),
    });
    
    alert(currentText.value.alertResult(scores.pre, scores.post));
    
    // İşlem tamamen bitince taslağı temizle ki bir sonraki kullanıcıya kalmasın
    localStorage.removeItem('sqli_draft_answers'); 
    router.push("/dashboard");
  } catch (err) {
    alert("Skor kaydedilirken hata oluştu!");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* Senin CSS'inin tamamı duruyor, sadece doğru/yanlış analiz renklerini ekledim */
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
.lang-btn { position: absolute; top: 20px; right: 20px; background-color: transparent; color: #00e5ff; border: 1px solid #00e5ff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; }
.lang-btn:hover { background-color: #00e5ff; color: #0b0f19; box-shadow: 0 0 10px rgba(0, 229, 255, 0.4); }
.module-container { background: #111827; width: 100%; max-width: 900px; padding: 40px; border-radius: 12px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); position: relative; overflow: hidden; }
.module-container::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, #00e5ff, #007bff); }
.step { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
h2 { color: #f8fafc; border-bottom: 1px solid #1f2937; padding-bottom: 15px; margin-top: 0; }
h3 { color: #e2e8f0; }
p { line-height: 1.6; }
b { color: #e2e8f0; }

.btn-next { background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 25px; float: right; transition: all 0.3s ease; letter-spacing: 1px; }
.btn-next:hover:not(:disabled) { box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); transform: translateY(-2px); }
.btn-next:disabled { opacity: 0.7; cursor: wait; }

.question-box { margin-bottom: 25px; background: #1f2937; padding: 20px; border-radius: 8px; border: 1px solid #374151; }
.question-box p { margin-top: 0; font-size: 16px; }
.question-box label { display: block; margin: 12px 0; cursor: pointer; color: #d1d5db; transition: color 0.2s; padding: 8px; border-radius: 4px; border: 1px solid transparent; }
.question-box label:hover { color: #00e5ff; background: rgba(0, 229, 255, 0.05); border-color: #374151; }
.question-box label input:disabled { cursor: not-allowed; }

.info-box { background: rgba(0, 229, 255, 0.05); border-left: 4px solid #00e5ff; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
.info-box ul { padding-left: 20px; margin-bottom: 0; }
.info-box li { margin-bottom: 10px; }
.summary-box { background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
.simulation-box { border: 1px solid #ef4444; padding: 25px; border-radius: 8px; background-color: rgba(239, 68, 68, 0.05); margin-top: 25px; box-shadow: inset 0 0 15px rgba(239, 68, 68, 0.1); }
.sim-input { width: 100%; padding: 12px; margin: 10px 0; background-color: #1f2937; color: #e2e8f0; border: 1px solid #374151; border-radius: 6px; box-sizing: border-box; transition: 0.3s; }
.sim-input:focus { border-color: #ef4444; outline: none; box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
.sim-btn { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; border: none; padding: 12px; width: 100%; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 15px; transition: all 0.3s ease; letter-spacing: 1px; }
.sim-btn:hover { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); transform: translateY(-2px); }

pre { background: #0b0f19; padding: 20px; border-radius: 8px; border: 1px solid #1f2937; overflow-x: auto; margin: 15px 0; }
code { font-family: "Consolas", "Courier New", monospace; color: #e2e8f0; font-size: 14px; line-height: 1.6; }
.code-keyword { color: #c678dd; }
.code-string { color: #98c379; }
.code-var { color: #e5c07b; }
.code-comment { color: #6b7280; font-style: italic; }

:deep(.db-table) { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; background: #111827; }
:deep(.db-table th) { background-color: #1f2937; color: #00e5ff; padding: 12px; text-align: left; border: 1px solid #374151; }
:deep(.db-table td) { padding: 10px 12px; border: 1px solid #374151; color: #e2e8f0; }
:deep(.db-table tr:nth-child(even)) { background-color: #172033; }
:deep(.db-table tr:hover) { background-color: rgba(16, 185, 129, 0.1); }

/* Yükleme animasyonu CSS'i */
.spinner { border-radius: 50%; border: 3px solid; border-top-color: transparent; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>