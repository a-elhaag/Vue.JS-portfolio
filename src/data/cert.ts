// src/data/certs.ts
import { Icon } from "@iconify/vue";

export type CertKind = "cert" | "badge" | "achievement";

export type CertItem = {
  id: string;
  kind: CertKind;
  title: string;
  issuer: string;
  date?: string;
  href?: string;
  accent?: string;
  variant?: "elevated" | "outline" | "solid" | "glass";
  orientation?: "vertical" | "horizontal";
  media?: { component?: any; props?: Record<string, any> };
  ribbon?: string;
};

const ico = (icon: string, color?: string) => ({
  component: Icon,
  props: {
    icon,
    class: "media-ico",
    style: color ? `color:${color}` : undefined,
  },
});

export const certs: CertItem[] = [
  // CERTIFICATIONS
  {
    id: "ai102",
    kind: "cert",
    title: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    issuer: "Microsoft",
    date: "Aug 2025",
    href: "https://learn.microsoft.com/credentials/",
    accent: "#2f6bed",
    variant: "outline",
    media: ico("simple-icons:microsoft", "#6666FF"),
  },
  {
    id: "azfunc-advanced",
    kind: "cert",
    title: "Azure Serverless: Functions Advanced",
    issuer: "Microsoft",
    date: "2025",
    href: "https://azure.microsoft.com/",
    accent: "#0062AD",
    variant: "elevated",
    media: ico("simple-icons:azurefunctions", "#0062AD"),
  },

  // BADGES
  {
    id: "mlsa-ai-project-winner",
    kind: "badge",
    title: "MLSA AI Project – Winner",
    issuer: "Microsoft Learn Student Ambassadors",
    date: "2025",
    href: "https://studentambassadors.microsoft.com/",
    accent: "#0078D4",
    variant: "glass",
    media: ico("simple-icons:microsoftazure", "#0078D4"),
  },
  {
    id: "kaggle-expert",
    kind: "badge",
    title: "Kaggle – Expert Tier",
    issuer: "Kaggle",
    date: "2025",
    href: "https://www.kaggle.com/",
    accent: "#20BEFF",
    variant: "glass",
    media: ico("simple-icons:kaggle", "#20BEFF"),
  },
  {
    id: "github-oss",
    kind: "badge",
    title: "Open Source Contributor",
    issuer: "GitHub",
    date: "2024–2025",
    href: "https://github.com/",
    accent: "#181717",
    variant: "outline",
    media: ico("simple-icons:github", "#181717"),
  },

  // Reserved: achievements (ignored by the Credentials section)
  // { id: "hack-winner-hexal", kind: "achievement", title: "AI Hackathon Winner", issuer: "Hexal Labs", date: "2025",
  //   accent: "#2f6bed", variant: "solid", media: ico("simple-icons:openai") },
];
