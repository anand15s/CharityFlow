import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e90ff', dark: '#1a7ae0', light: '#4da6ff' },
        secondary: { DEFAULT: '#1e293b', light: '#334155' },
        accent: { DEFAULT: '#10b981', light: '#34d399' },
        surface: { DEFAULT: '#f0fdfa', secondary: '#e1f5fe' },
      },
      fontFamily: { sans: ['Open Sans', 'sans-serif'] },
    },
  },
  plugins: [],
};

export default config;