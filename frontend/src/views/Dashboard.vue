<template>
  <div class="dashboard-wrapper">
    <div class="dot-grid"></div>

    <div class="navbar">
      <h2 class="nav-title">{{ currentText.welcome }}</h2>

      <div class="nav-right">
        <button class="btn-stats" @click="goToStats">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span>{{ currentText.stats }}</span>
        </button>

        <button class="lang-btn" @click="toggleLanguage">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          {{ currentLang === 'tr' ? 'EN' : 'TR' }}
        </button>

        <button class="btn-logout" @click="logout">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>{{ currentText.logout }}</span>
        </button>
      </div>
    </div>

    <div class="container fade-in-up">
      <div class="header-section">
        <div class="owasp-badge">OWASP Top 10 — 2025</div>
        <h1>{{ currentText.pageTitle }}</h1>
        <div class="neon-divider"></div>
        <p class="desc-text">{{ currentText.pageDesc }}</p>
        <div class="flow-steps">
          <div class="flow-step"><span class="flow-icon">📋</span><span>{{ currentText.step1 }}</span></div>
          <div class="flow-arrow">→</div>
          <div class="flow-step"><span class="flow-icon">⚡</span><span>{{ currentText.step2 }}</span></div>
          <div class="flow-arrow">→</div>
          <div class="flow-step"><span class="flow-icon">📖</span><span>{{ currentText.step3 }}</span></div>
          <div class="flow-arrow">→</div>
          <div class="flow-step"><span class="flow-icon">✅</span><span>{{ currentText.step4 }}</span></div>
        </div>
      </div>

      <div class="module-grid">
        <div
          v-for="(mod, index) in modules"
          :key="mod.key"
          class="module-card"
          :class="{ 'completed-card': completedStatus[mod.key] }"
          :style="{
            '--delay': `${index * 0.11}s`,
            '--mc':     completedStatus[mod.key] ? '#10b981' : mod.mc,
            '--mc-dark':completedStatus[mod.key] ? '#059669' : mod.mcDark,
            '--mc-rgb': completedStatus[mod.key] ? '16, 185, 129' : mod.mcRgb,
          }"
        >
          <div class="card-shine"></div>

          <div class="icon-wrap">
            <span class="mod-icon">{{ mod.icon }}</span>
          </div>

          <span class="owasp-chip">{{ mod.owasp }}</span>

          <h3 class="module-title">{{ currentText[mod.titleKey] }}</h3>

          <span class="done-badge" v-if="completedStatus[mod.key]">
            <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="3.5" fill="none">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ currentText.labelDone }}
          </span>

          <div class="card-sep"></div>

          <button
            class="btn-start"
            :class="{ 'is-done': completedStatus[mod.key] }"
            @click="handleModuleClick(mod.key, '/module/' + mod.key)"
          >
            {{ completedStatus[mod.key] ? currentText.btnCompleted : currentText.btnStart }}
            <span class="btn-arrow">→</span>
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
const currentLang = ref(localStorage.getItem('preferredLang') || 'tr');

const userEmail = localStorage.getItem('userEmail');
const token = localStorage.getItem('token');

const completedStatus = ref({ bac: false, sqli: false, cf: false });

const modules = [
  { key: 'cf',   icon: '🔑', owasp: 'A07', titleKey: 'm3Title', mc: '#f59e0b', mcDark: '#d97706', mcRgb: '245, 158, 11' },
  { key: 'sqli', icon: '💉', owasp: 'A05', titleKey: 'm2Title', mc: '#ef4444', mcDark: '#dc2626', mcRgb: '239, 68, 68' },
  { key: 'bac',  icon: '🪪', owasp: 'A01', titleKey: 'm1Title', mc: '#3b82f6', mcDark: '#1d4ed8', mcRgb: '59, 130, 246' },
];

const translations = {
  tr: {
    welcome: "👋 Hoş Geldiniz!",
    stats: "Karnem",
    logout: "Çıkış",
    pageTitle: "İnteraktif Siber Güvenlik Eğitim Platformu",
    pageDesc: "Bu platform, OWASP Top 10 2025 listesindeki kritik web güvenlik açıklarını gerçek saldırı simülasyonlarıyla deneyimleyerek öğretmektedir. Her modülde bilginizi ölçen testler, canlı bir zafiyet senaryosu ve savunma stratejileri yer almaktadır.",
    step1: "Ön-Test", step2: "Simülasyon", step3: "Eğitim", step4: "Son-Test",
    m1Title: "Broken Access Control",
    m2Title: "SQL Injection",
    m3Title: "Authentication Failures",
    btnStart: "Modüle Git",
    btnCompleted: "İncele",
    labelDone: "Tamamlandı",
  },
  en: {
    welcome: "👋 Welcome!",
    stats: "My Stats",
    logout: "Logout",
    pageTitle: "Interactive Cybersecurity Training Platform",
    pageDesc: "This platform teaches critical web security vulnerabilities from the OWASP Top 10 2025 list through hands-on attack simulations. Each module includes knowledge tests, a live vulnerability scenario, and defensive strategies.",
    step1: "Pre-Test", step2: "Simulation", step3: "Training", step4: "Post-Test",
    m1Title: "Broken Access Control",
    m2Title: "SQL Injection",
    m3Title: "Authentication Failures",
    btnStart: "Start Module",
    btnCompleted: "Review",
    labelDone: "Completed",
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  localStorage.setItem('preferredLang', currentLang.value);
};

const logout = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("token");
  router.push("/");
};

