<template>
  <div class="elite-dashboard">
    <div class="dashboard-wrapper">
      <nav class="tab-header bento-card glass-effect shadow-premium">
        <button v-for="tab in tabs" :key="tab.id" 
                :class="['tab-btn', { active: currentTab === tab.id }]"
                @click="currentTab = tab.id">
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
        </button>
      </nav>
 

      <div class="main-layout">
        <aside class="sidebar-area">
          <div class="bento-card sidebar-sticky shadow-soft">
            <div class="profile-section">
              <div class="avatar-frame shadow-soft">
                <img v-if="avatar" :src="`data:image/png;base64,${avatar}`" alt="SV">
                <div v-else class="avatar-fallback">{{ studentInfo?.tenDayDu?.charAt(0) }}</div>
              </div>
              <div class="profile-meta">
                <h3>{{ studentInfo?.tenDayDu || 'Đang tải...' }}</h3>
                <p>Mã SV: {{ studentInfo?.maSv }}</p>
              </div>
            </div>

            <div class="separator"></div>

            <div class="controls">
              <div class="control-item">
                <label>HỌC KỲ ĐANG XEM</label>
                <div class="sem-display">{{ selectedSemesterName }}</div>
              </div>
              
              <div class="control-item">
                <label>CHỌN NGÀY HỌC</label>
                <div class="date-input-wrapper">
                  <input type="date" v-model="selectedDate" class="modern-input shadow-sm" />
                </div>
              </div>
            </div>

            
          </div>
        </aside>

        <main class="content-area">
          <div class="bento-card schedule-card shadow-soft">
            <header class="card-header">
              <div class="date-focus">
                <p class="day-text">{{ formatDateFull(selectedDate) }}</p>
                <h2>Lịch trình chi tiết</h2>
              </div>
              <div class="count-chip">{{ filteredSchedule.length }} môn</div>
            </header>

            <div class="schedule-viewport custom-scrollbar">
              <div v-if="filteredSchedule.length === 0" class="empty-state">
                <div class="empty-icon">🍃</div>
                <p>Hôm nay bạn không có lịch học</p>
              </div>

              <div class="lesson-stack">
                <div 
                  v-for="(item, idx) in filteredSchedule" 
                  :key="idx" 
                  class="lesson-entry shadow-sm"
                  @click="selectedLesson = item"
                >
                  <div class="time-sidebar" :class="item.tietBatDau >= 6 ? 'pm' : 'am'">
                    <span class="t-label">TIẾT</span>
                    <span class="t-value">{{ item.tietBatDau }}-{{ item.tietBatDau + item.soTiet - 1 }}</span>
                  </div>
                  
                  <div class="lesson-main">
                    <div class="m-top">
                      <h4 class="m-title">{{ item.tenMon }}</h4>
                      <span class="m-week">Tuần {{ item.tuanSo }}</span>
                    </div>
                    <div class="m-bottom">
                      <div class="m-tag"><span class="i">📍</span> {{ item.phong }}</div>
                      <div class="m-tag hide-mobile"><span class="i">👤</span> {{ item.giangVien }}</div>
                      <div class="m-tag highlight"><span class="i">⏰</span> {{ item.gioBatDau }} - {{ item.gioKetThuc }}</div>
                    </div>
                  </div>
                  <div class="m-arrow">➔</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <Transition name="fade-scale">
      <div v-if="selectedLesson" class="modal-overlay" @click="selectedLesson = null">
        <div class="modal-container shadow-premium" @click.stop>
          <div class="modal-header-banner" :class="selectedLesson.tietBatDau >= 6 ? 'pm-bg' : 'am-bg'">
             <div class="m-header-content">
               <span class="m-type-badge">THÔNG TIN HỌC PHẦN</span>
               <h3>{{ selectedLesson.maMon }}</h3>
             </div>
             <button class="m-close" @click="selectedLesson = null">&times;</button>
          </div>
          
          <div class="modal-body custom-scrollbar">
             <div class="info-group">
                <label>Tên học phần</label>
                <h4>{{ selectedLesson.tenMon }}</h4>
             </div>

             <div class="info-details-grid">
                <div class="d-cell">
                  <label>👨‍🏫 Giảng viên</label>
                  <span>{{ selectedLesson.giangVien || 'Chưa cập nhật' }}</span>
                </div>
                <div class="d-cell">
                  <label>🏫 Phòng học</label>
                  <span class="room-emphasize">📍 {{ selectedLesson.phong }}</span>
                </div>
                <div class="d-cell">
                  <label>👥 Nhóm / Lớp</label>
                  <span>N{{ selectedLesson.nhom }} - {{ selectedLesson.lop }}</span>
                </div>
                <div class="d-cell">
                  <label>📝 Tín chỉ</label>
                  <span>{{ selectedLesson.soTinChi }} Tín chỉ</span>
                </div>
                <div class="d-cell">
                  <label>⏱️ Thời gian</label>
                  <span>Tiết {{ selectedLesson.tietBatDau }} ({{ selectedLesson.soTiet }} tiết)</span>
                </div>
                <div class="d-cell">
                  <label>📅 Ngày học</label>
                  <span>{{ selectedLesson.ngayHoc }}</span>
                </div>
             </div>

             <div class="week-info-section">
                <label>📅 Lịch tuần chi tiết</label>
                <div class="week-value">Tuần học hiện tại: {{ selectedLesson.tuanSo }}</div>
             </div>
          </div>
          
          <div class="modal-footer">
            <button class="m-btn-primary" @click="selectedLesson = null">Đã xem xong</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const auth = useAuthStore();
