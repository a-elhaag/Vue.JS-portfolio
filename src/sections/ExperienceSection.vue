<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import SectionHeader from "../components/SectionHeader.vue";
import Card from "../components/Card.vue";
import { experience, type ExperienceItem } from "../data/experience";

// Sort: order asc then current desc fallback original
const items = computed<ExperienceItem[]>(() => {
  return [...experience].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    const currA = a.current ? 1 : 0;
    const currB = b.current ? 1 : 0;
    return currB - currA;
  });
});

let observer: IntersectionObserver | null = null;
onMounted(() => {
  const entries = Array.from(
    document.querySelectorAll<HTMLElement>("#experience .entry")
  );
  observer = new IntersectionObserver(
    (obsEntries) => {
      obsEntries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-active");
        }
      });
    },
    { threshold: 0.35 }
  );
  entries.forEach((el) => observer!.observe(el));
});
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <section
    id="experience"
    class="exp-section"
    aria-labelledby="experience-title"
  >
    <SectionHeader section-name="experience" />
    <div class="container">
      <h2 id="experience-title" class="visually-hidden">Experience</h2>
      <ol class="timeline" aria-label="Experience timeline">
        <li
          v-for="(it, i) in items"
          :key="it.company + it.role + it.period"
          class="entry"
          :class="{ 'is-last': i === items.length - 1 }"
        >
          <div class="marker" aria-hidden="true">
            <span class="dot" />
          </div>
          <Card
            class="exp-card"
            variant="outline"
            :interactive="false"
            :accent="it.accent"
            :clamp="4"
            :aria-label="`${it.role} at ${it.company} ${it.period}`"
            :typeText="'Experience'"
            size="lg"
          >
            <template #title>
              <span class="role">{{ it.role }}</span>
              <span class="at">@</span>
              <span class="company">{{ it.company }}</span>
            </template>
            <template #subtitle>
              <span class="period">{{ it.period }}</span>
              <span v-if="it.location" class="loc"> · {{ it.location }}</span>
            </template>
            <div>
              {{ it.details }}
            </div>
          </Card>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.exp-section {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  padding: 40px 0 24px;
}
.container {
  width: min(900px, 96vw);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  }
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: relative;
}

.entry {
  position: relative;
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  align-items: start;
  gap: 0.6rem 0.75rem;
}
@media (max-width: 580px) {
  .entry {
    grid-template-columns: 1.9rem 1fr;
  }
}

.marker {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
/* Vertical timeline base + animated overlay */
.timeline::before,
.timeline::after {
  content: "";
  position: absolute;
  left: 1.1rem; /* align with center of marker column (roughly half of 2.2rem) */
  top: 0;
  bottom: 0;
  width: 2px;
  pointer-events: none;
}
.timeline::before {
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--text) 80%, transparent) 0%,
    color-mix(in srgb, var(--text) 65%, transparent) 100%
  );
  opacity: 0.4;
}
.timeline::after {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--glow) 0%, transparent) 0%,
    color-mix(in srgb, var(--glow) 70%, transparent) 40%,
    color-mix(in srgb, var(--glow) 0%, transparent) 80%
  );
  background-size: 100% 300%;
  animation: timelineFlow 7s linear infinite;
  mix-blend-mode: screen;
  opacity: 0.55;
  filter: blur(0.5px);
}
@keyframes timelineFlow {
  0% {
    background-position: 0 0%;
  }
  100% {
    background-position: 0 300%;
  }
}

.dot {
  --dot-size: 0.9rem;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: #111;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 2px #111;
  z-index: 2;
  margin-top: 0.4rem; /* align roughly with card header */
  position: relative;
  transition: background 0.4s, box-shadow 0.4s, transform 0.4s;
}
.entry.is-active .dot {
  background: var(--glow);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--glow) 40%, transparent),
    0 0 0 6px color-mix(in srgb, var(--glow) 12%, transparent),
    0 0 14px 2px color-mix(in srgb, var(--glow) 55%, transparent);
  transform: scale(1.08);
}

/* Card sizing override: full width & custom height */
.exp-card {
  --card-h: 12.5rem;
  width: 100%;
}
@media (max-width: 580px) {
  .exp-card {
    --card-h: 13.5rem;
  }
}

/* Title styling inside card */
.exp-card :deep(.title) {
  font-size: 1.05rem;
}
.role {
  font-weight: 600;
}
.at {
  opacity: 0.55;
  margin-inline: 0.4ch;
}
.company {
  font-weight: 600;
  color: var(--text);
}
.period {
  font-size: 0.82rem;
  color: var(--muted);
}
.loc {
  font-size: 0.78rem;
  color: var(--muted);
}

/* Remove hover raise for non-interactive timeline cards */
.exp-card :deep(.card.is-interactive:hover) {
  transform: none;
}

/* Body text clamp already handled; ensure good spacing */
.exp-card :deep(.body) {
  font-size: 0.9rem;
}

/* Hidden heading accessibility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
