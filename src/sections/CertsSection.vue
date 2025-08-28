<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "../components/Card.vue";
import Button from "../components/Button.vue";
import { certs, type CertItem } from "../data/cert";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import SectionHeader from "../components/SectionHeader.vue";

const MAX_VISIBLE = 8;
const UNIFIED_VARIANT: "elevated" | "outline" | "solid" | "glass" = "outline";
const CARD_SIZE: "sm" | "md" | "lg" = "md";

const items = computed<CertItem[]>(() =>
  certs.filter((c) => c.kind === "cert" || c.kind === "badge")
);

const showAll = ref(false);
const visible = computed(() =>
  showAll.value ? items.value : items.value.slice(0, MAX_VISIBLE)
);
const toggleLabel = computed(() => (showAll.value ? "Show less" : "Show more"));

function onToggle() {
  showAll.value = !showAll.value;
}
</script>

<template>
  <section id="credentials" class="creds-section" aria-labelledby="creds-title">
    <SectionHeader section-name="credentials" />
    <div class="container">
      <div id="creds-grid" class="grid" aria-live="polite">
        <div v-for="it in visible" :key="it.id" class="slot">
          <Card
            :kind="it.kind"
            :href="it.href"
            :variant="UNIFIED_VARIANT"
            :accent="it.accent"
            :interactive="true"
            :orientation="it.orientation || 'vertical'"
            :aria-label="`${it.title} – ${it.issuer}`"
            :size="CARD_SIZE"
            :clamp="3"
          >
            <template #media>
              <component
                :is="it.media?.component || 'div'"
                v-bind="it.media?.props || {}"
              />
            </template>

            <template #title>{{ it.title }}</template>
            <template #subtitle>
              {{ it.issuer }} <span v-if="it.date">· {{ it.date }}</span>
            </template>
          </Card>
        </div>
      </div>

      <div v-if="items.length > MAX_VISIBLE" class="more-wrap">
        <Button
          variant="animated"
          size="md"
          @click="onToggle"
          aria-label="Toggle more"
        >
          <template #icon>
            <span class="chev-icn">
              <component :is="showAll ? ChevronUp : ChevronDown" />
            </span>
          </template>
          {{ toggleLabel }}
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.creds-section {
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
  gap: 18px;
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  }
}

/* Grid */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 980px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.slot {
  position: relative;
}

/* Show more chevrons */
.chev-icn :deep(svg) {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
