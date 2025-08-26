// src/data/techStack.ts

// -----------------------------
// Graph data model
// -----------------------------
export type TechGroup = { id: string; label: string };
export type TechNode = {
  id: string;
  label: string;
  icon: string; // Iconify token
  group: string; // group id
  color?: string; // optional brand tint
};
export type TechEdge = { from: string; to: string; strength?: number }; // 0..1

// -----------------------------
// Groups (clusters on the canvas)
// -----------------------------
export const groups: TechGroup[] = [
  { id: "core", label: "Core Languages" },
  { id: "web", label: "Web & Frameworks" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "dataai", label: "Data & AI" },
  { id: "db", label: "Databases" },
  { id: "tools", label: "Tools & Productivity" },
  { id: "ui", label: "UI Kits" },
  { id: "quant", label: "Quantum" },
  { id: "web3", label: "Web3 / L2" },
];

// -----------------------------
// Nodes (everything you listed)
// -----------------------------
export const nodes: TechNode[] = [
  // Core
  {
    id: "ts",
    label: "TypeScript",
    icon: "simple-icons:typescript",
    group: "core",
    color: "#3178C6",
  },
  {
    id: "python",
    label: "Python",
    icon: "simple-icons:python",
    group: "core",
    color: "#3776AB",
  },
  {
    id: "c",
    label: "C",
    icon: "simple-icons:c",
    group: "core",
    color: "#A8B9CC",
  },
  {
    id: "cpp",
    label: "C++",
    icon: "simple-icons:cplusplus",
    group: "core",
    color: "#00599C",
  },
  {
    id: "solidity",
    label: "Solidity",
    icon: "simple-icons:solidity",
    group: "core",
    color: "#363636",
  },

  // Web & Frameworks
  {
    id: "vue",
    label: "Vue 3",
    icon: "akar-icons:vue-fill",
    group: "web",
    color: "#42B883",
  },
  {
    id: "react",
    label: "React",
    icon: "simple-icons:react",
    group: "web",
    color: "#61DAFB",
  },
  {
    id: "reactnative",
    label: "React Native",
    icon: "simple-icons:react",
    group: "web",
    color: "#61DAFB",
  },
  {
    id: "nextjs",
    label: "Next.js",
    icon: "simple-icons:nextdotjs",
    group: "web",
    color: "#000000",
  },
  {
    id: "fastapi",
    label: "FastAPI",
    icon: "simple-icons:fastapi",
    group: "web",
    color: "#009688",
  },

  // Cloud & DevOps
  {
    id: "azure",
    label: "Azure",
    icon: "simple-icons:microsoftazure",
    group: "cloud",
    color: "#0078D4",
  },
  {
    id: "aifoundry",
    label: "Azure AI Foundry",
    icon: "simple-icons:microsoftazure",
    group: "cloud",
    color: "#0078D4",
  },
  {
    id: "azurefunc",
    label: "Azure Functions",
    icon: "simple-icons:azurefunctions",
    group: "cloud",
    color: "#0062AD",
  },
  {
    id: "vercel",
    label: "Vercel",
    icon: "simple-icons:vercel",
    group: "cloud",
    color: "#000000",
  },
  {
    id: "docker",
    label: "Docker",
    icon: "simple-icons:docker",
    group: "cloud",
    color: "#2496ED",
  },

  // Data & AI
  {
    id: "openai",
    label: "OpenAI",
    icon: "simple-icons:openai",
    group: "dataai",
  },
  {
    id: "langchain",
    label: "LangChain",
    icon: "simple-icons:langchain",
    group: "dataai",
  },
  {
    id: "colab",
    label: "Google Colab",
    icon: "simple-icons:googlecolab",
    group: "dataai",
    color: "#F9AB00",
  },
  {
    id: "jupyter",
    label: "Jupyter",
    icon: "simple-icons:jupyter",
    group: "dataai",
    color: "#F37626",
  },
  {
    id: "kaggle",
    label: "Kaggle",
    icon: "simple-icons:kaggle",
    group: "dataai",
    color: "#20BEFF",
  },

  // Databases
  {
    id: "mysql",
    label: "MySQL",
    icon: "simple-icons:mysql",
    group: "db",
    color: "#4479A1",
  },
  {
    id: "sqlite",
    label: "SQLite",
    icon: "simple-icons:sqlite",
    group: "db",
    color: "#003B57",
  },

  // Tools & Productivity
  {
    id: "git",
    label: "Git",
    icon: "simple-icons:git",
    group: "tools",
    color: "#F05032",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "simple-icons:github",
    group: "tools",
    color: "#181717",
  },
  {
    id: "vscode",
    label: "VS Code",
    icon: "simple-icons:visualstudiocode",
    group: "tools",
    color: "#007ACC",
  },
  {
    id: "npm",
    label: "npm",
    icon: "simple-icons:npm",
    group: "tools",
    color: "#CB3837",
  },
  {
    id: "yarn",
    label: "Yarn",
    icon: "simple-icons:yarn",
    group: "tools",
    color: "#2C8EBB",
  },
  {
    id: "powershell",
    label: "PowerShell",
    icon: "simple-icons:powershell",
    group: "tools",
    color: "#5391FE",
  },
  {
    id: "postman",
    label: "Postman",
    icon: "simple-icons:postman",
    group: "tools",
    color: "#FF6C37",
  },
  {
    id: "notion",
    label: "Notion",
    icon: "simple-icons:notion",
    group: "tools",
    color: "#000000",
  },
  {
    id: "prettier",
    label: "Prettier",
    icon: "simple-icons:prettier",
    group: "tools",
    color: "#F7B93E",
  },

  // UI Kits
  {
    id: "mui",
    label: "MUI",
    icon: "simple-icons:mui",
    group: "ui",
    color: "#007FFF",
  },

  // Quantum
  {
    id: "qsharp",
    label: "Q#",
    icon: "mdi:alpha-q",
    group: "quant",
    color: "#0078D4",
  },
  {
    id: "qdk",
    label: "Quantum DevKit",
    icon: "mdi:atom",
    group: "quant",
    color: "#7C4DFF",
  },

  // Web3 / L2
  {
    id: "zksync",
    label: "zkSync",
    icon: "token-branded:zksync",
    group: "web3",
  },
];

