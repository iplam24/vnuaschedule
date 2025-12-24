import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    semesters: [], 
    selectedSemester: localStorage.getItem('selected_semester') || null,
  }),
  actions: {
    // Hàm này chỉ gọi sau khi đã có token (đã đăng nhập)
    async fetchSemesters() {
      try {
        const res = await api.get('/api/v1/tkb/semesters');
        if (res.data.success) {
          this.semesters = res.data.data;
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi lấy danh sách học kỳ:", error);
        return false;
      }
    },

 setSemester(hocKy, tenHocKy) {
    this.selectedSemester = hocKy;
    this.selectedSemesterName = tenHocKy; // Thêm state này nếu cần dùng trong app
    
    localStorage.setItem('selected_semester', hocKy);
    localStorage.setItem('selected_semester_name', tenHocKy); // Lưu tên học kỳ
  },

    async login(username, password) {
      try {
        const response = await api.post('/api/v1/tkb/login', { username, password });
        if (response.data.success) {
          this.token = response.data.data.accessToken;
          this.user = response.data.data;
          localStorage.setItem('token', this.token);
          localStorage.setItem('mssv', username);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return false;
      }
    },
// Thêm vào phần actions trong auth.js
async fetchFullProfile() {
  try {
    const res = await api.get('/api/v1/tkb/student-info'); // API lấy thông tin đầy đủ
    this.studentFullProfile = res.data.data;
    localStorage.setItem('student_profile', JSON.stringify(res.data.data));
  } catch (error) {
    console.error("Lỗi lấy Profile:", error);
  }
},
    logout() {
      this.token = null;
      this.user = null;
      this.semesters = [];
      this.selectedSemester = null;
      localStorage.clear();
      window.location.reload();
    }
  }
});