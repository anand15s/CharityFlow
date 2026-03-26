// CharityFlow Design System — Inspired by Bloomerang, Aplos, Keela
// UI/UX Research: March 26, 2026

export const colors = {
  // Primary palette
  primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#1e90ff', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
  // Semantic colors
  success: { light: '#d1fae5', DEFAULT: '#10b981', dark: '#059669' },
  warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#d97706' },
  danger:  { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#dc2626' },
  // Neutrals
  gray: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
  // Background
  bg: { page: '#f8fafc', card: '#ffffff', sidebar: '#0f172a', sidebarHover: '#1e293b' },
} as const;

export const typography = {
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
  sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
  weights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
};

export const spacing = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
export const radii = { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' };
export const shadows = {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  cardHover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};
