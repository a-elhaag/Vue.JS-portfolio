// src/data/techStack.ts
export type TechItem = {
  id: string;
  icon: string; // Iconify id (e.g., "simple-icons:react")
  label: string;
  color?: string; // optional brand color
};

export const techStack: TechItem[] = [
  // --- Core VCS/DevOps ---
  {
    id: "github",
    icon: "simple-icons:github",
    label: "GitHub",
    color: "#181717",
  },
  { id: "git", icon: "simple-icons:git", label: "Git", color: "#F05032" },
  {
    id: "vercel",
    icon: "simple-icons:vercel",
    label: "Vercel",
    color: "#000000",
  },
  {
    id: "vscode",
    icon: "simple-icons:visualstudiocode",
    label: "VS Code",
    color: "#007ACC",
  },

  // --- Containers / Cloud ---
  {
    id: "docker",
    icon: "simple-icons:docker",
    label: "Docker",
    color: "#2496ED",
  },
  {
    id: "azure",
    icon: "simple-icons:microsoftazure",
    label: "Microsoft Azure",
    color: "#0078D4",
  },
  {
    id: "colab",
    icon: "simple-icons:googlecolab",
    label: "Google Colab",
    color: "#F9AB00",
  },
  {
    id: "jupyter",
    icon: "simple-icons:jupyter",
    label: "Jupyter",
    color: "#F37626",
  },
  {
    id: "kaggle",
    icon: "simple-icons:kaggle",
    label: "Kaggle",
    color: "#20BEFF",
  },
  {
    id: "azfunc",
    icon: "simple-icons:azurefunctions",
    label: "Azure Functions",
  }, // color varies in the wild

  // --- AI / LLM ---
  { id: "openai", icon: "simple-icons:openai", label: "OpenAI" }, // simple-icons color shifts; let UI default
  {
    id: "aifoundry",
    icon: "simple-icons:microsoftazure",
    label: "Azure AI Foundry",
  }, // reuse Azure mark
  { id: "langchain", icon: "simple-icons:langchain", label: "LangChain" }, // color left to UI

  // --- Web / App Frameworks ---
  { id: "react", icon: "simple-icons:react", label: "React", color: "#61DAFB" },
  { id: "vue", icon: "picon:vue", label: "Vue 3", color: "#42B883" },

  {
    id: "reactnative",
    icon: "simple-icons:react",
    label: "React Native",
    color: "#61DAFB",
  },
  { id: "expo", icon: "simple-icons:expo", label: "Expo", color: "#000020" },
  {
    id: "nextjs",
    icon: "simple-icons:nextdotjs",
    label: "Next.js",
    color: "#000000",
  },
  { id: "vite", icon: "simple-icons:vite", label: "Vite", color: "#646CFF" },
  {
    id: "ts",
    icon: "simple-icons:typescript",
    label: "TypeScript",
    color: "#3178C6",
  },

  // --- Backend / APIs ---
  {
    id: "fastapi",
    icon: "simple-icons:fastapi",
    label: "FastAPI",
    color: "#009688",
  },

  // --- Languages ---
  {
    id: "python",
    icon: "simple-icons:python",
    label: "Python",
    color: "#3776AB",
  },
  { id: "c", icon: "simple-icons:c", label: "C", color: "#A8B9CC" },
  { id: "cpp", icon: "simple-icons:cplusplus", label: "C++", color: "#00599C" },
  {
    id: "solidity",
    icon: "simple-icons:solidity",
    label: "Solidity",
    color: "#363636",
  },
  {
    id: "js",
    icon: "simple-icons:javascript",
    label: "JavaScript",
    color: "#F7DF1E",
  },
  { id: "npm", icon: "simple-icons:npm", label: "npm", color: "#CB3837" },
  { id: "yarn", icon: "simple-icons:yarn", label: "Yarn", color: "#2C8EBB" },

  // --- Databases / Storage ---
  { id: "mysql", icon: "simple-icons:mysql", label: "MySQL", color: "#4479A1" },

  // --- Quantum ---
  { id: "qsharp", icon: "mdi:alpha-q", label: "Q#" }, // Iconify MDI fallback
  { id: "quantumdk", icon: "mdi:atom", label: "Quantum DevKit" }, // Iconify MDI fallback
  {
    id: "azurequantum",
    icon: "simple-icons:microsoftazure",
    label: "Azure Quantum",
  },

  // --- UI / Styling / Docs ---
  {
    id: "notion",
    icon: "simple-icons:notion",
    label: "Notion",
    color: "#000000",
  },
  { id: "canva", icon: "simple-icons:canva", label: "Canva", color: "#00C4CC" },
  { id: "zksync", icon: "token-branded:zksync", label: "zkSync" },
];
