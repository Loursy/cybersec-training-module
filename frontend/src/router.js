import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import Sqli from "./views/Sqli.vue";
import Stats from "./views/Stats.vue";
import Bac from "./views/Bac.vue";
import Ede from "./views/Ede.vue";
import Xss from "./views/Xss.vue";
import Rate from "./views/Rate.vue";
import Cmd from "./views/Cmd.vue";
import Register from "./views/Register.vue";

const Module1Pre = {
  template:
    '<h1 style="color:white; text-align:center; margin-top:50px;">Ön Test (Aşama 1)</h1>',
};
const Module1Sim = {
  template:
    '<h1 style="color:white; text-align:center; margin-top:50px;">Simülasyon (Aşama 2)</h1>',
};

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/stats",
    component: Stats,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/sqli",
    component: Sqli,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/bac",
    component: Bac,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/ede",
    component: Ede,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/xss",
    component: Xss,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/rate",
    component: Rate,
    meta: { requiresAuth: true },
  },
  {
    path: "/module/cmd",
    component: Cmd,
    meta: { requiresAuth: true },
  },
  {
    path: "/module1/simulation",
    component: Module1Sim,
    meta: { requiresAuth: true, requiredStage: 1 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ==========================================
// ROTA BEKÇİSİ (NAVIGATION GUARD)
// ==========================================
router.beforeEach((to, from, next) => {
  // 1. Kullanıcının giriş yapıp yapmadığını kontrol et
  const isAuthenticated = localStorage.getItem("userEmail");

  // 2. Kullanıcının modül ilerlemesini kontrol et (Dashboard kilidi için)
  const currentStage = parseInt(localStorage.getItem("module1_stage")) || 0;

  // KURAL 1: Gidilen sayfa giriş gerektiriyor mu ve kullanıcı giriş YAPMAMIŞ mı?
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.warn(
      "Güvenlik İhlali: Giriş yapılmadan sayfaya erişim engellendi!",
    );
    next("/");
  }
  // KURAL 2: Gidilen sayfa bir aşama gerektiriyor mu ve kullanıcının seviyesi yetmiyor mu?
  else if (
    to.meta.requiredStage !== undefined &&
    currentStage < to.meta.requiredStage
  ) {
    console.warn(
      "Mantık İhlali: Önceki modülü tamamlamadan buraya geçemezsiniz!",
    );
    next("/module1/pre-test");
  }
  // HER ŞEY YOLUNDA: Geçişe izin ver
  else {
    next();
  }
});

export default router;
