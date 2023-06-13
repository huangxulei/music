import { createApp } from "vue";
import App from "./App.vue";
//pinia
import { createPinia } from "pinia";

//状态管理
const pinia = createPinia();

//应用：创建、配置
const app = createApp(App);

app.use(pinia).mount("#app");
