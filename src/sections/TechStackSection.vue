<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { Icon } from "@iconify/vue";
import { groups, nodes, edges, type TechNode } from "../data/techStack";

/* =============================
   Stage & environment
   ============================= */
const W_DESKTOP = 1200;
const H_DESKTOP = 740;
const PADDING = 96;
const RING = 3000; // desktop group ring a touch wider

const isMobile = ref(false);
const canHover = ref(false);
const stageW = ref(W_DESKTOP);
const stageH = ref(H_DESKTOP);

function updateEnv() {
  isMobile.value = matchMedia("(max-width: 720px)").matches;
  canHover.value = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isMobile.value) {
    stageW.value = Math.max(360, Math.min(440, window.innerWidth));
    stageH.value = Math.max(640, window.innerHeight);
  } else {
    stageW.value = W_DESKTOP;
    stageH.value = H_DESKTOP;
  }
}
onMounted(() => {
  updateEnv();
  addEventListener("resize", updateEnv, { passive: true });
});
onBeforeUnmount(() => removeEventListener("resize", updateEnv));

/* =============================
   Responsive config
   ============================= */
const SHOW_LABELS_MOBILE = false;

const CFG = computed(() => {
  if (isMobile.value) {
    return {
      NODE_R: 22,
      ICON: 20,
      EDGE_REST: 240,
      REPULSE: 0.72,
      GRAV: 0.004,
      ITER: 360,
      COLS: 2, // mobile seed
      EDGE_WIDTH: 2,
    };
  }
  return {
    NODE_R: 30,
    ICON: 28,
    EDGE_REST: 440,
    REPULSE: 0.53,
    GRAV: 0.0012,
    ITER: 320,
    COLS: 4, // unused on desktop
    EDGE_WIDTH: 1.6,
  };
});

const nodeR = () => CFG.value.NODE_R;
const iconSz = () => CFG.value.ICON;
const MIN_DIST = () => nodeR() * 2.5 + 9;

/* =============================
   Rendering constants
   ============================= */
const EDGE_BASE_OPACITY = 0.42;
const EDGE_FOCUS_OPACITY = 0.78;
const EDGE_UNFOCUSED_OPACITY = 0.16;

/* =============================
   Utilities
   ============================= */
function seededShuffle<T>(arr: T[], seed = 7): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const degree: Record<string, number> = {};
nodes.forEach((n) => (degree[n.id] = 0));
edges.forEach((e) => {
  degree[e.from]++;
  degree[e.to]++;
});

/* =============================
   Initial layouts
   ============================= */
