import type { Config } from 'tailwindcss';

// Most styling lives in src/app/globals.css as component classes; these tokens
// mirror its CSS variables so utilities stay on-palette when used.
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ground: '#0a1222',
        surface: { DEFAULT: '#0f1a2f', 2: '#14223d' },
        ivory: '#eef1f6',
        text: '#c3cddb',
        dim: '#8291a8',
        blue: '#6ea8dc',
        ok: '#7fc79a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
