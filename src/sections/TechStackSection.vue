<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from "vue";
import TechCard from "../components/TechCard.vue";
import Button from "../components/Button.vue";
import { techStack, type TechItem } from "../data/techStack";
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-vue-next";

/** Desktop detection: enable drag only on hover-capable, fine-pointer devices */
const isDesktop = ref(false);
function updateDesktopFlag() {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  isDesktop.value = mq.matches;
}
onMounted(() => {
  updateDesktopFlag();
  window.addEventListener("resize", updateDesktopFlag, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("resize", updateDesktopFlag));

/** Data */
const items = ref<TechItem[]>(techStack.slice());
const originalIds = techStack.map((t) => t.id);
const orderChanged = computed(() => {
  const ids = items.value.map((i) => i.id);
  if (ids.length !== originalIds.length) return true;
  for (let i = 0; i < ids.length; i++)
    if (ids[i] !== originalIds[i]) return true;
  return false;
});

/** Collapsed views:
 *  - Mobile: first 2 items
 *  - Desktop: first 3 rows (columns auto-detected from computed grid template)
 */
const showAll = ref(false);
const COLLAPSE_AT_MOBILE = 2;

const gridEl = ref<HTMLElement | null>(null);
const desktopCols = ref(0); // computed from grid-template-columns

function measureCols() {
  const el = gridEl.value;
  if (!el) return;
  const style = getComputedStyle(el);
  const tpl = style.gridTemplateColumns || "";
  // Count tracks in the resolved grid template (e.g., "286px 286px 286px")
  let count = tpl.split(" ").filter(Boolean).length;
  // Fallback heuristic if the browser returns "none"
  if (!count) {
    const approxColWidth = 176; // ≈ 11rem card + gap
    count = Math.max(1, Math.floor(el.clientWidth / approxColWidth));
  }
  desktopCols.value = count;
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  measureCols();
  ro = new ResizeObserver(() => measureCols());
  if (gridEl.value) ro.observe(gridEl.value);
  window.addEventListener("resize", measureCols, { passive: true });
});
onBeforeUnmount(() => {
  if (ro && gridEl.value) ro.unobserve(gridEl.value);
  window.removeEventListener("resize", measureCols);
});

const collapsedDesktopCount = computed(() =>
  Math.max(0, desktopCols.value * 3)
);
const canCollapse = computed(() => {
  if (isDesktop.value) return items.value.length > collapsedDesktopCount.value;
  return items.value.length > COLLAPSE_AT_MOBILE;
});

const visible = computed(() => {
  if (showAll.value) return items.value;
  if (isDesktop.value)
    return items.value.slice(
      0,
      collapsedDesktopCount.value || items.value.length
    );
  return items.value.slice(0, COLLAPSE_AT_MOBILE);
});

/** Drag & Drop (desktop): smooth, no vibration (LERP to cursor), ghost snaps in */
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
  ty: 0, // target position (cursor - offset)
  ox: 0,
  oy: 0, // pickup offset inside card
  raf: 0 as number,
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

  // Nearest slot among currently visible cards
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

function step() {
  if (!drag.active || !drag.ghost) return;
  const a = 0.25; // smoothing factor; higher = snappier
  drag.x += (drag.tx - drag.x) * a;
  drag.y += (drag.ty - drag.y) * a;
  drag.ghost.style.transform = `translate3d(${drag.x}px, ${drag.y}px, 0) scale(1.03)`;
  drag.raf = requestAnimationFrame(step);
}

async function onMouseUp() {
  if (!drag.active) return;
  cancelAnimationFrame(drag.raf);

  const from = drag.index;
  const to = drag.overIndex >= 0 ? drag.overIndex : from;

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

/** Controls */
function snapBack() {
  items.value = techStack.slice();
}

const isAnimating = ref(false);

async function toggleShowAll() {
  if (isAnimating.value) return;

  isAnimating.value = true;
  const wasShowingAll = showAll.value;

  if (wasShowingAll) {
    // Hiding items: stagger fade out from end to beginning
    const hiddenItems = visible.value.slice(
      isDesktop.value ? collapsedDesktopCount.value : COLLAPSE_AT_MOBILE
    );

    // Animate items out with stagger
    for (let i = hiddenItems.length - 1; i >= 0; i--) {
      const index =
        (isDesktop.value ? collapsedDesktopCount.value : COLLAPSE_AT_MOBILE) +
        i;
      const el = cardEls.value[index];
      if (el) {
        el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.transform = "translateY(-10px) scale(0.95)";
        el.style.opacity = "0";
      }
      await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms stagger
    }

    showAll.value = false;
    await nextTick();

    // Reset transforms
    cardEls.value.forEach((el) => {
      if (el) {
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = "";
      }
    });
  } else {
    // Showing items: reveal with stagger fade in
    showAll.value = true;
    await nextTick();

    const newItems = visible.value.slice(
      isDesktop.value ? collapsedDesktopCount.value : COLLAPSE_AT_MOBILE
    );

    // Start new items hidden
    for (let i = 0; i < newItems.length; i++) {
      const index =
        (isDesktop.value ? collapsedDesktopCount.value : COLLAPSE_AT_MOBILE) +
        i;
      const el = cardEls.value[index];
      if (el) {
        el.style.transform = "translateY(20px) scale(0.9)";
        el.style.opacity = "0";
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Animate items in with stagger
    for (let i = 0; i < newItems.length; i++) {
      const index =
        (isDesktop.value ? collapsedDesktopCount.value : COLLAPSE_AT_MOBILE) +
        i;
      const el = cardEls.value[index];
      if (el) {
        el.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.transform = "translateY(0) scale(1)";
        el.style.opacity = "1";
      }
      await new Promise((resolve) => setTimeout(resolve, 80)); // 80ms stagger
    }

    // Clean up after animation
    setTimeout(() => {
      cardEls.value.forEach((el) => {
        if (el) {
          el.style.transition = "";
          el.style.transform = "";
          el.style.opacity = "";
        }
      });
    }, 400);
  }

  isAnimating.value = false;
}

const toggleLabel = computed(() => (showAll.value ? "Show less" : "Show more"));
</script>

<template>
  <section id="tech" class="tech-section">
    <div class="container">
      <header class="header">
        <div class="titles">
          <h2 class="title">Tech Stack</h2>
          <p class="subtitle">Just Drag & Drop.</p>
        </div>

        <!-- Desktop only: show Reset button when order changed -->
        <div class="controls" v-if="isDesktop && orderChanged">
          <Button
            variant="animated"
            size="md"
            @click="snapBack"
            aria-label="Reset order"
          >
            <template #icon>
              <!-- Wrap to avoid global fill rules turning strokes into blobs -->
              <span class="reset-icn"><RotateCcw /></span>
            </template>
            Reset
          </Button>
        </div>
      </header>

      <div
        ref="gridEl"
        class="grid"
        :data-desktop="isDesktop"
        :data-dragging="drag.active"
      >
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
            <!-- subtle drag indicator (desktop only) -->
            <div v-if="isDesktop" class="handle" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span
              ><span class="dot"></span>
            </div>

            <TechCard :icon="t.icon" :label="t.label" :color="t.color" />
          </div>
        </div>
      </div>

      <!-- Show more/less (both mobile and desktop, gated by canCollapse) -->
      <div v-if="canCollapse" class="more-wrap">
        <Button
          variant="animated"
          size="md"
          :disabled="isAnimating"
          aria-label="Toggle more"
          @click="toggleShowAll"
        >
          <template #icon>
            <component
              :is="showAll ? ChevronUp : ChevronDown"
              :class="{ 'animate-spin': isAnimating }"
            />
          </template>
          {{ isAnimating ? "Loading..." : toggleLabel }}
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
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  }
}

.controls {
  display: flex;
  gap: 10px;
}

/* Grid:
   - Phones: 2 columns
   - Desktop: responsive autofill
*/
.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, 1fr);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (min-width: 720px) {
  .grid {
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  }
}

/* Slots + highlight */
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

/* Card shell is the drag target */
.card-shell {
  position: relative;
  touch-action: manipulation;
  will-change: transform, opacity;
}
.card-shell.can-drag {
  cursor: grab;
}
.grid[data-dragging="true"] .card-shell.can-drag {
  cursor: grabbing;
}

/* Freeze hover during drag to avoid jank */
.grid[data-dragging="true"] :deep(.card) {
  transition: none !important;
  transform: none !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
}

/* Drag indicator (desktop only) */
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

/* Show more/less row */
.more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

/* Animation classes */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Ghost element (rendered in body) */
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

/* Only this reset icon: force strokes (prevents "blob" when global fill rules exist) */
.reset-icn :deep(svg) {
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2 !important;
  vector-effect: non-scaling-stroke;
}

/* Phone downsizing for cards (matches your earlier ask) */
@media (max-width: 719.98px) {
  .grid {
    gap: 12px;
  }
  .slot :deep(.card) {
    padding: 14px;
    min-height: 7.4rem;
    border-radius: 14px;
  }
  .slot :deep(.icon-wrap) {
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 10px;
  }
  .slot :deep(.icon) {
    width: 1.5rem;
    height: 1.5rem;
  }
  .slot :deep(.label) {
    font-size: 0.92rem;
  }
}
</style>
