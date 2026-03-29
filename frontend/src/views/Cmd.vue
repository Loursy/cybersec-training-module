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

          <div style="display: flex; justify-content: flex-end;">
            <button class="action-btn" @click="finishPreTest" style="width: auto;">
              {{ isReviewMode ? (currentLang === 'tr' ? 'Sonraki Aşama (Simülasyon)' : 'Next Step (Simulation)') : currentText.btnPre }}
            </button>
          </div>
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

            <div class="terminal-container">
              <div class="terminal-box" @click="focusTerminal">
                <div class="terminal-header">
                  <span>bash --login --session_id=8271</span>
                  <span style="color: #10b981">● ONLINE</span>
                </div>
                <div class="terminal-body" ref="terminalBody">
                  
                  <div style="color: #94a3b8; margin-bottom:10px;">
                    BT-Terminal v1.0.4 - {{ currentLang === 'tr' ? 'Hoş geldiniz.' : 'Welcome.' }}<br>
                    {{ currentLang === 'tr' ? 'Sistem hazır. Lütfen ping komutunu girin:' : 'System ready. Please enter the ping command:' }}
                  </div>

                  <div v-for="(line, index) in terminalLines" :key="index" :class="line.type">
                    <span v-if="line.type === 'cmd'" class="prompt">user@bt-server:~$</span> 
                    <span v-html="line.text"></span>
                  </div>

                  <div class="terminal-input-line" v-show="!isExecuting && !isReviewMode && currentMission <= 3">
                    <span class="prompt">user@bt-server:~$</span>
                    <input 
                      type="text" 
                      id="real-input" 
                      ref="terminalInputRef"
                      v-model="terminalInput" 
                      @keyup.enter="executeCommand" 
                      autocomplete="off" 
                      spellcheck="false" 
                      :disabled="isExecuting"
                    />
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end;">
                <button v-if="currentMission > 3 || isReviewMode" class="action-btn" style="background: #10b981; margin-top: 15px; width:auto;" @click="currentStep = 3">
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
                <div class="code-block">
                  <span style="color: #f59e0b">let</span> command = <span style="color: #a7f3d0">"ping "</span> + user_input;<br>
                  execute_system(command);
                </div>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num" style="background: #f59e0b; color: #0b1120">2</div>
              <div>
                <b style="color: #f59e0b; font-size: 16px">{{ currentText.trnH2 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;" v-html="currentText.trnP2"></p>
              </div>
            </div>

            <div class="flow-step">
              <div class="flow-num" style="background: #ef4444; color: #fff">3</div>
              <div>
                <b style="color: #ef4444; font-size: 16px">{{ currentText.trnH3 }}</b>
                <p style="margin-top: 5px; font-size: 14px; color: #cbd5e1; line-height: 1.6;" v-html="currentText.trnP3"></p>
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

// Simülasyon / Terminal Değişkenleri
const currentMission = ref(1);
const terminalInput = ref('');
const terminalInputRef = ref(null);
const terminalBody = ref(null);
const terminalLines = ref([]); // { type: 'cmd'|'output'|'analysis'|'error', text: '' }
const isExecuting = ref(false);

const answerKeys = {
  pre: { q1: "b", q2: "b", q3: "a" },
  post: { q1: "b", q2: "b", q3: "b" },
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 6: OS Command Injection",
    preTitle: "Ön-Test",
    qPre1: "1. OS Command Injection zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPre1_1: "A) İstemci tarafında çalışan zararlı betiklerin (script) sunucu bellek alanını taşırarak sistemi durdurması.",
    optPre1_2: "B) Kullanıcıdan alınan denetimsiz verilerin, arka plandaki işletim sistemi kabuğunda (shell) çalıştırılması.",
    optPre1_3: "C) Web uygulamasının dosya dizin yollarının manipüle edilerek yetkisiz sistem konfigürasyonlarının okunması.",
    qPre2: "2. Bir web uygulamasının arka planında çalışan sistem fonksiyonları (örn: ping aracı) neden güvenlik riski oluşturabilir?",
    optPre2_1: "A) Bu fonksiyonların aşırı ağ isteği üreterek sunucunun işlemci kapasitesini tüketebilmesi.",
    optPre2_2: "B) Geliştiricinin bu fonksiyonları çağırırken girdi doğrulamasını atlaması ve terminal yetkilerinin kötüye kullanılabilmesi.",
    optPre2_3: "C) Ağ protokollerinin web portları üzerinden yönlendirilmesinin güvenlik duvarını ihlal etmesi.",
    qPre3: "3. Linux/Unix sistemlerde komutları peş peşe çalıştırmak için hangi karakterler kullanılır?",
    optPre3_1: "A) Noktalı virgül ( ; ), Veya ( | ), Ve ( && )",
    optPre3_2: "B) Yüzde ( % ) ve Yıldız ( * )",
    optPre3_3: "C) Sadece Tire ( - )",
    btnPre: "Simülasyona Başla",

    simTitle: "Adım 2: Simülasyon",
    gTitle: "📋 Şirket Görev Dosyası",
    gDesc: "Şirketin tüm altyapısı Linux sunucular üzerinde çalışıyor. Ağda yaşanan kopmalar nedeniyle Baş Mühendis senden bu <b>'Web Ping Aracı'</b> ile sunucuların internete bağlı olup olmadığını test etmeni istedi. <i>(Ping, ağdaki bir cihaza 'Orada mısın?' diye sormaktır.)</i>",
    gs1T: "1. Keşif: Normal Çalışma",
    gs1D: "Terminal senden ping komutu bekliyor. Sunucuya <code class='highlight'>ping 127.0.0.1</code> yazıp Enter'a basarak bağlantıyı test et ve sistemin nasıl normal çalıştığını izle.",
    gs2T: "2. Sızma: Dosyaları Listele (ls)",
    gs2D: "Bu web aracının arkasında tam yetkili bir Linux terminali çalıştığını fark ettin! Linux'ta noktalı virgül <code class='highlight'>;</code> komutları ayırır. <code class='highlight'>ls</code> ise <i>(List)</i> dosyaları listeler.<br><br>Sisteme <code class='highlight'>ping 127.0.0.1; ls</code> yazarak aracı kandır ve sunucudaki gizli dosyaları açığa çıkar.",
    gs3T: "3. Veri İfşası: Şifreleri Oku (cat)",
    gs3D: "Artık dosyaları görebiliyorsun! Linux'ta <code class='highlight'>cat</code> komutu dosya okumak için kullanılır. <code class='highlight'>/etc/passwd</code> ise tüm kullanıcı hesaplarının saklandığı sistem dosyasıdır.<br><br><code class='highlight'>ping 127.0.0.1; cat /etc/passwd</code> yazarak yetki sınırlarını tamamen aş!",

    pAnalysis: "--- GÜVENLİK ANALİZİ: Standart ağ paket iletimi gerçekleşti. Sistem beklendiği gibi sadece belirtilen IP'ye ping attı. ---",
    lAnalysis: "--- GÜVENLİK ANALİZİ: DİKKAT! 'ls' komutu sızıntısı başarılı oldu. Sunucunun içindeki gizli sistem dosyaları (server.js vb.) ifşa ediliyor! ---",
    cAnalysis: "--- GÜVENLİK ANALİZİ: FELAKET! Kritik '/etc/passwd' dosyası okundu. Sistemdeki tüm kullanıcıların listesi ele geçirildi! ---",
    wrongCmd: "--- UYARI: İşlem başarısız! Lütfen sol taraftaki rehberde istenen tam komutu (ping dahil) eksiksiz girin. ---",
    wrongIp: "--- UYARI: Hedef sapması! Lütfen görev dosyasında istenen IP adresini (127.0.0.1) kullanın. ---",
    nextMsg: "Sistem sıfırlandı. Yeni terminal görevi bekleniyor...",
    btnToTrn: "TÜM GÖREVLER BAŞARILI - ANALİZE GEÇ",

    trnTitle: "Adım 3: Teknik Analiz - Sistem Nasıl Çöktü?",
    trnDesc: "Az önce masum görünen bir ping aracını kullanarak koca bir sunucuyu ele geçirdin. Peki bu nasıl oldu? Bilgisayarlar arka planda sadece onlara verilen komutları harfiyen yerine getirirler. İşte adım adım yaşananlar:",
    trnH1: "Geliştiricinin Kör Noktası",
    trnP1: "Arka ucu (Backend) yazan yazılımcı, kullanıcının sadece iyi niyetli bir IP adresi gireceğini varsaydı ve arka planda şu tehlikeli kodu kullandı:",
    trnH2: "Zehirli Karakter: Noktalı Virgül ( ; )",
    trnP2: "Sen girdi olarak <code class='highlight'>ping 127.0.0.1; cat /etc/passwd</code> yazdığında, Linux işletim sistemi noktalı virgülü gördü ve bunu <b>\"İlk komutu bitir, sıradaki yeni komuta geç\"</b> olarak anladı.",
    trnH3: "Sınırları Aşmak (Tam Yetki)",
    trnP3: "Sistem <code class='highlight'>ping 127.0.0.1</code> işlemini başarıyla tamamladıktan hemen sonra, senin gizlice sızdırdığın <code class='highlight'>cat /etc/passwd</code> komutunu kendi yerel komutuymuş gibi çalıştırdı. Böylece basit bir ağ aracı, veritabanı hırsızlığına dönüştü.",
    trnH4: "🛡️ Kesin Çözüm: Allowlist (İzin Listesi) Doğrulaması",
    trnP4: "Bu zafiyeti önlemek için \"Kara Liste\" (noktalı virgülü veya 'cat' kelimesini yasaklamak) işe yaramaz; çünkü hackerlar her zaman komutları bağlayacak başka bir karakter (örn: <code style='color:#10b981;'>&&</code> veya <code style='color:#10b981;'>|</code>) bulur.<br><br><b>Doğru ve tek yöntem \"Beyaz Liste\" (Allowlist) kullanmaktır:</b> Sistem, gelen verinin SADECE rakamlardan ve noktalardan (0-9 ve .) oluşup oluşmadığını kontrol etmeli, içinde harf veya özel karakter barındıran tüm işlemleri anında reddetmelidir.",
    btnToPost: "Tüm Detayları Anladım -> Son Teste Geç",

    postTitle: "Son-Test",
    qPost1: "1. Simülasyonda komut yazarken kullandığımız noktalı virgülün ( ; ) asıl işlevi neydi?",
    optPost1_1: "A) Ping işleminin başarısız olması durumunda sistemin otomatik olarak alternatif bir komuta geçmesi.",
    optPost1_2: "B) Önceki komutu sonlandırıp sonrasındaki metni çalıştırılması gereken yeni bir sistem emri sayması.",
    optPost1_3: "C) Sunucunun 'ls' komutunu ping hedefinin bir ağ uzantısı veya port numarası olarak tanımlaması.",
    qPost2: "2. OS Command Injection zafiyetine karşı en etkili ve kalıcı savunma yöntemi aşağıdakilerden hangisidir?",
    optPost2_1: "A) Girdilerin içerisinde bulunan 'cat, ls, rm' gibi tehlikeli kelimeleri kara liste (blocklist) ile engellemek.",
    optPost2_2: "B) Terminal komutları yerine yerleşik API'ler kullanmak ve girdileri beyaz liste (allowlist) ile doğrulamak.",
    optPost2_3: "C) Sunucuya gelen tüm şüpheli istekleri tespit etmek için ağ tabanlı bir güvenlik duvarı (WAF) kurmak.",
    qPost3: "3. OS Command Injection zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPost3_1: "A) İstemci tarafında çalışan zararlı betiklerin (script) sunucu bellek alanını taşırarak sistemi durdurması.",
    optPost3_2: "B) Kullanıcıdan alınan denetimsiz verilerin, arka plandaki işletim sistemi kabuğunda (shell) çalıştırılması.",
    optPost3_3: "C) Web uygulamasının dosya dizin yollarının manipüle edilerek yetkisiz sistem konfigürasyonlarının okunması.",
    btnPost: "Eğitimi Bitir",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 6: OS Command Injection",
    preTitle: "Pre-Test",
    qPre1: "1. What is the fundamental mechanism of an OS Command Injection vulnerability?",
    optPre1_1: "A) Overflowing the server's memory space by executing malicious client-side scripts to halt the system.",
    optPre1_2: "B) Directly executing unchecked user inputs within the underlying operating system's command shell.",
    optPre1_3: "C) Manipulating the web application's file directory paths to unauthorizedly read system configurations.",
    qPre2: "2. Why can background system functions (e.g., a ping tool) in a web application pose a potential security risk?",
    optPre2_1: "A) Because these functions can generate excessive network requests, exhausting server capacity.",
    optPre2_2: "B) Because developers might skip input validation, allowing terminal privileges to be abused.",
    optPre2_3: "C) Because routing network protocols via web ports violates the server's existing firewall policies.",
    qPre3: "3. Which characters are used to execute commands sequentially in Linux/Unix systems?",
    optPre3_1: "A) Semicolon ( ; ), OR ( | ), AND ( && )",
    optPre3_2: "B) Percent ( % ) and Asterisk ( * )",
    optPre3_3: "C) Only the Dash ( - )",
    btnPre: "Start Simulation",

    simTitle: "Step 2: Simulation",
    gTitle: "📋 Company Mission File",
    gDesc: "The company's entire infrastructure runs on Linux servers. Due to network drops, the Chief Engineer asked you to test if servers are online using this <b>'Web Ping Tool'</b>. <i>(Ping is asking a device 'Are you there?')</i>",
    gs1T: "1. Recon: Normal State",
    gs1D: "The terminal expects a ping command. Type <code class='highlight'>ping 127.0.0.1</code> and press Enter to test the connection and observe normal behavior.",
    gs2T: "2. Infiltrate: List Files (ls)",
    gs2D: "You noticed a fully authorized Linux terminal is running behind this tool! In Linux, a semicolon <code class='highlight'>;</code> separates commands. <code class='highlight'>ls</code> lists files.<br><br>Type <code class='highlight'>ping 127.0.0.1; ls</code> to fool the tool and reveal hidden files.",
    gs3T: "3. Data Leak: Read Passwords (cat)",
    gs3D: "You can see the files now! In Linux, the <code class='highlight'>cat</code> command is used to read files. <code class='highlight'>/etc/passwd</code> is the system file holding all user accounts.<br><br>Type <code class='highlight'>ping 127.0.0.1; cat /etc/passwd</code> to completely breach authority limits!",

    pAnalysis: "--- SECURITY ANALYSIS: Standard network packet transmission occurred. System only pinged the specified IP. ---",
    lAnalysis: "--- SECURITY ANALYSIS: WARNING! 'ls' command injection successful. Hidden system files are exposed! ---",
    cAnalysis: "--- SECURITY ANALYSIS: DISASTER! Critical '/etc/passwd' file was read. User list compromised! ---",
    wrongCmd: "--- WARNING: Operation failed! Please enter the exact full command requested in the guide. ---",
    wrongIp: "--- WARNING: Target deviation! Please use the IP address requested in the mission file (127.0.0.1). ---",
    nextMsg: "System reset. Awaiting new terminal task...",
    btnToTrn: "ALL MISSIONS SUCCESSFUL - GO TO ANALYSIS",

    trnTitle: "Step 3: Technical Analysis - How the System Crashed?",
    trnDesc: "You just used a seemingly innocent ping tool to compromise an entire server. How did this happen? Computers blindly follow the commands given to them. Here is a step-by-step breakdown:",
    trnH1: "The Developer's Blind Spot",
    trnP1: "The backend developer assumed the user would only input a benign IP address and wrote this dangerous code:",
    trnH2: "The Poisonous Character: Semicolon ( ; )",
    trnP2: "When you entered <code class='highlight'>ping 127.0.0.1; cat /etc/passwd</code>, the Linux OS saw the semicolon and interpreted it as <b>\"Finish the first command, proceed to the next one.\"</b>",
    trnH3: "Crossing the Boundaries (Full Authority)",
    trnP3: "Right after successfully completing the <code class='highlight'>ping 127.0.0.1</code> process, the system executed the <code class='highlight'>cat /etc/passwd</code> command you secretly injected, treating it as its own local command. Thus, a simple network tool turned into a database theft.",
    trnH4: "🛡️ Ultimate Solution: Allowlist Validation",
    trnP4: "To prevent this vulnerability, a \"Blocklist\" (banning the semicolon or the word 'cat') doesn't work; hackers will always find another character to chain commands.<br><br><b>The only correct method is to use an \"Allowlist\":</b> The system must check if the incoming data consists ONLY of numbers and dots (0-9 and .). If it contains letters or special characters, it must immediately reject the process.",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    qPost1: "1. What was the main function of the semicolon ( ; ) we used while typing the command in the simulation?",
    optPost1_1: "A) Making the system automatically switch to an alternative command if the ping process fails.",
    optPost1_2: "B) Terminating the previous command and treating the following text as a new system order to be executed.",
    optPost1_3: "C) Defining the 'ls' command as a network extension or port number of the ping target for the server.",
    qPost2: "2. Which of the following is the most effective and permanent defense method against OS Command Injection vulnerabilities?",
    optPost2_1: "A) Blocking dangerous words found in the inputs like 'cat, ls, rm' using a blocklist.",
    optPost2_2: "B) Using built-in APIs instead of terminal commands and validating inputs with an allowlist.",
    optPost2_3: "C) Installing a network-based firewall (WAF) to detect all suspicious requests arriving at the server.",
    qPost3: "3. What is the fundamental mechanism of an OS Command Injection vulnerability?",
    optPost3_1: "A) Overflowing the server's memory space by executing malicious client-side scripts to halt the system.",
    optPost3_2: "B) Directly executing unchecked user inputs within the underlying operating system's command shell.",
    optPost3_3: "C) Manipulating the web application's file directory paths to unauthorizedly read system configurations.",
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
    localStorage.setItem('cmd_draft_answers', JSON.stringify(newAnswers));
  }
}, { deep: true });