function circlePositions() {
  const cx = W_DESKTOP / 2,
    cy = H_DESKTOP / 2;
  const R = Math.min(W_DESKTOP, H_DESKTOP) / 2 - PADDING - 40;
  const step = (2 * Math.PI) / groups.length;

  const gPos: Record<string, { x: number; y: number }> = {};
  groups.forEach((g, i) => {
    const a = i * step - Math.PI / 2;
    gPos[g.id] = { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
  });

  const byGroup: Record<string, TechNode[]> = {};
  nodes.forEach((n) => (byGroup[n.group] ??= []).push(n));
  const nPos: Record<string, { x: number; y: number }> = {};
  for (const g of groups) {
    const list = seededShuffle(byGroup[g.id] ?? [], 11);
    const s = (2 * Math.PI) / Math.max(1, list.length);
    list.forEach((n, i) => {
      const a = i * s;
      nPos[n.id] = {
        x: gPos[g.id].x + Math.cos(a) * RING,
        y: gPos[g.id].y + Math.sin(a) * RING,
      };
    });
  }
  return { gPos, nPos };
}

function verticalPositions() {
  const cols = CFG.value.COLS; // 2 for mobile
  const laneX = 70;
  const colW = Math.max(128, Math.floor((stageW.value - 140) / cols));
  const nodeGap = 96;
  const groupGap = 140;

  const byGroup: Record<string, TechNode[]> = {};
  nodes.forEach((n) => (byGroup[n.group] ??= []).push(n));
  const gPos: Record<string, { x: number; y: number }> = {};
  const nPos: Record<string, { x: number; y: number }> = {};

  let y = 76;
  for (const g of groups) {
    const list = seededShuffle(byGroup[g.id] ?? [], 5);
    gPos[g.id] = { x: laneX, y };
    const x0 = laneX + 120;
    list.forEach((n, i) => {
      const col = i % cols,
        row = Math.floor(i / cols);
      nPos[n.id] = { x: x0 + col * colW, y: y + row * nodeGap };
    });
    y += Math.max(1, Math.ceil(list.length / cols)) * nodeGap + groupGap;
  }
  stageH.value = Math.max(y + 120, stageH.value);
  return { gPos, nPos };
}

/* =============================
   Physics (repulsion + springs + gravity)
   ============================= */
const EDGE_K = 0.06;

function relax(
  nPos: Record<string, { x: number; y: number }>,
  gPos: Record<string, { x: number; y: number }>,
  restLength: number,
  width: number,
  height: number
) {
  const ids = Object.keys(nPos);
  const cx = width / 2,
    cy = height / 2;

  for (let iter = 0; iter < CFG.value.ITER; iter++) {
    for (let i = 0; i < ids.length; i++) {
      const a = ids[i],
        pa = nPos[a];
      let vx = 0,
        vy = 0;

      // anti-overlap
      for (let j = i + 1; j < ids.length; j++) {
        const b = ids[j],
          pb = nPos[b];
        const dx = pa.x - pb.x,
          dy = pa.y - pb.y,
          d = Math.hypot(dx, dy) || 0.0001;
        const overlap = Math.max(0, MIN_DIST() - d);
        if (overlap > 0) {
          const fx = (overlap / d) * dx * CFG.value.REPULSE,
            fy = (overlap / d) * dy * CFG.value.REPULSE;
          vx += fx;
          vy += fy;
          pb.x -= fx;
          pb.y -= fy;
        }
      }

      // springs to rest length
      for (const e of edges) {
        if (e.from === a || e.to === a) {
          const other = e.from === a ? e.to : e.from;
          const p2 = nPos[other];
          if (!p2) continue;
          const dx = p2.x - pa.x,
            dy = p2.y - pa.y,
            d = Math.hypot(dx, dy) || 0.0001;
          const dirx = dx / d,
            diry = dy / d;
          const rest =
            restLength * (e.strength ? 1 + 0.15 * (1 - e.strength) : 1);
          const stretch = d - rest;
          vx += dirx * stretch * EDGE_K;
          vy += diry * stretch * EDGE_K;
        }
      }

      // cohesion to center
      vx += (cx - pa.x) * CFG.value.GRAV;
      vy += (cy - pa.y) * CFG.value.GRAV;

      // isolates → toward nearest group
      if (degree[a] === 0) {
        let near = { x: cx, y: cy },
          best = Infinity;
        for (const g of groups) {
          const p = gPos[g.id];
          const dd = Math.hypot(pa.x - p.x, pa.y - p.y);
          if (dd < best) {
            best = dd;
            near = p;
          }
        }
        vx += (near.x - pa.x) * 0.02;
        vy += (near.y - pa.y) * 0.02;
      }

      // integrate + clamp
      pa.x = Math.max(PADDING, Math.min(width - PADDING, pa.x + vx));
      pa.y = Math.max(PADDING, Math.min(height - PADDING, pa.y + vy));
    }
  }
  return nPos;
}

/* =============================
   Recompute
   ============================= */
const gPos = ref<Record<string, { x: number; y: number }>>({});
const nPos = ref<Record<string, { x: number; y: number }>>({});

function recompute() {
  if (isMobile.value) {
    const { gPos: gp, nPos: np } = verticalPositions();
    gPos.value = gp;
    nPos.value = relax(np, gp, CFG.value.EDGE_REST, stageW.value, stageH.value);
  } else {
    const { gPos: gp, nPos: np } = circlePositions();
    gPos.value = gp;
    nPos.value = relax(np, gp, CFG.value.EDGE_REST, W_DESKTOP, H_DESKTOP);
  }
}
onMounted(recompute);
watchEffect(recompute);

/* =============================
   Interaction (hover/click)
   ============================= */
const selectedId = ref<string | null>(null);
const hoverId = ref<string | null>(null);

function onNodeClick(id: string) {
  selectedId.value = selectedId.value === id ? null : id;
}
function isNeighbor(a: string, b: string) {
  return edges.some(
    (e) => (e.from === a && e.to === b) || (e.to === a && e.from === b)
  );
}
const nodeActive = (id: string) =>
  selectedId.value === id || hoverId.value === id;

const nodeOpacity = (id: string) => {
  const focus = selectedId.value ?? hoverId.value;
  if (!focus) return 1;
  return id === focus || isNeighbor(focus, id) ? 1 : 0.28;
};
const edgeOpacity = (a: string, b: string) => {
  const focus = selectedId.value ?? hoverId.value;
  if (!focus) return EDGE_BASE_OPACITY;
  return a === focus || b === focus
    ? EDGE_FOCUS_OPACITY
    : EDGE_UNFOCUSED_OPACITY;
};
const showLabel = (id: string) => {
  if (isMobile.value) return SHOW_LABELS_MOBILE;
  return selectedId.value === id || hoverId.value === id;
};
</script>

<template>
  <section id="tech" class="tech-stage">
    <div class="wrap" :class="{ mobile: isMobile }">

      <svg
        class="stage"
        :class="{ mobile: isMobile }"
        :viewBox="`0 0 ${stageW} ${stageH}`"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Technology relationship map"
      >
        <!-- Edges -->
        <g class="edges">
          <line
            v-for="(e, i) in edges"
            :key="i"
            :x1="nPos[e.from]?.x || 0"
            :y1="nPos[e.from]?.y || 0"
            :x2="nPos[e.to]?.x || 0"
            :y2="nPos[e.to]?.y || 0"
            :class="{
              glow:
                selectedId === e.from ||
                selectedId === e.to ||
                hoverId === e.from ||
                hoverId === e.to,
            }"
            stroke="color-mix(in oklab, var(--text) 28%, transparent)"
            :stroke-opacity="edgeOpacity(e.from, e.to)"
            :stroke-width="CFG.EDGE_WIDTH"
            :filter="
              selectedId === e.from ||
              selectedId === e.to ||
              hoverId === e.from ||
              hoverId === e.to
                ? 'url(#edgeGlow)'
                : undefined
            "
          />
        </g>

        <!-- Nodes -->
        <g class="nodes">
          <g
            v-for="n in nodes"
            :key="n.id"
            class="node"
            :transform="`translate(${nPos[n.id]?.x || 0} ${
              nPos[n.id]?.y || 0
            })`"
            :opacity="nodeOpacity(n.id)"
            @mouseenter="!isMobile && (hoverId = n.id)"
            @mouseleave="!isMobile && hoverId === n.id && (hoverId = null)"
            @click.stop="onNodeClick(n.id)"
          >
            <circle
              :r="nodeR()"
              fill="#fff"
              stroke="var(--border)"
              :stroke-width="isMobile ? 1.25 : 1"
              :filter="nodeActive(n.id) ? 'url(#nodeGlow)' : undefined"
            />
            <g :transform="`translate(${-iconSz() / 2},${-iconSz() / 2})`">
              <Icon
                :icon="n.icon"
                :width="iconSz()"
                :height="iconSz()"
                :style="{ color: 'var(--text)' }"
              />
            </g>

            <!-- Desktop labels only -->
            <g
              v-if="showLabel(n.id)"
              class="label"
              :transform="`translate(0, ${-nodeR() - 18})`"
            >
              <rect
                x="-62"
                y="-16"
                rx="8"
                ry="8"
                width="124"
                height="24"
                fill="#fff"
                stroke="var(--border)"
              />
              <text
                text-anchor="middle"
                dominant-baseline="middle"
                y="-4"
                fill="var(--text)"
                font-size="12"
              >
                {{ n.label }}
              </text>
            </g>
          </g>
        </g>

        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3.6"
              flood-color="var(--glow)"
              flood-opacity="0.55"
            />
          </filter>
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="1.8"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.tech-stage {
  background: var(--bg);
  display: flex;
  justify-content: center;
  padding: 24px 0 10px;
}
.wrap {
  width: min(1280px, 96vw);
}
.wrap.mobile {
  width: 100vw;
}
.title {
  font-size: clamp(20px, 3.5vw, 26px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 0 0 10px 6px;
}
.stage {
  width: 100%;
  height: auto;
  display: block;
}
.stage.mobile {
  width: 100vw;
  height: 100vh;
}

.nodes .node {
  cursor: pointer;
  transition: opacity 0.12s ease;
}
.edges .glow {
  stroke: color-mix(in oklab, var(--glow) 85%, #0000);
}
</style>
