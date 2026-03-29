<template>
  <div class="auth-wrapper">
    <div class="dot-grid"></div>

    <div class="lang-selector">
      <button class="lang-btn" @click="toggleLanguage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        {{ currentLang === 'tr' ? 'EN' : 'TR' }}
      </button>
    </div>

    <div class="scene">
      <div class="card" :class="{ 'is-flipped': !isLogin }">
        
        <div class="card-face card-front">
          <div class="auth-header">
            <div class="logo-circle glow-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h2>{{ currentText.loginTitle }}</h2>
            <p>{{ currentText.loginDesc }}</p>
          </div>

          <form @submit.prevent="submitForm" class="auth-form">
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
                <button type="button" class="eye-btn" @click="togglePassword" :title="showPassword ? currentText.hidePass : currentText.showPass">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
            </div>

            <div v-if="errorMessage && isLogin" class="error-box pulse-error">
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
              <span class="toggle-link" @click="toggleMode">{{ currentText.toRegister }}</span>
            </p>
          </div>
        </div>

        <div class="card-face card-back">
          <div class="auth-header">
            <div class="logo-circle glow-emerald">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </div>
            <h2>{{ currentText.registerTitle }}</h2>
            <p>{{ currentText.registerDesc }}</p>
          </div>

          <form @submit.prevent="submitForm" class="auth-form">
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
                <input :type="showPasswordReg ? 'text' : 'password'" v-model="password" placeholder="••••••••" required />
                <button type="button" class="eye-btn" @click="showPasswordReg = !showPasswordReg">
                  <svg v-if="!showPasswordReg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label>{{ currentText.confirmPassLbl }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <input :type="showPasswordReg ? 'text' : 'password'" v-model="confirmPassword" placeholder="••••••••" required />
              </div>
            </div>

            <div v-if="errorMessage && !isLogin" class="error-box pulse-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn-submit emerald-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>{{ currentText.registerBtn }}</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>
              {{ currentText.haveAccount }}
              <span class="toggle-link emerald-link" @click="toggleMode">{{ currentText.toLogin }}</span>
            </p>
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
const currentLang = ref('tr');

const translations = {
  tr: {
    loginTitle: "Sisteme Giriş",
    loginDesc: "Eğitim platformuna erişmek için kimliğinizi doğrulayın.",
    registerTitle: "Hesap Oluştur",
    registerDesc: "Platforma katılmak için yeni bir kullanıcı kaydı oluşturun.",
    emailLbl: "E-posta Adresi",
    passwordLbl: "Şifre",
    confirmPassLbl: "Şifre (Tekrar)",
    showPass: "Şifreyi Göster",
    hidePass: "Şifreyi Gizle",
    loginBtn: "Giriş Yap",
    registerBtn: "Kayıt Ol",
    noAccount: "Henüz bir hesabınız yok mu?",
    haveAccount: "Zaten bir hesabınız var mı?",
    toRegister: "Kayıt Olun",
    toLogin: "Giriş Yapın",
    errorEmpty: "Tüm alanları doldurmanız gerekmektedir.",
    errorEmail: "Geçersiz e-posta formatı. Lütfen geçerli bir adres girin.",
    errorPass: "Şifreniz en az 6 karakter uzunluğunda olmalıdır.",
    errorMismatch: "Girdiğiniz şifreler birbiriyle eşleşmiyor.",
    errorConnect: "Sunucu bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin."
  },
  en: {
    loginTitle: "Sign In",
    loginDesc: "Verify your identity to access the training platform.",
    registerTitle: "Create Account",
    registerDesc: "Create a new user registration to join the platform.",
    emailLbl: "Email Address",
    passwordLbl: "Password",
    confirmPassLbl: "Confirm Password",
    showPass: "Show Password",
    hidePass: "Hide Password",
    loginBtn: "Sign In",
    registerBtn: "Sign Up",
    noAccount: "Don't have an account yet?",
    haveAccount: "Already have an account?",
    toRegister: "Sign Up",
    toLogin: "Sign In",
    errorEmpty: "All fields are required.",
    errorEmail: "Invalid email format. Please enter a valid address.",
    errorPass: "Your password must be at least 6 characters long.",
    errorMismatch: "The passwords you entered do not match.",
    errorConnect: "Server connection failed. Please try again later."
  }
};

const currentText = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'tr' ? 'en' : 'tr';
  localStorage.setItem('preferredLang', currentLang.value);
};

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLogin = ref(true);
const errorMessage = ref('');
const isLoading = ref(false);

