export interface PaperLinkSet {
  app?: string; // optional application/demo link (acts like demo)
  repo?: string; // optional repository if code is public
  pdf?: string; // link to the paper PDF
}

export interface ResearchPaperItem {
  slug: string;
  title: string; // paper title
  intro: string; // short abstract/description
  stack: string[]; // key domains / tech (reuse for tag display)
  links: PaperLinkSet;
  accent?: string;
  featured?: boolean;
  order?: number;
}

export const papers: ResearchPaperItem[] = [
  {
    slug: "ai-nutrition-2025",
    title: "Context-Aware Meal Plan Generation with LLMs",
    intro:
      "Framework leveraging large language models and user metabolic feedback to iteratively optimize personalized nutrition plans.",
    stack: ["LLM", "Reinforcement", "Nutrition"],
    links: {
      pdf: "https://example.com/ai-nutrition.pdf",
      app: "https://melo.ai",
      repo: "https://github.com/anas/melo",
    },
    accent: "#9442d6",
    featured: true,
  },
  {
    slug: "graph-embeddings-2024",
    title: "Lightweight Graph Embeddings for Real-Time Ranking",
    intro:
      "Technique for producing streaming-updatable graph embeddings enabling <10ms similarity queries at scale.",
    stack: ["Graph", "Embeddings", "Ranking"],
    links: {
      pdf: "https://example.com/graph-embeddings.pdf",
    },
    accent: "#0c9665",
  },
];
