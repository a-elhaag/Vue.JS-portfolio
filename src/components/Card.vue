<!-- src/components/Card.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

type Variant = "elevated" | "outline" | "solid" | "glass";
type Size = "sm" | "md" | "lg";
type Orientation = "vertical" | "horizontal";

const props = withDefaults(
  defineProps<{
    /** Visual variant */
    variant?: Variant;
    /** Density */
    size?: Size;
    /** Vertical (default) or horizontal media+content layout */
    orientation?: Orientation;
    /** Make the whole card clickable */
    href?: string;
    external?: boolean;
    /** Subtle interactivity (lift + glow) */
    interactive?: boolean;
    /** Optional accent color for borders/accents/chips */
    accent?: string;
    /** Optional media iconify token (or provide via slot) */
    mediaIcon?: string;
    /** Optional media image src (or provide via slot) */
    mediaImg?: string;
    /** Rounded corners toggle (kept simple for reuse) */
    rounded?: boolean;
    /** Disabled look (for upcoming items) */
    disabled?: boolean;
    /** ARIA label if the whole card is a link/button */
    ariaLabel?: string;
  }>(),
  {
    variant: "elevated",
    size: "md",
    orientation: "vertical",
    external: false,
    interactive: true,
    rounded: true,
    disabled: false,
  }
);

const isLink = computed(() => !!props.href);
const target = computed(() => (props.external ? "_blank" : undefined));
const rel = computed(() =>
  props.external ? "noopener noreferrer" : undefined
);

/** Classes composed from props */
const classes = computed(() => [
  "card",
  `v-${props.variant}`,
  `s-${props.size}`,
  `o-${props.orientation}`,
  {
    "is-interactive": props.interactive,
    "is-rounded": props.rounded,
    "is-disabled": props.disabled,
  },
]);

/** CSS vars exposed to style layer */
const styleVars = computed(() => ({
  "--accent": props.accent || "var(--glow)",
}));
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    :href="href"
    :target="target"
    :rel="rel"
    :class="classes"
    :style="styleVars"
    :aria-label="ariaLabel"
    :tabindex="isLink ? undefined : 0"
  >
    <!-- Optional ribbon/badge (e.g., "NEW", "Top 1%") -->
    <div class="ribbon"><slot name="ribbon" /></div>

    <!-- Media -->
    <div class="media" v-if="$slots.media || mediaIcon || mediaImg">
      <slot name="media">
        <img v-if="mediaImg" :src="mediaImg" alt="" class="media-img" />
        <Icon v-else-if="mediaIcon" :icon="mediaIcon" class="media-ico" />
      </slot>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Header: title + meta -->
      <header class="header">
        <div class="title-wrap">
          <!-- Monospace heading by design -->
          <h3 class="title"><slot name="title" /></h3>
          <div class="subtitle"><slot name="subtitle" /></div>
        </div>
        <div class="meta"><slot name="meta" /></div>
      </header>

      <!-- Body -->
      <div class="body">
        <slot />
      </div>

      <!-- Tags / Chips -->
      <div v-if="$slots.tags" class="tags">
        <slot name="tags" />
      </div>

      <!-- Footer (actions, dates, links) -->
      <footer class="footer">
        <slot name="footer" />
      </footer>
    </div>
  </component>
</template>

<style scoped>
/* Base shell */
.card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);

  border-radius: 1rem;
  padding: 1.2rem;
  text-decoration: none; /* if <a> */

  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease,
    opacity 0.18s ease;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  outline: none;
}
.is-rounded {
  border-radius: 1rem;
}
.is-disabled {
  opacity: 0.55;
  pointer-events: none;
}

/* Interactivity */
.is-interactive:hover {
  transform: translateY(-2px);
}
.is-interactive:hover,
.card:focus-visible {
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.1),
    0 0 18px 3px color-mix(in srgb, var(--accent) 45%, transparent);
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
}

/* Variants */
.v-elevated {
  background: var(--surface);
}
.v-outline {
  background: var(--bg);
  border: 1.5px solid var(--border);
}
.v-solid {
  background: color-mix(in srgb, var(--text) 4%, var(--surface));
}
.v-glass {
  background: color-mix(in srgb, var(--surface) 65%, transparent);
  backdrop-filter: saturate(140%) blur(12px);
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
}

/* Sizes */
.s-sm {
  padding: 0.9rem;
}
.s-lg {
  padding: 1.4rem;
}

/* Orientation */
.o-vertical .media {
  order: 0;
}
.o-vertical .content {
  order: 1;
}

.o-horizontal {
  grid-template-columns: auto 1fr;
  align-items: center;
}
.o-horizontal .media {
  order: 0;
}
.o-horizontal .content {
  order: 1;
}

/* Media defaults */
.media {
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--accent) 0%, transparent),
    0 0 1.2rem 0.25rem color-mix(in srgb, var(--accent) 0%, transparent);
  transition: background 0.18s, border-color 0.18s, box-shadow 0.22s;
}
.media-img,
.media-ico {
  width: 1.9rem;
  height: 1.9rem;
  display: block;
}
.media-ico {
  color: var(--accent);
}

.is-interactive:hover .media {
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--accent) 12%, transparent),
    0 0 1.4rem 0.25rem color-mix(in srgb, var(--accent) 55%, transparent);
}

/* Ribbon (optional top-left badge) */
.ribbon {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--accent) 72%, var(--text));
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

/* Content layout */
.content {
  display: grid;
  gap: 0.75rem;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 0.5rem 1rem;
}
.title-wrap {
  display: grid;
  gap: 0.2rem;
}

/* Monospace headings — per your requirement */
.title {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas,
    "Liberation Mono", monospace;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--text);
}
.subtitle {
  font-size: 0.92rem;
  color: var(--muted);
}
.meta {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--muted);
  font-size: 0.88rem;
  white-space: nowrap;
}

/* Body text */
.body {
  color: var(--text);
  font-size: 0.96rem;
  line-height: 1.45;
}

/* Tags / chips slot styling baseline */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tags :deep(.chip) {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  font-size: 0.84rem;
  color: var(--text);
}
.tags :deep(.chip .ico) {
  width: 1rem;
  height: 1rem;
}

/* Footer */
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.6rem;
}

/* Focus ring for keyboard users */
.card:focus-visible {
  box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--accent) 40%, transparent),
    0 0 0 0.36rem color-mix(in srgb, var(--accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}

/* Mobile polish: reduce gaps a touch */
@media (max-width: 719.98px) {
  .card {
    padding: 1rem;
  }
  .media {
    width: 3rem;
    height: 3rem;
    border-radius: 0.7rem;
  }
  .media-img,
  .media-ico {
    width: 1.7rem;
    height: 1.7rem;
  }
  .title {
    font-size: 1rem;
  }
  .subtitle {
    font-size: 0.9rem;
  }
}
</style>
