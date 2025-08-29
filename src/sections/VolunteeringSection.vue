<script setup lang="ts">
// Placeholder section to avoid SFC compile errors; expand with real content later
import SectionHeader from "../components/SectionHeader.vue";
</script>

<template>
  <section id="volunteering" class="vol-section" aria-labelledby="vol-title">
    <SectionHeader section-name="volunteering" />
    <div class="container">
      <h2 id="vol-title" class="visually-hidden">Volunteering</h2>
      <p class="placeholder">Volunteering content coming soon.</p>
    </div>
  </section>
</template>

<style scoped>
.vol-section {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  padding: 40px 0 24px;
}
.container {
  width: min(900px, 96vw);
  padding-inline: 12px;
}
.placeholder {
  font-size: 0.9rem;
  color: var(--muted);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
