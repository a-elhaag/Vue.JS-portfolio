<script setup lang="ts">
import { ref, onMounted } from "vue";
import rawMd from "../data/about.md?raw";
import { renderMiniMdToHtml, htmlToBlocks } from "../lib/md";
import SectionHeader from "../components/SectionHeader.vue";

type Block = { html: string; type: "para" | "other" };
type Line = { text: string; type: "line" | "other" };

const blocks = ref<Block[]>([]);
const lines = ref<Line[]>([]);
// Static version (animation removed)

// Build lines: keep each paragraph as a single animated item (no sentence splitting)
function splitIntoLines(blocks: Block[]): Line[] {
  const result: Line[] = [];
  for (const block of blocks) {
    if (block.type === "para") {
      result.push({ text: block.html, type: "line" });
    } else {
      result.push({ text: block.html, type: "other" });
    }
  }
  return result;
}

onMounted(() => {
  const html = renderMiniMdToHtml(rawMd);
  blocks.value = htmlToBlocks(html);
  lines.value = splitIntoLines(blocks.value);
});
</script>

<template>
  <section id="about" class="about-wheel-root">
    <SectionHeader section-name="about" />
    <div class="about-content">
      <template v-for="(line, i) in lines" :key="i">
        <article
          v-if="line.type === 'line'"
          class="about-paragraph"
          v-html="line.text"
        />
        <div v-else class="static-block" v-html="line.text" />
      </template>
    </div>
  </section>
</template>

<style scoped>
/* Root section styling */
.about-wheel-root {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  color: var(--text);
  padding: 56px 0;
  font-family: var(--font-heading);
  /* Make about text use full section width unless capped below */
  --reading-width: 100%;
}
/* Static wrapper */
.about-content {
  width: min(var(--section-max), 96vw);
  padding-inline: 1rem;
}

.about-paragraph {
  font-family: var(--font-heading);
  font-size: 1.06rem; /* larger */
  line-height: 1.64;
  letter-spacing: 0.25px;
  max-width: var(--reading-width);
  margin: 0 auto 1.1rem;
  color: color-mix(in oklab, var(--text) 92%, var(--glow) 8%);
  opacity: 0.97;
  font-weight: 600; /* heavier */
}

/* Static blocks (headings/lists) */
.static-block :is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-heading);
  color: var(--text);
  letter-spacing: -0.01em;
  margin: 0.6em 0 0.4em;
}

.static-block h1 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 900;
}

.static-block h2 {
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 800;
}

.static-block p,
.static-block li {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text);
  opacity: 0.95;
}

.static-block ul {
  padding-left: 1.1rem;
}

/* Inline code styling */
:deep(code) {
  font-family: var(--font-heading);
  background: color-mix(in oklab, var(--surface) 92%, var(--border));
  border: 1px solid var(--border);
  padding: 0.1em 0.35em;
  border-radius: 6px;
}

/* Link styling */
:deep(a) {
  color: var(--glow);
  text-decoration: none;
  border-bottom: 1px dashed color-mix(in oklab, var(--glow) 40%, transparent);
}

:deep(a:hover) {
  text-decoration: underline;
}

/* Highlighted text */
:deep(mark),
:deep(.glow-mark) {
  background: transparent;
  color: var(--glow);
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 600px) {
  .about-content {
    padding-inline: 1.25rem;
  }
  .about-paragraph {
    font-size: 1rem;
    line-height: 1.6;
  }
}

/* Respect reduced motion */
/* Bold text uses glow color */
:deep(strong) {
  color: var(--glow);
  font-weight: 650;
}
</style>
