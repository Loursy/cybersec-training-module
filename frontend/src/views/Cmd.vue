<template>
  <div class="module-wrapper">
    <div class="dot-grid"></div>

    <div class="container">
      <button class="lang-btn" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
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
          <p class="step-desc" v-if="!isReviewMode">{{ currentText.s1Desc }}</p>

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
            </div>

            <div class="app-container">
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

                <div class="action-footer" style="justify-content: flex-end;">
                  <button v-if="currentMission > 3 || isReviewMode" class="btn-success fade-in" @click="currentStep = 3">
                    {{ currentText.btnToTrn }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Eğitim Materyali' : '🔍 Review Mode: Training Material') : currentText.trnTitle }}
          </h2>
          
          <div class="edu-card">
            <p class="edu-desc-txt">{{ currentText.trnDesc }}</p>
            
            <div style="margin-top: 20px; margin-bottom: 30px; text-align: center;">
               
            </div>

            <div class="flow-step">
              <div class="flow-num step-blue">1</div>
              <div>
                <b class="step-title-text blue-text">{{ currentText.trnH1 }}</b>
                <p class="step-desc-text" v-html="currentText.trnP1"></p>
                <div class="code-block">
                  <span style="color: #f59e0b">let</span> command = <span style="color: #a7f3d0">"ping "</span> + user_input;<br>
                  execute_system(command);
                </div>
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
              <div class="flow-num step-red">3</div>
              <div>
                <b class="step-title-text red-text">{{ currentText.trnH3 }}</b>
                <p class="step-desc-text" v-html="currentText.trnP3"></p>
              </div>
            </div>
            
            <div class="solution-box">
              <b class="solution-title-text">{{ currentText.trnH4 }}</b>
              <p class="solution-info" v-html="currentText.trnP4"></p>
              <div style="margin-top: 25px; text-align: center;">
                 
              </div>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 2">Önceki</button>
            <button class="btn-primary" @click="currentStep = 4">{{ currentText.btnToPost }}</button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="step">
          <h2 class="step-title" :class="{ 'review-mode-title': isReviewMode }">
            {{ isReviewMode ? (currentLang === 'tr' ? '🔍 İnceleme Modu: Son-Test Analizi' : '🔍 Review Mode: Post-Test Analysis') : currentText.postTitle }}
          </h2>
          <p class="step-desc" v-if="!isReviewMode">{{ currentText.s4Desc }}</p>

          <div class="question" v-for="(q, index) in [1, 2, 3]" :key="'post'+index">
            <p><b v-html="currentText[`qPost${q}`]"></b></p>
            <div class="options">
              <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" :class="getLabelClass('post', `q${q}`, opt)">
                <input type="radio" v-model="answers[`postQ${q}`]" :value="opt" :disabled="isReviewMode" /> 
                <span>{{ currentText[`optPost${q}_${opt === 'a' ? 1 : opt === 'b' ? 2 : opt === 'c' ? 3 : 4}`] }}</span>
              </label>
            </div>
          </div>

          <div class="action-footer space-between">
            <button class="btn-secondary" @click="currentStep = 3">Önceki</button>
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

// JWT Token ve Kullanıcı Bilgisi
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// Simülasyon / Terminal Değişkenleri
const currentMission = ref(1);
const terminalInput = ref('');
const terminalInputRef = ref(null);
const terminalBody = ref(null);
const terminalLines = ref([]); // { type: 'cmd'|'output'|'analysis'|'error', text: '' }
const isExecuting = ref(false);

const answerKeys = {
  pre: { q1: "b", q2: "b", q3: "d" },
  post: { q1: "b", q2: "b", q3: "b" },
};

const translations = {
  tr: {
    warnEmpty: "Lütfen tüm soruları cevaplayın!",
    alertResult: (pre, post) => `Tebrikler!\nÖn-Test Başarısı: %${pre}\nSon-Test Başarısı: %${post}\n\nKarnenize yönlendiriliyorsunuz...`,
    modTitle: "Modül 6: OS Command Injection",
    preTitle: "Ön-Test",
    s1Desc: "Aşağıdaki soruları yanıtlayarak mevcut bilgi seviyenizi ölçelim.",
    s4Desc: "Bu modülde öğrendiklerinizi pekiştirelim.",
    
    qPre1: "1. OS Command Injection zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPre1_1: "A) İstemci tarafındaki zararlı betiklerin, Kernel Panic yaratarak sunucu bellek alanını taşırması.",
    optPre1_2: "B) Kullanıcıdan alınan denetimsiz verilerin, arka plandaki işletim sisteminde çalıştırılması.",
    optPre1_3: "C) Web uygulamasının Rootkit yapılandırmalarını manipüle ederek yetkisiz sistem Daemon'larını okuması.",
    optPre1_4: "D) Ağ katmanındaki Syscall (Sistem Çağrısı) tablolarının değiştirilerek port yönlendirmesi yapılması.",
    
    qPre2: "2. Bir web uygulamasının arka planında çalışan sistem fonksiyonları (örn: ping aracı) neden güvenlik riski oluşturabilir?",
    optPre2_1: "A) Bu fonksiyonların aşırı ağ isteği üreterek sunucunun işlemci kapasitesini tüketebilmesi.",
    optPre2_2: "B) Geliştiricinin bu fonksiyonları çağırırken girdi doğrulamasını atlaması ve terminal yetkilerinin kötüye kullanılabilmesi.",
    optPre2_3: "C) Ağ protokollerinin web portları üzerinden yönlendirilmesinin güvenlik duvarını ihlal etmesi.",
    optPre2_4: "D) İşletim sisteminin gönderilen ICMP paketlerini otomatik olarak veritabanı sorgusuna dönüştürmesi.",
    
    qPre3: "3. Linux/Unix sistemlerde ilk komutun hemen ardından ikinci bir komutu aynı satırda zincirleme çalıştırmak için aşağıdaki karakterlerden hangisi kullanılır?",
    optPre3_1: "A) >",
    optPre3_2: "B) #",
    optPre3_3: "C) $",
    optPre3_4: "D) ;",
    
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
    optPost1_4: "D) Komut satırına sızdırılan veriyi Base64 formatına çevirerek IDS sistemlerini atlatması.",
    
    qPost2: "2. OS Command Injection zafiyetine karşı en etkili ve kalıcı savunma yöntemi aşağıdakilerden hangisidir?",
    optPost2_1: "A) Girdilerin içerisinde bulunan 'cat, ls, rm' gibi tehlikeli kelimeleri kara liste (blocklist) ile engellemek.",
    optPost2_2: "B) Terminal komutları yerine yerleşik API'ler kullanmak ve girdileri beyaz liste (allowlist) ile doğrulamak.",
    optPost2_3: "C) Sunucuya gelen tüm şüpheli istekleri tespit etmek için ağ tabanlı bir güvenlik duvarı (WAF) kurmak.",
    optPost2_4: "D) Sunucu işlemcisini yormamak için gelen yetkisiz ping paketlerini drop (düşürme) modunda reddetmek.",
    
    qPost3: "3. OS Command Injection zafiyetinin temel çalışma mantığı aşağıdakilerden hangisidir?",
    optPost3_1: "A) İstemci tarafındaki zararlı betiklerin, Kernel Panic yaratarak sunucu bellek alanını taşırması.",
    optPost3_2: "B) Kullanıcıdan alınan denetimsiz verilerin, arka plandaki işletim sistemi kabuğunda çalıştırılması.",
    optPost3_3: "C) Web uygulamasının Rootkit yapılandırmalarını manipüle ederek yetkisiz sistem Daemon'larını okuması.",
    optPost3_4: "D) Ağ katmanındaki Syscall (Sistem Çağrısı) tablolarının değiştirilerek port yönlendirmesi yapılması.",
    
    btnPost: "Eğitimi Bitir",
  },
  en: {
    warnEmpty: "Please answer all questions!",
    alertResult: (pre, post) => `Congratulations!\nPre-Test: ${pre}%\nPost-Test: ${post}%\n\nRedirecting to stats...`,
    modTitle: "Module 6: OS Command Injection",
    preTitle: "Pre-Test",
    s1Desc: "Let's measure your current knowledge level.",
    s4Desc: "Let's reinforce what you learned.",
    
    qPre1: "1. What is the fundamental mechanism of an OS Command Injection vulnerability?",
    optPre1_1: "A) Overloading the server memory space by creating a Kernel Panic using malicious client-side scripts.",
    optPre1_2: "B) Directly executing unchecked user inputs within the underlying operating system.",
    optPre1_3: "C) Manipulating the web application's Rootkit configurations to read unauthorized system Daemons.",
    optPre1_4: "D) Modifying Syscall tables at the network layer to perform unauthorized port forwarding.",
    
    qPre2: "2. Why can background system functions (e.g., a ping tool) in a web application pose a potential security risk?",
    optPre2_1: "A) Because these functions can generate excessive network requests, exhausting server processor capacity.",
    optPre2_2: "B) Because developers might skip input validation when calling these functions, allowing terminal privileges to be abused.",
    optPre2_3: "C) Because routing network protocols via web ports violates the server's firewall rules.",
    optPre2_4: "D) Because the operating system automatically converts sent ICMP packets into database queries.",
    
    qPre3: "3. Which of the following single characters is used in Linux/Unix systems to chain and execute a second command on the same line immediately after the first one?",
    optPre3_1: "A) >",
    optPre3_2: "B) #",
    optPre3_3: "C) $",
    optPre3_4: "D) ;",
    
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
    trnP4: "To prevent this vulnerability, a \"Blocklist\" (banning the semicolon or the word 'cat') doesn't work; hackers will always find another character to chain commands (e.g. <code style='color:#10b981;'>&&</code> or <code style='color:#10b981;'>|</code>).<br><br><b>The only correct method is to use an \"Allowlist\":</b> The system must check if the incoming data consists ONLY of numbers and dots (0-9 and .). If it contains letters or special characters, it must immediately reject the process.",
    btnToPost: "I Understood the Details -> Go to Post-Test",

    postTitle: "Post-Test",
    
    qPost1: "1. What was the main function of the semicolon ( ; ) we used while typing the command in the simulation?",
    optPost1_1: "A) Making the system automatically switch to an alternative command if the ping process fails.",
    optPost1_2: "B) Terminating the previous command and treating the following text as a new system order to be executed.",
    optPost1_3: "C) Defining the 'ls' command as a network extension or port number of the ping target for the server.",
    optPost1_4: "D) Bypassing IDS systems by converting the injected command line data into Base64 format.",
    
    qPost2: "2. Which of the following is the most effective and permanent defense method against OS Command Injection vulnerabilities?",
    optPost2_1: "A) Blocking dangerous words found in the inputs like 'cat, ls, rm' using a blocklist.",
    optPost2_2: "B) Using built-in APIs instead of terminal commands and validating inputs with an allowlist.",
    optPost2_3: "C) Installing a network-based firewall (WAF) to detect all suspicious requests arriving at the server.",
    optPost2_4: "D) Rejecting incoming unauthorized ping packets in drop mode to prevent exhausting the server processor.",
    
    qPost3: "3. What is the fundamental mechanism of an OS Command Injection vulnerability?",
    optPost3_1: "A) Overloading the server memory space by creating a Kernel Panic using malicious client-side scripts.",
    optPost3_2: "B) Directly executing unchecked user inputs within the underlying operating system's command shell.",
    optPost3_3: "C) Manipulating the web application's Rootkit configurations to read unauthorized system Daemons.",
    optPost3_4: "D) Modifying Syscall tables at the network layer to perform unauthorized port forwarding.",
    
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
  if (!userEmail || !token) return router.push('/');

  if (isReviewMode.value) {
    try {
      const response = await fetch(`/api/get-user-stats/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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

const typeLines = async (linesArray, cssClass) => {
  for (let line of linesArray) {
    if (line.trim() === '') continue;
    
    let currentLineObj = reactive({ type: cssClass, text: '' });
    terminalLines.value.push(currentLineObj);
    
    for (let i = 0; i < line.length; i++) {
      currentLineObj.text += line[i];
      scrollToBottom();
      await new Promise(r => setTimeout(r, 5)); 
    }
  }
};

const executeCommand = async () => {
  const cmd = terminalInput.value.trim();
  if (!cmd) return;
  
  terminalInput.value = '';
  isExecuting.value = true;

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

  let backendIp = cmd.replace(/^ping\s+/i, "");
  
  try {
    const response = await fetch("/api/vuln/cmd/ping", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ ip: backendIp }),
    });
    const res = await response.json();

    const outputLines = res.output.split("\n");
    
    await typeLines(outputLines, 'output');
    
    if (currentMission.value === 1 && !res.isHacked) {
      await typeLines([currentText.value.pAnalysis], 'analysis');
      currentMission.value = 2;
      await typeLines(["", currentText.value.nextMsg], 'output');
    } 
    else if (currentMission.value === 2 && res.isHacked && cmd.includes("ls")) {
      await typeLines([currentText.value.lAnalysis], 'analysis');
      currentMission.value = 3;
      await typeLines(["", currentText.value.nextMsg], 'output');
    } 
    else if (currentMission.value === 3 && res.isHacked && cmd.includes("cat /etc/passwd")) {
      await typeLines([currentText.value.cAnalysis], 'analysis');
      currentMission.value = 4; 
    } 
    else {
      await typeLines([currentText.value.wrongCmd], 'error');
    }

  } catch (error) {
    await typeLines(["Connection failed. Ensure backend is running and you have authorization."], 'error');
  }

  isExecuting.value = false;
  focusTerminal();
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
.module-wrapper { background-color: #0b0f19; color: #cbd5e1; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.container { width: 100%; max-width: 1000px; margin: 0 auto; background: #0f172a; padding: 40px 50px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; border-top: 4px solid #00e5ff; position: relative; z-index: 1; }

.lang-btn { position: absolute; top: 25px; right: 25px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

/* Başlık ve Metinler */
.mod-title { color: #f8fafc; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
.neon-divider { height: 1px; background: linear-gradient(90deg, #00e5ff, transparent); margin-bottom: 35px; }
.step-title { color: #f8fafc; font-size: 24px; border-left: 4px solid #00e5ff; padding-left: 15px; margin-bottom: 25px; }
.step-desc { font-size: 15px; color: #94a3b8; margin-bottom: 25px;}
.review-mode-title { color: #10b981; border-left-color: #10b981; }

/* Sorular */
.question { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
.question p { margin-top: 0; font-size: 16px; color: #f8fafc; margin-bottom: 15px; line-height: 1.5; }
.options label { display: block; margin: 10px 0; cursor: pointer; color: #94a3b8; transition: all 0.2s; padding: 12px 15px; border-radius: 8px; border: 1px solid #334155; background: #0b1120; }
.options label:hover:not(.correct-answer):not(.wrong-answer) { border-color: #00e5ff; background: rgba(0, 229, 255, 0.05); color: #f8fafc; }
.options label input { margin-right: 10px; accent-color: #00e5ff; }
.options label input:disabled { cursor: not-allowed; }

.correct-answer { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: bold; }
.wrong-answer { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; text-decoration: line-through; }

/* GÖREV REHBERİ (Adım 2) */
.mission-layout { display: grid; grid-template-columns: 350px 1fr; gap: 25px; margin-top: 20px; }
.guide-panel { background: rgba(30, 41, 59, 0.4); padding: 25px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; }
.guide-title { margin-top: 0; color: #f8fafc; font-size: 18px; margin-bottom: 10px; }
.guide-desc { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
.guide-step { padding: 15px; border-radius: 8px; margin-bottom: 12px; transition: 0.3s; opacity: 0.4; border: 1px solid transparent; }
.guide-step.current { opacity: 1; background: rgba(0, 229, 255, 0.05); border: 1px solid #00e5ff; box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05); }
.guide-step.done { opacity: 0.5; border-left: 4px solid #10b981; }
.guide-step b { display: block; color: #00e5ff; margin-bottom: 5px; font-size: 14px; }
.guide-step p { margin: 0; font-size: 12.5px; line-height: 1.5; color: #cbd5e1; }
code.highlight { background: #000; color: #f59e0b; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #334155;}

/* TERMINAL */
.app-container { display: flex; flex-direction: column; gap: 15px; position: relative; }
.terminal-container { display: flex; flex-direction: column; gap: 15px; }
.terminal-box { background: #050505; border-radius: 12px; border: 1px solid #334155; overflow: hidden; height: 500px; display: flex; flex-direction: column; cursor: text; box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
.terminal-header { background: #1e293b; color: #cbd5e1; padding: 12px 20px; font-size: 13px; display: flex; justify-content: space-between; border-bottom: 1px solid #000; font-family: monospace; }
.terminal-body { padding: 20px; flex-grow: 1; overflow-y: auto; color: #22c55e; font-family: "Consolas", "Courier New", monospace; font-size: 14px; line-height: 1.5; }

.prompt { color: #10b981; font-weight: bold; margin-right: 8px; }
.output { color: #a7f3d0; margin-bottom: 2px; white-space: pre-wrap; }
.analysis { background: rgba(245, 158, 11, 0.1); color: #fcd34d; border-left: 4px solid #f59e0b; margin: 15px 0; padding: 12px 15px; font-style: italic; font-size: 13px; display: block; border-radius: 0 4px 4px 0; }
.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-left: 4px solid #ef4444; margin: 15px 0; padding: 12px 15px; font-style: italic; font-size: 13px; display: block; border-radius: 0 4px 4px 0; }

.terminal-input-line { display: flex; align-items: center; margin-top: 10px; }
#real-input { background: transparent; border: none; color: #22c55e; font-family: inherit; font-size: inherit; outline: none; flex-grow: 1; caret-color: #22c55e; }

/* EĞİTİM TASARIMI */
.edu-card { background: #1e293b; border-radius: 12px; padding: 30px; border-left: 6px solid #00e5ff; }
.edu-desc-txt { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 0; margin-bottom: 25px; }
.flow-step { display: flex; gap: 15px; margin-top: 20px; align-items: flex-start; }
.flow-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 15px; color: #fff;}
.step-blue { background: #00e5ff; color: #000; }
.step-yellow { background: #f59e0b; color: #000;}
.step-red { background: #ef4444; }
.step-title-text { font-size: 16px; display: block; margin-bottom: 5px; }
.blue-text { color: #00e5ff; }
.yellow-text { color: #f59e0b; }
.red-text { color: #ef4444; }
.step-desc-text { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
.code-block { background: #000; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; margin: 15px 0 0 0; border: 1px solid #334155; font-size: 13.5px;}

.solution-box { background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); margin-top: 35px; border-left: 4px solid #10b981; }
.solution-title-text { color: #10b981; font-size: 16px; display: block; margin-bottom: 10px; }
.solution-info { margin: 0; font-size: 14.5px; line-height: 1.7; color: #cbd5e1; }

/* Butonlar & Aksiyonlar */
.action-footer { margin-top: 30px; display: flex; }
.action-footer.space-between { justify-content: space-between; }
button { font-family: inherit; }
.btn-primary { background: #0284c7; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(2, 132, 199, 0.4); }
.btn-secondary { background: #334155; color: #f8fafc; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.btn-secondary:hover { background: #475569; }
.btn-success { background: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; width: auto;}
.btn-success:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4); }
.btn-warning { background: #00e5ff; color: #0f172a; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
.btn-warning:hover:not(:disabled) { background: #0891b2; color: #fff; transform: translateY(-2px); }
.btn-warning:disabled { opacity: 0.7; cursor: not-allowed; }

/* Animasyonlar ve Yükleyiciler */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
.fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.loading-screen { text-align: center; padding: 80px 0; }
.spinner { display: inline-block; border: 4px solid rgba(0, 229, 255, 0.2); border-top-color: #00e5ff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
.spinner-small { display: inline-block; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>