// src/data/techStack.ts
// ----------------------------------------------------------------------------
// Structured, future-proof tech stack list.
// - Your own stack entries are UNCOMMENTED (active).
// - Tons of additional techs are PROVIDED BUT COMMENTED, organized by category.
// - Uses Iconify tokens (mostly `simple-icons:*`; a few `mdi:*` where needed).
// - Each entry supports an optional `color` used by your TechCard tint/icon.
// ----------------------------------------------------------------------------

export type TechItem = {
  id: string;
  label: string;
  /** Iconify token, e.g., "simple-icons:react" or "devicon:vuejs" */
  icon: string;
  /** Optional brand color used for accent + Iconify icon color */
  color?: string;
};

export const techStack: TechItem[] = [
  {
    id: "github",
    icon: "simple-icons:github",
    label: "GitHub",
    color: "#181717",
  },
  { id: "git", icon: "simple-icons:git", label: "Git", color: "#F05032" },
  {
    id: "vscode",
    icon: "simple-icons:visualstudiocode",
    label: "VS Code",
    color: "#007ACC",
  },
  { id: "npm", icon: "simple-icons:npm", label: "npm", color: "#CB3837" },
  { id: "yarn", icon: "simple-icons:yarn", label: "Yarn", color: "#2C8EBB" },
  {
    id: "powershell",
    icon: "simple-icons:powershell",
    label: "PowerShell",
    color: "#5391FE",
  },

  // --- Hosting & Infra ---
  {
    id: "vercel",
    icon: "simple-icons:vercel",
    label: "Vercel",
    color: "#000000",
  },
  {
    id: "docker",
    icon: "simple-icons:docker",
    label: "Docker",
    color: "#2496ED",
  },

  // --- Cloud & AI ---
  {
    id: "azure",
    icon: "simple-icons:microsoftazure",
    label: "Azure",
    color: "#0078D4",
  },
  {
    id: "aifoundry",
    icon: "simple-icons:microsoftazure",
    label: "Azure AI Foundry",
    color: "#0078D4",
  },
  {
    id: "azurefunc",
    icon: "simple-icons:azurefunctions",
    label: "Azure Functions",
    color: "#0062AD",
  },
  { id: "openai", icon: "simple-icons:openai", label: "OpenAI" },
  { id: "langchain", icon: "simple-icons:langchain", label: "LangChain" },

  // --- Frameworks (Web & App) ---
  { id: "react", icon: "simple-icons:react", label: "React", color: "#61DAFB" },
  {
    id: "reactnative",
    icon: "simple-icons:react",
    label: "React Native",
    color: "#61DAFB",
  },
  {
    id: "nextjs",
    icon: "simple-icons:nextdotjs",
    label: "Next.js",
    color: "#000000",
  },
  { id: "vue", icon: "devicon:vuejs", label: "Vue 3", color: "#42B883" },
  {
    id: "ts",
    icon: "simple-icons:typescript",
    label: "TypeScript",
    color: "#3178C6",
  },
  // // { id: 'express',    icon: 'simple-icons:express',       label: 'Express',       color: '#000000' },
  // // { id: 'nestjs',     icon: 'simple-icons:nestjs',        label: 'NestJS',        color: '#E0234E' },
  // // { id: 'django',     icon: 'simple-icons:django',        label: 'Django',        color: '#092E20' },
  // // { id: 'flask',      icon: 'simple-icons:flask',         label: 'Flask',         color: '#000000' },
  // // { id: 'spring',     icon: 'simple-icons:spring',        label: 'Spring',        color: '#6DB33F' },
  // // { id: 'dotnet',     icon: 'simple-icons:dotnet',        label: '.NET',          color: '#512BD4' },

  // // { id: 'svelte',     icon: 'simple-icons:svelte',        label: 'Svelte',        color: '#FF3E00' },
  // // { id: 'angular',    icon: 'simple-icons:angular',       label: 'Angular',       color: '#DD0031' },
  // // { id: 'nuxt',       icon: 'simple-icons:nuxtdotjs',     label: 'Nuxt',          color: '#00DC82' },
  // // { id: 'astro',      icon: 'simple-icons:astro',         label: 'Astro',         color: '#BC52EE' },
  // // { id: 'remix',      icon: 'simple-icons:remix',         label: 'Remix',         color: '#000000' },
  // // { id: 'vite',       icon: 'simple-icons:vite',          label: 'Vite',          color: '#646CFF' },

  // --- Backend / APIs ---
  {
    id: "fastapi",
    icon: "simple-icons:fastapi",
    label: "FastAPI",
    color: "#009688",
  },
  {
    id: "postman",
    icon: "simple-icons:postman",
    label: "Postman",
    color: "#FF6C37",
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
  // // { id: 'go',         icon: 'simple-icons:go',            label: 'Go',            color: '#00ADD8' },
  // // { id: 'rust',       icon: 'simple-icons:rust',          label: 'Rust' },
  // // { id: 'java',       icon: 'simple-icons:java',          label: 'Java',          color: '#007396' },
  // // { id: 'swift',      icon: 'simple-icons:swift',         label: 'Swift',         color: '#FA7343' },
  // // { id: 'kotlin',     icon: 'simple-icons:kotlin',        label: 'Kotlin',        color: '#7F52FF' },
  // // { id: 'r',          icon: 'simple-icons:r',             label: 'R',             color: '#276DC3' },
  // // { id: 'julia',      icon: 'simple-icons:julia',         label: 'Julia',         color: '#9558B2' },
  // // { id: 'matlab',     icon: 'simple-icons:matlab',        label: 'MATLAB' },
  // // { id: 'bash',       icon: 'simple-icons:gnubash',       label: 'Bash',          color: '#4EAA25' },
  // // { id: 'powershell', icon: 'simple-icons:powershell',    label: 'PowerShell',    color: '#5391FE' },

  // --- Databases ---
  { id: "mysql", icon: "simple-icons:mysql", label: "MySQL", color: "#4479A1" },
  // // { id: 'postgres',   icon: 'simple-icons:postgresql',    label: 'PostgreSQL',    color: '#336791' },
  // // { id: 'redis',      icon: 'simple-icons:redis',         label: 'Redis',         color: '#DC382D' },
  // // { id: 'mongodb',    icon: 'simple-icons:mongodb',       label: 'MongoDB',       color: '#47A248' },
  {
    id: "sqlite",
    icon: "simple-icons:sqlite",
    label: "SQLite",
    color: "#003B57",
  },
  // // { id: 'supabase',   icon: 'simple-icons:supabase',      label: 'Supabase',      color: '#3ECF8E' },
  // // { id: 'firebase',   icon: 'simple-icons:firebase',      label: 'Firebase',      color: '#FFCA28' },
  // // { id: 'prisma',     icon: 'simple-icons:prisma',        label: 'Prisma',        color: '#2D3748' },

  // --- Quantum ---
  { id: "qsharp", icon: "mdi:alpha-q", label: "Q#", color: "#0078D4" },
  { id: "qdk", icon: "mdi:atom", label: "Quantum DevKit", color: "#7C4DFF" },

  // --- Web3 / L2 ---
  { id: "zksync", icon: "token-branded:zksync", label: "zkSync" },

  // --- Productivity ---
  {
    id: "notion",
    icon: "simple-icons:notion",
    label: "Notion",
    color: "#000000",
  },
  // { id: 'kafka',      icon: 'simple-icons:apachekafka',   label: 'Apache Kafka',  color: '#231F20' },
  // { id: 'rabbitmq',   icon: 'simple-icons:rabbitmq',      label: 'RabbitMQ',      color: '#FF6600' },
  // { id: 'grpc',       icon: 'simple-icons:grpc',          label: 'gRPC',          color: '#3D3D3D' },

  // // --- APIs ---
  // // { id: 'graphql',    icon: 'simple-icons:graphql',       label: 'GraphQL',       color: '#E10098' },
  // // { id: 'apollo',     icon: 'simple-icons:apollographql', label: 'Apollo',        color: '#311C87' },
  // // { id: 'insomnia',   icon: 'simple-icons:insomnia',      label: 'Insomnia',      color: '#4000BF' },

  // --- Big Data / ETL ---
  // // { id: 'spark',      icon: 'simple-icons:apachespark',   label: 'Apache Spark',  color: '#E25A1C' },
  // // { id: 'hadoop',     icon: 'simple-icons:apachehadoop',  label: 'Apache Hadoop', color: '#66CCFF' },
  // // { id: 'airflow',    icon: 'simple-icons:apacheairflow', label: 'Apache Airflow',color: '#017CEE' },
  // // { id: 'dbt',        icon: 'simple-icons:dbt',           label: 'dbt',           color: '#FF694B' },

  // // --- DevOps / IaC / Orchestration ---
  // // { id: 'terraform',  icon: 'simple-icons:terraform',     label: 'Terraform',     color: '#7B42BC' },
  // // { id: 'ansible',    icon: 'simple-icons:ansible',       label: 'Ansible',       color: '#EE0000' },
  // // { id: 'k8s',        icon: 'simple-icons:kubernetes',    label: 'Kubernetes',    color: '#326CE5' },
  // // { id: 'helm',       icon: 'simple-icons:helm',          label: 'Helm',          color: '#0F1689' },
  // // { id: 'nginx',      icon: 'simple-icons:nginx',         label: 'NGINX',         color: '#009639' },
  // // { id: 'traefik',    icon: 'simple-icons:traefikproxy',  label: 'Traefik',       color: '#24A1C1' },

  // // --- Cloud (extra) ---
  // // { id: 'aws',        icon: 'simple-icons:amazonaws',     label: 'AWS',           color: '#FF9900' },
  // // { id: 'gcp',        icon: 'simple-icons:googlecloud',   label: 'Google Cloud',  color: '#4285F4' },
  // // { id: 'cloudflare', icon: 'simple-icons:cloudflare',    label: 'Cloudflare',    color: '#F38020' },

  // // --- Build Tools / Monorepo ---
  // // { id: 'webpack',    icon: 'simple-icons:webpack',       label: 'Webpack',       color: '#8DD6F9' },
  // // { id: 'rollup',     icon: 'simple-icons:rollupdotjs',   label: 'Rollup',        color: '#EC4A3F' },
  // // { id: 'parcel',     icon: 'simple-icons:parcel',        label: 'Parcel',        color: '#FF4C1F' },
  // // { id: 'babel',      icon: 'simple-icons:babel',         label: 'Babel',         color: '#F9DC3E' },
  // // { id: 'postcss',    icon: 'simple-icons:postcss',       label: 'PostCSS',       color: '#DD3A0A' },
  // // { id: 'sass',       icon: 'simple-icons:sass',          label: 'Sass',          color: '#CC6699' },
  // // { id: 'eslint',     icon: 'simple-icons:eslint',        label: 'ESLint',        color: '#4B32C3' },
  {
    id: "prettier",
    icon: "simple-icons:prettier",
    label: "Prettier",
    color: "#F7B93E",
  },
  // // { id: 'husky',      icon: 'simple-icons:husky',         label: 'Husky' },
  // // { id: 'lerna',      icon: 'simple-icons:lerna',         label: 'Lerna' },
  // // { id: 'turborepo',  icon: 'simple-icons:turborepo',     label: 'Turborepo' },
  // // { id: 'nx',         icon: 'simple-icons:nx',            label: 'Nx',            color: '#143055' },

  // // --- Testing ---
  // // { id: 'jest',       icon: 'simple-icons:jest',          label: 'Jest',          color: '#C21325' },
  // // { id: 'vitest',     icon: 'simple-icons:vitest',        label: 'Vitest',        color: '#6E9F18' },
  // // { id: 'playwright', icon: 'simple-icons:playwright',    label: 'Playwright',    color: '#2EAD33' },
  // // { id: 'cypress',    icon: 'simple-icons:cypress',       label: 'Cypress',       color: '#17202C' },
  // // { id: 'storybook',  icon: 'simple-icons:storybook',     label: 'Storybook',     color: '#FF4785' },

  // // --- UI Kits / Design ---
  { id: "mui", icon: "simple-icons:mui", label: "MUI", color: "#007FFF" },
  // // { id: 'ant',        icon: 'simple-icons:antdesign',     label: 'Ant Design',    color: '#0170FE' },
  // // { id: 'chakra',     icon: 'simple-icons:chakraui',      label: 'Chakra UI',     color: '#319795' },
  // // { id: 'figma',      icon: 'simple-icons:figma',         label: 'Figma',         color: '#F24E1E' },
  // // { id: 'adobexd',    icon: 'simple-icons:adobexd',       label: 'Adobe XD',      color: '#FF61F6' },
  // // { id: 'ps',         icon: 'simple-icons:adobephotoshop',label: 'Photoshop',     color: '#31A8FF' },
  // // { id: 'ai',         icon: 'simple-icons:adobeillustrator', label: 'Illustrator',color: '#FF9A00' },
  // // { id: 'canva',      icon: 'simple-icons:canva',         label: 'Canva',         color: '#00C4CC' },

  // // --- Desktop / Runtime ---
  // // { id: 'electron',   icon: 'simple-icons:electron',      label: 'Electron',      color: '#47848F' },
  // // { id: 'tauri',      icon: 'simple-icons:tauri',         label: 'Tauri',         color: '#FFC131' },

  // // --- Web Graphics / DataViz ---
  // // { id: 'three',      icon: 'simple-icons:threedotjs',    label: 'Three.js',      color: '#000000' },
  // // { id: 'd3',         icon: 'simple-icons:d3dotjs',       label: 'D3.js',         color: '#F9A03C' },

  // // --- Team / PM ---
  // // { id: 'jira',       icon: 'simple-icons:jira',          label: 'Jira',          color: '#0052CC' },
  // // { id: 'trello',     icon: 'simple-icons:trello',        label: 'Trello',        color: '#0052CC' },
  // // { id: 'slack',      icon: 'simple-icons:slack',         label: 'Slack',         color: '#4A154B' },

  // --- Data Science / ML ---
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
];
