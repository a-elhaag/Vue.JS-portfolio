<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { Icon } from "@iconify/vue";
import { groups, nodes, edges, type TechNode } from "../data/techStack";

/* =============================
   TUNABLE CONSTANTS (one place)
   ============================= */
const W_DESKTOP = 1200;
const H_DESKTOP = 740;
const PADDING = 96;

// Node size
const NODE_R = 26; // circle radius (↑ bigger nodes)
const ICON_SZ = 28; // icon size

// Initial placement
const RING = 200; // distance of nodes around each group center

// Physics
const MIN_DIST = NODE_R * 4 + 12; // min comfortable spacing (anti-overlap)
const REPULSE_K = 0.55; // repulsion strength
const EDGE_REST_DESK = 350; // desired edge length (desktop)
const EDGE_REST_MOB = 120; // desired edge length (mobile)
const EDGE_K = 0.06; // spring strength toward rest length
const GRAVITY = 0.008; // gentle pull to the center for cohesion
const ITER = 260; // iterations of relaxation

// Rendering
const EDGE_BASE_OPACITY = 0.38;
const EDGE_FOCUS_OPACITY = 0.72;
const EDGE_UNFOCUSED_OPACITY = 0.16;

/* =============================
   RESPONSIVE SWITCH
   ============================= */
