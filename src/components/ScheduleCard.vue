<template>
  <div class="lesson-card-pro" @click="$emit('details', lesson)">
    <div class="time-tag">Tiết {{ lesson.tietBatDau }}</div>
    <div class="subject-content">
      <h3>{{ lesson.tenMon }}</h3>
      <p>📍 {{ lesson.phong }} • 👨‍🏫 {{ lesson.giangVien }}</p>
    </div>
    <div class="arrow">→</div>
  </div>
</template>

<script setup>
defineProps(['lesson']);
defineEmits(['details']);
</script>

<style scoped>
.lesson-card-pro {
  background: white; border-radius: 16px; padding: 18px; margin-bottom: 12px;
  display: flex; align-items: center; gap: 15px; cursor: pointer;
  border: 1px solid #f1f5f9; transition: all 0.2s ease;
}
.lesson-card-pro:hover {
  transform: translateX(5px); border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}
.time-tag {
  background: #ecfdf5; color: #059669; padding: 6px 10px;
  border-radius: 10px; font-weight: 800; font-size: 0.75rem;
}
.subject-content h3 { font-size: 1rem; margin: 0; color: #0f172a; }
.subject-content p { font-size: 0.8rem; color: #64748b; margin: 4px 0 0; }
.arrow { margin-left: auto; color: #cbd5e1; font-weight: bold; }
</style>