<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Track which section is in view and control visibility
const currentSection = ref("");
const label = computed(() => currentSection.value.replace(/-/g, " "));
const show = ref(false);
let timeoutId: number | null = null;
let observer: IntersectionObserver;

onMounted(() => {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("section[id]")
  );
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection.value = entry.target.id;
          show.value = true;
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            show.value = false;
          }, 5000);
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((sec) => observer.observe(sec));
});

onBeforeUnmount(() => {
  observer.disconnect();
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="section-header">
      <div class="header-content">
        <span class="section-label">{{ label }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.section-header {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

.header-content {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  font-family: sans-serif;
  color: var(--text);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.section-label {
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header-content {
    padding: 0.7rem 1.1rem;
    font-size: 0.95rem;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .header-content {
    animation: none;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .header-content {
    background: rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
