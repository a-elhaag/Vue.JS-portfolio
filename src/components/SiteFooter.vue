<script setup lang="ts">
import Button from "./Button.vue";
import { welcome } from "../data/welcome";
import { Github, Linkedin, X } from "lucide-vue-next";

const currentYear = new Date().getFullYear();

const iconMap = { github: Github, linkedin: Linkedin, x: X } as const;
const order: Array<keyof typeof iconMap> = (
  welcome.style?.order ? [...welcome.style.order] : ["github", "linkedin", "x"]
) as Array<keyof typeof iconMap>;
const socials = order
  .filter((k) => welcome.socials[k as keyof typeof welcome.socials])
  .map((k) => ({
    key: k,
    url: welcome.socials[k as keyof typeof welcome.socials]!,
    icon: iconMap[k],
  }));
</script>

<template>
  <footer class="site-footer" aria-labelledby="footer-heading">
    <div class="footer-inner">
      <h2 id="footer-heading" class="visually-hidden">Site footer</h2>
      <div class="footer-row">
        <Button
          variant="solid"
          :href="`mailto:${welcome.contacts.email}`"
          aria-label="Contact Me from footer"
          >Email Me</Button
        >
        <p class="copyright">© {{ currentYear }} {{ welcome.name }}</p>
        <div class="footer-socials" v-if="socials.length">
          <Button
            v-for="s in socials"
            :key="s.key"
            :href="s.url"
            variant="social"
            :aria-label="s.key"
            external
          >
            <template #icon>
              <component :is="s.icon" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  background: var(--bg);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
  padding: 48px 0 56px;
  margin-top: 4rem;
}
.footer-inner {
  width: min(var(--section-max), 96vw);
  padding-inline: 12px;
}
.footer-row {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  justify-content: flex-start;
  position: relative;
}
.footer-socials {
  display: flex;
  gap: 10px;
}
.copyright {
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  flex: 0 1 auto;
}
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
