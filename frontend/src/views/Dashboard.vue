<template>
  <div>
    <div class="navbar">
      <h2 style="margin: 0; color: #e2e8f0; font-weight: 600; font-size: 20px">
        {{ currentText.welcome }}
      </h2>

      <div class="nav-right">
        <button class="btn-stats" @click="goToStats">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span>{{ currentText.stats }}</span>
        </button>
        
        <button class="lang-btn" @click="toggleLanguage">
          {{ currentLang === 'tr' ? 'EN' : 'TR' }}
        </button>
        
        <button class="btn-logout" @click="logout">
          {{ currentText.logout }}
        </button>
      </div>
    </div>

    <div class="container">
      <h1>{{ currentText.pageTitle }}</h1>
      <p class="desc-text">{{ currentText.pageDesc }}</p>

      <div class="module-grid">
        <div class="module-card" :class="{ 'completed-card': completedStatus.sqli }">
          <span class="check-icon" v-if="completedStatus.sqli">✓</span>
          <div class="module-icon">💉</div>
          <h3 class="module-title">{{ currentText.m1Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.sqli }" @click="handleModuleClick('sqli', '/module/sqli')">
            <span>{{ completedStatus.sqli ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.bac }">
          <span class="check-icon" v-if="completedStatus.bac">✓</span>
          <div class="module-icon">🪪</div>
          <h3 class="module-title">{{ currentText.m2Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.bac }" @click="handleModuleClick('bac', '/module/bac')">
            <span>{{ completedStatus.bac ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.ede }">
          <span class="check-icon" v-if="completedStatus.ede">✓</span>
          <div class="module-icon">🩻</div>
          <h3 class="module-title">{{ currentText.m3Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.ede }" @click="handleModuleClick('ede', '/module/ede')">
            <span>{{ completedStatus.ede ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.xss }">
          <span class="check-icon" v-if="completedStatus.xss">✓</span>
          <div class="module-icon">🕷️</div>
          <h3 class="module-title">{{ currentText.m4Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.xss }" @click="handleModuleClick('xss', '/module/xss')">
            <span>{{ completedStatus.xss ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.rate }">
          <span class="check-icon" v-if="completedStatus.rate">✓</span>
          <div class="module-icon">🚦</div>
          <h3 class="module-title">{{ currentText.m5Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.rate }" @click="handleModuleClick('rate', '/module/rate')">
            <span>{{ completedStatus.rate ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.cmd }">
          <span class="check-icon" v-if="completedStatus.cmd">✓</span>
          <div class="module-icon">⚡</div>
          <h3 class="module-title">{{ currentText.m6Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.cmd }" @click="handleModuleClick('cmd', '/module/cmd')">
            <span>{{ completedStatus.cmd ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentLang = ref('tr');
const userEmail = localStorage.getItem('userEmail');

// Modüllerin tamamlanma durumunu tutan obje (Reaktif)
const completedStatus = ref({
  sqli: false,
  bac: false,
  ede: false,
  xss: false,
  rate: false,
  cmd: false
});

const translations = {
  tr: {
    welcome: "👋 Hoş Geldiniz!",
    stats: "Karnem",
    logout: "Çıkış",
    pageTitle: "Siber Güvenlik Eğitim Laboratuvarı",
    pageDesc: "Aşağıdaki modülleri sırasıyla tamamlayarak zafiyetleri uygulamalı olarak öğrenin.",
    m1Title: "1. SQL Injection",
    m2Title: "2. Broken Access Control",
    m3Title: "3. Excessive Data Exposure",
    m4Title: "4. Cross-Site Scripting (XSS)",
    m5Title: "5. Rate Limiting",
    m6Title: "6. OS Command Injection",
    btnStart: "MODÜLE GİT",
    btnCompleted: "TAMAMLANDI",
    alertCompleted: "Bu modülü zaten başarıyla tamamladınız! Karnenizden skorunuzu görebilirsiniz.",
  },
  en: {
    welcome: "👋 Welcome!",
    stats: "My Stats",
    logout: "Logout",
    pageTitle: "Cybersecurity Training Lab",
    pageDesc: "Complete the modules below sequentially to learn vulnerabilities hands-on.",
    m1Title: "1. SQL Injection",
    m2Title: "2. Broken Access Control",
    m3Title: "3. Excessive Data Exposure",
    m4Title: "4. Cross-Site Scripting (XSS)",
    m5Title: "5. Rate Limiting",
    m6Title: "6. OS Command Injection",
    btnStart: "GO TO MODULE",
    btnCompleted: "COMPLETED",
    alertCompleted: "You have already completed this module successfully! You can check your score in your stats.",
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
};

const logout = () => {
  localStorage.removeItem("userEmail"); // Bileti yırt
  router.push("/"); // Login sayfasına ışınla
};

const goToStats = () => {
  router.push("/stats");
};

const handleModuleClick = (moduleKey, routePath) => {
  if (completedStatus.value[moduleKey]) {
    router.push(`${routePath}?review=true`);
  } else {
    // Bitmemişse normal olarak girsin
    router.push(routePath);
  }
};

// Sayfa yüklendiğinde (onMounted) Backend'den skorları çekiyoruz
onMounted(async () => {
  if (!userEmail) {
    router.push('/');
    return;
  }

  try {
    const baseUrl = "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/get-user-stats/${userEmail}`);
    const result = await response.json();

    if (result.success && result.data) {
      const modules = ["sqli", "bac", "ede", "xss", "rate", "cmd"];
      modules.forEach((mod) => {
        if (result.data[`${mod}_completed`]) {
          completedStatus.value[mod] = true; // Sadece true yapıyoruz, Vue anında HTML'i yeşile boyuyor!
        }
      });
    }
  } catch (error) {
    console.error("Kilit mekanizması verisi çekilemedi:", error);
  }
});
</script>

<style scoped>
/* Senin orjinal CSS'in, sadece body kısmını sildik çünkü App.vue içinde tanımlı */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(12px);
  padding: 15px 30px;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-stats {
  background: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-stats:hover {
  background: #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.lang-btn {
  background: transparent;
  color: #00e5ff;
  border: 1px solid #00e5ff;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 14px;
}
.lang-btn:hover {
  background: rgba(0, 229, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
}

.btn-logout {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  font-size: 14px;
}
.btn-logout:hover {
  background: rgba(239, 68, 68, 0.15);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}

.container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
}

h1 {
  color: #f8fafc;
  font-size: 32px;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: center;
}
.desc-text {
  color: #64748b;
  margin-bottom: 50px;
  font-size: 16px;
  text-align: center;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.module-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 40px 30px 35px 30px;
  min-height: 240px;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  text-align: center;
  overflow: hidden; 
}

.module-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  transition: all 0.75s ease;
  z-index: 0;
  pointer-events: none;
}

.module-card:hover {
  transform: translateY(-8px) scale(1.02); 
  border-color: #0284c7; 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(2, 132, 199, 0.15);
}

.module-card:hover::before {
  left: 200%;
}

.completed-card {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.02);
}
.completed-card:hover {
  border-color: #10b981;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15);
}

.check-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #10b981;
  font-size: 16px;
  font-weight: bold;
  background: rgba(16, 185, 129, 0.1);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
  z-index: 2;
}

.module-icon {
  font-size: 65px;
  margin-bottom: 25px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.05));
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
  position: relative;
}

.module-card:hover .module-icon {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 0 20px rgba(2, 132, 199, 0.4));
}
.completed-card:hover .module-icon {
  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
}

.module-title {
  color: #f8fafc;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 30px 0;
  letter-spacing: 0.5px;
  z-index: 2;
  position: relative;
}

.btn-start {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
  z-index: 2;
}

.btn-start::after {
  content: "→";
  position: absolute;
  opacity: 0;
  transform: translateX(-15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  right: 25px;
  font-size: 18px;
}

.btn-start:hover {
  background: linear-gradient(135deg, #0369a1, #1d4ed8);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  padding-right: 35px;
}

.btn-start:hover::after {
  opacity: 1;
  transform: translateX(0);
}

.btn-start.completed {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
  cursor: default;
}
.btn-start.completed:hover {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  padding-right: 14px;
}
.btn-start.completed::after {
  display: none;
}
</style>