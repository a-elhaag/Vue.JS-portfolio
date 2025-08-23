<!-- src/sections/TechStackSection.vue -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import TechCard from "../components/TechCard.vue";
import Button from "../components/Button.vue";
import { techStack, type TechItem } from "../data/techStack";
import { ChevronDown, ChevronUp } from "lucide-vue-next";

/* Desktop-only drag (hover+fine pointer) */
const isDesktop = ref(false);
onMounted(() => {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  const apply = () => (isDesktop.value = mq.matches);
  apply();
  mq.addEventListener?.("change", apply);
});

/* Data */
const items = ref<TechItem[]>(techStack.slice());


/* Collapse long lists — MOBILE ONLY */
const COLLAPSE_AT_MOBILE = 6;
const showAll = ref(false);
const canCollapseMobile = computed(
  () => !isDesktop.value && items.value.length > COLLAPSE_AT_MOBILE
);
const visible = computed(() => {
  if (isDesktop.value) return items.value;
  return showAll.value ? items.value : items.value.slice(0, COLLAPSE_AT_MOBILE);
});

/* Drag (desktop) — smoothed lerp (no vibration) */
const cardEls = ref<HTMLElement[]>([]);
function setCardRef(el: Element | null, i: number) {
  if (el) cardEls.value[i] = el as HTMLElement;
}

const drag = reactive({
  active: false,
  index: -1,
  overIndex: -1,
  ghost: null as HTMLElement | null,
  x: 0,
  y: 0, // drawn position
  tx: 0,
  ty: 0, // target position
  ox: 0,
  oy: 0, // offset inside card
  raf: 0,
});

function onMouseDown(e: MouseEvent, index: number) {
  if (!isDesktop.value) return;
  const el = cardEls.value[index];
  if (!el) return;

  const r = el.getBoundingClientRect();
  drag.active = true;
  drag.index = index;
  drag.ox = e.clientX - r.left;
  drag.oy = e.clientY - r.top;
  drag.x = r.left;
  drag.y = r.top;
  drag.tx = e.clientX - drag.ox;
  drag.ty = e.clientY - drag.oy;

  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.classList.add("drag-ghost");
  ghost.style.width = r.width + "px";
  ghost.style.height = r.height + "px";
  document.body.appendChild(ghost);
  drag.ghost = ghost;

  drag.raf = requestAnimationFrame(step);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  e.preventDefault();
}

function onMouseMove(e: MouseEvent) {
  if (!drag.active) return;
  drag.tx = e.clientX - drag.ox;
  drag.ty = e.clientY - drag.oy;

  // nearest visible slot
  let nearest = -1,
    best = Infinity;
  const n = visible.value.length;
  for (let i = 0; i < n; i++) {
    const el = cardEls.value[i];
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (d < best) {
      best = d;
      nearest = i;
    }
  }
  drag.overIndex = nearest;
}

/* Smooth follow (lerp) */
function step() {
  if (!drag.active || !drag.ghost) return;
  const a = 0.25;
  drag.x += (drag.tx - drag.x) * a;
  drag.y += (drag.ty - drag.y) * a;
  drag.ghost.style.transform = `translate3d(${drag.x}px, ${drag.y}px, 0) scale(1.03)`;
  drag.raf = requestAnimationFrame(step);
}

async function onMouseUp() {
  if (!drag.active) return;
  cancelAnimationFrame(drag.raf);

  const from = drag.index;
  let to = drag.overIndex >= 0 ? drag.overIndex : from;

  if (to !== from) {
    const next = items.value.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    items.value = next;
  }

  await nextTick();
  const target = cardEls.value[to];
  if (drag.ghost && target) {
    const r = target.getBoundingClientRect();
    const dx = r.left - drag.x,
      dy = r.top - drag.y;
    drag.ghost.style.transition =
      "transform .28s cubic-bezier(.22,1,.36,1), opacity .28s";
    drag.ghost.style.transform = `translate3d(${drag.x + dx}px, ${
      drag.y + dy
    }px, 0) scale(1)`;
    drag.ghost.style.opacity = "0";
    setTimeout(() => drag.ghost?.remove(), 290);
  }

  drag.active = false;
  drag.index = -1;
  drag.overIndex = -1;
  drag.ghost = null;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}
