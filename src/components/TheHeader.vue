<template>
  <header class="main-top-nav glass-effect shadow-soft">
    <div class="header-container">
      <div class="nav-left">
        <div class="logo-box shadow-icon">🌿</div>
        <div class="brand-info">
          <span class="brand-name">VNUA <span class="light">Schedule</span></span>
          <span class="version-tag">v2.8 Platinum</span>
        </div>
      </div>

      <div class="nav-right">
       
        
        <div class="nav-user " @click="handleLogout">
          <div class="user-info-mini">
           
            <span class="u-status"> Trực tuyến</span>
          </div>
          <div class="logout-icon-box" style ="color: red;">➔</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

defineProps(['isMobile', 'sidebarOpen']);
const emit = defineEmits(['toggle-sidebar']);
const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped>
.main-top-nav {
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.header-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.glass-effect { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); }
.nav-left { display: flex; align-items: center; gap: 14px; }
.logo-box { background: #10b981; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; }
.brand-name { font-weight: 800; color: #064e3b; font-size: 1.1rem; }
.version-tag { font-size: 0.65rem; color: #10b981; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; width: fit-content; }
.nav-user { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 100px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; }
.u-name { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
.u-status { font-size: 0.7rem; color: #10b981; font-weight: 600; text-align: right; }
.logout-icon-box { background: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94a3b8; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

@media (max-width: 900px) {
  .logout-mobile {
    width: 36px;
    height: 36px;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
  }

  .nav-user {
    padding: 0;
    border: none;
    background: transparent;
  }
}


</style>