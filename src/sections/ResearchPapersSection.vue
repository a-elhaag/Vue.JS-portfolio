<script setup lang="ts">
import { computed } from "vue";
import SectionHeader from "../components/SectionHeader.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { papers } from "../data/papers";
import type { ProjectItem } from "../data/projects";

// Adapt papers to ProjectItem shape for reuse of ProjectCard component.
const items = computed<ProjectItem[]>(() => {
  return [...papers]
    .sort((a, b) => {
      const featA = a.featured ? 1 : 0;
      const featB = b.featured ? 1 : 0;
      if (featA !== featB) return featB - featA;
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return 0;
    })
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      intro: p.intro,
      stack: p.stack,
      // Put the PDF link as the demo (renamed button) and ignore repo entirely
      links: { repo: "", demo: p.links.pdf },
      accent: p.accent,
      featured: p.featured,
      order: p.order,
    }));
});
</script>

<template>
  <section id="research" class="papers-section" aria-labelledby="papers-title">
    <SectionHeader section-name="research" />
    <div class="container">
      <h2 id="papers-title" class="visually-hidden">Research Papers</h2>
      <div class="grid">
        <div v-for="p in items" :key="p.slug" class="slot">
          <ProjectCard :project="p" :show-repo="false" demo-label="Paper" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.papers-section {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  padding: 40px 0 24px;
}
.container {
  width: min(var(--section-max), 96vw);
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  }
}
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 980px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.slot {
  position: relative;
}
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
