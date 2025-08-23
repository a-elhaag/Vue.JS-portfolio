<script setup lang="ts">
withDefaults(defineProps<{
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(), {
  hover: true,
  glow: true,
  padding: 'md'
})
</script>

<template>
  <div class="card"
       :class="['p-' + padding, { 'is-hover': hover, 'is-glow': glow }]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0,0,0,.08);
  transition: transform .16s cubic-bezier(.22,1,.36,1), box-shadow .16s;
}
.card.is-hover:hover {
  transform: translateY(-2px);
}
.card.is-glow:hover {
  box-shadow: 0 18px 42px rgba(0,0,0,.16),
              0 0 24px 3px color-mix(in oklab, var(--glow) 55%, transparent);
}

/* padding */
.p-none { padding: 0 }
.p-sm { padding: 10px }
.p-md { padding: 16px }
.p-lg { padding: 24px }
</style>