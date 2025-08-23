
<script setup lang="ts">
import { welcome } from '../data/welcome'
import { Github, Linkedin, X, Instagram } from 'lucide-vue-next'

const socials = [
  { key: 'github', url: welcome.socials.github, icon: Github },
  { key: 'linkedin', url: welcome.socials.linkedin, icon: Linkedin },
  { key: 'x', url: welcome.socials.x, icon: X },
  { key: 'instagram', url: welcome.socials.instagram, icon: Instagram },
].filter(s => s.url)

const avatarSvg = new URL('../assets/avatar.svg', import.meta.url).href
const initial = (welcome.name || 'A').slice(0,1).toUpperCase()
</script>

<template>
  <section id="welcome" class="welcome-hero">
    <div class="welcome-content">
      <div class="welcome-avatar">
        <img v-if="welcome.avatar?.src" :src="welcome.avatar.src" :alt="welcome.avatar?.alt || ('Portrait of ' + welcome.name)" class="avatar-img" />
        <img v-else :src="avatarSvg" alt="Avatar" class="avatar-img" />
        <div v-if="!welcome.avatar?.src && !avatarSvg" class="avatar-fallback">{{ initial }}</div>
      </div>
      <div class="welcome-text">
        <h1 class="welcome-name">{{ welcome.name }}</h1>
        <p class="welcome-headline">{{ welcome.headline }}</p>
        <p class="welcome-intro">{{ Array.isArray(welcome.intro) ? welcome.intro[0] : welcome.intro }}</p>
        <div v-if="socials.length" class="welcome-socials">
          <a v-for="s in socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer" :aria-label="s.key" class="welcome-social-icon">
            <component :is="s.icon" style="font-size: 1.7em; display: flex;" />
          </a>
        </div>
        <div class="welcome-cta">
          <a v-if="welcome.cta.contactMe && welcome.contacts.email" :href="`mailto:${welcome.contacts.email}`" class="welcome-btn solid">Contact</a>
          <a v-if="welcome.cta.letsTalk" href="#contact" class="welcome-btn ghost">Let’s Talk</a>
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
  .welcome-socials {
    display: flex;
    gap: 18px;
    margin: 10px 0 0 0;
  }
  .welcome-social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--text);
    color: var(--bg);
    font-size: 1.6rem;
    transition: background 0.18s, color 0.18s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  .welcome-social-icon:hover {
    background: var(--muted);
    color: var(--bg);
  }
  .welcome-cta {
    display: flex;
    gap: 14px;
    margin-top: 18px;
  }
  .welcome-btn {
    display: inline-block;
    padding: 12px 28px;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  .welcome-btn.solid {
    background: var(--text);
    color: var(--bg);
    border: none;
  }
  .welcome-btn.solid:hover {
    background: var(--muted);
    color: var(--bg);
  }
  .welcome-btn.ghost {
    background: var(--bg);
    color: var(--text);
    border: 2px solid var(--text);
  }
  .welcome-btn.ghost:hover {
    background: var(--text);
    color: var(--bg);
  }
  .welcome-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 8px solid #000; /* black frame */
    box-sizing: border-box; /* include border in dimensions */
    background: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    position: relative;
    overflow: hidden;
  }
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  /* Remove filter to ensure image is visible */
  filter: none;
    display: block;
    position: relative;
    z-index: 2;
  }
  .avatar-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--bg);
    background: transparent;
    z-index: 1;
  }
  /* Small screens: avatar at top */
  @media (max-width: 799px) {
    .welcome-content {
      flex-direction: column;
    }
    .welcome-avatar {
      order: -1; /* Ensure avatar comes first */
    }
    .welcome-text {
      order: 1;
    }
  }
  
  /* Desktop: avatar on right */
  @media (min-width: 800px) {
    .welcome-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 48px;
    }
    .welcome-text {
      align-items: flex-start;
      text-align: left;
      flex: 1 1 0%;
      order: 1;
    }
    .welcome-avatar {
      width: 240px;
      height: 240px;
      min-width: 240px;
      min-height: 240px;
      order: 2; /* Avatar on the right */
    }
  }
  </style>