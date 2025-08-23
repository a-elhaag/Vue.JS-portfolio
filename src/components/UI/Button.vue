<script setup lang="ts">
import { computed } from "vue";

type Variant = "solid" | "ghost" | "link" | "social";
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
    <!-- Icon/content slot -->
    <span class="icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="label"><slot /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid var(--btn-border, var(--border));
  background: var(--btn-bg, var(--surface));
  color: var(--btn-text, var(--text));
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.16s,
    background 0.16s, color 0.16s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.btn.is-block {
  width: 100%;
}
.btn.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  line-height: 0;
  display: inline-flex;
}
.icon :deep(svg) {
  width: 1.6em;
  height: 1.6em;
  display: block;
  fill: currentColor;
}
.label {
  line-height: 1;
}

/* Sizes */
.s-sm {
  padding: 8px 12px;
  font-size: 13px;
}
.s-md {
  padding: 12px 20px;
  font-size: 14px;
}
.s-lg {
  padding: 14px 24px;
  font-size: 16px;
}

/* Variants */
/* SOLID: base black pill, hover = glow only, text/icon turns --glow */
.v-solid {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}
.v-solid:hover:not(.is-disabled) {
  color: var(--glow); /* glow-colored text/icon */
  box-shadow: 0 0 0 0 rgba(47, 107, 237, 0.18),
    0 0 24px 6px color-mix(in oklab, var(--glow) 70%, transparent),
    0 0 48px 12px color-mix(in oklab, var(--glow) 40%, transparent);
}

/* GHOST: outline black, hover inverts like before plus a little glow */
.v-ghost {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--text);
}
.v-ghost:hover:not(.is-disabled) {
  background: var(--text);
  color: var(--bg);
}

/* LINK: no chrome */
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

/* SOCIAL: circular icon button, white on black, hover = glow + icon color -> --glow */
.v-social {
  width: 44px;
  height: 44px;
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
    0 0 24px 6px color-mix(in oklab, var(--glow) 70%, transparent),
    0 0 48px 12px color-mix(in oklab, var(--glow) 40%, transparent);
}

/* SOCIAL size mini maps to sm dimensions */
.v-social.s-sm {
  width: 36px;
  height: 36px;
}

/* Hide icon if empty */
.icon:empty {
  display: none;
}
</style>
