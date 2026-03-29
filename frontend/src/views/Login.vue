<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      
      <div class="lang-selector">
        <button class="lang-btn" @click="toggleLanguage">
          <span class="lang-icon">🌐</span>
          {{ currentLang === 'tr' ? 'EN' : 'TR' }}
        </button>
      </div>

      <div class="auth-header">
        <div class="logo-icon">🛡️</div>
        <h2>{{ isLogin ? currentText.loginTitle : currentText.registerTitle }}</h2>
        <p>{{ currentText.welcomeMsg }}</p>
      </div>

      <form @submit.prevent="submitForm" class="auth-form">
        
        <div class="input-group">
          <label>{{ currentText.emailLbl }}</label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input 
              type="email" 
              v-model="email" 
              placeholder="email@example.com" 
              required 
              autocomplete="off"
            />
          </div>
        </div>

        <div class="input-group">
          <label>{{ currentText.passwordLbl }}</label>
          <div class="input-wrapper">
            <span class="input-icon">🔑</span>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
            
            <button type="button" class="eye-btn" @click="togglePassword" :title="showPassword ? currentText.hidePass : currentText.showPass">
              <span class="eye-icon">{{ showPassword ? '🔓' : '🔒' }}</span>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ isLogin ? currentText.loginBtn : currentText.registerBtn }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          {{ isLogin ? currentText.noAccount : currentText.haveAccount }}
          <span class="toggle-link" @click="toggleMode">
            {{ isLogin ? currentText.toRegister : currentText.toLogin }}
          </span>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentLang = ref('tr');

const translations = {
  tr: {
    loginTitle: "Giriş Yap",
    welcomeMsg: "Siber güvenlik laboratuvarına hoş geldiniz.",
    registerTitle: "Hesap Oluştur",
    emailLbl: "E-posta Adresi",
    passwordLbl: "Şifre",
    showPass: "Şifreyi Göster",
    hidePass: "Şifreyi Gizle",
    loginBtn: "Sisteme Gir",
    registerBtn: "Kayıt Ol",
    noAccount: "Hesabınız yok mu?",
    haveAccount: "Zaten üye misiniz?",
    toRegister: "Hemen Oluştur",
    toLogin: "Giriş Yap",
    errorEmpty: "Tüm alanları doldurun!",
    errorEmail: "E-posta formatı hatalı!",
    errorPass: "Şifre en az 6 karakter olmalı.",
    errorConnect: "Bağlantı hatası! Sunucu kapalı olabilir."
  },
  en: {
    loginTitle: "Sign In",
    welcomeMsg: "Welcome to the cybersecurity laboratory.",
    registerTitle: "Create Account",
    emailLbl: "Email Address",
    passwordLbl: "Password",
    showPass: "Show Password",
    hidePass: "Hide Password",
    loginBtn: "Enter System",
    registerBtn: "Sign Up",
    noAccount: "Don't have an account?",
    haveAccount: "Already a member?",
    toRegister: "Create One",
    toLogin: "Sign In",
    errorEmpty: "Fill in all fields!",
    errorEmail: "Invalid email format!",
    errorPass: "Password must be at least 6 chars.",
    errorConnect: "Connection failed! Backend may be down."
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  localStorage.setItem('preferredLang', currentLang.value);
};

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const togglePassword = () => { showPassword.value = !showPassword.value; };

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
  password.value = '';
  email.value = '';
};

const submitForm = async () => {
  errorMessage.value = '';
  if (!email.value || !password.value) { errorMessage.value = currentText.value.errorEmpty; return; }
  if (!emailRegex.test(email.value)) { errorMessage.value = currentText.value.errorEmail; return; }
  if (password.value.length < 6) { errorMessage.value = currentText.value.errorPass; return; }

  isLoading.value = true;
  const endpoint = isLogin.value ? '/api/secure/login' : '/api/secure/register';

  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('userEmail', email.value);
      router.push('/dashboard');
    } else {
      errorMessage.value = data.message || "Error";
    }
  } catch (error) {
    errorMessage.value = currentText.value.errorConnect;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang) currentLang.value = savedLang;
});
</script>

<style scoped>
.auth-wrapper {
  background-color: #0d1117;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.auth-container {
  background: #161b22;
  width: 100%;
  max-width: 460px; /* Biraz genişletildi */
  padding: 60px 45px; /* İç boşluk artırıldı */
  border-radius: 16px;
  border: 1px solid #30363d;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  position: relative;
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 4px;
  background: linear-gradient(90deg, #58a6ff, #1f6feb);
}

/* YENİ DİL BUTONU TASARIMI */
.lang-selector {
  position: absolute;
  top: 20px;
  right: 20px;
}

.lang-btn {
  background: rgba(88, 166, 255, 0.05);
  color: #58a6ff;
  border: 1px solid #30363d;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: rgba(88, 166, 255, 0.15);
  border-color: #58a6ff;
  transform: translateY(-2px);
}

.lang-icon {
  font-size: 16px;
}

.auth-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-icon {
  font-size: 55px;
  margin-bottom: 15px;
  display: block;
}

.auth-header h2 {
  color: #f0f6fc;
  margin: 0;
  font-size: 30px; /* Büyütüldü */
  font-weight: 700;
}

.auth-header p {
  color: #8b949e;
  margin-top: 8px;
  font-size: 16px; /* Büyütüldü */
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 25px; /* Boşluk artırıldı */
}

.input-group label {
  display: block;
  color: #c9d1d9;
  margin-bottom: 10px;
  font-size: 15px; /* Büyütüldü */
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  font-size: 18px;
  color: #484f58;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 45px; /* Giriş alanı büyütüldü */
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  color: #c9d1d9;
  font-size: 16px; /* Yazı büyütüldü */
  outline: none;
  transition: 0.2s;
}

.input-wrapper input:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 4px rgba(88, 166, 255, 0.1);
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: 0.2s;
}

.eye-btn:hover {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
}

.btn-submit {
  background: #1f6feb;
  color: #fff;
  border: none;
  padding: 16px; /* Buton büyütüldü */
  border-radius: 8px;
  font-size: 18px; /* Yazı büyütüldü */
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-submit:hover:not(:disabled) { 
  background: #388bfd;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(31, 111, 235, 0.4);
}

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.error-box {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.4);
  color: #ff7b72;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
  border-top: 1px solid #30363d;
  padding-top: 25px;
}

.auth-footer p { color: #8b949e; font-size: 15px; }

.toggle-link {
  color: #58a6ff;
  font-weight: 700;
  cursor: pointer;
  margin-left: 5px;
}

.toggle-link:hover { text-decoration: underline; }

.spinner {
  width: 22px; height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>