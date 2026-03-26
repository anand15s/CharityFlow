import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1e90ff',
          light: '#e1f5fe',
          mint: '#f0fdfa',
          dark: '#1e293b',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
\ No newline at end of file