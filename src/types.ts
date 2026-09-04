export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'CLI & Systems' | 'AI & Tools' | 'Graphics & Web';
  tags: string[];
  stars?: number;
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  year: string;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 1-100
    category?: string;
    note?: string;
  }[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  blog: string;
  location: string;
}

export interface VirtualFile {
  name: string;
  type: 'file' | 'dir';
  size?: string;
  content?: string;
  children?: Record<string, VirtualFile>;
}

export interface TerminalHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  output: {
    type: 'text' | 'error' | 'success' | 'neofetch' | 'table' | 'projects' | 'skills' | 'experience' | 'contact' | 'help' | 'matrix' | 'cat' | 'ls' | 'about';
    content?: string;
    data?: any;
  };
}

export type ThemeKey = 'matrix' | 'dracula' | 'cyberpunk' | 'nord' | 'monokai' | 'amber' | 'light';

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  description: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  promptUser: string;
  promptHost: string;
  promptPath: string;
  accent: string;
  accentBg: string;
  cursor: string;
  highlight: string;
  error: string;
  success: string;
  glowClass?: string;
}
