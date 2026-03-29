<template>
  <div class="stats-wrapper">
    <div class="dot-grid"></div>
    <div class="container">
      
      <div class="header">
        <h2>🏆 Eğitim Karnem</h2>
        <button class="btn-back" @click="goToDashboard">← Dashboard'a Dön</button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <span class="spinner"></span>
        <p>Verileriniz güvenli bağlantı üzerinden çekiliyor...</p>
      </div>

      <div v-else class="stats-grid">
        
        <div v-for="mod in modules" :key="mod.id" class="stat-card" :class="{ 'completed': statsData[mod.id + '_completed'] }">
          <h3>{{ mod.title }}</h3>
          
          <div v-if="statsData[mod.id + '_completed']" class="scores-container">
            <div class="score-row">
              <span class="score-label">Ön-Test:</span>
              <span class="score-value" :class="getScoreColor(statsData[mod.id + '_pre'])">
                {{ statsData[mod.id + '_pre'] }} / 100
              </span>
            </div>
            <div class="score-row">
              <span class="score-label">Son-Test:</span>
              <span class="score-value" :class="getScoreColor(statsData[mod.id + '_post'])">
                {{ statsData[mod.id + '_post'] }} / 100
              </span>
            </div>
            
            <button class="btn-review" @click="goToReview(mod.path)">
              🔍 Cevaplarımı İncele
            </button>
          </div>
          
          <div v-else class="not-completed">
            <div class="lock-icon">🔒</div>
            <p>Bu modülü henüz tamamlamadınız.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const statsData = ref({});

// JWT Token ve User Email
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

// Platformdaki tüm modüllerin listesi ve rotaları
const modules = [
  { id: 'sqli', title: '1. SQL Injection', path: '/module/sqli' },
  { id: 'bac', title: '2. Broken Access Control', path: '/module/bac' },
  { id: 'ede', title: '3. Excessive Data Exposure', path: '/module/ede' },
  { id: 'xss', title: '4. Cross-Site Scripting (XSS)', path: '/module/xss' },
  { id: 'rate', title: '5. Rate Limiting', path: '/module/rate' },
  { id: 'cmd', title: '6. OS Command Injection', path: '/module/cmd' }
];

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

.btn-back {
  background: transparent;
  color: #00e5ff;
  border: 1px solid #00e5ff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
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