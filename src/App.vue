<script setup lang="ts">
import WelcomeSection from "./sections/WelcomeSection.vue";
import TechSection from "./sections/TechStackSection.vue";
import CertsSection from "./sections/CertsSection.vue";
import AboutSection from "./sections/AboutSection.vue";
import ProjectsSection from "./sections/ProjectsSection.vue";
import ResearchPapersSection from "./sections/ResearchPapersSection.vue";
import ExperienceSection from "./sections/ExperienceSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
  <main>
    <WelcomeSection />
    <TechSection />
    <CertsSection />
    <AboutSection />
    <ProjectsSection />
    <ExperienceSection />
    <ResearchPapersSection />
    <SiteFooter />
  </main>
</template>