onMounted(async () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`http://localhost:3000/api/get-user-stats/${userEmail}`);
      const result = await response.json();
      if (result.success && result.data && result.data.cmd_answers) {
        Object.assign(answers, result.data.cmd_answers);
      }
    } catch (error) {}
  } else {
    const savedDraft = localStorage.getItem('cmd_draft_answers');
    if (savedDraft) Object.assign(answers, JSON.parse(savedDraft));
  }
  
  isLoading.value = false;
  
  // Terminal input focus
  nextTick(() => {
    if(terminalInputRef.value) terminalInputRef.value.focus();
  });
});

const finishPreTest = () => {
  if (!isReviewMode.value && (!answers.preQ1 || !answers.preQ2 || !answers.preQ3)) {
    return alert(currentText.value.warnEmpty);
  }
  currentStep.value = 2; 
  nextTick(() => {
    if(terminalInputRef.value) terminalInputRef.value.focus();
  });
};

const focusTerminal = () => {
  if(terminalInputRef.value && !isExecuting.value) terminalInputRef.value.focus();
}

const scrollToBottom = () => {
  if (terminalBody.value) {
    terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
  }
};

// --- EFSANEVİ TYPEWRITER (HARF HARF YAZMA) FONKSİYONU ---
const typeLines = async (linesArray, cssClass) => {
  for (let line of linesArray) {
    if (line.trim() === '') continue;
    
    // Yeni bir satır objesi oluştur
    let currentLineObj = reactive({ type: cssClass, text: '' });
    terminalLines.value.push(currentLineObj);
    
    // Harf harf ekle
    for (let i = 0; i < line.length; i++) {
      currentLineObj.text += line[i];
      scrollToBottom();
      // Çok hızlı bir daktilo efekti (Matrix stili)
      await new Promise(r => setTimeout(r, 5)); 
    }
  }
};

