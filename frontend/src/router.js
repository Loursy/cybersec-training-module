import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import Sqli from "./views/Sqli.vue";
import Stats from "./views/Stats.vue";
import Bac from "./views/Bac.vue";
import AuthFailures from "./views/AuthFailures.vue";
import Register from "./views/Register.vue";

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
    path: "/module/cf",
    component: AuthFailures,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    redirect: "/module/bac",
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
  const isAuthenticated =
    localStorage.getItem("userEmail") && localStorage.getItem("token");

  const currentStage = parseInt(localStorage.getItem("module1_stage")) || 0;

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
    next("/dashboard");
  }
  // HER ŞEY YOLUNDA: Geçişe izin ver
  else {
    next();
  }
});

export default router;