const studentInfo = ref(null);
const avatar = ref('');
const schedule = ref([]);
const selectedLesson = ref(null);
const currentTab = ref('schedule');

const tabs = [
  { id: 'schedule', name: 'Lịch học', icon: '📖' },
  { id: 'exam', name: 'Lịch thi', icon: '✍️' },
  { id: 'grade', name: 'Điểm thi', icon: '📊' },
  { id: 'user', name: 'Cá nhân', icon: '👤' }
];
const selectedSemesterName = ref(localStorage.getItem('selected_semester_name') || 'Học kỳ hiện tại');
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const filteredSchedule = computed(() => {
  if (!schedule.value) return [];
  return schedule.value
    .filter(item => item.ngayHoc === selectedDate.value)
    .sort((a, b) => a.tietBatDau - b.tietBatDau);
});

const formatDateFull = (dateStr) => {
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
};

const fetchData = async () => {
  const mssv = localStorage.getItem('mssv');
  const hocky = auth.selectedSemester;

  try {
    const [info, img, sche] = await Promise.all([
      api.get('/api/v1/tkb/student-info'),
      api.get(`/api/v1/tkb/student-image?maSv=${mssv}`),
      api.get(`/api/v1/tkb/full-schedule?hocKy=${hocky}`)
    ]);
    studentInfo.value = info.data.data;
    avatar.value = img.data.data;
    schedule.value = sche.data.data;
  } catch (e) { console.error("Lỗi Lịch học:", e); }

  try {
    const examRes = await api.get(`/api/v1/tkb/exams?hocKy=${hocky}`);
    examSchedule.value = examRes.data.data || [];
  } catch (e) { examSchedule.value = []; }

  try {
    const gradeRes = await api.get(`/api/v1/tkb/grades?hocKy=${hocky}`);
    gradeResults.value = gradeRes.data.data || [];
  } catch (e) { gradeResults.value = []; }
};

onMounted(fetchData);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.elite-dashboard { height: 100vh; padding: 20px; background: #f8fafc; font-family: 'Inter', sans-serif; overflow: hidden; }
.dashboard-wrapper { max-width: 1200px; height: 100%; margin: 0 auto; display: flex; flex-direction: column; }

/* TOP NAV */
.top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 8px; }
.nav-brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; color: #064e3b; }
.logo-box { background: #10b981; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }
.nav-user { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #94a3b8; font-weight: 600; font-size: 0.9rem; transition: 0.2s; }
.nav-user:hover { color: #ef4444; }

/* LAYOUT */
.main-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; flex: 1; min-height: 0; }
.bento-card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; }
.shadow-soft { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02); }

