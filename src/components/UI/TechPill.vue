<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="pill">{{ label }}</span>
</template>

<style scoped>
.pill {
  display: inline-block; padding: 4px 10px; font-size: 12px;
  color: var(--muted); border: 1px solid var(--border);
  border-radius: 999px; background: var(--surface);
}
</style>