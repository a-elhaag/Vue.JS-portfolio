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
  employmentType?:
    | "full-time"
    | "part-time"
    | "internship"
    | "contract"
    | "freelance"
    | "self-employed"
    | "volunteer";
  /** Iconify icon name for the company (e.g., 'simple-icons:upwork', 'simple-icons:orange') */
  companyIcon?: string;
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
    employmentType: "self-employed",
    companyIcon: "simple-icons:orange", // example icon (adjust if desired)
  },
  {
    company: "Microsoft Student Clubs - ECU",
    role: "Founder",
    period: "2023 – Present",
    details: "Leading student developer community.",
    current: true,
    order: 2,
    employmentType: "volunteer",
    companyIcon: "simple-icons:microsoft",
    accent: "#78D4",
  },
];

// Usage Example (add your own entries):
// {
//   company: "Upwork",
//   role: "Freelance Developer",
//   period: "2022 – 2024",
//   details: "Delivered full‑stack features for international clients.",
//   employmentType: "freelance",
//   companyIcon: "simple-icons:upwork"
// }
