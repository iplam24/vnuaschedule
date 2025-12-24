<template>
  <div class="luxury-login">
    <div class="bg-gradient-overlay"></div>

    <Transition name="slide-up" mode="out-in">
      <div v-if="!showSemesterDialog" key="login" class="form-container">
        <div class="glass-card">
          <div class="card-header">
            <div class="icon-box shadow-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 12.5V16a6 6 0 0012 0v-3.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1>Đăng nhập</h1>
            <p class="brand-name">Vnua Schedule</p>
          </div>

          <div class="card-body">
            <div class="input-group">
              <input v-model="username" type="text" placeholder="Mã sinh viên" @keyup.enter="handleLogin">
            </div>
            <div class="input-group">
              <input v-model="password" type="password" placeholder="••••••••••••" @keyup.enter="handleLogin">
            </div>
            <button @click="handleLogin" :disabled="loading" class="btn-primary-glow">
              <span v-if="!loading">Đăng nhập</span>
              <div v-else class="spinner"></div>
            </button>
          </div>
        </div>
        <footer class="clean-footer">
          <p>VNUA © 2025</p>
          <p class="author">Vũ Xuân Lâm đẹp trai</p>
        </footer>
      </div>

      <div v-else key="semester" class="form-container">
        <div class="glass-card">
          <div class="card-header">
            <div class="icon-box secondary shadow-icon">📅</div>
            <h1>Học kỳ</h1>
            <p class="brand-name">Xác nhận phiên làm việc</p>
          </div>

          <div class="card-body">
            <div class="select-field">
              <select v-model="tempSemester">
                <option value="" disabled selected>-- Chọn học kỳ --</option>
                <option v-for="s in auth.semesters" :key="s.hocKy" :value="s.hocKy">
                  {{ s.tenHocKy }}
                </option>
              </select>
              <div class="chevron"></div>
            </div>
            <button @click="confirmAndEnter" :disabled="!tempSemester" class="btn-primary-glow">
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const showSemesterDialog = ref(false);
const tempSemester = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  loading.value = true;
  const success = await auth.login(username.value, password.value);
  if (success) {
    await auth.fetchSemesters();
    showSemesterDialog.value = true;
  } else {
    alert('Thông tin không chính xác!');
  }
  loading.value = false;
};

const confirmAndEnter = () => {
  // Tìm đối tượng học kỳ để lấy tên
  const selectedObj = auth.semesters.find(s => s.hocKy === tempSemester.value);
  if (selectedObj) {
    auth.setSemester(selectedObj.hocKy, selectedObj.tenHocKy);
    router.push('/');
  }
};
</script>

<style scoped>
/* Chống tràn và Căn giữa */
.luxury-login {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0fdf4;
  position: relative;
  overflow: hidden;
}

.form-container {
  width: 100%;
  max-width: 380px; /* Không tràn PC, gọn trên Mobile */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.bg-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #e0f9ed 0%, #ffffff 100%);
  z-index: 1;
}

/* Card Đăng nhập Premium */
.glass-card {
  width: 100%;
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 28px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.icon-box {
  width: 68px; height: 68px;
  background: #1eb45d;
  color: white;
  margin: 0 auto 20px;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
}
.shadow-icon { box-shadow: 0 8px 20px rgba(30, 180, 93, 0.3); }

h1 { font-size: 1.7rem; font-weight: 800; color: #1a633c; margin: 0; }
.brand-name { color: #8c9ba5; font-size: 0.95rem; margin: 8px 0 32px; font-weight: 500; }

/* Input và Select xanh lơ nhạt */
.input-group, .select-field { margin-bottom: 16px; position: relative; }
input, select {
  width: 100%; height: 54px;
  padding: 0 20px; background: #f1f6ff;
  border: 1.5px solid transparent; border-radius: 16px;
  font-size: 1rem; font-weight: 600; color: #334155;
  outline: none; box-sizing: border-box; transition: 0.2s;
}
input:focus, select:focus { background: #fff; border-color: #1eb45d; box-shadow: 0 0 0 4px rgba(30, 180, 93, 0.1); }

/* Nút bấm Đẳng cấp */
.btn-primary-glow {
  width: 100%; height: 56px; margin-top: 10px;
  background: #1eb45d; color: white; border: none;
  border-radius: 16px; font-weight: 700; cursor: pointer;
  box-shadow: 0 10px 20px rgba(30, 180, 93, 0.25);
}

.select-field select { appearance: none; }
.chevron {
  position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
  width: 12px; height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a633c' stroke-width='3'%3E%3Cpath d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
  background-size: contain; pointer-events: none;
}

.clean-footer { margin-top: 30px; text-align: center; }
.clean-footer p { margin: 4px 0; color: #9aa7af; font-size: 0.85rem; font-weight: 600; }
.author { color: #64748b !important; }

.spinner {
  width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-20px); }
</style>