/* SIDEBAR Area */
.sidebar-sticky { padding: 24px 16px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.avatar-frame { width: 68px; height: 85px; margin: 0 auto 15px; border-radius: 16px; overflow: hidden; border: 3px solid #10b981; background: #f0fdf4; }
.avatar-frame img { width: 100%; height: 100%; object-fit: cover; }
.profile-meta h3 { font-size: 1rem; margin: 0; font-weight: 800; color: #1e293b; line-height: 1.3; text-align: center; }
.profile-meta p { font-size: 0.8rem; color: #94a3b8; margin: 5px 0 0; font-weight: 600; text-align: center; }
/* TAB HEADER */
.tab-header { display: flex; padding: 6px; gap: 6px; margin-bottom: 8px; }
.tab-btn { flex: 1; border: none; background: transparent; padding: 12px; border-radius: 14px; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; color: #64748b; }
.tab-btn.active { background: #10b981; color: white; transform: translateY(-2px); }
.separator { height: 1px; background: #f1f5f9; margin: 20px 0; }
.controls { flex: 1; }
.control-item { margin-bottom: 20px; }
.control-item label { display: block; font-size: 9px; font-weight: 800; color: #cbd5e1; letter-spacing: 0.8px; margin-bottom: 8px; }
.sem-display { background: #f8fafc; color: #10b981; padding: 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; border: 1px solid #f1f5f9; }
.modern-input { width: 100%; padding: 12px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-family: inherit; font-weight: 700; outline: none; transition: 0.2s; color: #064e3b; box-sizing: border-box; }
.modern-input:focus { border-color: #10b981; background: white; }

.status-pill { font-size: 0.75rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 8px 16px; border-radius: 100px; width: fit-content; }
.dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; }
.pulse { animation: pulse-green 2s infinite; }

/* CONTENT AREA */
.schedule-card { padding: 30px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.card-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; }
.day-text { font-size: 0.85rem; color: #94a3b8; font-weight: 600; margin-bottom: 4px; text-transform: capitalize; }
.card-header h2 { font-size: 1.6rem; font-weight: 800; margin: 0; color: #0f172a; letter-spacing: -0.5px; }
.count-chip { background: #1e293b; color: white; padding: 6px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; }

/* VIEWPORT CHỐNG TRÀN */
.schedule-viewport { flex: 1; overflow-y: auto; padding-right: 12px; }
.lesson-stack { display: flex; flex-direction: column; gap: 16px; }

.lesson-entry { 
  display: flex; background: white; border-radius: 18px; overflow: hidden; 
  border: 1px solid #f1f5f9; cursor: pointer; transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.lesson-entry:hover { transform: translateX(6px); border-color: #10b981; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.08); }

.time-sidebar { 
  width: 80px; display: flex; flex-direction: column; align-items: center; 
  justify-content: center; color: white; flex-shrink: 0; padding: 20px 0;
}
.am { background: linear-gradient(180deg, #f59e0b, #d97706); }
.pm { background: linear-gradient(180deg, #3b82f6, #1d4ed8); }
.t-label { font-size: 9px; font-weight: 800; opacity: 0.8; margin-bottom: 2px; }
.t-value { font-size: 1.3rem; font-weight: 800; }

.lesson-main { padding: 18px 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.m-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.m-title { font-size: 1rem; font-weight: 800; color: #1e293b; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.m-week { font-size: 0.7rem; background: #f1f5f9; padding: 3px 10px; border-radius: 6px; color: #64748b; font-weight: 700; }

.m-bottom { display: flex; gap: 20px; flex-wrap: wrap; }
.m-tag { font-size: 0.8rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.highlight { color: #10b981; }
.m-arrow { width: 40px; display: flex; align-items: center; justify-content: center; color: #e2e8f0; font-size: 1.5rem; }

/* MODAL CHI TIẾT */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 20px; }
.modal-container { background: white; width: 100%; max-width: 500px; border-radius: 28px; overflow: hidden; }
.modal-header-banner { padding: 35px; color: white; display: flex; justify-content: space-between; align-items: flex-start; }
.am-bg { background: linear-gradient(135deg, #f59e0b, #d97706); }
.pm-bg { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }

.m-header-content .m-type-badge { font-size: 9px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 5px 12px; border-radius: 6px; text-transform: uppercase; }
.m-header-content h3 { font-size: 1.8rem; font-weight: 800; margin: 12px 0 0; }
.m-close { background: none; border: none; color: white; font-size: 2rem; cursor: pointer; opacity: 0.7; }

.modal-body { padding: 35px; }
.info-group label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 8px; }
.info-group h4 { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin: 0; line-height: 1.4; }

.info-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; border-top: 1px solid #f1f5f9; padding-top: 30px; margin-top: 30px; margin-bottom: 30px; }
.d-cell label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 6px; }
.d-cell span { font-weight: 700; color: #1e293b; font-size: 1rem; }
.room-emphasize { color: #10b981 !important; font-weight: 800; }

.week-info-section { background: #f8fafc; padding: 18px; border-radius: 14px; border: 1px solid #f1f5f9; }
.week-value { font-weight: 700; color: #1e293b; font-size: 0.9rem; }

.modal-footer { padding: 0 35px 35px; }
.m-btn-primary { width: 100%; padding: 16px; background: #1e293b; color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; }

/* UTILS */
.empty-state { text-align: center; padding-top: 100px; color: #94a3b8; }
.empty-icon { font-size: 3rem; margin-bottom: 15px; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
@keyframes pulse-green { 0% { box-shadow: 0 0 0 0px rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0px rgba(34, 197, 94, 0); } }

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
  .sidebar-sticky {
    flex-direction: row;
  }
  .elite-dashboard { overflow-y: auto; height: auto; }
}
@media (max-width: 600px) {
  .elite-dashboard {
    padding: 10px;
  }

  /* TOP NAV */
  .top-nav {
    padding: 0;
  }

  .brand-name {
    font-size: 0.95rem;
  }

  .nav-user span {
    display: none; /* chỉ để icon cho gọn */
  }

  /* CARD */
  .schedule-card {
    padding: 18px;
    border-radius: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .card-header h2 {
    font-size: 1.3rem;
  }

  .count-chip {
    align-self: flex-end;
  }

  /* LESSON ITEM */
  .lesson-entry {
    flex-direction: column;
  }

  .time-sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    padding: 12px;
  }

  .lesson-main {
    padding: 16px;
  }

  .m-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .m-title {
    white-space: normal;
  }

  .m-bottom {
    gap: 10px;
  }

  .hide-mobile {
    display: none;
  }

  .m-arrow {
    display: none;
  }

  /* MODAL */
  .modal-container {
    border-radius: 22px;
  }

  .modal-header-banner {
    padding: 25px;
  }

  .modal-body {
    padding: 25px;
  }

  .info-details-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .empty-state {
    padding-top: 60px;
  }
}/* ================= MOBILE / TABLET ================= */
@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .elite-dashboard {
    height: auto;
    overflow-y: auto;
  }

  /* SIDEBAR thành card trên */
  .sidebar-area {
    display: block;
  }

  .sidebar-sticky {
    padding: 18px;
    border-radius: 22px;
    margin-bottom: 16px;
  }

  .profile-section {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .avatar-frame {
    width: 56px;
    height: 70px;
    margin: 0;
  }

  .profile-meta h3 {
    font-size: 0.95rem;
    text-align: left;
  }

  .profile-meta p {
    font-size: 0.75rem;
    text-align: left;
  }

  .separator {
    margin: 14px 0;
  }

  /* Controls xếp dọc cho đẹp */
  .controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .control-item {
    margin-bottom: 0;
  }

  .control-item label {
    font-size: 9px;
  }

  .sys-status {
    margin-top: 14px;
  }

  /* CARD LỊCH */
  .schedule-card {
    padding: 20px;
    border-radius: 22px;
  }

  .lesson-entry:hover {
    transform: none;
  }
}


</style>