/* Mobile-only toggle label */
const moreLabel = computed(() => (showAll.value ? "Show less" : "Show more"));
</script>

<template>
  <section id="tech" class="tech-section">
    <div class="container">
      <header class="header">
        <div class="titles">
          <h2 class="title">Tech Stack</h2>
          <p class="subtitle">Tools I actually ship with.</p>
        </div>
      </header>

      <div class="grid" :data-desktop="isDesktop" :data-dragging="drag.active">
        <div
          v-for="(t, i) in visible"
          :key="t.id"
          class="slot"
          :class="{ 'slot-highlight': i === drag.overIndex && drag.active }"
          :style="{ '--accent': t.color || 'var(--glow)' }"
        >
          <div
            class="card-shell"
            :class="{ 'can-drag': isDesktop }"
            :ref="(el) => setCardRef(el as Element, i)"
            @mousedown="onMouseDown($event, i)"
          >
            <!-- drag indicator (desktop) -->
            <div v-if="isDesktop" class="handle" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span
              ><span class="dot"></span>
            </div>

            <TechCard :icon="t.icon" :label="t.label" :color="t.color" />
          </div>
        </div>
      </div>

      <!-- Mobile-only "Show more/less" -->
      <div v-if="canCollapseMobile" class="more-wrap">
        <Button
          variant="animated"
          size="md"
          aria-label="Toggle more"
          @click="showAll = !showAll"
        >
          <template #icon>
            <component :is="showAll ? ChevronUp : ChevronDown" />
          </template>
          {{ moreLabel }}
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Section / container */
.tech-section {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  padding: 40px 0 24px;
}
.container {
  width: min(1000px, 96vw);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  /* add horizontal padding/margins for small screens */
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  } /* desktop uses intrinsic 96vw margin */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.titles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.title {
  font-size: clamp(1.6rem, 3.2vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text);
}
.subtitle {
  font-size: 1rem;
  color: var(--muted);
}
.controls {
  display: flex;
  gap: 10px;
}

/* Grid:
   - Phones: 2 columns, tighter gap and inner padding for breathing room
   - Desktop: responsive auto-fill
*/
.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 720px) {
  .grid {
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  }
}

/* Slot + highlight */
.slot {
  position: relative;
  transition: outline 0.16s ease, background 0.16s ease;
}
.slot-highlight {
  outline: 2px dashed color-mix(in srgb, var(--accent) 55%, var(--border));
  outline-offset: 4px;
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  border-radius: 18px;
}

/* Card shell (drag target) */
.card-shell {
  position: relative;
  touch-action: manipulation;
}
.card-shell.can-drag {
  cursor: grab;
}
.grid[data-dragging="true"] .card-shell.can-drag {
  cursor: grabbing;
}

/* While dragging, freeze hover transitions for smoothness */
.grid[data-dragging="true"] :deep(.card) {
  transition: none !important;
  transform: none !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
}

/* Drag indicator (desktop) */
.handle {
  position: absolute;
  top: 8px;
  right: 10px;
  display: inline-flex;
  gap: 3px;
  opacity: 0.55;
}
.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
}

/* Mobile-only "Show more" row */
.more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

/* Ghost element */
.drag-ghost {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  pointer-events: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22),
    0 0 22px 6px rgba(47, 107, 237, 0.1);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

/* ——— Phone-specific downsizing of card internals ——— */
@media (max-width: 719.98px) {
  /* slightly smaller cards on phones */
  .grid {
    gap: 12px;
  }
  .slot :deep(.card) {
    padding: 12px; /* was 16px */
    min-height: 7.2rem; /* was 8.4rem */
    border-radius: 14px; /* subtle shrink */
  }
  .slot :deep(.icon-wrap) {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 10px;
  }
  .slot :deep(.icon) {
    width: 1.4rem;
    height: 1.4rem;
  }
  .slot :deep(.label) {
    font-size: 0.92rem;
  }
}
@media (max-width: 719.98px) {
  /* remove hover glow/tilt on phones */
  .card:hover,
  .card:hover .icon-wrap {
    transform: none !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
    border-color: var(--border) !important;
    background: var(--surface) !important;
  }
}
</style>
