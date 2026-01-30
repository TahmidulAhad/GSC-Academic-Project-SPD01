import { User } from "./lib/api";

export type Language = "en" | "bn";

export interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface Request {
  id: number;
  title: string;
  requester: string;
  date: string;
  status: "Pending" | "Completed";
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface TeamMember {
  id: number;
  nameKey: string;
  roleKey: string;
}
