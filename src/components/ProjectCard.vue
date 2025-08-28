<script setup lang="ts">
import Card from "./Card.vue";
import Button from "./Button.vue";
import { ExternalLink } from "lucide-vue-next";
import type { ProjectItem } from "../data/projects";
import { computed } from "vue";

const props = defineProps<{
  project: ProjectItem;
  variant?: "elevated" | "outline" | "solid" | "glass";
  size?: "sm" | "md" | "lg"; // will default to md
  clamp?: number; // intro clamp lines
}>();

const variant = computed(() => props.variant || "outline");
const size = computed(() => props.size || "md");
const clamp = computed(() => props.clamp ?? 4);
const showDemo = computed(() => !!props.project.links.demo);
const ariaLabel = computed(
  () => `${props.project.title} project${showDemo.value ? " with demo" : ""}`
);
const stackDisplay = computed(() => {
  const max = 4;
  const list = props.project.stack.slice(0, max);
  const extra = props.project.stack.length - list.length;
  return extra > 0 ? [...list, `+${extra}`] : list;
});
</script>

<template>
  <Card
    :variant="variant"
    :size="size"
    :accent="project.accent"
    :interactive="true"
    :clamp="clamp"
    :aria-label="ariaLabel"
  >
    <!-- Title monospace already handled by Card -->
    <template #title>{{ project.title }}</template>
    <template #subtitle>
      <span class="stack" v-if="stackDisplay.length">
        {{ stackDisplay.join(" · ") }}
      </span>
    </template>

    <div class="intro">{{ project.intro }}</div>

    <template #footer>
      <div class="actions">
        <Button
          variant="solid"
          size="md"
          :href="project.links.repo"
          external
          aria-label="Open repository"
        >
          Repo
        </Button>
        <Button
          v-if="showDemo"
          variant="animated"
          size="md"
          :href="project.links.demo"
          external
          aria-label="Open live demo"
        >
          <template #icon>
            <ExternalLink />
          </template>
          Demo
        </Button>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.intro {
  /* Card body area inherits clamp via parent; ensure consistent text style */
  font-size: 0.96rem;
  line-height: 1.45;
  color: var(--text);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.actions :deep(.btn) {
  /* ensure consistent min-width feel */
  flex: 0 0 auto;
}
.stack {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.01em;
}

/* Override default Card footer raise so buttons sit cleanly at bottom and are visually separated */
:deep(.footer) {
  transform: translateY(0) !important;
  margin-top: 0.25rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--border);
}

/* Project specific sizing tweaks */
:deep(.card) {
  --card-h: 18rem; /* Increase height slightly */
}

/* Larger heading just for project cards */
:deep(.title) {
  font-size: 1.14rem;
}
</style>
