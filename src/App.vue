<template>
  <div id="app-wrapper">
    <div class="bg-decoration">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>

    <TheHeader 
      v-if="auth.token" 
      :isMobile="isMobile"
      :sidebarOpen="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />

    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <TheFooter v-if="auth.token" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

const auth = useAuthStore();
const sidebarOpen = ref(false);
const isMobile = ref(window.innerWidth <= 900);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 900;
  if (!isMobile.value) sidebarOpen.value = false;
};

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>

<style>
/* Import Font chữ đẳng cấp */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
  background-color: #f0fdf4; /* Màu nền xanh lá cực nhạt */
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

#app-wrapper {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* NỀN XANH ĐẲNG CẤP */
.bg-decoration {
  position: fixed; /* Cố định nền khi cuộn trang */
  inset: 0;
  z-index: 0;
  pointer-events: none; /* Không cản trở việc click */
  overflow: hidden;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.6;
  animation: float 20s infinite alternate ease-in-out;
}

/* Khối màu xanh Emerald */
.glow-1 {
  width: 600px;
  height: 600px;
  background: #86efac;
  top: -150px;
  right: -100px;
}

/* Khối màu xanh Lime nhẹ */
.glow-2 {
  width: 500px;
  height: 500px;
  background: #bbf7d0;
  bottom: -100px;
  left: -100px;
  animation-delay: -5s;
}

/* Khối màu trắng sáng để tạo điểm nhấn */
.glow-3 {
  width: 400px;
  height: 400px;
  background: #ffffff;
  top: 30%;
  left: 20%;
  opacity: 0.4;
  animation-delay: -10s;
}

@keyframes float {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(100px, 50px) rotate(15deg); }
}

.main-content {
  position: relative;
  z-index: 10; /* Đảm bảo nội dung luôn nằm trên nền */
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* HIỆU ỨNG CHUYỂN TRANG (TRANSITION) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loại bỏ nền trong Login.vue nếu bạn đã dán vào đó để tránh bị chồng chéo */
</style>