<template>
  <div class="auth-wrapper">
    <div class="dot-grid" :class="showPassword ? 'grid-red' : 'grid-blue'"></div>

    <div class="lang-selector">
      <button class="lang-btn" :class="showPassword ? 'lang-btn-red' : 'lang-btn-blue'" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>
    </div>

    <div class="auth-container fade-in-up" :class="showPassword ? 'border-red' : 'border-blue'">
      <div class="top-line" :class="showPassword ? 'line-red' : 'line-blue'"></div>
      
      <div class="auth-header">
        <div class="logo-circle" :class="showPassword ? 'glow-red' : 'glow-blue'">
          <svg v-if="!showPassword" class="icon-transition" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <svg v-else class="icon-transition" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M8 20v2h8v-2"></path><path d="M12.5 17l-.5-1-.5 1h1z"></path><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"></path></svg>
        </div>
        <h2>{{ currentText.title }}</h2>
        <p :class="showPassword ? 'text-red' : 'text-blue-gray'">
          {{ showPassword ? currentText.descRisk : currentText.desc }}
        </p>
      </div>

      <form @submit.prevent="submitLogin" class="auth-form">
        <div class="input-group">
          <label>{{ currentText.emailLbl }}</label>
          <div class="input-wrapper" :class="showPassword ? 'input-wrapper-red' : 'input-wrapper-blue'">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input type="email" v-model="email" placeholder="ornek@sirket.com" required autocomplete="off" />
          </div>
        </div>

        <div class="input-group">
          <label :class="{'text-red': showPassword}">{{ currentText.passwordLbl }}</label>
          <div class="input-wrapper" :class="showPassword ? 'input-wrapper-red' : 'input-wrapper-blue'">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required />
            <button type="button" class="eye-btn" :class="showPassword ? 'eye-btn-red' : 'eye-btn-blue'" @click="showPassword = !showPassword" :title="showPassword ? currentText.hidePass : currentText.showPass">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
        </div>

        <div class="remember-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark" :class="showPassword ? 'check-red' : 'check-blue'"></span>
            {{ currentText.rememberMe }}
          </label>
        </div>

        <div v-if="errorMessage" class="error-box pulse-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-submit" :class="showPassword ? 'red-btn' : 'blue-btn'" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ currentText.loginBtn }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          {{ currentText.noAccount }}
          <router-link to="/register" class="toggle-link" :class="showPassword ? 'link-red' : 'link-blue'">{{ currentText.toRegister }}</router-link>
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
    descRisk: "DİKKAT: Şifreniz şu anda açık metin olarak görünüyor!",
    emailLbl: "E-posta Adresi",
    passwordLbl: "Şifre",
    rememberMe: "Beni Hatırla",
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
    descRisk: "WARNING: Your password is currently visible in plain text!",
    emailLbl: "Email Address",
    passwordLbl: "Password",
    rememberMe: "Remember Me",
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
const rememberMe = ref(false); 
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
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value,
        rememberMe: rememberMe.value 
      })
    });
    
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
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
.auth-wrapper { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; position: relative; overflow: hidden; font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; transition: background-color 0.4s ease; }

/* Dinamik Arka Plan Noktaları */
.dot-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: 24px 24px; z-index: 0; pointer-events: none; transition: background-image 0.5s ease; }
.grid-blue { background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px); }
.grid-red { background-image: radial-gradient(rgba(239, 68, 68, 0.15) 1px, transparent 1px); }

