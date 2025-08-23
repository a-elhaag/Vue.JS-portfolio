<!-- src/components/TechCard.vue -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** Iconify token, e.g. "devicon:vuejs" or "token-branded:zksync" */
  icon?: string
  /** Optional colored SVG from /src/assets (exact brand mark) */
  imgSrc?: string
  /** Visible label under the icon */
  label: string
  /** Optional brand hex for tinting the capsule & Iconify icon */
  color?: string
}>(), {
  color: undefined
})

/** Use provided color or fall back to your global glow */
const accent = computed(() => props.color || 'var(--glow)')

/** Mild 3D tilt on desktop (disabled on phones) */
const root = ref<HTMLElement | null>(null)
function onMove(e: MouseEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  const rx = (py - 0.5) * -6
  const ry = (px - 0.5) * 6
  root.value.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`
}
function onLeave() {
  if (!root.value) return
  root.value.style.transform = ''
}
</script>

<template>
  <div
    ref="root"
    class="card"
    :style="{ '--accent': String(accent) }"
    @mousemove="onMove"
    @mouseleave="onLeave"
    role="button"
    tabindex="0"
    :aria-label="label"
  >
    <div class="icon-wrap">
      <!-- Prefer exact colored SVG when provided -->
      <img v-if="imgSrc" :src="imgSrc" alt="" class="icon-img" />
      <!-- Otherwise Iconify in brand color -->
      <Icon v-else :icon="icon!" class="icon" :style="{ color: color || 'var(--glow)' }" />
    </div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<style scoped>
.card,
.card * {
  -webkit-tap-highlight-color: transparent;
}

.card {
  --ring: color-mix(in srgb, var(--accent) 70%, transparent);
  --soft: color-mix(in srgb, var(--accent) 12%, transparent);

  transform-style: preserve-3d;
  perspective: 800px;
  will-change: transform;

  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 16px;

  /* slightly tighter by default; section can override via media queries */
  padding: 16px;
  min-height: 8.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;

  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
  user-select: none;
}

/* Desktop hover: subtle lift + glow (disabled on phones below) */
.card:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  box-shadow:
    0 6px 22px rgba(0,0,0,0.10),
    0 0 18px 3px var(--ring);
}

.icon-wrap {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border-radius: 12px;

  /* brand-tinted capsule */
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));

  box-shadow:
    0 0 0 .25rem color-mix(in srgb, var(--accent) 0%, transparent),
    0 0 1.2rem .25rem color-mix(in srgb, var(--accent) 0%, transparent);

  transition: box-shadow .22s ease, transform .18s ease, background .18s ease, border-color .18s ease;
}

.card:hover .icon-wrap {
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  box-shadow:
    0 0 0 .25rem color-mix(in srgb, var(--accent) 10%, transparent),
    0 0 1.4rem .25rem color-mix(in srgb, var(--accent) 55%, transparent);
  transform: translateZ(8px);
}

/* Icon sizing */
.icon-img,
.icon {
  width: 1.8rem;
  height: 1.8rem;
  display: block;
}

/* Label styling */
.label {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.96rem;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1.15;
}

/* Focus ring for keyboard users */
.card:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 .18rem color-mix(in srgb, var(--accent) 40%, transparent),
    0 0 0 .36rem color-mix(in srgb, var(--accent) 18%, transparent);
}

/* Touch: remove hover/tilt; add press feedback */
@media (hover: none) and (pointer: coarse) {
  .card { transition: transform .12s ease, box-shadow .12s ease; }
  .card:hover,
  .card:hover .icon-wrap {
    transform: none !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    border-color: var(--border) !important;
    background: var(--surface) !important;
  }
  .card:active {
    transform: scale(0.985);
    box-shadow: 0 4px 14px rgba(0,0,0,0.10);
  }
}

/* Slightly smaller footprint on narrow phones; section can also downscale */
@media (max-width: 719.98px) {
  .card { padding: 14px; min-height: 7.4rem; border-radius: 14px; }
  .icon-wrap { width: 2.7rem; height: 2.7rem; border-radius: 10px; }
  .icon-img, .icon { width: 1.5rem; height: 1.5rem; }
  .label { font-size: 0.92rem; }
}
</style>