const goToStats = () => router.push("/stats");

const handleModuleClick = (moduleKey, routePath) => {
  if (completedStatus.value[moduleKey]) {
    router.push(`${routePath}?review=true`);
  } else {
    router.push(routePath);
  }
};

onMounted(async () => {
  if (!userEmail || !token) { router.push('/'); return; }
  try {
    const response = await fetch(`/api/get-user-stats/${userEmail}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (result.success && result.data) {
      modules.forEach(({ key }) => {
        if (result.data[`${key}_completed`]) completedStatus.value[key] = true;
      });
    } else if (response.status === 401 || response.status === 403) {
      logout();
    }
  } catch (error) {
    console.error("Modül durumları çekilemedi:", error);
  }
});
</script>

<style scoped>
/* ─── WRAPPER ─────────────────────────────────────────── */
.dashboard-wrapper {
  background-color: #080c14;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  z-index: 0;
  pointer-events: none;
}

/* ─── NAVBAR ─────────────────────────────────────────── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 15, 28, 0.9);
  backdrop-filter: blur(14px);
  padding: 14px 32px;
  border-bottom: 1px solid #1a2438;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
}

.nav-title {
  margin: 0;
  color: #f1f5f9;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: 0.3px;
}

.nav-right { display: flex; align-items: center; gap: 12px; }

.btn-stats, .lang-btn, .btn-logout {
  background: transparent;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 7px;
  letter-spacing: 0.4px;
  font-family: inherit;
}

.btn-stats  { color: #94a3b8; border: 1px solid #1e293b; background: rgba(30,41,59,0.4); }
.btn-stats:hover  { background: #1e293b; color: #f1f5f9; transform: translateY(-1px); }

.lang-btn   { color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); }
.lang-btn:hover   { background: rgba(56,189,248,0.1); box-shadow: 0 0 14px rgba(56,189,248,0.2); transform: translateY(-1px); }

.btn-logout { color: #f87171; border: 1px solid rgba(248,113,113,0.4); }
.btn-logout:hover { background: rgba(248,113,113,0.1); box-shadow: 0 0 14px rgba(248,113,113,0.2); transform: translateY(-1px); }

/* ─── CONTAINER ─────────────────────────────────────── */
.container {
  max-width: 1080px;
  margin: 52px auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.fade-in-up { animation: fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

/* ─── HEADER ─────────────────────────────────────────── */
.header-section { text-align: center; margin-bottom: 52px; }

.owasp-badge {
  display: inline-block;
  background: rgba(56, 189, 248, 0.08);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 20px;
  padding: 4px 15px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.header-section h1 {
  color: #f1f5f9;
  font-size: 32px;
  margin: 0 0 14px 0;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.neon-divider {
  height: 3px;
  width: 72px;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  margin: 0 auto 18px auto;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
}

.desc-text {
  color: #64748b;
  font-size: 14.5px;
  max-width: 660px;
  margin: 0 auto 28px auto;
  line-height: 1.75;
}

.flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 6px 13px;
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 600;
}

.flow-icon { font-size: 13px; }
.flow-arrow { color: #1e293b; font-size: 16px; }

/* ─── GRID: 3 KOLONLU YAN YANA ─────────────────────── */
.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

@media (max-width: 900px) {
  .module-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 520px) {
  .module-grid { grid-template-columns: 1fr; }
  .header-section h1 { font-size: 24px; }
  .flow-arrow { display: none; }
}

/* ─── KART ───────────────────────────────────────────── */
.module-card {
  --mc: #38bdf8;
  --mc-dark: #0ea5e9;
  --mc-rgb: 56, 189, 248;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(170deg, #0d1828 0%, #090f1c 100%);
  border: 1px solid #1a2438;
  border-radius: 22px;
  padding: 34px 20px 24px;
  overflow: hidden;
  cursor: pointer;

  /* Staggered giriş animasyonu */
  animation: cardIn 0.52s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0s);

  transition:
    border-color 0.32s ease,
    box-shadow   0.32s ease,
    transform    0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

/* Üst parlak çizgi */
.module-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--mc), transparent);
  box-shadow: 0 0 10px rgba(var(--mc-rgb), 0.5);
  transition: box-shadow 0.32s ease;
}

/* Hover glow halkası (pseudo-element ile) */
.module-card:hover {
  border-color: rgba(var(--mc-rgb), 0.5);
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(var(--mc-rgb), 0.12),
    0 0 44px rgba(var(--mc-rgb), 0.1);
  transform: translateY(-9px);
}

.module-card:hover::before {
  box-shadow: 0 0 22px rgba(var(--mc-rgb), 0.75);
}

/* Tamamlanmış kart — yeşil CSS var'ları :style ile gelir */
.completed-card {
  background: linear-gradient(170deg, #091a14 0%, #060e0e 100%);
  border-color: rgba(var(--mc-rgb), 0.22);
}

/* ─── PARLAMA EFEKTİ (card-shine) ────────────────────── */
.card-shine {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: radial-gradient(
    ellipse at 50% -20%,
    rgba(var(--mc-rgb), 0.08) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.module-card:hover .card-shine {
  opacity: 1;
}

/* ─── İKON ÇEMBERI ───────────────────────────────────── */
.icon-wrap {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(var(--mc-rgb), 0.07);
  border: 1.5px solid rgba(var(--mc-rgb), 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
  transition:
    transform    0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background   0.32s ease,
    border-color 0.32s ease,
    box-shadow   0.32s ease;
}

.module-card:hover .icon-wrap {
  transform: scale(1.14) translateY(-4px);
  background: rgba(var(--mc-rgb), 0.13);
  border-color: rgba(var(--mc-rgb), 0.35);
  box-shadow:
    0 0 32px rgba(var(--mc-rgb), 0.25),
    0 0 0 6px rgba(var(--mc-rgb), 0.07);
}

.mod-icon {
  font-size: 36px;
  line-height: 1;
  display: block;
  transition: transform 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.module-card:hover .mod-icon {
  transform: scale(1.08);
}

/* ─── OWASP CHIP ──────────────────────────────────────── */
.owasp-chip {
  display: inline-block;
  background: rgba(var(--mc-rgb), 0.1);
  color: var(--mc);
  border: 1px solid rgba(var(--mc-rgb), 0.28);
  border-radius: 6px;
  padding: 3px 11px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1.3px;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.module-card:hover .owasp-chip {
  background: rgba(var(--mc-rgb), 0.18);
  box-shadow: 0 0 12px rgba(var(--mc-rgb), 0.2);
}

/* ─── BAŞLIK ──────────────────────────────────────────── */
.module-title {
  color: #dde4ee;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  line-height: 1.5;
  flex: 1;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.completed-card .module-title {
  color: #94a3b8;
}

/* ─── TAMAMLANDI ROZET ────────────────────────────────── */
.done-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #10b981;
  font-size: 10.5px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.28);
  border-radius: 20px;
  padding: 3px 10px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

/* ─── AYRAÇ ───────────────────────────────────────────── */
.card-sep {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--mc-rgb), 0.18), transparent);
  margin: 18px 0 16px;
  position: relative;
  z-index: 1;
  transition: background 0.3s ease;
}

/* ─── BUTON ───────────────────────────────────────────── */
@keyframes shimmer {
  0%   { transform: translateX(-130%) skewX(-18deg); }
  100% { transform: translateX(230%)  skewX(-18deg); }
}

.btn-start {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 10px;
  border: 1px solid rgba(var(--mc-rgb), 0.28);
  background: rgba(var(--mc-rgb), 0.07);
  color: var(--mc);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition:
    background    0.28s ease,
    border-color  0.28s ease,
    color         0.28s ease,
    box-shadow    0.28s ease,
    transform     0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Shimmer şeridi */
.btn-start::after {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-130%) skewX(-18deg);
  pointer-events: none;
}

.module-card:hover .btn-start::after {
  animation: shimmer 0.55s ease forwards;
}

.btn-arrow {
  display: inline-block;
  font-size: 14px;
  transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Hover — tamamlanmamış */
.module-card:hover .btn-start:not(.is-done) {
  background: linear-gradient(135deg, var(--mc), var(--mc-dark));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 22px rgba(var(--mc-rgb), 0.45);
  transform: translateY(-2px);
}

/* Hover — tamamlanmış */
.module-card:hover .btn-start.is-done {
  background: linear-gradient(135deg, var(--mc), var(--mc-dark));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 22px rgba(var(--mc-rgb), 0.4);
  transform: translateY(-2px);
}

.module-card:hover .btn-arrow {
  transform: translateX(6px);
}
</style>
