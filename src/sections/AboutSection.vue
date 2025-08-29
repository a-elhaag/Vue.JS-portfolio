<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import rawMd from "../data/about.md?raw";
import { renderMiniMdToHtml, htmlToBlocks } from "../lib/md";
import SectionHeader from "../components/SectionHeader.vue";

type Block = { html: string; type: "para" | "other" };
type Line = { text: string; type: "line" | "other" };

const blocks = ref<Block[]>([]);
const lines = ref<Line[]>([]);
const items = ref<HTMLElement[]>([]);

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// Animation settings
const MAX_ROT = 55;
const CENTER_Z = 140;
const BAND = 0.4;
const MAX_BLUR = 1.2;

let rafId = 0;
let running = false;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function easeOutQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

// Function to split paragraphs into lines
function splitIntoLines(blocks: Block[]): Line[] {
  const result: Line[] = [];

  for (const block of blocks) {
    if (block.type === "para") {
      // Remove HTML tags and split by sentences/natural breaks
      const text = block.html.replace(/<[^>]*>/g, "");
      const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());

      for (const sentence of sentences) {
        if (sentence.trim()) {
          // Restore any HTML formatting that was in the original
          let formattedSentence = sentence;
          if (block.html.includes("<mark>") || block.html.includes("==")) {
            const markMatch = block.html.match(/==([^=]+)==/);
            if (markMatch && sentence.includes(markMatch[1])) {
              formattedSentence = sentence.replace(
                markMatch[1],
                `<mark>${markMatch[1]}</mark>`
              );
            }
          }
          result.push({ text: formattedSentence, type: "line" });
        }
      }
    } else {
      result.push({ text: block.html, type: "other" });
    }
  }

  return result;
}

function applyTransforms() {
  if (prefersReduced || !items.value.length) return;
  const centerY = window.innerHeight / 2;
  const norm = window.innerHeight * BAND;

  for (const el of items.value) {
    const rect = el.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;

    let d = (itemCenter - centerY) / norm;
    d = clamp(d, -1, 1);

    const rot = d * MAX_ROT;
    const abs = Math.abs(d);
    const falloff = easeOutQuad(1 - abs);

    const z = CENTER_Z * Math.pow(falloff, 0.9);
    const opacity = 0.8 + 0.2 * falloff;
    const blur = MAX_BLUR * (1 - falloff);

    el.style.transform = `translateZ(${z.toFixed(2)}px) rotateX(${rot.toFixed(
      2
    )}deg)`;
    el.style.opacity = String(opacity.toFixed(3));
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  }
}

function loop() {
  if (!running) return;
  applyTransforms();
  rafId = requestAnimationFrame(loop);
}
function start() {
  if (running) return;
  running = true;
  rafId = requestAnimationFrame(loop);
}
function stop() {
  running = false;
  cancelAnimationFrame(rafId);
}

onMounted(async () => {
  const html = renderMiniMdToHtml(rawMd);
  blocks.value = htmlToBlocks(html);
  lines.value = splitIntoLines(blocks.value);
  await nextTick();
  items.value = Array.from(
    document.querySelectorAll<HTMLElement>(".wheel-item")
  );
  if (!prefersReduced) start();
  window.addEventListener("scroll", start, { passive: true });
  window.addEventListener("resize", start, { passive: true });
});
onBeforeUnmount(() => {
  stop();
  window.removeEventListener("scroll", start);
  window.removeEventListener("resize", start);
});
</script>

<template>
  <section id="about" class="about-wheel-root">
    <SectionHeader section-name="about" />
    <div class="about-wheel-wrap">
      <template v-for="(line, i) in lines" :key="i">
        <div v-if="line.type === 'line'" class="wheel-container">
          <article class="wheel-item" v-html="line.text" />
        </div>
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
}

/* Wrapper with perspective for 3D animation */
.about-wheel-wrap {
  position: relative;
  width: min(1000px, 96vw); /* widened to match other sections */
  padding-inline: 1rem;
  perspective: 950px;
  perspective-origin: center 42%;
}

/* Line container for 3D transforms */
.wheel-container {
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  margin: 16px 0; /* Reduced margin for line spacing */
}

/* Animated line items - consistent color, no highlighting */
.wheel-item {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.1s linear, opacity 0.1s linear, filter 0.1s linear;
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 68ch;
  margin: 0 auto;
  color: var(--text); /* Consistent color - no changing */
  opacity: 0.95; /* Consistent opacity base */
  display: block; /* Ensure each line is a block element */
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
  font-weight: 800;
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
  .about-wheel-wrap {
    padding-inline: 1.25rem;
  }

  .wheel-item {
    font-size: 1.02rem;
    line-height: 1.62;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .about-wheel-wrap {
    perspective: none;
  }
  .wheel-item {
    transition: none !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
    color: var(--text) !important;
  }
}
</style>
