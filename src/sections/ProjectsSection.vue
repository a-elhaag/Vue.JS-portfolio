<script setup lang="ts">
import { computed } from "vue";
import SectionHeader from "../components/SectionHeader.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { projects, type ProjectItem } from "../data/projects";

// Sorting logic: featured first, then order asc, then original index
const items = computed<ProjectItem[]>(() => {
  return [...projects].sort((a, b) => {
    const featA = a.featured ? 1 : 0;
    const featB = b.featured ? 1 : 0;
    if (featA !== featB) return featB - featA; // featured desc
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return 0;
  });
});
</script>

<template>
  <section
    id="projects"
    class="projects-section"
    aria-labelledby="projects-title"
  >
    <SectionHeader section-name="projects" />
    <div class="container">
      <h2 id="projects-title" class="visually-hidden">Projects</h2>
      <div class="grid">
        <div v-for="p in items" :key="p.slug" class="slot">
          <ProjectCard :project="p" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
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

/* A11y hidden heading */
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
