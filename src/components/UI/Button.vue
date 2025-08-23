<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'solid' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  icon?: string         // primeicons class, e.g., "pi pi-github"
  block?: boolean       // full-width
  ariaLabel?: string
  disabled?: boolean
}>(), {
  variant: 'solid',
  size: 'md',
  external: false,
  block: false,
  disabled: false
})

const isLink = computed(() => !!props.href)
const rel = computed(() => props.external ? 'noreferrer noopener' : undefined)
const target = computed(() => props.external ? '_blank' : undefined)
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    class="btn"
    :class="[
      `v-${variant}`,
      `s-${size}`,
      { 'is-block': block, 'is-disabled': disabled }
    ]"
    :href="href"
    :target="target"
    :rel="rel"
    :aria-label="ariaLabel"
    :disabled="!isLink && disabled"
  >
    <i v-if="icon" :class="icon" aria-hidden="true" />
    <span class="label"><slot /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 12px; border: 1px solid var(--btn-border, var(--border));
  background: var(--btn-bg, var(--surface)); color: var(--btn-text, var(--text));
  white-space: nowrap; text-decoration: none; cursor: pointer;
  transition: transform .16s cubic-bezier(.22,1,.36,1), box-shadow .16s, background .16s;
}
.btn:hover:not(.is-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0,0,0,.18),
              0 0 18px 2px color-mix(in oklab, var(--glow) 55%, transparent);
}
.btn.is-block { width: 100%; }
.btn.is-disabled { opacity: .6; cursor: not-allowed; }

/* Variants */
.v-solid { background: var(--btn-bg, var(--text)); color: var(--btn-text, #fff); border-color: var(--btn-border, var(--text)); }
.v-solid:hover { box-shadow: 0 10px 24px rgba(0,0,0,.22),
                           0 0 22px 2px color-mix(in oklab, var(--glow) 60%, transparent); }

.v-ghost { background: transparent; color: var(--btn-ghost-text, var(--text)); border: 1.5px solid var(--btn-ghost-border, var(--text)); }
.v-ghost:hover { background: color-mix(in oklab, var(--btn-ghost-text, var(--text)) 6%, transparent); }

.v-link { background: transparent; border-color: transparent; color: var(--text); padding: 0; }
.v-link:hover { text-decoration: underline; box-shadow: none; transform: none; }

/* Sizes */
.s-sm { padding: 6px 10px; font-size: 12px; }
.s-md { padding: 10px 14px; font-size: 14px; }
.s-lg { padding: 12px 16px; font-size: 16px; }

.btn i { font-size: 16px; line-height: 0; color: var(--btn-icon-color, currentColor); }
.btn .label { line-height: 1; }
</style>