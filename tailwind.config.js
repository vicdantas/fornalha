/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8C45A',
          dim: '#7A621A',
          dark: '#4A3800',
        },
        navy: {
          DEFAULT: '#111827',
          2: '#1A2332',
          3: '#243044',
        },
        ink: '#0D0D0D',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
