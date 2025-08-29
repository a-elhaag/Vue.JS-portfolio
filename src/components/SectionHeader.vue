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
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 0.9rem 1.4rem;
  font-size: 1.05rem;
  font-family: var(--font-heading);
  font-weight: 650;
  letter-spacing: 0.03em;
  color: color-mix(in oklab, var(--text) 88%, var(--glow) 12%);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
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
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
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
    padding: 0.75rem 1.15rem;
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
