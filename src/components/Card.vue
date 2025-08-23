<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import Button from "./Button.vue";

type Kind = "cert" | "badge" | "achievement";
type Variant = "elevated" | "outline" | "solid" | "glass";
type Size = "sm" | "md" | "lg";
type Orientation = "vertical" | "horizontal";

const props = withDefaults(
  defineProps<{
    kind?: Kind;
    href?: string;
    variant?: Variant;
    size?: Size;
    orientation?: Orientation;
    interactive?: boolean;
    accent?: string;
    rounded?: boolean;
    disabled?: boolean;
    mediaIcon?: string;
    mediaImg?: string;
    ariaLabel?: string;
    typeText?: string;
    clamp?: number;
    autoView?: boolean;
    viewLabel?: string;
  }>(),
  {
    variant: "elevated",
    size: "md",
    orientation: "vertical",
    interactive: true,
    rounded: true,
    disabled: false,
    clamp: 4,
    autoView: true,
    viewLabel: "View",
  }
);

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

const styleVars = computed(() => ({
  "--accent": props.accent || "var(--glow)",
  "--body-clamp": String(props.clamp),
}));

const resolvedTypeText = computed(() => {
  if (props.typeText) return props.typeText;
  if (props.kind === "cert") return "Certification";
  if (props.kind === "badge") return "Badge";
  if (props.kind === "achievement") return "Achievement";
  return undefined;
});

const shouldRenderAutoView = computed(
  () =>
    props.autoView &&
    (props.kind === "cert" || props.kind === "badge") &&
    !!props.href
);
</script>

<template>
  <div :class="classes" :style="styleVars" :aria-label="ariaLabel" tabindex="0">
    <div v-if="$slots.ribbon" class="ribbon"><slot name="ribbon" /></div>

    <div class="media" v-if="$slots.media || mediaIcon || mediaImg">
      <slot name="media">
        <img v-if="mediaImg" :src="mediaImg" alt="" class="media-img" />
        <Icon v-else-if="mediaIcon" :icon="mediaIcon" class="media-ico" />
      </slot>
    </div>

    <div class="content">
      <header class="header">
        <div class="title-wrap">
          <h3 class="title"><slot name="title" /></h3>
          <div class="subtitle"><slot name="subtitle" /></div>
        </div>
        <div class="meta">
          <span v-if="resolvedTypeText" class="type-pill">{{
            resolvedTypeText
          }}</span>
          <slot name="meta" />
        </div>
      </header>

      <div class="body"><slot /></div>

      <footer class="footer">
        <slot name="footer">
          <Button
            v-if="shouldRenderAutoView"
            variant="animated"
            size="md"
            :href="href"
            external
            aria-label="View verification"
          >
            <template #icon>
              <span class="link-icn">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17L17 7M7 7h10v10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
            </template>
            {{ viewLabel }}
          </Button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Fixed sizes (constant height) */
.s-sm {
  --card-h: 14.5rem;
}
.s-md {
  --card-h: 16.5rem;
}
.s-lg {
  --card-h: 19rem;
}

/* Shell */
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
  height: var(--card-h);
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.18s,
    border-color 0.18s, background 0.18s, opacity 0.18s;
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

/* Orientation */
.o-horizontal {
  grid-template-columns: auto 1fr;
  align-items: center;
}

/* Media */
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

/* Ribbon only when provided */
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

/* Content: header | body (fill) | footer pinned */
.content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  min-height: calc(var(--card-h) - 2.4rem);
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

/* Monospace heading */
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

/* Meta */
.type-pill {
  border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--text);
}

/* Body clamp = consistent heights */
.body {
  color: var(--text);
  font-size: 0.96rem;
  line-height: 1.45;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

/* Footer */
.footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transform: translateY(-65px);
}

/* Inline SVG safety */
.link-icn :deep(svg) {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

/* Mobile */
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
