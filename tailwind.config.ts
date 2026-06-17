import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // FFXV-inspired palette: deep navy bases + sober silver/ivory.
        // Cool blue is heavily desaturated; saturated accents are reserved
        // only for active/selected states (see `frost.bright`).
        abyss: '#0a1124',
        midnight: '#101a32',
        steel: '#1c2848',
        frost: {
          DEFAULT: '#aebccd', // muted steel-silver — lines, icons, accents
          soft: '#d4dbe6', // soft silver — primary readable text
          dim: '#6e7888', // muted silver — secondary text
          bright: '#eef1f6', // near-white ivory — active highlights
        },
        // FFXV "magic/warp" cyan — reserved for active/energised states only.
        accent: {
          DEFAULT: '#4fc3d6', // royal cyan — active borders, links, highlights
          bright: '#7ee0ee', // luminous cyan — peak glow
          deep: '#2a8aa0', // deep cyan — shadows/glows
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      boxShadow: {
        glow: '0 0 16px rgba(174, 188, 205, 0.16)',
        'glow-strong': '0 0 24px rgba(206, 217, 232, 0.32)',
        'glow-accent': '0 0 18px rgba(79, 195, 214, 0.40)',
        'glow-accent-strong': '0 0 26px rgba(126, 224, 238, 0.55)',
      },
      backgroundImage: {
        'frost-line':
          'linear-gradient(90deg, transparent, rgba(174,188,205,0.45), transparent)',
        'accent-line':
          'linear-gradient(90deg, transparent, rgba(79,195,214,0.55), transparent)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        particle: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.08' },
          '50%': { transform: 'translateY(-16px)', opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        particle: 'particle 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
