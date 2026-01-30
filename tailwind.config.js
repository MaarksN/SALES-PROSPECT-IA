import { readFileSync } from 'fs';
import containerQueries from '@tailwindcss/container-queries';

const tokens = JSON.parse(readFileSync(new URL('./design-tokens.json', import.meta.url), 'utf8'));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: tokens.colors
    },
  },
  plugins: [
    containerQueries,
  ],
}