/* Dil Seçici Dinamik */
.lang-selector { position: absolute; top: 25px; right: 25px; z-index: 10; }
.lang-btn { background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.4s ease; backdrop-filter: blur(5px); }
.lang-btn-blue:hover { background: #1e293b; color: #f8fafc; border-color: #38bdf8; }
.lang-btn-red { color: #fca5a5; border-color: #7f1d1d; }
.lang-btn-red:hover { background: #450a0a; color: #f8fafc; border-color: #ef4444; }

/* Ana Konteyner Dinamik Sınır */
.auth-container { width: 100%; max-width: 440px; background: #0f172a; padding: 50px 40px; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); position: relative; z-index: 1; transition: all 0.4s ease; }
.border-blue { border-color: #1e293b; }
.border-red { border-color: #450a0a; box-shadow: 0 25px 50px rgba(239, 68, 68, 0.15); }

.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* Üst Çizgi Dinamik */
.top-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; border-top-left-radius: 16px; border-top-right-radius: 16px; transition: background 0.4s ease; }
.line-blue { background: linear-gradient(90deg, #0ea5e9, #3b82f6); }
.line-red { background: linear-gradient(90deg, #ef4444, #b91c1c); }

.auth-header { text-align: center; margin-bottom: 30px; }

/* Logo Yuvarlağı Dinamik */
.logo-circle { width: 60px; height: 60px; background: #1e293b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; border: 1px solid #334155; transition: all 0.4s ease; }
.glow-blue { color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
.glow-red { color: #ef4444; box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); border-color: #7f1d1d; background: #450a0a;}
.icon-transition { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

.auth-header h2 { color: #f8fafc; margin: 0; font-size: 26px; font-weight: 700; transition: color 0.4s ease; }
.auth-header p { margin-top: 8px; font-size: 14px; line-height: 1.5; transition: color 0.4s ease; }
.text-blue-gray { color: #94a3b8; }
.text-red { color: #fca5a5; font-weight: bold; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }
.input-group label { display: block; color: #cbd5e1; margin-bottom: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.4s ease;}
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 15px; color: #64748b; transition: color 0.4s ease; }

/* Input Focus Dinamik */
.input-wrapper input { width: 100%; padding: 14px 45px; background: #0b1120; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 15px; outline: none; transition: all 0.3s ease; }
.input-wrapper-blue input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
.input-wrapper-blue:focus-within .input-icon { color: #38bdf8; }

.input-wrapper-red input { border-color: #450a0a; }
.input-wrapper-red input:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); background: #170505;}
.input-wrapper-red:focus-within .input-icon { color: #ef4444; }

/* Göz Butonu Dinamik */
.eye-btn { position: absolute; right: 10px; background: transparent; border: none; color: #64748b; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; transition: 0.3s; }
.eye-btn-blue:hover { background: #1e293b; color: #f8fafc; }
.eye-btn-red { color: #fca5a5; }
.eye-btn-red:hover { background: #450a0a; color: #ef4444; }

/* Beni Hatırla Kutucuğu Dinamik */
.remember-options { display: flex; align-items: center; margin-top: -5px; margin-bottom: 5px; }
.checkbox-container { display: flex; align-items: center; position: relative; padding-left: 28px; cursor: pointer; font-size: 13.5px; color: #94a3b8; user-select: none; transition: color 0.3s ease; font-weight: 500;}
.checkbox-container:hover { color: #f8fafc; }
.checkbox-container input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark { position: absolute; top: -1px; left: 0; height: 18px; width: 18px; background-color: #0b1120; border: 1px solid #334155; border-radius: 4px; transition: all 0.3s ease; }

.check-blue { }
.checkbox-container:hover input ~ .check-blue { border-color: #0284c7; }
.checkbox-container input:checked ~ .check-blue { background-color: #0284c7; border-color: #0284c7; }

.check-red { border-color: #7f1d1d;}
.checkbox-container:hover input ~ .check-red { border-color: #ef4444; }
.checkbox-container input:checked ~ .check-red { background-color: #ef4444; border-color: #ef4444; }

.checkmark:after { content: ""; position: absolute; display: none; }
.checkbox-container input:checked ~ .checkmark:after { display: block; }
.checkbox-container .checkmark:after { left: 6px; top: 2px; width: 4px; height: 9px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }

/* Buton Dinamik */
.btn-submit { color: #fff; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.4s ease; margin-top: 5px; display: flex; justify-content: center; align-items: center; }
.blue-btn { background: #0284c7; }
.blue-btn:hover:not(:disabled) { background: #0369a1; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3); }

.red-btn { background: #dc2626; }
.red-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 12px; border-radius: 8px; font-size: 13.5px; display: flex; align-items: center; gap: 10px; justify-content: center; }
.pulse-error { animation: shake 0.4s ease-in-out; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

.auth-footer { margin-top: 25px; text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; transition: border-color 0.4s ease;}
.border-red .auth-footer { border-color: #450a0a; }

.auth-footer p { color: #94a3b8; font-size: 14px; margin: 0; transition: color 0.4s ease;}
.toggle-link { font-weight: 600; cursor: pointer; margin-left: 5px; transition: 0.3s; text-decoration: none; }
.link-blue { color: #38bdf8; }
.link-blue:hover { color: #7dd3fc; text-decoration: underline; }
.link-red { color: #ef4444; }
.link-red:hover { color: #fca5a5; text-decoration: underline; }

.spinner { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>