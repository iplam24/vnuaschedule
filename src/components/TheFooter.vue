<template>
  <footer class="global-footer glass-effect">
    <div class="footer-content">
      <p class="copyright">© 2025 VNUA Schedule . Bảo mật bởi <strong>Vũ Xuân Lâm</strong>.</p>
      <div class="footer-links desktop-only">
        <span>Hướng dẫn</span>
        <span class="dot-sep">•</span>
        <span>Bảo mật</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.global-footer {
  margin-top: auto;
  padding: 24px 0;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  z-index: 100;
}
.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.copyright { font-size: 0.8rem; color: #94a3b8; }
.copyright strong { color: #10b981; }
.footer-links { display: flex; gap: 16px; font-size: 0.8rem; color: #64748b; }
@media (max-width: 900px) { .desktop-only { display: none; } }
</style>