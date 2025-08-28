export interface ProjectLinkSet {
  repo: string; // GitHub repository (required)
  demo?: string; // Optional live demo URL
  docs?: string; // Optional documentation site
}

export interface ProjectItem {
  slug: string;
  title: string; // monospace heading
  intro: string; // short intro paragraph
  stack: string[]; // key tech keywords
  links: ProjectLinkSet;
  accent?: string; // optional accent color
  featured?: boolean; // highlight priority
  status?: "active" | "archived" | "wip";
  order?: number; // manual ordering weight
}

export const projects: ProjectItem[] = [
  {
    slug: "melo",
    title: "Melo",
    intro: "AI-powered diet planner generating adaptive meal plans.",
    stack: ["Vue", "FastAPI", "Azure"],
    links: {
      repo: "https://github.com/anas/melo",
      demo: "https://melo.ai",
    },
    accent: "#2f6bed",
    featured: true,
  },
  {
    slug: "inkr",
    title: "Inkr",
    intro: "Note-taking app inspired by Notion, powered by AI.",
    stack: ["Vue", "Node", "Postgres"],
    links: {
      repo: "https://github.com/anas/inkr",
    },
    status: "wip",
  },
];