const executeCommand = async () => {
  const cmd = terminalInput.value.trim();
  if (!cmd) return;
  
  terminalInput.value = '';
  isExecuting.value = true;

  // Kullanıcının yazdığı komutu anında ekle
  terminalLines.value.push({ type: 'cmd', text: cmd });
  scrollToBottom();

  const isPingCommand = cmd.toLowerCase().startsWith("ping ");
  const isTargetIp = cmd.includes("127.0.0.1");

  if (!isPingCommand) {
    await typeLines([currentText.value.wrongCmd], 'error');
    isExecuting.value = false;
    focusTerminal();
    return;
  } 
  
  if (!isTargetIp) {
    await typeLines([currentText.value.wrongIp], 'error');
    isExecuting.value = false;
    focusTerminal();
    return;
  }

  // API'yi çağır (Simüle edilmiş backend)
  let backendIp = cmd.replace(/^ping\s+/i, "");
  
  try {
    const response = await fetch("http://localhost:3000/api/vuln/cmd/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: backendIp }),
    });
    const res = await response.json();

    const outputLines = res.output.split("\n");
    
    // Çıktıyı harf harf terminale bas
    await typeLines(outputLines, 'output');
    
    // Analiz mesajını bas ve görev kontrolü yap
    await processMission(cmd, res.isHacked);

  } catch (error) {
    await typeLines(["Connection failed. Is the Node.js server running?"], 'error');
  }

  isExecuting.value = false;
  focusTerminal();
};

