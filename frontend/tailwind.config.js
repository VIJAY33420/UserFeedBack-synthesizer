/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        panel: 'rgba(255, 255, 255, 0.04)',
        panelHover: 'rgba(255, 255, 255, 0.07)',
        borderLight: 'rgba(255, 255, 255, 0.08)',
        violet: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyan: {
          400: '#22d3ee',
        },
        emerald: {
          500: '#10b981',
        },
        amber: {
          500: '#f59e0b',
        },
        rose: {
          500: '#f43f5e',
        },
        textMain: '#f1f1f4',
        textMuted: '#9a9aa5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
