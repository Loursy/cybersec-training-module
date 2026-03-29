<template>
  <div class="auth-wrapper">
    <div class="dot-grid"></div>

    <div class="lang-selector">
      <button class="lang-btn" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>
    </div>

    <div class="auth-container fade-in-up">
      <div class="top-line line-blue"></div>
      
      <div class="auth-header">
        <div class="logo-circle glow-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h2>{{ currentText.title }}</h2>
        <p>{{ currentText.desc }}</p>
      </div>

      <form @submit.prevent="submitLogin" class="auth-form">
        <div class="input-group">
          <label>{{ currentText.emailLbl }}</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input type="email" v-model="email" placeholder="ornek@sirket.com" required autocomplete="off" />
          </div>
        </div>

        <div class="input-group">
          <label>{{ currentText.passwordLbl }}</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword" :title="showPassword ? currentText.hidePass : currentText.showPass">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-box pulse-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-submit blue-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ currentText.loginBtn }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          {{ currentText.noAccount }}
          <router-link to="/register" class="toggle-link">{{ currentText.toRegister }}</router-link>
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
    title: "Sisteme Giriş",
    desc: "Eğitim platformuna erişmek için kimliğinizi doğrulayın.",
    emailLbl: "E-posta Adresi",
    passwordLbl: "Şifre",
    showPass: "Şifreyi Göster",
    hidePass: "Şifreyi Gizle",
    loginBtn: "Giriş Yap",
    noAccount: "Henüz bir hesabınız yok mu?",
    toRegister: "Kayıt Olun",
    errorEmpty: "Tüm alanları doldurmanız gerekmektedir.",
    errorEmail: "Geçersiz e-posta formatı.",
    errorPass: "Şifreniz en az 6 karakter olmalıdır.",
    errorConnect: "Sunucu bağlantısı kurulamadı."
  },
  en: {
    title: "Sign In",
    desc: "Verify your identity to access the training platform.",
    emailLbl: "Email Address",
    passwordLbl: "Password",
    showPass: "Show Password",
    hidePass: "Hide Password",
    loginBtn: "Sign In",
    noAccount: "Don't have an account yet?",
    toRegister: "Sign Up",
    errorEmpty: "All fields are required.",
    errorEmail: "Invalid email format.",
    errorPass: "Password must be at least 6 characters.",
    errorConnect: "Server connection failed."
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  localStorage.setItem('preferredLang', currentLang.value);
};

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const submitLogin = async () => {
  errorMessage.value = '';
  
  if (!email.value || !password.value) { errorMessage.value = currentText.value.errorEmpty; return; }
  if (!emailRegex.test(email.value)) { errorMessage.value = currentText.value.errorEmail; return; }
  if (password.value.length < 6) { errorMessage.value = currentText.value.errorPass; return; }

  isLoading.value = true;

  try {
    const response = await fetch(`/api/secure/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    
    const data = await response.json();
    if (data.success) {
      // 1. Backend'den gelen güvenli JWT biletini sakla
      localStorage.setItem('token', data.token); 
      // 2. Ekranda göstermek vb. için e-postayı da sakla
      localStorage.setItem('userEmail', email.value);
      router.push('/dashboard');
    } else {
      errorMessage.value = data.message || "Bir hata oluştu.";
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
.auth-wrapper { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; position: relative; overflow: hidden; font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; pointer-events: none; }
.lang-selector { position: absolute; top: 25px; right: 25px; z-index: 10; }
.lang-btn { background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; backdrop-filter: blur(5px); }
.lang-btn:hover { background: #1e293b; color: #f8fafc; border-color: #475569; }

.auth-container { width: 100%; max-width: 440px; background: #0f172a; padding: 50px 40px; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); position: relative; z-index: 1; }

/* Yumuşak Giriş Animasyonu */
.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.top-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; border-top-left-radius: 16px; border-top-right-radius: 16px; }
.line-blue { background: linear-gradient(90deg, #0ea5e9, #3b82f6); }

.auth-header { text-align: center; margin-bottom: 30px; }
.logo-circle { width: 60px; height: 60px; background: #1e293b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; border: 1px solid #334155; color: #f8fafc; }
.glow-blue { color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
.auth-header h2 { color: #f8fafc; margin: 0; font-size: 26px; font-weight: 700; }
.auth-header p { color: #94a3b8; margin-top: 8px; font-size: 14px; line-height: 1.5; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }
.input-group label { display: block; color: #cbd5e1; margin-bottom: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 15px; color: #64748b; }

.input-wrapper input { width: 100%; padding: 14px 45px; background: #0b1120; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 15px; outline: none; transition: 0.3s; }
.input-wrapper input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }

.eye-btn { position: absolute; right: 10px; background: transparent; border: none; color: #64748b; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; transition: 0.2s; }
.eye-btn:hover { background: #1e293b; color: #f8fafc; }

.btn-submit { color: #fff; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 10px; display: flex; justify-content: center; align-items: center; }
.blue-btn { background: #0284c7; }
.blue-btn:hover:not(:disabled) { background: #0369a1; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 12px; border-radius: 8px; font-size: 13.5px; display: flex; align-items: center; gap: 10px; justify-content: center; }
.pulse-error { animation: shake 0.4s ease-in-out; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

.auth-footer { margin-top: 25px; text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; }
.auth-footer p { color: #94a3b8; font-size: 14px; margin: 0; }
.toggle-link { color: #38bdf8; font-weight: 600; cursor: pointer; margin-left: 5px; transition: 0.2s; text-decoration: none; }
.toggle-link:hover { color: #7dd3fc; text-decoration: underline; }

.spinner { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>