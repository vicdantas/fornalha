/** @type {import('tailwindcss').Config} */

// Paleta do catálogo oficial da Fornalha: dourado sobre preto neutro, com
// bordas finas em dourado escuro. A escala "ember" (cobre do PNG do logo:
// realce #f4b663, corpo #c08740, sombra #896821) fica para brilhos junto ao logo.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0a09',
        foreground: '#ede6d6',

        card: '#171615',
        secondary: '#1c1a18',
        accent: '#2a2418',

        muted: {
          DEFAULT: '#1f1d1b',
          foreground: '#a8a398',
        },

        border: '#3d3320',
        input: '#4a3e26',
        ring: '#e2bd62',

        primary: {
          DEFAULT: '#e2bd62',
          foreground: '#0b0a09',
        },

        // Dourado do catálogo: 200 é o tom dos títulos e preços.
        gold: {
          100: '#f6e3b0',
          200: '#f0d28a',
          300: '#e2bd62',
          500: '#c9a24a',
          700: '#8a6e2e',
          900: '#3a2e14',
        },

        ember: {
          100: '#f7d0a1',
          200: '#f1af64',
          300: '#e1994a',
          500: '#c28336',
          700: '#885716',
          900: '#43260a',
        },

        whatsapp: {
          DEFAULT: '#25d366',
          dark: '#1da851',
        },
      },

      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Jost', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        DEFAULT: '0.375rem',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-in-right': 'slide-in-right 280ms cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
