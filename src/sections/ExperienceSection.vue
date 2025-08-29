<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import SectionHeader from "../components/SectionHeader.vue";
import Card from "../components/Card.vue";
import { experience, type ExperienceItem } from "../data/experience";

// Sort: order asc then current desc fallback original
const items = computed<ExperienceItem[]>(() => {
  return [...experience].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    const currA = a.current ? 1 : 0;
    const currB = b.current ? 1 : 0;
    return currB - currA;
  });
});

let observer: IntersectionObserver | null = null;
onMounted(() => {
  const entries = Array.from(
    document.querySelectorAll<HTMLElement>("#experience .entry")
  );
  observer = new IntersectionObserver(
    (obsEntries) => {
      obsEntries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-active");
        }
      });
    },
    { threshold: 0.35 }
  );
  entries.forEach((el) => observer!.observe(el));
});
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

function formatEmployment(type?: ExperienceItem["employmentType"]) {
  if (!type) return "";
  const map: Record<string, string> = {
    "full-time": "Full time",
    "part-time": "Part time",
    internship: "Internship",
    contract: "Contract",
    freelance: "Freelance",
    "self-employed": "Self employed",
    volunteer: "Volunteer",
  };
  return map[type] || type;
}
</script>

<template>
  <section
    id="experience"
    class="exp-section"
    aria-labelledby="experience-title"
  >
    <SectionHeader section-name="experience" />
    <div class="container">
      <h2 id="experience-title" class="visually-hidden">Experience</h2>
      <ol class="timeline" aria-label="Experience timeline">
        <li
          v-for="(it, i) in items"
          :key="it.company + it.role + it.period"
          class="entry"
          :class="{ 'is-last': i === items.length - 1 }"
          :style="{ '--entry-accent': it.accent || 'var(--glow)' }"
        >
          <div class="marker" aria-hidden="true">
            <span class="dot" />
          </div>
          <Card
            class="exp-card"
            variant="outline"
            :interactive="true"
            :accent="it.accent"
            :clamp="4"
            :aria-label="`${it.role} at ${it.company} ${it.period}`"
            size="lg"
            :media-icon="it.companyIcon"
          >
            <template #title>
              <span class="role">{{ it.role }}</span>
              <span class="at">@</span>
              <span class="company">{{ it.company }}</span>
            </template>
            <template #subtitle>
              <span class="period">{{ it.period }}</span>
              <span
                v-if="it.employmentType"
                class="etype"
                :data-type="it.employmentType"
              >
                {{ formatEmployment(it.employmentType) }}
              </span>
              <span v-if="it.location" class="loc"> · {{ it.location }}</span>
            </template>
            <div>
              {{ it.details }}
            </div>
          </Card>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.exp-section {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg);
  padding: 40px 0 24px;
}
.container {
  width: min(var(--section-max), 96vw);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-inline: 12px;
}
@media (min-width: 720px) {
  .container {
    padding-inline: 0;
  }
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: relative;
}

.entry {
  position: relative;
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  align-items: start;
  gap: 0.6rem 0.75rem;
}
@media (max-width: 580px) {
  .entry {
    grid-template-columns: 1.9rem 1fr;
  }
}

.marker {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
/* Uniform per-entry vertical segment */
.marker::after {
  content: "";
  position: absolute;
  top: calc(var(--dot-size) + 0.2rem);
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% - var(--dot-size) - 0.2rem);
  background: color-mix(
    in srgb,
    var(--entry-accent, var(--glow)) 55%,
    transparent
  );
  opacity: 0.55;
  transition: background 0.45s, opacity 0.45s, box-shadow 0.45s;
}
.entry.is-last .marker::after {
  display: none;
}

.dot {
  --dot-size: 0.9rem;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--entry-accent, var(--glow)) 85%,
    transparent
  );
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--entry-accent, var(--glow)) 80%, transparent);
  z-index: 2;
  margin-top: 0.4rem; /* align roughly with card header */
  position: relative;
  transition: background 0.35s, box-shadow 0.35s, transform 0.35s;
}
.entry.is-active .dot {
  background: var(--entry-accent, var(--glow));
  box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 55%, transparent),
    0 0 0 6px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 22%, transparent),
    0 0 14px 3px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 55%, transparent);
  transform: scale(1.08);
}
.entry.is-active .marker::after {
  background: color-mix(
    in srgb,
    var(--entry-accent, var(--glow)) 65%,
    transparent
  );
  opacity: 0.85;
  box-shadow: 0 0 8px 1px
    color-mix(in srgb, var(--entry-accent, var(--glow)) 55%, transparent);
}

/* Card sizing override: full width & custom height */
.exp-card {
  --card-h: 12.5rem;
  width: 100%;
}
@media (max-width: 580px) {
  .exp-card {
    --card-h: 13.5rem;
  }
}

/* Title styling inside card */
.exp-card :deep(.title) {
  font-size: 1.05rem;
  position: relative;
}
.role {
  font-weight: 600;
}
.at {
  opacity: 0.55;
  margin-inline: 0.4ch;
}
.company {
  font-weight: 600;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.period {
  font-size: 0.82rem;
  color: var(--muted);
}
.etype {
  display: inline-flex;
  align-items: center;
  gap: 0.25ch;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.18rem 0.45rem 0.16rem;
  margin-left: 0.5rem;
  border: 1px solid
    color-mix(in srgb, var(--accent, var(--glow)) 45%, var(--border));
  background: color-mix(in srgb, var(--accent, var(--glow)) 14%, transparent);
  border-radius: 999px;
  color: var(--text);
  position: relative;
}
.etype[data-type="internship"] {
  background: color-mix(in srgb, var(--glow) 16%, transparent);
}
.etype[data-type="volunteer"] {
  background: color-mix(in srgb, var(--glow) 10%, transparent);
}
.etype[data-type="self-employed"] {
  background: color-mix(in srgb, var(--glow) 20%, transparent);
}
.etype[data-type="freelance"] {
  background: color-mix(in srgb, var(--glow) 12%, transparent);
}
.etype[data-type="contract"] {
  background: color-mix(in srgb, var(--glow) 18%, transparent);
}
.etype[data-type="full-time"],
.etype[data-type="part-time"] {
  background: color-mix(in srgb, var(--glow) 14%, transparent);
}
.loc {
  font-size: 0.78rem;
  color: var(--muted);
}

/* Remove hover raise for non-interactive timeline cards */
.exp-card :deep(.card.is-interactive:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.12),
    0 0 0 3px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 28%, transparent);
}
/* subtle glow on marker & dot when hovering corresponding card */
.entry:hover .dot:not(.active) {
  background: var(--entry-accent, var(--glow));
  box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 55%, transparent),
    0 0 10px 2px
      color-mix(in srgb, var(--entry-accent, var(--glow)) 55%, transparent);
}
.entry:hover .marker::after:not(.is-last) {
  background: color-mix(
    in srgb,
    var(--entry-accent, var(--glow)) 65%,
    transparent
  );
  opacity: 0.9;
}

/* Body text clamp already handled; ensure good spacing */
.exp-card :deep(.body) {
  font-size: 0.9rem;
}

/* Hidden heading accessibility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
