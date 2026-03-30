<template>
  <div class="dashboard-wrapper">
    <div class="dot-grid"></div>

    <div class="navbar">
      <h2 style="margin: 0; color: #f8fafc; font-weight: 700; font-size: 22px; letter-spacing: 0.5px;">
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
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>{{ currentText.logout }}</span>
        </button>
      </div>
    </div>

    <div class="container fade-in-up">
      <div class="header-section">
        <h1>{{ currentText.pageTitle }}</h1>
        <div class="neon-divider"></div>
        <p class="desc-text">{{ currentText.pageDesc }}</p>
      </div>

      <div class="module-grid">
        <div class="module-card" :class="{ 'completed-card': completedStatus.sqli }">
          <div class="check-badge" v-if="completedStatus.sqli">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="module-icon">💉</div>
          <h3 class="module-title">{{ currentText.m1Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.sqli }" @click="handleModuleClick('sqli', '/module/sqli')">
            <span>{{ completedStatus.sqli ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.bac }">
          <div class="check-badge" v-if="completedStatus.bac">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="module-icon">🪪</div>
          <h3 class="module-title">{{ currentText.m2Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.bac }" @click="handleModuleClick('bac', '/module/bac')">
            <span>{{ completedStatus.bac ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.ede }">
          <div class="check-badge" v-if="completedStatus.ede">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="module-icon">🩻</div>
          <h3 class="module-title">{{ currentText.m3Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.ede }" @click="handleModuleClick('ede', '/module/ede')">
            <span>{{ completedStatus.ede ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.xss }">
          <div class="check-badge" v-if="completedStatus.xss">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="module-icon">🕷️</div>
          <h3 class="module-title">{{ currentText.m4Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.xss }" @click="handleModuleClick('xss', '/module/xss')">
            <span>{{ completedStatus.xss ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.rate }">
          <div class="check-badge" v-if="completedStatus.rate">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="module-icon">🚦</div>
          <h3 class="module-title">{{ currentText.m5Title }}</h3>
          <button class="btn-start" :class="{ 'completed': completedStatus.rate }" @click="handleModuleClick('rate', '/module/rate')">
            <span>{{ completedStatus.rate ? currentText.btnCompleted : currentText.btnStart }}</span>
          </button>
        </div>

        <div class="module-card" :class="{ 'completed-card': completedStatus.cmd }">
          <div class="check-badge" v-if="completedStatus.cmd">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
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
const token = localStorage.getItem('token');

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
    pageTitle: "Siber Güvenlik Laboratuvarı",
    pageDesc: "Aşağıdaki zafiyet simülasyonlarını tamamlayarak sistemleri nasıl koruyacağınızı öğrenin.",
    m1Title: "1. SQL Injection",
    m2Title: "2. Broken Access Control",
    m3Title: "3. Excessive Data Exposure",
    m4Title: "4. Cross-Site Scripting (XSS)",
    m5Title: "5. Rate Limiting",
    m6Title: "6. OS Command Injection",
    btnStart: "MODÜLE GİT",
    btnCompleted: "İNCELE",
  },
  en: {
    welcome: "👋 Welcome!",
    stats: "My Stats",
    logout: "Logout",
    pageTitle: "Cybersecurity Lab",
    pageDesc: "Complete the vulnerability simulations below to learn how to protect systems.",
    m1Title: "1. SQL Injection",
    m2Title: "2. Broken Access Control",
    m3Title: "3. Excessive Data Exposure",
    m4Title: "4. Cross-Site Scripting (XSS)",
    m5Title: "5. Rate Limiting",
    m6Title: "6. OS Command Injection",
    btnStart: "START MODULE",
    btnCompleted: "REVIEW",
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
};

const logout = () => {
  localStorage.removeItem("userEmail"); 
  localStorage.removeItem("token"); 
  router.push("/"); 
};

const goToStats = () => {
  router.push("/stats");
};

const handleModuleClick = (moduleKey, routePath) => {
  if (completedStatus.value[moduleKey]) {
    router.push(`${routePath}?review=true`);
  } else {
    router.push(routePath);
  }
};

onMounted(async () => {
  if (!userEmail || !token) {
    router.push('/');
    return;
  }

  try {
    const response = await fetch(`/api/get-user-stats/${userEmail}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const result = await response.json();

    if (result.success && result.data) {
      const modules = ["sqli", "bac", "ede", "xss", "rate", "cmd"];
      modules.forEach((mod) => {
        if (result.data[`${mod}_completed`]) {
          completedStatus.value[mod] = true;
        }
      });
    } else if (response.status === 401 || response.status === 403) {
      logout();
    }
  } catch (error) {
    console.error("Kilit mekanizması verisi çekilemedi:", error);
  }
});
</script>

<style scoped>
.dashboard-wrapper {
  background-color: #0b0f19;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
  z-index: 0;
  pointer-events: none;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  padding: 15px 30px;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-right { display: flex; align-items: center; gap: 15px; }

.btn-stats, .lang-btn, .btn-logout {
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.btn-stats { color: #f8fafc; border: 1px solid #334155; background: rgba(30, 41, 59, 0.5); }
.btn-stats:hover { background: #334155; border-color: #475569; transform: translateY(-2px); }

.lang-btn { color: #0ea5e9; border: 1px solid #0ea5e9; }
.lang-btn:hover { background: rgba(14, 165, 233, 0.15); box-shadow: 0 0 12px rgba(14, 165, 233, 0.3); transform: translateY(-2px); }

.btn-logout { color: #ef4444; border: 1px solid #ef4444; }
.btn-logout:hover { background: rgba(239, 68, 68, 0.15); box-shadow: 0 0 12px rgba(239, 68, 68, 0.3); transform: translateY(-2px); }

.container { max-width: 1150px; margin: 50px auto; padding: 0 20px; position: relative; z-index: 1; }

.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.header-section { text-align: center; margin-bottom: 50px; }
.header-section h1 { color: #f8fafc; font-size: 38px; margin: 0 0 15px 0; font-weight: 800; letter-spacing: 1px; }
.neon-divider { height: 3px; width: 80px; background: linear-gradient(90deg, #0ea5e9, #3b82f6); margin: 0 auto 20px auto; border-radius: 2px; box-shadow: 0 0 10px rgba(14, 165, 233, 0.5); }
.desc-text { color: #94a3b8; font-size: 16px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.module-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }

.module-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 40px 30px;
  min-height: 250px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-align: center;
  overflow: hidden; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.module-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.03), transparent);
  transform: skewX(-25deg);
  transition: all 0.75s ease;
  pointer-events: none;
}

.module-card:hover { transform: translateY(-8px); border-color: #0ea5e9; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(14, 165, 233, 0.15); }
.module-card:hover::before { left: 200%; }

.completed-card { border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.03); }
.completed-card:hover { border-color: #10b981; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(16, 185, 129, 0.15); }

.check-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.module-icon { font-size: 65px; margin-bottom: 25px; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.05)); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.module-card:hover .module-icon { transform: scale(1.1) translateY(-3px); filter: drop-shadow(0 5px 15px rgba(14, 165, 233, 0.4)); }
.completed-card:hover .module-icon { filter: drop-shadow(0 5px 15px rgba(16, 185, 129, 0.4)); }

.module-title { color: #f8fafc; font-size: 20px; font-weight: 700; margin: 0 0 30px 0; letter-spacing: 0.5px; }

/* Yenilenmiş Dinamik Buton Tasarımı */
.btn-start {
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  padding: 14px 20px; /* Sağa biraz ok için boşluk ekledik */
  border-radius: 8px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 700;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Geçiş efekti eklendi */
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: auto;
  position: relative; /* Ok için gerekli */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Okun kart dışına taşmasını engeller */
}

/* Kayan Ok Animasyonu (İnaktif) */
.btn-start::after {
  content: "→";
  position: absolute;
  opacity: 0;
  transform: translateX(-15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  right: 25px; /* Okun konumu */
  font-size: 18px;
}

/* Kart Hover Olunca Buton (Yasal) */
.module-card:hover .btn-start:not(.completed) {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  padding-right: 35px; /* Ok için yer açıyoruz */
}

/* Kart Hover Olunca Ok Animasyonu (Aktivasyon) */
.module-card:hover .btn-start:not(.completed)::after {
  opacity: 1;
  transform: translateX(0); /* Ok yerine oturuyor */
}

/* Tamamlanmış Buton Tasarımı */
.btn-start.completed { 
  background: rgba(16, 185, 129, 0.1); 
  color: #10b981; 
  border-color: rgba(16, 185, 129, 0.3); 
}
.module-card:hover .btn-start.completed { 
  background: linear-gradient(135deg, #10b981, #059669); 
  color: #ffffff; 
  border-color: transparent; 
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); 
}
/* İnceleme butonunda ok çıkmasın */
.module-card:hover .btn-start.completed::after {
  display: none;
}
</style>