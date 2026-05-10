<template>
  <div class="stats-wrapper">
    <div class="dot-grid"></div>
    <div class="container">

      <div class="header">
        <h2>🏆 {{ currentText.pageTitle }}</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="lang-btn" @click="toggleLanguage">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            {{ currentLang === 'tr' ? 'EN' : 'TR' }}
          </button>
          <button class="btn-back" @click="goToDashboard">← {{ currentText.btnBack }}</button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <span class="spinner"></span>
        <p>{{ currentText.loading }}</p>
      </div>

      <div v-else class="stats-grid">

        <div v-for="mod in currentModules" :key="mod.id" class="stat-card" :class="{ 'completed': statsData[mod.id + '_completed'] }">
          <h3>{{ mod.title }}</h3>

          <div v-if="statsData[mod.id + '_completed']" class="scores-container">
            <div class="score-row">
              <span class="score-label">{{ currentText.preTest }}</span>
              <span class="score-value" :class="getScoreColor(statsData[mod.id + '_pre'])">
                {{ statsData[mod.id + '_pre'] }} / 100
              </span>
            </div>
            <div class="score-row">
              <span class="score-label">{{ currentText.postTest }}</span>
              <span class="score-value" :class="getScoreColor(statsData[mod.id + '_post'])">
                {{ statsData[mod.id + '_post'] }} / 100
              </span>
            </div>

            <div class="score-row diff-row">
              <span class="score-label">{{ currentText.diffLabel }}</span>
              <span class="diff-badge" :class="getDiffColor(getDiff(mod.id))">
                <span>{{ getDiff(mod.id) > 0 ? '↑' : getDiff(mod.id) < 0 ? '↓' : '→' }}</span>
                {{ getDiff(mod.id) > 0 ? '+' : '' }}{{ getDiff(mod.id) }} {{ currentText.points }}
              </span>
            </div>

            <button class="btn-review" @click="goToReview(mod.path)">
              🔍 {{ currentText.btnReview }}
            </button>
          </div>

          <div v-else class="not-completed">
            <div class="lock-icon">🔒</div>
            <p>{{ currentText.notCompleted }}</p>
          </div>
        </div>

      </div>

      <div v-if="completedCount > 0" class="summary-panel">
        <h3 class="summary-title">📊 {{ currentText.summaryTitle }}</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-num">{{ completedCount }} / 3</div>
            <div class="summary-label">{{ currentText.completedModules }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-num" :class="getScoreColor(overallStats.avgPre)">{{ overallStats.avgPre }}</div>
            <div class="summary-label">{{ currentText.avgPre }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-num" :class="getScoreColor(overallStats.avgPost)">{{ overallStats.avgPost }}</div>
            <div class="summary-label">{{ currentText.avgPost }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-num" :class="getDiffColor(overallStats.avgDiff)">
              {{ overallStats.avgDiff > 0 ? '+' : '' }}{{ overallStats.avgDiff }}
            </div>
            <div class="summary-label">{{ currentText.overallDiff }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const statsData = ref({});
const currentLang = ref(localStorage.getItem('preferredLang') || 'tr');

const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

const translations = {
  tr: {
    pageTitle: 'Eğitim Karnem',
    btnBack: "Dashboard'a Dön",
    loading: 'Verileriniz güvenli bağlantı üzerinden çekiliyor...',
    preTest: 'Ön-Test:',
    postTest: 'Son-Test:',
    diffLabel: 'Başarı Farkı:',
    points: 'puan',
    btnReview: 'Cevaplarımı İncele',
    notCompleted: 'Bu modülü henüz tamamlamadınız.',
    summaryTitle: 'Genel Başarı Özeti',
    completedModules: 'Tamamlanan Modül',
    avgPre: 'Ort. Ön-Test',
    avgPost: 'Ort. Son-Test',
    overallDiff: 'Genel Gelişim',
  },
  en: {
    pageTitle: 'My Training Report',
    btnBack: 'Back to Dashboard',
    loading: 'Fetching your data over a secure connection...',
    preTest: 'Pre-Test:',
    postTest: 'Post-Test:',
    diffLabel: 'Score Change:',
    points: 'pts',
    btnReview: 'Review My Answers',
    notCompleted: 'You have not completed this module yet.',
    summaryTitle: 'Overall Performance Summary',
    completedModules: 'Modules Completed',
    avgPre: 'Avg. Pre-Test',
    avgPost: 'Avg. Post-Test',
    overallDiff: 'Overall Progress',
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  localStorage.setItem('preferredLang', currentLang.value);
};

const modulesTr = [
  { id: 'bac',  title: 'Broken Access Control (A01)',  path: '/module/bac' },
  { id: 'sqli', title: 'SQL Injection (A05)',          path: '/module/sqli' },
  { id: 'cf',   title: 'Authentication Failures (A07)',path: '/module/cf' },
];

const allModuleIds = ['bac', 'sqli', 'cf'];

const currentModules = computed(() => modulesTr);

const completedCount = computed(() =>
  allModuleIds.filter(id => statsData.value[`${id}_completed`]).length
);

const getDiff = (moduleId) => {
  const pre = statsData.value[`${moduleId}_pre`];
  const post = statsData.value[`${moduleId}_post`];
  if (pre === undefined || post === undefined) return 0;
  return post - pre;
};

const getDiffColor = (diff) => {
  if (diff > 0) return 'text-green';
  if (diff < 0) return 'text-red';
  return 'text-neutral';
};

const overallStats = computed(() => {
  const completed = allModuleIds.filter(id => statsData.value[`${id}_completed`]);
  if (completed.length === 0) return { avgPre: 0, avgPost: 0, avgDiff: 0 };
  const totalPre = completed.reduce((sum, id) => sum + (statsData.value[`${id}_pre`] || 0), 0);
  const totalPost = completed.reduce((sum, id) => sum + (statsData.value[`${id}_post`] || 0), 0);
  const avgPre = Math.round(totalPre / completed.length);
  const avgPost = Math.round(totalPost / completed.length);
  return { avgPre, avgPost, avgDiff: avgPost - avgPre };
});

onMounted(async () => {
  // 1. Güvenlik Kontrolü: Token veya Email yoksa girişe şutla
  if (!userEmail || !token) {
    router.push('/');
    return;
  }

  try {
    // 2. JWT ENTEGRASYONU ve LOCALHOST TEMİZLİĞİ
    const response = await fetch(`/api/get-user-stats/${userEmail}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // GÜVENLİK BİLETİ
      }
    });
    
    const result = await response.json();
    
    if (result.success && result.data) {
      statsData.value = result.data; 
    } else if (response.status === 401 || response.status === 403) {
      // Token geçersizse çıkış yaptır
      localStorage.clear();
      router.push('/');
    }
  } catch (error) {
    console.error("Karne verileri çekilemedi:", error);
  } finally {
    isLoading.value = false;
  }
});

const goToDashboard = () => {
  router.push('/dashboard');
};

const goToReview = (path) => {
  router.push(`${path}?review=true`);
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green';
  if (score >= 50) return 'text-yellow';
  return 'text-red';
};
</script>

<style scoped>
/* Mevcut stillerini korudum, arka plana derinlik katmak için dot-grid ekledim */
.stats-wrapper {
  background-color: #0b0f19;
  color: #a1a1aa;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  z-index: 0;
  pointer-events: none;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 20px;
}

.header h2 {
  color: #f8fafc;
  margin: 0;
  font-size: 28px;
}

.lang-btn {
  background: rgba(15, 23, 42, 0.8);
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.lang-btn:hover {
  background: #1e293b;
  color: #f8fafc;
  border-color: #0ea5e9;
}

.btn-back {
  background: transparent;
  color: #00e5ff;
  border: 1px solid #00e5ff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-back:hover {
  background: #00e5ff;
  color: #0b0f19;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.stat-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.stat-card.completed {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.stat-card h3 {
  color: #e2e8f0;
  margin-top: 0;
  border-bottom: 1px solid #1f2937;
  padding-bottom: 15px;
}

.scores-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.score-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
}

.score-label {
  color: #94a3b8;
}

.score-value {
  font-weight: bold;
}

.text-green { color: #10b981; }
.text-yellow { color: #f59e0b; }
.text-red { color: #ef4444; }
.text-neutral { color: #64748b; }

.diff-row {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid #1e293b;
}

.diff-badge {
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-panel {
  margin-top: 40px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 28px 30px;
}

.summary-title {
  color: #e2e8f0;
  margin: 0 0 24px 0;
  font-size: 18px;
  border-bottom: 1px solid #1f2937;
  padding-bottom: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 640px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}

.summary-item {
  text-align: center;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
  padding: 18px 10px;
}

.summary-num {
  font-size: 32px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1;
  margin-bottom: 8px;
}

.summary-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
}

.btn-review {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
  width: 100%;
  transition: all 0.3s ease;
}

.btn-review:hover {
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.not-completed {
  text-align: center;
  color: #64748b;
  padding: 20px 0;
}

.lock-icon {
  font-size: 40px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.loading-state {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 229, 255, 0.1);
  border-radius: 50%;
  border-top-color: #00e5ff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>