const isMobile = ref(false);
function updateMobileFlag() {
  isMobile.value = window.matchMedia("(max-width: 720px)").matches;
}
onMounted(() => {
  updateMobileFlag();
  window.addEventListener("resize", updateMobileFlag, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("resize", updateMobileFlag));

/* =============================
   UTILS
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

/* Precompute degrees (how many edges touch a node) */
const degree: Record<string, number> = {};
nodes.forEach((n) => (degree[n.id] = 0));
edges.forEach((e) => {
  degree[e.from]++;
  degree[e.to]++;
});

/* =============================
   INITIAL LAYOUTS
   ============================= */
// Desktop: groups on a ring; each group gets a node ring; then physics
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

// Mobile: vertical lanes seed, then physics uses the same springs
const mobileHeight = ref(H_DESKTOP);
function verticalPositions() {
  const laneX = 112;
  const startY = 84;
  const groupGap = 148;
  const nodeGap = 78;
  const cols = 3;
  const colW = 112;

  const gPos: Record<string, { x: number; y: number }> = {};
  const nPos: Record<string, { x: number; y: number }> = {};

  let y = startY;
  const byGroup: Record<string, TechNode[]> = {};
  nodes.forEach((n) => (byGroup[n.group] ??= []).push(n));

  for (const g of groups) {
    gPos[g.id] = { x: laneX, y };
    const list = seededShuffle(byGroup[g.id] ?? [], 5);
    const x0 = laneX + 150;
    list.forEach((n, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      nPos[n.id] = { x: x0 + col * colW, y: y + row * nodeGap };
    });
    const rows = Math.max(1, Math.ceil(list.length / cols));
    y += rows * nodeGap + groupGap;
  }
  mobileHeight.value = y + 140;
  return { gPos, nPos };
}

/* =============================
   RELAXATION (physics)
   - anti-overlap
   - spring edges with rest length (controls edge length)
   - gravity to center
   - gentle tether for isolates (degree 0)
   ============================= */
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

  for (let iter = 0; iter < ITER; iter++) {
    for (let i = 0; i < ids.length; i++) {
      const a = ids[i],
        pa = nPos[a];
      let vx = 0,
        vy = 0;

      // repulsion (anti-overlap)
      for (let j = i + 1; j < ids.length; j++) {
        const b = ids[j],
          pb = nPos[b];
        const dx = pa.x - pb.x,
          dy = pa.y - pb.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const overlap = Math.max(0, MIN_DIST - d);
        if (overlap > 0) {
          const fx = (overlap / d) * dx * REPULSE_K;
          const fy = (overlap / d) * dy * REPULSE_K;
          vx += fx;
          vy += fy;
          pb.x -= fx;
          pb.y -= fy;
        }
      }

      // Hooke springs toward a rest length for edges
      for (const e of edges) {
        if (e.from === a || e.to === a) {
          const other = e.from === a ? e.to : e.from;
          const p2 = nPos[other];
          if (!p2) continue;
          const dx = p2.x - pa.x,
            dy = p2.y - pa.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const dirx = dx / d,
            diry = dy / d;
          // vary rest length a bit with strength (weaker edge → slightly longer)
          const rest =
            restLength * (e.strength ? 1 + 0.15 * (1 - e.strength) : 1);
          const stretch = d - rest;
          vx += dirx * stretch * EDGE_K;
          vy += diry * stretch * EDGE_K;
        }
      }

      // global gravity toward center (prevents drift)
      vx += (cx - pa.x) * GRAVITY;
      vy += (cy - pa.y) * GRAVITY;

      // isolates: tether softly toward nearest group
      if (degree[a] === 0) {
        let near = { x: cx, y: cy },
          best = Infinity;
        for (const g of groups) {
          const p = gPos[g.id];
          const d = Math.hypot(pa.x - p.x, pa.y - p.y);
          if (d < best) {
            best = d;
            near = p;
          }
        }
        vx += (near.x - pa.x) * 0.02;
        vy += (near.y - pa.y) * 0.02;
      }

      // integrate + clamp to stage
      pa.x = Math.max(PADDING, Math.min(width - PADDING, pa.x + vx));
      pa.y = Math.max(PADDING, Math.min(height - PADDING, pa.y + vy));
    }
  }
  return nPos;
}

/* =============================
   RECOMPUTE LAYOUTS
   ============================= */
const gPos = ref<Record<string, { x: number; y: number }>>({});
const nPos = ref<Record<string, { x: number; y: number }>>({});

function recompute() {
  if (isMobile.value) {
    const { gPos: gp, nPos: np } = verticalPositions();
    gPos.value = gp;
    nPos.value = relax(
      np,
      gp,
      EDGE_REST_MOB,
      W_DESKTOP,
      Math.max(mobileHeight.value, H_DESKTOP)
    );
  } else {
    const { gPos: gp, nPos: np } = circlePositions();
    gPos.value = gp;
    nPos.value = relax(np, gp, EDGE_REST_DESK, W_DESKTOP, H_DESKTOP);
  }
}
onMounted(recompute);
watchEffect(recompute);

/* =============================
   INTERACTION (click only)
   ============================= */
const selectedId = ref<string | null>(null);
function onNodeClick(id: string) {
  selectedId.value = selectedId.value === id ? null : id;
}
function isNeighbor(a: string, b: string) {
  return edges.some(
    (e) => (e.from === a && e.to === b) || (e.to === a && e.from === b)
  );
}
const nodeOpacity = (id: string) => {
  if (!selectedId.value) return 1;
  return id === selectedId.value || isNeighbor(selectedId.value, id) ? 1 : 0.28;
};
const edgeOpacity = (a: string, b: string) => {
  if (!selectedId.value) return EDGE_BASE_OPACITY;
  return a === selectedId.value || b === selectedId.value
    ? EDGE_FOCUS_OPACITY
    : EDGE_UNFOCUSED_OPACITY;
};
</script>

<template>
  <section id="tech" class="tech-stage">
    <div class="wrap">
      <h2 class="title">Tech Stack</h2>

      <svg
        class="stage"
        :viewBox="`0 0 ${W_DESKTOP} ${
          isMobile ? Math.max(mobileHeight, H_DESKTOP) : H_DESKTOP
        }`"
        role="img"
        aria-label="Technology relationship map"
      >
        <!-- Edges (undirected; no labels) -->
        <g class="edges">
          <line
            v-for="(e, i) in edges"
            :key="i"
            :x1="nPos[e.from]?.x || 0"
            :y1="nPos[e.from]?.y || 0"
            :x2="nPos[e.to]?.x || 0"
            :y2="nPos[e.to]?.y || 0"
            stroke="color-mix(in oklab, var(--text) 28%, transparent)"
            :stroke-opacity="edgeOpacity(e.from, e.to)"
            stroke-width="1.6"
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
            @click="onNodeClick(n.id)"
          >
            <circle
              :r="NODE_R"
              fill="#fff"
              stroke="var(--border)"
              stroke-width="1"
              :filter="selectedId === n.id ? 'url(#glow)' : undefined"
            />
            <g :transform="`translate(${-ICON_SZ / 2},${-ICON_SZ / 2})`">
              <Icon
                :icon="n.icon"
                :width="ICON_SZ"
                :height="ICON_SZ"
                :style="{ color: 'var(--text)' }"
              />
            </g>
          </g>
        </g>

        <defs>
          <!-- cinematic blue glow on selection only -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3.4"
              flood-color="var(--glow)"
              flood-opacity="0.45"
            />
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
  padding: 28px 0 12px;
}
.wrap {
  width: min(1280px, 96vw);
}
.title {
  font-size: clamp(20px, 3.5vw, 26px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 0 0 12px 6px;
}
.stage {
  width: 100%;
  height: auto;
  display: block;
}

/* Nodes: no hover animation; selection only */
.nodes .node {
  cursor: pointer;
  transition: opacity 0.12s ease;
}

/* Slightly tighter padding on phones */
@media (max-width: 720px) {
  .tech-stage {
    padding-top: 16px;
  }
  .title {
    margin-left: 2px;
  }
}
</style>
