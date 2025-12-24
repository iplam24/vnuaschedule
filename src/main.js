import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Nếu bạn không có file style.css hoặc main.css, hãy tạm thời xóa dòng import này để tránh lỗi
// import './style.css'; 

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');