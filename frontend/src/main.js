import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Yönlendiriciyi import et

const app = createApp(App);
app.use(router); // Vue'ya yönlendiriciyi entegre et
app.mount("#app");
