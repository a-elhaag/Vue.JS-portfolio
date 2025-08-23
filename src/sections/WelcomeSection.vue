<script setup lang="ts">
import { computed } from 'vue'
import { welcome } from '../data/welcome'
import { Github, Linkedin, X } from 'lucide-vue-next'
import Button from '../components/UI/Button.vue'

const avatarSvg = new URL('../assets/avatar.svg', import.meta.url).href
const initial = (welcome.name || 'A').slice(0,1).toUpperCase()

// map known socials -> lucide icon
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  x: X,
} as const

// respect welcome.style.order and filter only those with URLs present
const defaultOrder: Array<keyof typeof iconMap> = ['github', 'linkedin', 'x']

const socials = computed(() => {
  const order = welcome.style?.order ?? defaultOrder
  return order
    .filter(key => welcome.socials[key as keyof typeof welcome.socials])
    .map(key => ({
      key,
      url: welcome.socials[key as keyof typeof welcome.socials] as string,
      icon: iconMap[key],
    }))
})
// map welcome.style.socialVariant -> Button size
const socialSize = computed(() => welcome.style?.socialVariant === 'mini' ? 'sm' : 'md')
</script>

<template>
  <section id="welcome" class="welcome-hero">
    <div class="welcome-content">
      <!-- Avatar with glow behind it -->
      <div class="welcome-avatar">
        <img
          v-if="welcome.avatar?.src"
          :src="welcome.avatar.src"
          :alt="welcome.avatar?.alt || ('Portrait of ' + welcome.name)"
          class="avatar-img"
        />
        <img v-else :src="avatarSvg" alt="Avatar" class="avatar-img" />
        <div v-if="!welcome.avatar?.src && !avatarSvg" class="avatar-fallback">{{ initial }}</div>
      </div>

      <div class="welcome-text">
        <h1 class="welcome-name">{{ welcome.name }}</h1>
        <p class="welcome-headline">{{ welcome.headline }}</p>
        <p class="welcome-intro">{{ Array.isArray(welcome.intro) ? welcome.intro[0] : welcome.intro }}</p>

        <div v-if="socials.length" class="welcome-socials">
          <Button
            v-for="s in socials"
            :key="s.key"
            :href="s.url"
            variant="social"
            :aria-label="s.key"
            :size="socialSize"
            external
          >
            <template #icon>
              <component :is="s.icon" />
            </template>
          </Button>
        </div>

        <div class="welcome-cta">
          <Button
            v-if="welcome.cta.contactMe && welcome.contacts.email"
            :href="`mailto:${welcome.contacts.email}`"
            variant="solid"
            aria-label="Contact"
          >
            Contact
          </Button>
          <Button
            v-if="welcome.cta.letsTalk"
            href="#contact"
            variant="ghost"
            aria-label="Let’s Talk"
          >
            Let’s Talk
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-hero {
  width: 100%;
  padding: 56px 0 32px 0;
  background: var(--bg);
  display: flex;
  justify-content: center;
}

.welcome-content {
  width: min(900px, 96vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
}

.welcome-name {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text);
  margin-bottom: 0.2em;
}

.welcome-headline {
  font-size: 1.25rem;
  color: var(--muted);
  font-weight: 500;
  margin-bottom: 0.2em;
}

.welcome-intro {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.92;
  margin-bottom: 0.5em;
}

/* Avatar with glow behind it (no color change, soft halo using --glow) */
.welcome-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 8px solid #000;
  box-sizing: border-box;
  background: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 0 8px rgba(47,107,237,0.08),
    0 0 36px 12px color-mix(in oklab, var(--glow) 55%, transparent),
    0 0 64px 24px color-mix(in oklab, var(--glow) 30%, transparent);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: none;
  display: block;
  position: relative;
  z-index: 2;
}

.avatar-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 3.5rem; font-weight: 800;
  color: var(--bg); background: transparent; z-index: 1;
}

/* Layout only (no button/icon styles live here) */
.welcome-socials { display: flex; gap: 18px; margin: 10px 0 0 0; }
.welcome-cta { display: flex; gap: 14px; margin-top: 18px; }

/* Responsive */
@media (max-width: 799px) {
  .welcome-content { flex-direction: column; }
  .welcome-avatar { order: -1; }
  .welcome-text { order: 1; }
}
@media (min-width: 800px) {
  .welcome-content {
    flex-direction: row; align-items: center; justify-content: space-between; gap: 48px;
  }
  .welcome-text {
    align-items: flex-start; text-align: left; flex: 1 1 0%; order: 1;
  }
  .welcome-avatar {
    width: 240px; height: 240px; min-width: 240px; min-height: 240px; order: 2;
  }
}
</style>