// -----------------------------
// Edges (relationships)
// -----------------------------
export const edges: TechEdge[] = [
  // Core relations
  { from: "vue", to: "ts", strength: 0.9 },
  { from: "react", to: "ts", strength: 0.7 },
  { from: "reactnative", to: "ts", strength: 0.6 },
  { from: "nextjs", to: "react", strength: 0.9 },

  { from: "fastapi", to: "python", strength: 0.9 },

  // Cloud <> Web
  { from: "vercel", to: "vue", strength: 0.6 },
  { from: "vercel", to: "nextjs", strength: 0.8 },
  { from: "docker", to: "fastapi", strength: 0.6 },

  // Cloud <> AI
  { from: "azure", to: "openai", strength: 0.85 },
  { from: "azure", to: "langchain", strength: 0.6 },
  { from: "aifoundry", to: "openai", strength: 0.8 },
  { from: "azurefunc", to: "python", strength: 0.6 },

  // Data/AI toolchain
  { from: "python", to: "jupyter", strength: 0.7 },
  { from: "python", to: "colab", strength: 0.6 },
  { from: "python", to: "kaggle", strength: 0.5 },
  { from: "langchain", to: "openai", strength: 0.7 },

  // DB relations
  { from: "fastapi", to: "sqlite", strength: 0.5 },
  { from: "fastapi", to: "mysql", strength: 0.4 },

  // Tools
  { from: "git", to: "github", strength: 0.9 },
  { from: "vscode", to: "ts", strength: 0.5 },
  { from: "postman", to: "fastapi", strength: 0.6 },
  { from: "prettier", to: "ts", strength: 0.4 },

  // UI
  { from: "mui", to: "react", strength: 0.6 },

  // Quantum
  { from: "qdk", to: "qsharp", strength: 0.85 },

  // Web3
  { from: "zksync", to: "ts", strength: 0.4 },
  { from: "zksync", to: "react", strength: 0.4 },

  // Misc helpful links
  { from: "notion", to: "github", strength: 0.3 },
  { from: "yarn", to: "vue", strength: 0.35 },
  { from: "npm", to: "react", strength: 0.35 },
];
