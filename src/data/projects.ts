export const projects = [
  {
    slug: "melo",
    title: "Melo",
    summary: "AI-powered diet planner for personalized meal plans.",
    stack: ["Vue", "FastAPI", "Azure"],
    links: {
      github: "https://github.com/anas/melo",
      live: "https://melo.ai"
    }
  },
  {
    slug: "inkr",
    title: "Inkr",
    summary: "Note-taking app inspired by Notion, powered by AI.",
    stack: ["Vue", "Node", "Postgres"],
    links: {
      github: "https://github.com/anas/inkr"
    }
  }
] as const