export interface Testimonial {
  id: string;
  name: string;
  position: string;
  content: string;
  rating: number;
  order: number;
  screenshot?: string | null;
  platform?: string | null;
  projectTitle?: string | null;
}

export const TESTIMONIAL_PLATFORMS = [
  "Upwork",
  "Fiverr",
  "LinkedIn",
  "Direct Client",
  "Other",
] as const;
