export interface ExperienceItem {
  company: string;
  role: string;
  period: string; // e.g. "2024 – Present"
  details: string; // description (will be line-clamped)
  location?: string; // optional location
  link?: string; // external link (company or role page)
  stack?: string[]; // optional tech keywords
  accent?: string; // per-item accent color
  current?: boolean; // derived or explicit current flag
  order?: number; // manual ordering weight
}

export const experience: ExperienceItem[] = [
  {
    company: "Hexal Labs",
    role: "Founder",
    period: "2024 – Present",
    details: "Building AI-powered products such as Melo and Inkr.",
    accent: "#2f6bed",
    current: true,
    order: 1,
  },
  {
    company: "Microsoft Student Clubs - ECU",
    role: "Founder",
    period: "2023 – Present",
    details: "Leading student developer community.",
    current: true,
    order: 2,
  },
];
