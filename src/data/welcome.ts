export const welcome = {
  name: "Anas Abuelhaag",
  headline: "I build intelligent systems with code and cloud.",
  intro: [
    "Software engineering student and AI engineer.",
    "Focused on Vue 3 + TypeScript, Azure, and fast, accessible UIs."
  ],
  
  contacts: {
    email: "you@example.com"
  },
  socials: {
    github: "https://github.com/anas",
    linkedin: "https://linkedin.com/in/anas",
    x: "https://x.com/anas_handle",
  },
  style: {
    order: ["github", "x", "linkedin"]
  },
  cta: {
    contactMe: true,
    letsTalk: true
  },
  avatar: {
    src: "src/assets/avatar.svg",
    alt: "Portrait of Anas"
  }
} as const