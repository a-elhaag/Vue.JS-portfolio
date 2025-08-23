<script setup lang="ts">
import { computed } from "vue";

type Variant = "solid" | "ghost" | "link" | "social" | "animated";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    href?: string;
    external?: boolean;
    block?: boolean;
    ariaLabel?: string;
    disabled?: boolean;
  }>(),
  {
    variant: "solid",
    size: "md",
    external: false,
    block: false,
    disabled: false,
  }
);

const isLink = computed(() => !!props.href);
const rel = computed(() =>
  props.external ? "noreferrer noopener" : undefined
);
const target = computed(() => (props.external ? "_blank" : undefined));
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    class="btn"
    :class="[
      `v-${variant}`,
      `s-${size}`,
      { 'is-block': block, 'is-disabled': disabled },
    ]"
    :href="href"
    :target="target"
    :rel="rel"
    :aria-label="ariaLabel"
    :disabled="!isLink && disabled"
  >
    <span v-if="$slots.icon" class="icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="label"><slot /></span>
  </component>
</template>

<style scoped>
/* Base — rems, larger, monospace */
.btn {
  position: relative; /* required for animated's absolute icon */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  border-radius: 999px;
  border: 1px solid var(--btn-border, var(--border));
  background: var(--btn-bg, var(--surface));
  color: var(--btn-text, var(--text));
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.16s,
    background 0.16s, color 0.16s, padding 0.16s;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.08);
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas,
    "Liberation Mono", monospace;
}
.btn.is-block {
  width: 100%;
}
.btn.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Icon handling — Lucide uses strokes */
.icon {
  line-height: 0;
  display: inline-flex;
}
.icon :deep(svg) {
  width: 1.6em;
  height: 1.6em;
  display: block;
  fill: currentColor;
  stroke: currentColor; /* key so strokes follow text color */
}
.icon:empty {
  display: none;
}

.label {
  line-height: 1;
}

/* Sizes — rem-based and a bit larger */
.s-sm {
  padding: 0.6rem 0.95rem;
  font-size: 0.95rem;
}
.s-md {
  padding: 0.9rem 1.35rem;
  font-size: 1.05rem;
}
.s-lg {
  padding: 1.05rem 1.65rem;
  font-size: 1.15rem;
}

/* === Variants === */

/* SOLID: black pill; hover -> glow + text/icon set to --glow (bg unchanged) */
.v-solid {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}
.v-solid:hover:not(.is-disabled) {
  color: var(--glow);
  box-shadow: 0 0 0 0 rgba(47, 107, 237, 0.18),
    0 0 1.5rem 0.375rem color-mix(in srgb, var(--glow) 70%, transparent),
    0 0 3rem 0.75rem color-mix(in srgb, var(--glow) 40%, transparent),
    /* fallbacks for older engines */ 0 0 1.5rem 0.375rem
      rgba(47, 107, 237, 0.5),
    0 0 3rem 0.75rem rgba(47, 107, 237, 0.25);
}

/* GHOST: outline; invert on hover (no glow change requested here) */
.v-ghost {
  background: transparent;
  color: var(--text);
  border: 0.125rem solid var(--text);
}
.v-ghost:hover:not(.is-disabled) {
  background: var(--text);
  color: var(--bg);
}

/* LINK: minimal */
.v-link {
  background: transparent;
  border-color: transparent;
  color: var(--text);
  padding: 0;
}
.v-link:hover:not(.is-disabled) {
  text-decoration: underline;
  box-shadow: none;
  transform: none;
}

/* SOCIAL: circular icon; glow + icon color to --glow on hover */
.v-social {
  width: 3rem; /* ~48px */
  height: 3rem;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--text);
  color: var(--bg);
  border: none;
}
.v-social .label {
  display: none;
} /* icon-only */
.v-social:hover:not(.is-disabled) {
  color: var(--glow);
  box-shadow: 0 0 0 0 rgba(47, 107, 237, 0.18),
    0 0 1.5rem 0.375rem color-mix(in srgb, var(--glow) 70%, transparent),
    0 0 3rem 0.75rem color-mix(in srgb, var(--glow) 40%, transparent),
    0 0 1.5rem 0.375rem rgba(47, 107, 237, 0.5),
    0 0 3rem 0.75rem rgba(47, 107, 237, 0.25);
}
.v-social.s-sm {
  width: 2.5rem;
  height: 2.5rem;
}

/* Animated (ghost-like, centered label, expand on hover only) */
.v-animated {
  background: transparent;
  color: var(--text);
  border: 0.125rem solid var(--text);
  padding-inline: 1.2rem; /* consistent base */
  position: relative;
  overflow: hidden;
}

/* icon hidden & outside layout at rest */
.v-animated .icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) translateX(0.4rem); /* slightly off to the right */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

/* ensure label is always centered when idle */
.v-animated .label {
  text-align: center;
  width: 100%;
}

/* Only expand on hover-capable devices (avoid mobile click jank) */
/* Animated hover & focus-visible states (desktop / keyboard) */
@media (hover: hover) and (pointer: fine) {
  .v-animated:hover:not(.is-disabled) {
    padding-right: 3.2rem; /* expand to make room for the icon further out */
  }
  .v-animated:hover .icon {
    opacity: 1;
    transform: translateY(-50%) translateX(0); /* slide icon in smoothly */
  }
}

.v-animated:focus-visible:not(.is-disabled) {
  padding-right: 3.2rem;
}
.v-animated:focus-visible .icon {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
</style>