const processMission = async (cmd, isHacked) => {
  if (currentMission.value === 1 && !isHacked) {
    await typeLines([currentText.value.pAnalysis], 'analysis');
    currentMission.value = 2;
    await typeLines(["", currentText.value.nextMsg], 'output');
  } 
  else if (currentMission.value === 2 && isHacked && cmd.includes("ls")) {
    await typeLines([currentText.value.lAnalysis], 'analysis');
    currentMission.value = 3;
    await typeLines(["", currentText.value.nextMsg], 'output');
  } 
  else if (currentMission.value === 3 && isHacked && cmd.includes("cat")) {
    await typeLines([currentText.value.cAnalysis], 'analysis');
    currentMission.value = 4; // Tamamlandı
  } 
  else {
    await typeLines([currentText.value.wrongCmd], 'error');
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
      body: JSON.stringify({ email: userEmail, module: "cmd", preScore, postScore, answers }),
    });
    alert(currentText.value.alertResult(preScore, postScore));
    localStorage.removeItem('cmd_draft_answers'); 
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

/* TERMINAL */
.terminal-container { display: flex; flex-direction: column; gap: 15px; }
.terminal-box { background: #050505; border-radius: 8px; border: 1px solid #334155; overflow: hidden; height: 550px; display: flex; flex-direction: column; cursor: text; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.terminal-header { background: #1e293b; color: #cbd5e1; padding: 10px 15px; font-size: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #000; font-family: monospace; }
.terminal-body { padding: 15px; flex-grow: 1; overflow-y: auto; color: #22c55e; font-family: "Consolas", "Courier New", monospace; font-size: 14.5px; line-height: 1.5; }

.prompt { color: #10b981; font-weight: bold; margin-right: 8px; }
.output { color: #a7f3d0; margin-bottom: 2px; white-space: pre-wrap; }
.analysis { background: rgba(245, 158, 11, 0.1); color: #fcd34d; border-left: 4px solid #f59e0b; margin: 15px 0; padding: 10px 15px; font-style: italic; font-size: 13.5px; display: block; border-radius: 0 4px 4px 0; }
.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-left: 4px solid #ef4444; margin: 15px 0; padding: 10px 15px; font-style: italic; font-size: 13.5px; display: block; border-radius: 0 4px 4px 0; }

.terminal-input-line { display: flex; align-items: center; margin-top: 10px; }
#real-input { background: transparent; border: none; color: #22c55e; font-family: inherit; font-size: inherit; outline: none; flex-grow: 1; caret-color: #22c55e; }

/* EĞİTİM TASARIMI */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border-left: 6px solid #00e5ff; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 16px; }
.code-block { background: #000; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; margin: 10px 0; border: 1px solid #334155; font-size: 13.5px;}

.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 229, 255, 0.1); border-radius: 50%; border-top-color: #00e5ff; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>