const showPassword = ref(false); 
const showPasswordReg = ref(false); 

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const togglePassword = () => { showPassword.value = !showPassword.value; };

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
  password.value = '';
  confirmPassword.value = '';
  email.value = '';
  showPassword.value = false;
  showPasswordReg.value = false;
};

const submitForm = async () => {
  errorMessage.value = '';
  
  if (!email.value || !password.value || (!isLogin.value && !confirmPassword.value)) { 
    errorMessage.value = currentText.value.errorEmpty; 
    return; 
  }
  
  if (!emailRegex.test(email.value)) { 
    errorMessage.value = currentText.value.errorEmail; 
    return; 
  }
  
  if (password.value.length < 6) { 
    errorMessage.value = currentText.value.errorPass; 
    return; 
  }

  // YENİ: Kayıt olurken şifreler eşleşiyor mu kontrolü
  if (!isLogin.value && password.value !== confirmPassword.value) {
    errorMessage.value = currentText.value.errorMismatch;
    return;
  }

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
/* Genel Arka Plan ve Düzen */
.auth-wrapper {
  background-color: #0b0f19;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Noktalı Arka Plan Efekti */
.dot-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
  z-index: 0;
  pointer-events: none;
}

.lang-selector {
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 10;
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
  backdrop-filter: blur(5px);
}

.lang-btn:hover {
  background: #1e293b;
  color: #f8fafc;
  border-color: #475569;
}

/* 3D Flip Card Mekanizması */
.scene {
  width: 100%;
  max-width: 440px;
  height: 640px; /* Kayıt ekranındaki ekstra input için uzatıldı */
  perspective: 1000px;
  z-index: 1;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #0f172a;
  padding: 50px 40px;
  border-radius: 16px;
  border: 1px solid #1e293b;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Ön (Mavi) ve Arka (Yeşil) Yüzün Üst Çizgileri */
.card-front::before {
  content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
  background: linear-gradient(90deg, #0ea5e9, #3b82f6);
  border-top-left-radius: 16px; border-top-right-radius: 16px;
}

.card-back {
  transform: rotateY(180deg);
}

.card-back::before {
  content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
  background: linear-gradient(90deg, #10b981, #059669);
  border-top-left-radius: 16px; border-top-right-radius: 16px;
}

/* İçerik Tasarımları */
.auth-header { text-align: center; margin-bottom: 30px; }

.logo-circle {
  width: 60px;
  height: 60px;
  background: #1e293b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px auto;
  border: 1px solid #334155;
  color: #f8fafc;
}

.glow-blue { color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
.glow-emerald { color: #34d399; box-shadow: 0 0 20px rgba(52, 211, 153, 0.2); }

.auth-header h2 { color: #f8fafc; margin: 0; font-size: 26px; font-weight: 700; }
.auth-header p { color: #94a3b8; margin-top: 8px; font-size: 14px; line-height: 1.5; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.input-group label { display: block; color: #cbd5e1; margin-bottom: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 15px; color: #64748b; }

.input-wrapper input {
  width: 100%;
  padding: 14px 45px;
  background: #0b1120;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f8fafc;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
}

.input-wrapper input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
.card-back .input-wrapper input:focus { border-color: #34d399; box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1); }

.eye-btn {
  position: absolute; right: 10px; background: transparent; border: none; 
  color: #64748b; cursor: pointer; padding: 6px; border-radius: 6px; 
  display: flex; align-items: center; transition: 0.2s;
}
.eye-btn:hover { background: #1e293b; color: #f8fafc; }

/* Buton Tasarımları */
.btn-submit {
  color: #fff; border: none; padding: 15px; border-radius: 8px; font-size: 16px;
  font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 10px;
  display: flex; justify-content: center; align-items: center;
}
.blue-btn { background: #0284c7; }
.blue-btn:hover:not(:disabled) { background: #0369a1; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3); }

.emerald-btn { background: #059669; }
.emerald-btn:hover:not(:disabled) { background: #047857; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3); }

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* Hata Mesajı */
.error-box {
  background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5; padding: 12px; border-radius: 8px; font-size: 13.5px; 
  display: flex; align-items: center; gap: 10px; justify-content: center;
}
.pulse-error { animation: shake 0.4s ease-in-out; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.auth-footer { margin-top: 25px; text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; }
.auth-footer p { color: #94a3b8; font-size: 14px; margin: 0; }

.toggle-link { color: #38bdf8; font-weight: 600; cursor: pointer; margin-left: 5px; transition: 0.2s; }
.toggle-link:hover { color: #7dd3fc; text-decoration: underline; }
.emerald-link { color: #34d399; }
.emerald-link:hover { color: #6ee7b7; }

.spinner {
  width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>